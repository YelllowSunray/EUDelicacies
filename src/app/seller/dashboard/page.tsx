"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSellerProducts, deleteProduct, type SellerProduct } from "@/lib/products";
import { getSellerOrders, getSellerOrderStats, updateOrderStatus } from "@/lib/firebase-orders";
import { FirebaseOrder, OrderStatus } from "@/lib/firebase-collections";

export default function SellerDashboardPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [orders, setOrders] = useState<FirebaseOrder[]>([]);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "seller")) {
      router.push("/");
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (user && userData?.role === "seller") {
      loadProducts();
      loadOrders();
    }
  }, [user, userData]);

  const loadProducts = async () => {
    if (!user) return;
    setLoadingProducts(true);
    try {
      const sellerProducts = await getSellerProducts(user.uid);
      setProducts(sellerProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
    setLoadingProducts(false);
  };

  const loadOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const [sellerOrders, stats] = await Promise.all([
        getSellerOrders(user.uid),
        getSellerOrderStats(user.uid)
      ]);
      setOrders(sellerOrders);
      setOrderStats(stats);
    } catch (error) {
      console.error("Error loading orders:", error);
    }
    setLoadingOrders(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-navy">Loading...</p>
      </div>
    );
  }

  if (!user || userData?.role !== "seller") {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            Seller Dashboard
          </h1>
          <p className="text-navy/70">
            Welcome back, {user.displayName}! 🏪
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl mb-1">📦</div>
            <p className="text-xl font-bold text-navy">{products.length}</p>
            <p className="text-xs text-navy/60">Products</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl mb-1">📋</div>
            <p className="text-xl font-bold text-navy">{orderStats.totalOrders}</p>
            <p className="text-xs text-navy/60">Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl mb-1">⏳</div>
            <p className="text-xl font-bold text-terracotta">{orderStats.pendingOrders}</p>
            <p className="text-xs text-navy/60">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-xl font-bold text-olive">€{orderStats.totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-navy/60">Revenue</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xl font-bold text-navy">{products.reduce((sum, p) => sum + p.stock, 0)}</p>
            <p className="text-xs text-navy/60">Stock</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-bold text-navy">
                  My Products
                </h2>
                <Link 
                  href="/seller/products/add"
                  className="px-4 py-2 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
                >
                  + Add Product
                </Link>
              </div>
              
              {loadingProducts ? (
                <div className="text-center py-12">
                  <p className="text-navy/70">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 bg-cream rounded-lg">
                  <div className="text-5xl mb-4">📦</div>
                  <p className="text-navy/70 mb-4">
                    You haven't listed any products yet
                  </p>
                  <Link 
                    href="/seller/products/add"
                    className="inline-block px-6 py-2 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
                  >
                    List Your First Product
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border-2 border-olive/20 rounded-lg p-4 hover:shadow-lg transition-all hover:border-olive/40">
                      <div className="flex gap-4 items-start">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gradient-to-br from-olive/10 to-terracotta/10 rounded-lg overflow-hidden relative">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              📦
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-navy text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-navy/60 mb-2">{product.category} • {product.country}</p>
                          <p className="text-sm text-navy/70 line-clamp-2 mb-3">{product.description}</p>
                          <div className="flex gap-4 text-sm">
                            <span className="text-terracotta font-bold text-lg">€{product.price.toFixed(2)}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              product.stock > 10 ? 'bg-green-100 text-green-700' :
                              product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              Stock: {product.stock}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 flex-shrink-0">
                          <Link
                            href={`/seller/products/edit/${product.id}`}
                            className="px-4 py-2 bg-olive/10 text-olive rounded-lg hover:bg-olive/20 transition-colors text-sm font-medium"
                          >
                            ✏️ Edit
                          </Link>
                          {deleteConfirm === product.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteProduct(product.id!)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                              >
                                ✓ Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 bg-gray-200 text-navy rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                              >
                                ✕ Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id!)}
                              className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                Recent Orders
              </h2>
              
              {loadingOrders ? (
                <div className="text-center py-12">
                  <p className="text-navy/70">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 bg-cream rounded-lg">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="text-navy/70">
                    No orders yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => {
                    // Filter items for this seller only
                    const sellerItems = order.items.filter(item => item.sellerId === user?.uid);
                    const sellerTotal = sellerItems.reduce((sum, item) => sum + item.subtotal, 0);
                    
                    return (
                      <div key={order.id} className="border border-olive/20 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-navy">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-navy/60">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <select
                            value={order.status}
                            onChange={async (e) => {
                              const newStatus = e.target.value as OrderStatus;
                              try {
                                await updateOrderStatus(order.id, newStatus);
                                await loadOrders();
                              } catch (error) {
                                console.error('Error updating order status:', error);
                                alert('Failed to update order status');
                              }
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-navy font-medium mb-1">Customer:</p>
                          <p className="text-sm text-navy/70">{order.shippingAddress.fullName}</p>
                          <p className="text-sm text-navy/70">{order.userEmail}</p>
                          <p className="text-sm text-navy/70">{order.shippingAddress.phone}</p>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-navy font-medium mb-1">Your Items:</p>
                          {sellerItems.map((item, idx) => (
                            <p key={idx} className="text-sm text-navy/70">
                              {item.productName} x{item.quantity} - €{item.subtotal.toFixed(2)}
                            </p>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-olive/20">
                          <span className="font-semibold text-navy">Your Total:</span>
                          <span className="font-bold text-terracotta">€{sellerTotal.toFixed(2)}</span>
                        </div>

                        {order.notes && (
                          <div className="mt-3 p-3 bg-gold/10 rounded-lg">
                            <p className="text-xs text-navy/60 font-medium mb-1">Customer Notes:</p>
                            <p className="text-sm text-navy/80">{order.notes}</p>
                          </div>
                        )}

                        <div className="mt-3 flex gap-2">
                          <a
                            href={`mailto:${order.userEmail}?subject=Order ${order.orderNumber} from EU Delicacies`}
                            className="flex-1 text-center px-3 py-2 bg-olive/10 text-olive rounded-lg hover:bg-olive/20 transition-colors text-sm font-medium"
                          >
                            📧 Contact Customer
                          </a>
                          <Link
                            href={`/seller/orders/${order.id}`}
                            className="flex-1 text-center px-3 py-2 bg-terracotta/10 text-terracotta rounded-lg hover:bg-terracotta/20 transition-colors text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {orders.length > 5 && (
                    <Link
                      href="/seller/orders"
                      className="block text-center text-terracotta hover:text-terracotta/80 transition-colors font-medium mt-4"
                    >
                      View all {orders.length} orders →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-serif text-xl font-bold text-navy mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/seller/products/add" className="block w-full text-left px-4 py-3 bg-cream hover:bg-olive/10 rounded-lg transition-colors">
                  <div className="font-semibold text-navy">📦 Add Product</div>
                  <div className="text-sm text-navy/60">List a new product</div>
                </Link>
                <Link href="/seller/analytics" className="block w-full text-left px-4 py-3 bg-cream hover:bg-olive/10 rounded-lg transition-colors">
                  <div className="font-semibold text-navy">📊 View Analytics</div>
                  <div className="text-sm text-navy/60">Track your performance</div>
                </Link>
                <Link href="/settings" className="block w-full text-left px-4 py-3 bg-cream hover:bg-olive/10 rounded-lg transition-colors">
                  <div className="font-semibold text-navy">⚙️ Settings</div>
                  <div className="text-sm text-navy/60">Manage your account</div>
                </Link>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-olive/5 rounded-lg p-6 border border-olive/20">
              <h3 className="font-semibold text-navy mb-3">💡 Seller Tips</h3>
              <ul className="space-y-2 text-sm text-navy/80">
                <li>✓ Add high-quality product photos</li>
                <li>✓ Write detailed product stories</li>
                <li>✓ Keep your inventory updated</li>
                <li>✓ Respond quickly to orders</li>
                <li>✓ Offer authentic regional products</li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-navy mb-3">Need Help?</h3>
              <p className="text-sm text-navy/70 mb-4">
                Check our seller resources or contact support
              </p>
              <Link
                href="/contact"
                className="block w-full text-center px-4 py-2 border border-olive text-navy rounded-full hover:bg-olive/5 transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

