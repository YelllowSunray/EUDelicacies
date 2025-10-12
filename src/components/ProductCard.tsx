"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    country: string;
    category: string;
    description: string;
    price: number;
    imageUrl?: string;
    sellerId: string;
    sellerName: string;
    stock: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Category emoji fallback
  const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
      "Cheese": "🧀",
      "Beverages": "🍷",
      "Oils": "🫒",
      "Meats": "🥓",
      "Bakery": "🥖",
      "Snacks": "🍪",
      "Gourmet Meals": "🍽️",
      "Seafood": "🐟",
      "Preserves": "🍯"
    };
    return emojiMap[category] || "🍴";
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    if (product.stock <= 0) {
      alert('This product is currently out of stock');
      return;
    }

    setIsAdding(true);
    try {
      await addToCart({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        price: product.price,
        quantity: 1,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        stock: product.stock,
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 h-full relative">
      {showSuccess && (
        <div className="absolute top-0 left-0 right-0 bg-olive text-white text-center py-2 z-10 text-sm font-medium">
          ✓ Added to cart!
        </div>
      )}
      
      <Link href={`/products/${product.id}`} className="block">
        {/* Product Image or Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-olive/10 to-terracotta/10">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl">
                {getCategoryEmoji(product.category)}
              </div>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-lg font-bold text-navy line-clamp-2 flex-1">
              {product.name}
            </h3>
            <span className="text-xl font-bold text-terracotta ml-2 whitespace-nowrap">
              €{product.price.toFixed(2)}
            </span>
          </div>
          <p className="text-sm text-olive mb-2">{product.country}</p>
          <p className="text-sm text-navy/70 line-clamp-2 mb-3">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="inline-block px-3 py-1 bg-olive/10 text-olive text-xs rounded-full">
              {product.category}
            </span>
            {product.stock > 0 ? (
              <span className="text-xs text-olive">In Stock: {product.stock}</span>
            ) : (
              <span className="text-xs text-red-600">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.stock <= 0}
          className="w-full py-2.5 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAdding ? "Adding..." : product.stock <= 0 ? "Out of Stock" : "Add to Cart 🛒"}
        </button>
      </div>
    </div>
  );
}
