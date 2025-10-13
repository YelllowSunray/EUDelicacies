import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { getCountryById } from '@/lib/firebase-countries';
import { getProductsByCountry } from '@/lib/products';
import { FirebaseCountry } from '@/lib/firebase-collections';
import { SellerProduct } from '@/lib/products';
import ProductCard from "@/components/ProductCard";
import CountrySpecialtyFilter from "@/components/CountrySpecialtyFilter";
import { generateMetadata as generateSEOMetadata, generateBreadcrumbStructuredData, SEO_KEYWORDS } from "@/lib/seo";

interface CountryPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    const country = await getCountryById(resolvedParams.id);
    
    if (!country) {
      return generateSEOMetadata({
        title: "Country Not Found",
        description: "The requested country could not be found.",
        url: `/countries/${resolvedParams.id}`,
      });
    }

    const specialtiesText = country.specialties?.length > 0 
      ? `Famous for ${country.specialties.slice(0, 3).join(', ')}.` 
      : '';

    return generateSEOMetadata({
      title: `${country.name} Delicacies - Authentic ${country.name} Food & Specialties`,
      description: `Discover authentic ${country.name} delicacies and traditional specialties. ${specialtiesText} Shop premium ${country.name} products from local producers with fast delivery across Europe.`,
      keywords: [
        ...SEO_KEYWORDS.countries,
        `${country.name.toLowerCase()} food`,
        `${country.name.toLowerCase()} delicacies`,
        `authentic ${country.name.toLowerCase()} cuisine`,
        `traditional ${country.name.toLowerCase()} products`,
        `${country.name.toLowerCase()} specialties`,
        `buy ${country.name.toLowerCase()} food online`,
        ...(country.specialties?.map(s => s.toLowerCase()) || []),
      ],
      type: 'website',
      url: `/countries/${country.id}`,
      image: '/default-country-image.jpg', // Use default image since flag is emoji
    });
  } catch (error) {
    console.error('Error generating country metadata:', error);
    return generateSEOMetadata({
      title: "Country Not Found",
      description: "The requested country could not be found.",
      url: `/countries/${resolvedParams.id}`,
    });
  }
}

export default async function CountryDetailPage({ params }: CountryPageProps) {
  const resolvedParams = await params;
  
  let country: FirebaseCountry | null = null;
  let products: SellerProduct[] = [];
  
  try {
    [country, products] = await Promise.all([
      getCountryById(resolvedParams.id),
      getProductsByCountry(resolvedParams.id)
    ]);
    
    if (!country) {
      notFound();
    }
  } catch (error) {
    console.error('Error loading country data:', error);
    notFound();
  }

  // Generate structured data
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Countries', url: '/countries' },
    { name: country.name, url: `/countries/${country.id}` },
  ]);

  const countryStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: country.name,
    description: `Authentic ${country.name} delicacies and traditional specialties`,
    url: `https://eudelicacies.com/countries/${country.id}`,
    image: '/default-country-image.jpg', // Use default since flag is emoji
    additionalProperty: country.specialties?.map(specialty => ({
      '@type': 'PropertyValue',
      name: 'Regional Specialty',
      value: specialty,
    })) || [],
  };

  const productListStructuredData = products.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${country.name} Products`,
    description: `Authentic products from ${country.name}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.imageUrl,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'EUR',
        },
      },
    })),
  } : null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Structured Data */}
      <Script
        id="country-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(countryStructuredData),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />
      {productListStructuredData && (
        <Script
          id="product-list-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productListStructuredData),
          }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-olive/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-navy/60 hover:text-navy transition-colors">
              Home
            </Link>
            <span className="text-navy/40">/</span>
            <Link href="/countries" className="text-navy/60 hover:text-navy transition-colors">
              Countries
            </Link>
            <span className="text-navy/40">/</span>
            <span className="text-navy font-medium">{country.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Country Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl">{country.flag}</div>
            <div>
              <h1 className="font-serif text-4xl font-bold text-navy mb-2">
                {country.name}
              </h1>
              <p className="text-lg text-navy/70">
                Discover authentic delicacies from {country.name}
              </p>
            </div>
          </div>
          
          {country.description && (
            <div className="prose prose-navy max-w-none mb-6">
              <p className="text-navy/80 leading-relaxed">
                {country.description}
              </p>
            </div>
          )}

          {/* Regional Specialties */}
          {country.specialties && country.specialties.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-4">
                Regional Specialties
              </h2>
              <CountrySpecialtyFilter 
                specialties={country.specialties}
                products={products}
              />
            </div>
          )}
        </div>

        {/* Products Section - This will be handled by the client component */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-navy mb-2">
                Products from {country.name}
              </h2>
              <p className="text-navy/70">
                {products.length} authentic {products.length === 1 ? 'product' : 'products'} available
              </p>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-cream rounded-lg">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                No products available yet
              </h3>
              <p className="text-navy/70 mb-6">
                We're working on adding authentic {country.name} products to our marketplace.
              </p>
              <Link
                href="/countries"
                className="inline-block px-6 py-3 bg-olive text-white rounded-full hover:bg-olive/90 transition-colors font-semibold"
              >
                Explore Other Countries
              </Link>
            </div>
          )}
        </div>

        {/* Back to Countries */}
        <div className="mt-8 text-center">
          <Link
            href="/countries"
            className="inline-flex items-center px-6 py-3 bg-navy text-white rounded-full hover:bg-navy/90 transition-colors font-semibold"
          >
            ← Explore All Countries
          </Link>
        </div>
      </div>
    </div>
  );
}