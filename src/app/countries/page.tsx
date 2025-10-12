"use client";

import { useState, useEffect } from 'react';
import { getAllCountries } from '@/lib/firebase-countries';
import { FirebaseCountry } from '@/lib/firebase-collections';
import CountryCard from "@/components/CountryCard";
import Link from "next/link";

export default function CountriesPage() {
  const [countries, setCountries] = useState<FirebaseCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setLoading(true);
    const data = await getAllCountries();
    setCountries(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <p className="text-navy text-xl">Loading countries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6">
            Discover Europe by Taste
          </h1>
          <p className="text-xl text-navy/80 max-w-3xl mx-auto">
            Each country offers unique culinary traditions passed down through generations. 
            Explore authentic delicacies from artisan producers across Europe.
          </p>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {countries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-navy/70 mb-4">No countries available yet.</p>
            <p className="text-sm text-navy/60 mb-4">Please run the seed script to populate countries data.</p>
            <Link 
              href="/admin/seed"
              className="inline-block px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
            >
              Go to Seed Page
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country) => (
              <CountryCard key={country.id} country={country} />
            ))}
          </div>
        )}
      </section>

      {/* Info Section */}
      {countries.length > 0 && (
        <section className="bg-navy text-cream py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg">
              <strong>{countries.length} European countries</strong> and growing!
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
