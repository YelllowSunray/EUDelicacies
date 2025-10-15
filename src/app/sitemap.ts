import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    const baseUrl = 'https://www.delicacies.eu';
    const lastModified = new Date('2024-10-15T10:00:00.000Z');
    
    // Core pages that must be included
    const pages: MetadataRoute.Sitemap = [
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
      // Country pages
      {
        url: `${baseUrl}/countries/france`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/italy`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/spain`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/germany`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/netherlands`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/belgium`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/portugal`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/greece`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/austria`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/switzerland`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/poland`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/czech-republic`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/hungary`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/croatia`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/denmark`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/sweden`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/norway`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/finland`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/ireland`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/romania`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/bulgaria`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/slovakia`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/slovenia`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/estonia`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/latvia`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/lithuania`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/luxembourg`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/malta`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/countries/cyprus`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ];

    console.log(`✅ Sitemap generated successfully with ${pages.length} URLs`);
    return pages;
    
  } catch (error) {
    console.error('❌ Sitemap generation failed:', error);
    
    // Fallback minimal sitemap
    return [
      {
        url: 'https://www.delicacies.eu',
        lastModified: new Date('2024-10-15T10:00:00.000Z'),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: 'https://www.delicacies.eu/shop',
        lastModified: new Date('2024-10-15T10:00:00.000Z'),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: 'https://www.delicacies.eu/countries',
        lastModified: new Date('2024-10-15T10:00:00.000Z'),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];
  }
}
