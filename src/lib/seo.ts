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
  siteUrl: 'https://www.delicacies.eu',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@eudelicacies',
  contactEmail: 'eudelicacies@gmail.com',
  foundingDate: '2024',
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
    referrer: 'origin-when-cross-origin',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#2C3E50' },
      { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
    ],
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

// Legacy function for backward compatibility
export function generateOrganizationStructuredData() {
  return generateEnhancedOrganizationStructuredData();
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
    'buy european food online',
    'european gourmet shop',
    'artisan european foods',
    'traditional european recipes',
    'european food delivery',
    'authentic european ingredients',
    'premium european delicacies',
    'european food gift baskets',
  ],
  products: [
    'european food',
    'authentic delicacies',
    'gourmet products',
    'traditional food',
    'artisan made',
    'continental cuisine',
    'handcrafted european',
    'premium quality',
    'authentic taste',
    'traditional recipe',
  ],
  countries: [
    'traditional cuisine',
    'authentic recipes',
    'local specialties',
    'regional food',
    'cultural delicacies',
    'heritage food',
    'traditional dishes',
    'authentic ingredients',
    'local producers',
    'artisan foods',
  ],
};

// Generate ItemList structured data for product collections
export function generateItemListStructuredData(items: Array<{
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  rating?: number;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        description: item.description,
        image: item.imageUrl || defaultConfig.defaultImage,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'EUR',
        },
        aggregateRating: item.rating ? {
          '@type': 'AggregateRating',
          ratingValue: item.rating,
        } : undefined,
      },
    })),
  };
}

// Generate FAQ structured data
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate Review structured data
export function generateReviewStructuredData(reviews: Array<{
  author: string;
  rating: number;
  reviewBody: string;
  datePublished: string;
  productName?: string;
}>) {
  return reviews.map(review => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
    itemReviewed: review.productName ? {
      '@type': 'Product',
      name: review.productName,
    } : undefined,
  }));
}

// Enhanced Organization structured data with more details
export function generateEnhancedOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${defaultConfig.siteUrl}/#organization`,
    name: 'EU Delicacies',
    alternateName: 'European Delicacies Marketplace',
    url: defaultConfig.siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${defaultConfig.siteUrl}/logo.png`,
      width: 250,
      height: 60,
    },
    description: 'Authentic European delicacies and gourmet foods from local producers across 29+ European countries. Premium quality, artisan-made products delivered fresh.',
    foundingDate: defaultConfig.foundingDate,
    sameAs: [
      'https://facebook.com/eudelicacies',
      'https://instagram.com/eudelicacies',
      'https://twitter.com/eudelicacies',
      'https://linkedin.com/company/eudelicacies',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: defaultConfig.contactEmail,
        availableLanguage: ['English', 'German', 'French', 'Spanish', 'Italian'],
        areaServed: 'EU',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'Sales',
        email: defaultConfig.contactEmail,
        availableLanguage: ['English'],
      },
    ],
    areaServed: {
      '@type': 'GeoCircle',
      name: 'European Union',
    },
  };
}
