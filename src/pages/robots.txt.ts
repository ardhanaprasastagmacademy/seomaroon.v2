import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const sitemapUrl = new URL('sitemap.xml', site || 'https://seopromptstudio.com').href;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /_system/

Sitemap: ${sitemapUrl}
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
