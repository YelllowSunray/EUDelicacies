"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import type { SellerProduct } from "@/lib/products";
import type { CartItem } from "@/lib/firebase-collections";

interface AddToCartButtonProps {
  product: SellerProduct;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      // Store return URL for after login
      const currentUrl = window.location.pathname + window.location.search;
      localStorage.setItem('returnUrl', currentUrl);
      router.push('/login');
      return;
    }

    setIsAdding(true);
    try {
      // Transform product to CartItem format
      const cartItem: CartItem = {
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        price: product.price,
        quantity: 1, // Default quantity
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        stock: product.stock,
      };
      
      await addToCart(cartItem);
      // Optional: Show success message or animation
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Optional: Show error message
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className="w-full bg-terracotta text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Adding to Cart...
        </>
      ) : (
        <>
          🛒 Add to Cart
        </>
      )}
    </button>
  );
}
