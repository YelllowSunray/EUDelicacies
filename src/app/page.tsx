"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import CountryCard from "@/components/CountryCard";
import { getAllCountries } from "@/lib/firebase-countries";
import { FirebaseCountry } from "@/lib/firebase-collections";
import Link from "next/link";

export default function Home() {
  const [countries, setCountries] = useState<FirebaseCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    setLoading(true);
    const data = await getAllCountries();
    // Show only first 6 countries on homepage
    setCountries(data.slice(0, 6));
    setLoading(false);
  };

  return (
    <div>
      <HeroSection />
      
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
        
        {loading ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-navy/70">Loading countries...</p>
          </div>
        ) : countries.length > 0 ? (
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
