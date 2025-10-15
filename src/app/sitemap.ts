import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.delicacies.eu';
  const lastModified = new Date('2024-10-15');
  
  // Static pages - always available
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/countries`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // European countries - static list for reliable sitemap
  const countries = [
    'france', 'italy', 'spain', 'germany', 'netherlands', 'belgium', 
    'portugal', 'greece', 'austria', 'switzerland', 'poland', 'czech-republic',
    'hungary', 'croatia', 'denmark', 'sweden', 'norway', 'finland',
    'ireland', 'romania', 'bulgaria', 'slovakia', 'slovenia', 'estonia',
    'latvia', 'lithuania', 'luxembourg', 'malta', 'cyprus'
  ];

  // Country pages
  const countryPages: MetadataRoute.Sitemap = countries.map((countryId) => ({
    url: `${baseUrl}/countries/${countryId}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  console.log(`Sitemap generated with ${staticPages.length + countryPages.length} URLs`);
  
  return [...staticPages, ...countryPages];
}
