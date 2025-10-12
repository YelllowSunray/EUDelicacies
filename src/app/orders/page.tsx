"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserOrders } from "@/lib/firebase-orders";
import { hasUserReviewedProduct } from "@/lib/reviews";
import { FirebaseOrder } from "@/lib/firebase-collections";
import ReviewForm from "@/components/ReviewForm";
import Image from "next/image";
import Link from "next/link";

export default function OrdersPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<FirebaseOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [reviewingProduct, setReviewingProduct] = useState<{
    productId: string;
    productName: string;
    orderId: string;
  } | null>(null);
  const [reviewedProducts, setReviewedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;
    
    setLoadingOrders(true);
    try {
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);

      // Check which products have been reviewed
      const reviewed = new Set<string>();
      for (const order of userOrders) {
        for (const item of order.items) {
          const hasReviewed = await hasUserReviewedProduct(user.uid, item.productId, order.id);
          if (hasReviewed) {
            reviewed.add(`${order.id}-${item.productId}`);
          }
        }
      }
      setReviewedProducts(reviewed);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleReviewSubmitted = () => {
    setReviewingProduct(null);
    loadOrders(); // Reload to update reviewed status
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-navy">Loading...</p>
      </div>
    );
  }

  if (reviewingProduct) {
    return (
      <div className="min-h-screen bg-cream py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setReviewingProduct(null)}
            className="mb-6 text-olive hover:text-terracotta transition-colors flex items-center gap-2"
          >
            ← Back to Orders
          </button>
          <ReviewForm
            productId={reviewingProduct.productId}
            productName={reviewingProduct.productName}
            userId={user.uid}
            userName={user.displayName || "Anonymous"}
            orderId={reviewingProduct.orderId}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setReviewingProduct(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            My Orders
          </h1>
          <p className="text-navy/70">
            View your order history and leave reviews
          </p>
        </div>

        {loadingOrders ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-navy/70">Loading your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-olive/5 border-b border-olive/20 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-sm text-navy/60 mb-1">Order Number</p>
                      <p className="text-xl font-mono font-bold text-navy">
                        {order.orderNumber}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="text-center">
                        <p className="text-xs text-navy/60 mb-1">Date</p>
                        <p className="font-semibold text-navy">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-navy/60 mb-1">Total</p>
                        <p className="font-semibold text-terracotta">
                          €{order.total.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-navy/60 mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="font-semibold text-navy mb-4">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => {
                      const reviewKey = `${order.id}-${item.productId}`;
                      const hasReviewed = reviewedProducts.has(reviewKey);
                      const canReview = order.status === 'delivered' || order.status === 'completed';

                      return (
                        <div key={index} className="flex gap-4 items-start pb-4 border-b border-olive/10 last:border-0">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-olive/10 to-terracotta/10 rounded-lg overflow-hidden relative">
                            {item.productImage ? (
                              <Image
                                src={item.productImage}
                                alt={item.productName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-3xl">
                                🍴
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/products/${item.productId}`}
                              className="font-semibold text-navy hover:text-terracotta transition-colors block mb-1"
                            >
                              {item.productName}
                            </Link>
                            <p className="text-sm text-navy/60 mb-1">
                              by {item.sellerName}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-navy/70">Qty: {item.quantity}</span>
                              <span className="text-navy/70">€{item.pricePerUnit.toFixed(2)} each</span>
                              <span className="font-semibold text-navy">€{item.subtotal.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Review Button */}
                          <div className="flex-shrink-0">
                            {hasReviewed ? (
                              <div className="text-center">
                                <div className="text-2xl mb-1">✅</div>
                                <p className="text-xs text-green-600 font-medium">Reviewed</p>
                              </div>
                            ) : canReview ? (
                              <button
                                onClick={() => setReviewingProduct({
                                  productId: item.productId,
                                  productName: item.productName,
                                  orderId: order.id
                                })}
                                className="px-4 py-2 bg-gold/20 text-navy rounded-lg hover:bg-gold/30 transition-colors font-medium text-sm border border-gold/40"
                              >
                                ⭐ Review
                              </button>
                            ) : (
                              <div className="text-center">
                                <p className="text-xs text-navy/40">Review after delivery</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-6 border-t border-olive/20">
                    <h4 className="font-semibold text-navy mb-3 text-sm">Shipping Address</h4>
                    <div className="text-sm text-navy/70">
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                      <p>{order.shippingAddress.country}</p>
                      <p className="mt-1">Phone: {order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-navy/70 mb-2">
              You haven't placed any orders yet
            </p>
            <p className="text-sm text-navy/60 mb-6">
              Start exploring our authentic European delicacies!
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
