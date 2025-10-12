"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getAllProducts, SellerProduct } from "@/lib/products";
import Link from "next/link";

const categoryMap: { [key: string]: { name: string; description: string; emoji: string; matches: string[] } } = {
  "cheese": {
    name: "Cheeses & Dairy",
    description: "Artisan cheeses and dairy products from traditional European producers. From creamy Brie to aged Gouda, discover authentic flavours that have been perfected over centuries.",
    emoji: "🧀",
    matches: ["Cheese"]
  },
  "beverages": {
    name: "Wines & Spirits",
    description: "Premium wines, beers, and spirits from renowned European regions. Each bottle tells a story of terroir, tradition, and masterful craftsmanship.",
    emoji: "🍷",
    matches: ["Beverages"]
  },
  "oils": {
    name: "Preserves & Oils",
    description: "Cold-pressed olive oils, honey, marmalades, and other pantry essentials. Natural, organic, and bursting with Mediterranean sunshine.",
    emoji: "🫒",
    matches: ["Oils", "Preserves"]
  },
  "meats": {
    name: "Meats & Seafood",
    description: "Cured hams, sausages, and preserved seafood using time-honored techniques. Quality meats from small-scale producers who care about their craft.",
    emoji: "🥓",
    matches: ["Meats", "Seafood", "Gourmet Meals"]
  },
  "bakery": {
    name: "Sweets & Bakery",
    description: "Pastries, cookies, waffles, and confections from Europe's finest bakeries. Sweet treats that bring joy with every bite.",
    emoji: "🥖",
    matches: ["Bakery", "Snacks"]
  }
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryInfo = categoryMap[resolvedParams.category];

  useEffect(() => {
    if (!categoryInfo) {
      router.push('/shop');
      return;
    }
    loadProducts();
  }, [resolvedParams.category, categoryInfo]);

  const loadProducts = async () => {
    setLoading(true);
    const allProducts = await getAllProducts();
    
    // Filter products by category
    const filtered = allProducts.filter(p => 
      categoryInfo.matches.includes(p.category)
    );
    
    setProducts(filtered);
    setLoading(false);
  };

  if (!categoryInfo) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">{categoryInfo.emoji}</div>
          <p className="text-navy text-xl">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Category Hero */}
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-7xl mb-6">{categoryInfo.emoji}</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6">
            {categoryInfo.name}
          </h1>
          <p className="text-xl text-navy/80 max-w-3xl mx-auto">
            {categoryInfo.description}
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy">
            {products.length} Products
          </h2>
          <Link 
            href="/shop"
            className="text-olive hover:text-terracotta transition-colors font-medium"
          >
            View All Products →
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-cream rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-navy/70 text-lg mb-2">No products in this category yet.</p>
            <p className="text-sm text-navy/60 mb-6">
              Check back soon as sellers add more products!
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </section>

      {/* Back Link */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Link 
          href="/shop"
          className="inline-flex items-center text-olive hover:text-terracotta transition-colors font-medium"
        >
          ← Back to all products
        </Link>
      </section>
    </div>
  );
}
