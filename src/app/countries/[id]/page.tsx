"use client";

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCountryById } from '@/lib/firebase-countries';
import { getProductsByCountry } from '@/lib/products';
import { FirebaseCountry } from '@/lib/firebase-collections';
import { SellerProduct } from '@/lib/products';
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function CountryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [country, setCountry] = useState<FirebaseCountry | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  const loadData = async () => {
    setLoading(true);
    const [countryData, productsData] = await Promise.all([
      getCountryById(resolvedParams.id),
      getProductsByCountry(resolvedParams.id)
    ]);
    
    setCountry(countryData);
    setProducts(productsData);
    setLoading(false);
    
    if (!countryData) {
      router.push('/countries');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-navy text-xl">Loading...</p>
      </div>
    );
  }

  if (!country) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Country Hero */}
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-8xl mb-6">{country.flag}</div>
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-4">
              {country.name}
            </h1>
            <p className="text-2xl text-terracotta italic mb-6">
              {country.tagline}
            </p>
            <p className="text-lg text-navy/80 max-w-3xl mx-auto">
              {country.description}
            </p>
          </div>
        </div>
      </section>

      {/* Specialties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="font-serif text-2xl font-bold text-navy mb-4">
            Regional Specialties
          </h2>
          <div className="flex flex-wrap gap-3">
            {country.specialties.map((specialty, idx) => (
              <span 
                key={idx}
                className="px-4 py-2 bg-olive/10 text-olive rounded-full font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-serif text-4xl font-bold text-navy mb-8">
          Products from {country.name}
        </h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-cream rounded-lg">
            <p className="text-navy/70 text-lg">
              Products from {country.name} coming soon!
            </p>
          </div>
        )}
      </section>

      {/* Back Link */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link 
          href="/countries"
          className="inline-flex items-center text-olive hover:text-terracotta transition-colors font-medium"
        >
          ← Back to all countries
        </Link>
      </section>
    </div>
  );
}
