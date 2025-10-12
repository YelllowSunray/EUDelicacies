import { notFound } from "next/navigation";
import { getProductById } from "@/data/products";
import Link from "next/link";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = getProductById(resolvedParams.id);
  
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link 
          href={`/countries/${product.countryId}`}
          className="inline-flex items-center text-olive hover:text-terracotta transition-colors font-medium mb-8"
        >
          ← Back to {product.country}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-gradient-to-br from-olive/10 to-terracotta/10 rounded-2xl flex items-center justify-center h-[500px]">
            <div className="text-9xl">
              {product.category === "Cheese" && "🧀"}
              {product.category === "Beverages" && "🍷"}
              {product.category === "Oils" && "🫒"}
              {product.category === "Meats" && "🥓"}
              {product.category === "Bakery" && "🥖"}
              {product.category === "Snacks" && "🍪"}
              {product.category === "Gourmet Meals" && "🍽️"}
              {product.category === "Seafood" && "🐟"}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1 bg-olive/10 text-olive rounded-full text-sm font-medium">
                {product.category}
              </span>
              <span className="text-navy/60">{product.region}</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-navy mb-4">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-terracotta">
                €{product.price.toFixed(2)}
              </span>
              <span className="text-navy/60">
                ⭐ {product.rating}/5.0
              </span>
            </div>

            <p className="text-lg text-navy/80 mb-6">
              {product.description}
            </p>

            {/* The Story */}
            <div className="bg-cream rounded-lg p-6 mb-6">
              <h2 className="font-serif text-2xl font-bold text-navy mb-3">
                The Story
              </h2>
              <p className="text-navy/80 leading-relaxed">
                {product.story}
              </p>
              <p className="text-sm text-olive mt-4 italic">
                From: {product.seller}
              </p>
            </div>

            {/* Product Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-olive/20">
                <p className="text-sm text-navy/60 mb-1">Shelf Life</p>
                <p className="font-semibold text-navy">{product.shelfLife}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-olive/20">
                <p className="text-sm text-navy/60 mb-1">Stock Available</p>
                <p className="font-semibold text-navy">{product.stock} units</p>
              </div>
            </div>

            {/* Pair With */}
            <div className="mb-6">
              <h3 className="font-semibold text-navy mb-3">Perfect Pairings:</h3>
              <div className="flex flex-wrap gap-2">
                {product.pairWith.map((item, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-white text-navy text-sm rounded-full border border-olive/30"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-gold/20 text-navy text-sm rounded-full font-medium"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold text-lg">
              Add to Cart - €{product.price.toFixed(2)}
            </button>

            <p className="text-sm text-navy/60 text-center mt-4">
              🚚 EU-wide shipping • 📦 Secure packaging • ✓ Satisfaction guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

