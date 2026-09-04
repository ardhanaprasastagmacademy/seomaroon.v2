import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = (site || 'https://seopromptstudio.com').toString().replace(/\/$/, '');
  const pages = [
    { url: '', changefreq: 'daily', priority: 1.0 },
    { url: '/features', changefreq: 'weekly', priority: 0.9 },
    { url: '/templates', changefreq: 'weekly', priority: 0.9 },
    { url: '/dashboard', changefreq: 'daily', priority: 0.7 },
    { url: '/calendar', changefreq: 'daily', priority: 0.7 },
    { url: '/prompt-builder', changefreq: 'daily', priority: 0.7 },
    { url: '/templates-manager', changefreq: 'weekly', priority: 0.6 },
    { url: '/formatter', changefreq: 'weekly', priority: 0.6 },
    { url: '/bulk', changefreq: 'weekly', priority: 0.6 },
    { url: '/history', changefreq: 'weekly', priority: 0.6 },
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
