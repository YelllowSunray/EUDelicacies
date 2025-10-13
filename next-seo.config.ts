/**
 * Next.js SEO Configuration
 * Centralized SEO settings for EU Delicacies
 * 
 * Update this file with your actual:
 * - Social media handles
 * - Verification codes
 * - Business information
 */

export const SEO_CONFIG = {
  // Site Information
  siteName: 'EU Delicacies',
  siteUrl: 'https://www.delicacies.eu',
  defaultTitle: 'EU Delicacies - Authentic European Food & Gourmet Specialties',
  defaultDescription: 'Shop authentic European delicacies from 29+ countries. Discover artisan cheeses, premium wines, traditional preserves, and gourmet specialties from local European producers. Fast delivery across Europe.',
  
  // Business Information
  contactEmail: 'eudelicacies@gmail.com',
  supportEmail: 'eudelicacies@gmail.com',
  phone: '+31 XXX XXX XXX', // Update with actual phone
  address: 'Amsterdam, Netherlands', // Update with actual address
  foundingYear: '2024',
  
  // Social Media Handles
  social: {
    twitter: '@eudelicacies',
    facebook: 'https://facebook.com/eudelicacies',
    instagram: 'https://instagram.com/eudelicacies',
    linkedin: 'https://linkedin.com/company/eudelicacies',
  },
  
  // Search Engine Verification Codes
  // Get these from:
  // - Google: https://search.google.com/search-console
  // - Bing: https://www.bing.com/webmasters
  verification: {
    google: 'your-google-verification-code-here',
    bing: 'your-bing-verification-code-here',
    // yandex: 'your-yandex-verification-code-here',
  },
  
  // Default Images
  images: {
    ogImage: '/og-image.jpg', // 1200x630px recommended
    logo: '/logo.png',
    favicon: '/favicon.ico',
  },
  
  // Keywords
  defaultKeywords: [
    'european delicacies',
    'authentic european food',
    'gourmet european products',
    'artisan food europe',
    'buy european food online',
    'european marketplace',
    'traditional european cuisine',
    'european food delivery',
  ],
  
  // Analytics IDs
  analytics: {
    googleAnalytics: 'G-XXXXXXXXXX', // Update with your GA4 ID
    microsoftClarity: 'tp3vl4eta0',
    // facebookPixel: 'XXXXXXXXX',
  },
  
  // Locale Information
  locale: 'en_US',
  alternateLocales: ['nl_NL', 'de_DE', 'fr_FR', 'it_IT', 'es_ES'],
  defaultCurrency: 'EUR',
  
  // OpenGraph Defaults
  openGraph: {
    type: 'website',
    siteName: 'EU Delicacies',
    locale: 'en_US',
  },
  
  // Twitter Card Defaults
  twitter: {
    cardType: 'summary_large_image',
    site: '@eudelicacies',
  },
};

export default SEO_CONFIG;

