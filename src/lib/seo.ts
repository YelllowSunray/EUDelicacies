import { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
  brand?: string;
  category?: string;
}

const defaultConfig = {
  siteName: 'EU Delicacies',
  siteUrl: 'https://eudelicacies.com', // Update with your actual domain
  defaultImage: '/og-image.jpg', // We'll create this
  twitterHandle: '@eudelicacies', // Update with your Twitter handle
};

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = defaultConfig.defaultImage,
    url,
    type = 'website',
  } = config;

  const fullTitle = title.includes(defaultConfig.siteName) 
    ? title 
    : `${title} | ${defaultConfig.siteName}`;

  const fullUrl = url ? `${defaultConfig.siteUrl}${url}` : defaultConfig.siteUrl;
  const fullImage = image.startsWith('http') ? image : `${defaultConfig.siteUrl}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'EU Delicacies' }],
    creator: 'EU Delicacies',
    publisher: 'EU Delicacies',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(defaultConfig.siteUrl),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: defaultConfig.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: type === 'product' ? 'website' : type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      creator: defaultConfig.twitterHandle,
      images: [fullImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateProductStructuredData(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  country: string;
  sellerId: string;
  sellerName?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: product.sellerName || 'EU Delicacies Seller',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: product.sellerName || 'EU Delicacies Seller',
      },
    },
    aggregateRating: product.rating && product.reviewCount ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Country of Origin',
        value: product.country,
      },
    ],
  };
}

export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${defaultConfig.siteUrl}${crumb.url}`,
    })),
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EU Delicacies',
    url: defaultConfig.siteUrl,
    logo: `${defaultConfig.siteUrl}/logo.png`,
    description: 'Authentic European delicacies and gourmet foods from local producers across Europe.',
    sameAs: [
      // Add your social media URLs here
      'https://facebook.com/eudelicacies',
      'https://instagram.com/eudelicacies',
      'https://twitter.com/eudelicacies',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@eudelicacies.com',
    },
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EU Delicacies',
    url: defaultConfig.siteUrl,
    description: 'Discover authentic European delicacies from local producers. Fresh, traditional, and delivered to your door.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${defaultConfig.siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

// Common keyword sets for different page types
export const SEO_KEYWORDS = {
  homepage: [
    'european delicacies',
    'authentic european food',
    'gourmet european products',
    'traditional european cuisine',
    'european marketplace',
    'artisan food europe',
    'european specialties',
    'continental delicacies',
  ],
  products: [
    'european food',
    'authentic delicacies',
    'gourmet products',
    'traditional food',
    'artisan made',
    'continental cuisine',
  ],
  countries: [
    'traditional cuisine',
    'authentic recipes',
    'local specialties',
    'regional food',
    'cultural delicacies',
    'heritage food',
  ],
};
