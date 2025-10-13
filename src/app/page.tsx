import { Metadata } from "next";
import HeroSection from "@/components/HeroSection";
import CountryCard from "@/components/CountryCard";
import ProductCard from "@/components/ProductCard";
import { getAllCountries } from "@/lib/firebase-countries";
import { getAllProducts, type SellerProduct } from "@/lib/products";
import { FirebaseCountry } from "@/lib/firebase-collections";
import Link from "next/link";
import Script from "next/script";
import { generateMetadata as generateSEOMetadata, SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "EU Delicacies - Authentic European Food & Gourmet Specialties",
  description: "Shop authentic European delicacies from 29+ countries. Discover artisan cheeses, premium wines, traditional preserves, and gourmet specialties from local European producers. Fast delivery across Europe.",
  keywords: [
    ...SEO_KEYWORDS.homepage,
    'buy european food online',
    'european gourmet marketplace',
    'authentic european ingredients',
    'european food delivery',
    'artisan european products',
    'traditional european recipes',
  ],
  type: 'website',
  url: '/',
});

// Server Component for better SEO
async function getHomePageData() {
  try {
    const [countries, products] = await Promise.all([
      getAllCountries(),
      getAllProducts()
    ]);
    
    return {
      countries: countries.slice(0, 6), // Show only first 6 countries
      recentProducts: products.slice(0, 8), // Show 8 recent products
    };
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return {
      countries: [],
      recentProducts: [],
    };
  }
}

export default async function Home() {
  const { countries, recentProducts } = await getHomePageData();

  // Generate structured data for the homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'EU Delicacies - European Food Marketplace',
    description: 'Discover authentic European delicacies from local producers across 29+ countries',
    url: 'https://eudelicacies.com',
    mainEntity: {
      '@type': 'ItemList',
      name: 'Featured European Countries',
      numberOfItems: countries.length,
      itemListElement: countries.map((country, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Place',
          name: country.name,
          description: `Authentic ${country.name} delicacies and specialties`,
          url: `https://eudelicacies.com/countries/${country.id}`,
        },
      })),
    },
  };

  return (
    <div>
      {/* Structured Data */}
      <Script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <HeroSection />
      
      {/* Recently Added Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-navy mb-4">
            Recently Added Products
          </h2>
          <p className="text-lg text-navy/70 max-w-2xl mx-auto">
            Discover the latest artisan delicacies from across Europe, freshly added by our trusted sellers.
          </p>
        </div>
        
        {recentProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold"
              >
                Browse All Products →
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-cream rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-navy/70">No products available yet.</p>
          </div>
        )}
      </section>
      
      {/* Featured Countries Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl font-bold text-navy mb-4">
            Explore Our Countries
          </h2>
          <p className="text-lg text-navy/70 max-w-2xl mx-auto">
            Discover authentic flavours from European nations, each offering their own unique culinary traditions.
          </p>
        </div>
        
        {countries.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {countries.map((country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/countries"
                className="inline-block px-8 py-3 bg-olive text-white rounded-full hover:bg-olive/90 transition-colors font-semibold"
              >
                View All Countries →
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-cream rounded-lg">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-navy/70 mb-4">No countries available yet.</p>
            <Link
              href="/admin/seed"
              className="inline-block px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
            >
              Seed Data
            </Link>
          </div>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-olive/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-navy mb-4">
              Why EU Delicacies?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="font-serif text-xl font-bold text-navy mb-3">
                Verified Authenticity
              </h3>
              <p className="text-navy/70">
                Only genuine products from verified local producers and artisan makers across Europe.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="font-serif text-xl font-bold text-navy mb-3">
                Sustainable & Ethical
              </h3>
              <p className="text-navy/70">
                Supporting small-batch producers who prioritize quality, tradition, and eco-friendly practices.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-5xl mb-4">📦</div>
              <h3 className="font-serif text-xl font-bold text-navy mb-3">
                EU-Wide Delivery
              </h3>
              <p className="text-navy/70">
                Fast, reliable shipping across all European Union countries with smart logistics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-serif text-4xl font-bold text-navy mb-6">
          Start Your European Taste Journey
        </h2>
        <p className="text-xl text-navy/70 mb-8 max-w-2xl mx-auto">
          From Alpine cheeses to Mediterranean oils, discover the authentic flavours that make Europe special.
        </p>
        <Link 
          href="/shop" 
          className="inline-block px-10 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold text-lg"
        >
          Browse All Products
        </Link>
      </section>
    </div>
  );
}
