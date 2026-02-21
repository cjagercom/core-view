import type { MetaDescriptor } from 'react-router';

const BASE_URL = 'https://www.core-view.app';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

interface SeoConfig {
  title: string;
  description: string;
  url: string;
  type?: string;
  image?: string;
  noindex?: boolean;
}

/**
 * Build a complete set of meta tags for a page.
 * Merges with parent meta, keeping non-SEO tags (e.g. theme-color).
 */
export function buildMeta(config: SeoConfig, parentMeta: MetaDescriptor[] = []): MetaDescriptor[] {
  const image = config.image ?? DEFAULT_IMAGE;
  const fullUrl = config.url.startsWith('http') ? config.url : `${BASE_URL}${config.url}`;

  // Keep parent meta that we don't override
  const kept = parentMeta.filter((m) => {
    if ('title' in m) return false;
    if ('property' in m) return false;
    if ('tagName' in m && (m as Record<string, string>).rel === 'canonical') return false;
    if ('name' in m) {
      const name = (m as Record<string, string>).name;
      if (
        ['description', 'robots', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].includes(
          name,
        )
      )
        return false;
    }
    return true;
  });

  const tags: MetaDescriptor[] = [
    ...kept,
    { title: config.title },
    { name: 'description', content: config.description },
    { property: 'og:title', content: config.title },
    { property: 'og:description', content: config.description },
    { property: 'og:url', content: fullUrl },
    { property: 'og:type', content: config.type ?? 'website' },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:site_name', content: 'Core-View' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: config.title },
    { name: 'twitter:description', content: config.description },
    { name: 'twitter:image', content: image },
    { tagName: 'link', rel: 'canonical', href: fullUrl },
  ];

  if (config.noindex) {
    tags.push({ name: 'robots', content: 'noindex, nofollow' });
  }

  return tags;
}

/**
 * Build BreadcrumbList JSON-LD structured data.
 */
export function buildBreadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}
