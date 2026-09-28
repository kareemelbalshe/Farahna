import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://farahna.menuflowx.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  // Base routes for landing & key sections
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#themes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Fetch only invitations where status='published' and privacy='public'
  try {
    const res = await fetch(`${apiUrl}/public/sitemap-invitations`, {
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      json.data.forEach((inv: { type: string; slug: string; updatedAt: string }) => {
        routes.push({
          url: `${baseUrl}/invitation/${inv.type}/${inv.slug}`,
          lastModified: new Date(inv.updatedAt),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      });
    }
  } catch (e) {
    // If backend isn't reachable during static generation, return base routes
  }

  return routes;
}
