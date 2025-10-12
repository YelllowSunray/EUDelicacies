"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getUserOrders } from "@/lib/firebase-orders";
import { FirebaseOrder } from "@/lib/firebase-collections";
import Image from "next/image";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<FirebaseOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

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
    } catch (error) {
      console.error("Error loading orders:", error);
    }
    setLoadingOrders(false);
  };

  const handleCancelOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Are you sure you want to cancel order #${orderNumber}?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      const { updateOrderStatus } = await import('@/lib/firebase-orders');
      await updateOrderStatus(orderId, 'cancelled');
      
      // Reload orders to show updated status
      await loadOrders();
      
      alert('Order cancelled successfully. The seller will be notified.');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again or contact support.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-navy">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            My Orders
          </h1>
          <p className="text-navy/70">
            Track and manage your orders
          </p>
        </div>

        {loadingOrders ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center py-12">
              <p className="text-navy/70">Loading your orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="font-serif text-2xl font-bold text-navy mb-2">
                No Orders Yet
              </h2>
              <p className="text-navy/70 mb-6">
                You haven't placed any orders yet. Start exploring our authentic European delicacies!
              </p>
              <Link
                href="/shop"
                className="inline-block px-8 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold"
              >
                Browse Products
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-olive/5 px-6 py-4 border-b border-olive/20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-navy">
                        Order #{order.orderNumber}
                      </h2>
                      <p className="text-sm text-navy/60">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h3 className="font-semibold text-navy mb-4">Items</h3>
                  <div className="space-y-4 mb-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gradient-to-br from-olive/10 to-terracotta/10 rounded overflow-hidden">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              🍴
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-navy">{item.productName}</h4>
                          <p className="text-sm text-navy/60">by {item.sellerName}</p>
                          <p className="text-sm text-navy/70 mt-1">
                            Quantity: {item.quantity} × €{item.pricePerUnit.toFixed(2)} = €{item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="border-t border-olive/20 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-navy/70">Subtotal:</span>
                      <span className="text-navy">€{order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.shippingCost > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-navy/70">Shipping:</span>
                        <span className="text-navy">€{order.shippingCost.toFixed(2)}</span>
                      </div>
                    )}
                    {order.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-navy/70">Tax:</span>
                        <span className="text-navy">€{order.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-olive/20">
                      <span className="text-navy">Total:</span>
                      <span className="text-terracotta">€{order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 p-4 bg-cream rounded-lg">
                    <h4 className="font-semibold text-navy mb-2">Shipping Address</h4>
                    <p className="text-sm text-navy/80">
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.addressLine1}<br />
                      {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                      {order.shippingAddress.country}<br />
                      {order.shippingAddress.phone}
                    </p>
                  </div>

                  {order.notes && (
                    <div className="mt-4 p-4 bg-gold/10 rounded-lg">
                      <h4 className="font-semibold text-navy mb-2">Order Notes</h4>
                      <p className="text-sm text-navy/80">{order.notes}</p>
                    </div>
                  )}

                  {/* Order Status Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-navy/80">
                      <strong>💡 Note:</strong> The seller(s) will contact you directly via email to arrange payment and delivery. 
                      Please check your email for updates.
                    </p>
                  </div>

                  {/* Cancel Order Button (only for pending orders) */}
                  {order.status === 'pending' && (
                    <div className="mt-6">
                      <button
                        onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                        className="w-full py-3 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        ❌ Cancel Order
                      </button>
                      <p className="text-xs text-navy/50 mt-2 text-center">
                        You can cancel this order while it's still pending. Once the seller starts processing, cancellation requires contacting them directly.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

