export function validateBasicAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) return false;

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) return false;

  const encoded = authHeader.slice(6); // Strip "Basic "
  const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
  const colonIndex = decoded.indexOf(':');
  if (colonIndex === -1) return false;
  const user = decoded.slice(0, colonIndex);
  const pass = decoded.slice(colonIndex + 1);

  return user === username && pass === password;
}

export function unauthorizedResponse() {
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Core-View Admin"' },
  });
}
