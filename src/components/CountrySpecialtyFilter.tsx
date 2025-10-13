"use client";

import { useState } from "react";
import { SellerProduct } from "@/lib/products";
import ProductCard from "./ProductCard";

interface CountrySpecialtyFilterProps {
  specialties: string[];
  products: SellerProduct[];
}

export default function CountrySpecialtyFilter({ specialties, products }: CountrySpecialtyFilterProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const handleSpecialtyClick = (specialty: string) => {
    setSelectedSpecialty(selectedSpecialty === specialty ? null : specialty);
  };

  const clearFilter = () => {
    setSelectedSpecialty(null);
  };

  // Filter products based on selected specialty
  const filteredProducts = selectedSpecialty
    ? products.filter(product => 
        product.name.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
        product.description.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
        product.category.toLowerCase().includes(selectedSpecialty.toLowerCase())
      )
    : products;

  return (
    <div>
      {/* Specialty Tags */}
      <div className="flex flex-wrap gap-3 mb-6">
        {specialties.map((specialty) => (
          <button
            key={specialty}
            onClick={() => handleSpecialtyClick(specialty)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSpecialty === specialty
                ? 'bg-terracotta text-white shadow-md'
                : 'bg-cream text-navy hover:bg-olive/10 border border-olive/20'
            }`}
          >
            {specialty}
          </button>
        ))}
        
        {selectedSpecialty && (
          <button
            onClick={clearFilter}
            className="px-4 py-2 rounded-full text-sm font-medium bg-navy/10 text-navy hover:bg-navy/20 transition-colors"
          >
            ✕ Clear Filter
          </button>
        )}
      </div>

      {/* Filtered Products */}
      {selectedSpecialty && (
        <div className="mt-8">
          <h3 className="font-serif text-xl font-bold text-navy mb-4">
            {selectedSpecialty} Products
            {filteredProducts.length > 0 && (
              <span className="text-base font-normal text-navy/60 ml-2">
                ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
              </span>
            )}
          </h3>
          
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-cream/50 rounded-lg border-2 border-dashed border-olive/20">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-navy/70">
                No products found for "{selectedSpecialty}". Try browsing all products below.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
