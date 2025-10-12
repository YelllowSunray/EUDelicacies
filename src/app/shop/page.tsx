"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, categories as productCategories } from "@/lib/products";
import { getAllCountries } from "@/lib/firebase-countries";
import { SellerProduct } from "@/lib/products";
import { FirebaseCountry } from "@/lib/firebase-collections";

export default function ShopPage() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [countries, setCountries] = useState<FirebaseCountry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [productsData, countriesData] = await Promise.all([
      getAllProducts(),
      getAllCountries()
    ]);
    setProducts(productsData);
    setCountries(countriesData);
    setLoading(false);
  };

  // Filter products
  let filteredProducts = products;
  
  if (selectedCountry !== "all") {
    filteredProducts = filteredProducts.filter(p => p.countryId === selectedCountry);
  }
  
  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-navy text-xl">Loading products...</p>
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
            Shop All Products
          </h1>
          <p className="text-xl text-navy/80 max-w-3xl mx-auto">
            Discover authentic European delicacies from artisan producers. 
            Filter by country or category to find your perfect taste.
          </p>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              >
                <option value="all">All Countries</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              >
                <option value="all">All Categories</option>
                {productCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-navy/60">
            Showing {sortedProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-xl text-navy/70 mb-2">No products found</p>
            <p className="text-sm text-navy/60 mb-6">
              Try adjusting your filters or check back later for new products
            </p>
            <button
              onClick={() => {
                setSelectedCountry("all");
                setSelectedCategory("all");
              }}
              className="px-6 py-2 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
