import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { token } = params;
  if (!token) return new Response('Missing token', { status: 400 });

  const url = new URL(request.url);
  const origin = url.origin;

  const manifest = {
    name: 'Core-View — My Profile',
    short_name: 'Core-View',
    description: 'Your personality profile at a glance',
    start_url: `/s/${token}`,
    scope: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#115E59',
    icons: [
      {
        src: `${origin}/favicon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: `${origin}/icon-192.png`,
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: `${origin}/icon-512.png`,
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
