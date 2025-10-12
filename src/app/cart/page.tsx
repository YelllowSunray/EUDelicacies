"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, loading, total, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl font-bold text-navy mb-6">
            Shopping Cart
          </h1>
          <p className="text-navy/70 mb-8">Please login to view your cart</p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-navy">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl font-bold text-navy mb-6">
            Shopping Cart
          </h1>
          <div className="text-6xl mb-6">🛒</div>
          <p className="text-navy/70 mb-8">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemove = async (productId: string) => {
    if (confirm('Remove this item from cart?')) {
      try {
        await removeItem(productId);
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-serif text-4xl font-bold text-navy mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white rounded-lg shadow-md p-6 flex gap-6"
              >
                {/* Product Image */}
                <div className="relative w-24 h-24 flex-shrink-0 bg-gradient-to-br from-olive/10 to-terracotta/10 rounded-lg overflow-hidden">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      🍴
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-serif text-lg font-bold text-navy hover:text-terracotta transition-colors"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-olive">by {item.sellerName}</p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-lg font-bold text-terracotta mb-3">
                    €{item.price.toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-navy">Quantity:</span>
                    <div className="flex items-center border border-olive/30 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 bg-cream hover:bg-olive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        −
                      </button>
                      <span className="px-4 py-1 bg-white border-x border-olive/30">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="px-3 py-1 bg-cream hover:bg-olive/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                    {item.quantity >= item.stock && (
                      <span className="text-xs text-red-600">Max stock reached</span>
                    )}
                  </div>

                  {/* Subtotal */}
                  <p className="mt-3 text-sm text-navy/70">
                    Subtotal: <span className="font-semibold text-navy">€{(item.price * item.quantity).toFixed(2)}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-olive/20">
                <div className="flex justify-between text-navy">
                  <span>Items ({items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-navy">
                  <span>Shipping</span>
                  <span className="text-olive">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-navy mb-6">
                <span>Estimated Total</span>
                <span className="text-terracotta">€{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/shop"
                className="block text-center text-navy hover:text-terracotta transition-colors text-sm"
              >
                ← Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t border-olive/20">
                <p className="text-xs text-navy/60">
                  💡 No payment required. Sellers will contact you directly to arrange payment and delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
