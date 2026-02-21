import { archetypes } from '~/data/archetypes';

const BASE_URL = 'https://www.core-view.app';

export async function loader() {
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'monthly' },
    { loc: '/about', priority: '0.8', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.5', changefreq: 'yearly' },
    { loc: '/personality', priority: '0.9', changefreq: 'monthly' },
  ];

  const archetypePages = archetypes.map((a) => ({
    loc: `/personality/${a.id}`,
    priority: '0.7',
    changefreq: 'monthly' as const,
  }));

  const allPages = [...staticPages, ...archetypePages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
