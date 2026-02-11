import type { LoaderFunctionArgs } from 'react-router';
import { validateBasicAuth, unauthorizedResponse } from '~/lib/auth.server';
import { fetchAdminData } from '~/lib/admin-queries.server';

export async function loader({ request }: LoaderFunctionArgs) {
  if (!validateBasicAuth(request)) {
    throw unauthorizedResponse();
  }

  const url = new URL(request.url);
  const days = parseInt(url.searchParams.get('days') || '30', 10);

  const data = await fetchAdminData(days);
  return Response.json(data);
}
