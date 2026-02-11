import { PassThrough } from 'node:stream';
import type { AppLoadContext, EntryContext } from 'react-router';
import { ServerRouter } from 'react-router';
import { createReadableStreamFromReadable } from '@react-router/node';
import { renderToPipeableStream } from 'react-dom/server';
import { isbot } from 'isbot';

const ABORT_DELAY = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  // Send 401 as raw HTTP response so the browser shows the Basic Auth dialog
  if (responseStatusCode === 401) {
    return new Response('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Core-View Admin"' },
    });
  }

  const userAgent = request.headers.get('user-agent');
  const callbackName = isbot(userAgent ?? '') ? 'onAllReady' : 'onShellReady';

  return new Promise<Response>((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(<ServerRouter context={routerContext} url={request.url} />, {
      [callbackName]() {
        shellRendered = true;
        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);

        responseHeaders.set('Content-Type', 'text/html');

        resolve(
          new Response(stream, {
            headers: responseHeaders,
            status: responseStatusCode,
          }),
        );

        pipe(body);
      },
      onShellError(error: unknown) {
        reject(error);
      },
      onError(error: unknown) {
        responseStatusCode = 500;
        if (shellRendered) {
          console.error(error);
        }
      },
    });

    setTimeout(abort, ABORT_DELAY);
  });
}
