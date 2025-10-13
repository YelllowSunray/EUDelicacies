import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://eudelicacies.com'; // Update with your actual domain

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',
          '/seller/',
          '/admin/',
          '/api/',
          '/checkout/',
          '/orders/',
          '/settings/',
          '/auth-test/',
          '/_next/',
          '/private/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/account/',
          '/seller/',
          '/admin/',
          '/api/',
          '/checkout/',
          '/orders/',
          '/settings/',
          '/auth-test/',
          '/_next/',
          '/private/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
