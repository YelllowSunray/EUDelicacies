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
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

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

  // Filter products based on selected specialty
  const filteredProducts = selectedSpecialty
    ? products.filter(product => {
        const searchTerm = selectedSpecialty.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      })
    : products;

  const handleSpecialtyClick = (specialty: string) => {
    if (selectedSpecialty === specialty) {
      // Clicking the same specialty clears the filter
      setSelectedSpecialty(null);
    } else {
      setSelectedSpecialty(specialty);
    }
  };

  const clearFilter = () => {
    setSelectedSpecialty(null);
  };

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
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-olive/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-3xl font-bold text-navy flex items-center gap-2">
              <span>🏆</span> Regional Specialties
            </h2>
            {selectedSpecialty && (
              <button
                onClick={clearFilter}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors font-medium text-sm flex items-center gap-2"
              >
                <span>✕</span> Clear Filter
              </button>
            )}
          </div>
          
          {selectedSpecialty && (
            <div className="mb-4 p-4 bg-terracotta/10 border border-terracotta/30 rounded-lg">
              <p className="text-sm text-navy/80">
                <strong>🔍 Filtering by:</strong> {selectedSpecialty}
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            {country.specialties.map((specialty, idx) => {
              const isSelected = selectedSpecialty === specialty;
              return (
                <button
                  key={idx}
                  onClick={() => handleSpecialtyClick(specialty)}
                  className={`px-5 py-2.5 rounded-full font-semibold transition-all transform hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-r from-terracotta to-terracotta/90 text-white shadow-lg ring-2 ring-terracotta/50'
                      : 'bg-olive/10 text-olive hover:bg-olive/20 hover:shadow-md'
                  }`}
                >
                  {isSelected && '✓ '}
                  {specialty}
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-navy/60 mt-4">
            💡 Click a specialty to filter products
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-4xl font-bold text-navy">
            {selectedSpecialty 
              ? `${selectedSpecialty} from ${country.name}` 
              : `Products from ${country.name}`}
          </h2>
          {selectedSpecialty && filteredProducts.length > 0 && (
            <div className="bg-terracotta/20 px-4 py-2 rounded-full">
              <span className="text-terracotta font-semibold">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </span>
            </div>
          )}
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : selectedSpecialty ? (
          <div className="text-center py-16 bg-gradient-to-br from-cream to-terracotta/10 rounded-lg border-2 border-dashed border-terracotta/30">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-serif text-2xl font-bold text-navy mb-2">
              No "{selectedSpecialty}" Found
            </h3>
            <p className="text-navy/70 text-lg mb-6">
              We couldn't find any products matching "{selectedSpecialty}" from {country.name}
            </p>
            <button
              onClick={clearFilter}
              className="px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold shadow-md"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="text-center py-12 bg-cream rounded-lg">
            <div className="text-6xl mb-4">{country.flag}</div>
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
