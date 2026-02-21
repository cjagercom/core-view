import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import type { Route } from './+types/root';
import './app.css';

export const meta: Route.MetaFunction = () => [
  { title: "Core-View \u2014 Discover who you are beneath everything you've learned" },
  {
    name: 'description',
    content:
      "A 12-minute personality assessment that goes deeper than Myers-Briggs. Based on who you were as a child, not who you've become. No account needed.",
  },
  { property: 'og:title', content: "Core-View \u2014 Discover who you are beneath everything you've learned" },
  {
    property: 'og:description',
    content: 'A 12-minute personality assessment that goes deeper than Myers-Briggs. No account needed.',
  },
  { property: 'og:type', content: 'website' },
  { property: 'og:url', content: 'https://www.core-view.app' },
  { property: 'og:image', content: 'https://www.core-view.app/og-image.png' },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:site_name', content: 'Core-View' },
  { property: 'og:locale', content: 'en_US' },
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: "Core-View \u2014 Discover who you are beneath everything you've learned" },
  {
    name: 'twitter:description',
    content: 'A 12-minute personality assessment that goes deeper than Myers-Briggs. No account needed.',
  },
  { name: 'twitter:image', content: 'https://www.core-view.app/og-image.png' },
  { tagName: 'link', rel: 'canonical', href: 'https://www.core-view.app' },
];

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap',
  },
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  { rel: 'apple-touch-icon', href: '/icon-192.png' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#115E59" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Core-View" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Core-View',
              url: 'https://www.core-view.app',
              description:
                "A 12-minute personality assessment that goes deeper than Myers-Briggs. Based on who you were as a child, not who you've become.",
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Any',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              creator: { '@type': 'Organization', name: 'PinkPollos', url: 'https://www.pinkpollos.com' },
            }),
          }}
        />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(function(){})}`,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-dvh bg-paper flex items-center justify-center px-5">
      <div className="text-center">
        <h1 className="font-display text-3xl text-ink mb-2">{message}</h1>
        <p className="text-ink-soft">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto mt-4 text-left text-xs bg-paper-warm rounded-lg">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
