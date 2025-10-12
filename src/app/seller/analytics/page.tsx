"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSellerProducts, type SellerProduct } from "@/lib/products";

export default function AnalyticsPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "seller")) {
      router.push("/");
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (user && userData?.role === "seller") {
      loadData();
    }
  }, [user, userData]);

  const loadData = async () => {
    if (!user) return;
    setLoadingData(true);
    try {
      const sellerProducts = await getSellerProducts(user.uid);
      setProducts(sellerProducts);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoadingData(false);
  };

  if (loading || !user || userData?.role !== "seller") {
    return null;
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const avgPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;

  // Category breakdown
  const categoryData = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Country breakdown
  const countryData = products.reduce((acc, p) => {
    acc[p.country] = (acc[p.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/seller/dashboard" className="text-olive hover:text-terracotta transition-colors mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            Analytics
          </h1>
          <p className="text-navy/70">
            Track your shop's performance
          </p>
        </div>

        {loadingData ? (
          <div className="text-center py-12">
            <p className="text-navy">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">📦</div>
                <p className="text-3xl font-bold text-navy">{totalProducts}</p>
                <p className="text-sm text-navy/60">Total Products</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-3xl font-bold text-navy">{totalStock}</p>
                <p className="text-sm text-navy/60">Total Stock Items</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">💶</div>
                <p className="text-3xl font-bold text-navy">€{totalValue.toFixed(2)}</p>
                <p className="text-sm text-navy/60">Inventory Value</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">🏷️</div>
                <p className="text-3xl font-bold text-navy">€{avgPrice.toFixed(2)}</p>
                <p className="text-sm text-navy/60">Average Price</p>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                Products by Category
              </h2>
              {Object.keys(categoryData).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(categoryData).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-navy">{category}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-cream rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-terracotta h-full rounded-full"
                            style={{ width: `${(count / totalProducts) * 100}%` }}
                          />
                        </div>
                        <span className="text-navy/60 text-sm w-12 text-right">{count} ({Math.round((count / totalProducts) * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-navy/60 text-center py-8">No data available</p>
              )}
            </div>

            {/* Country Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                Products by Country
              </h2>
              {Object.keys(countryData).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(countryData).map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="text-navy">{country}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-48 bg-cream rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-olive h-full rounded-full"
                            style={{ width: `${(count / totalProducts) * 100}%` }}
                          />
                        </div>
                        <span className="text-navy/60 text-sm w-12 text-right">{count} ({Math.round((count / totalProducts) * 100)}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-navy/60 text-center py-8">No data available</p>
              )}
            </div>

            {/* Top Products by Stock Value */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                Top Products by Inventory Value
              </h2>
              {products.length > 0 ? (
                <div className="space-y-3">
                  {products
                    .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
                    .slice(0, 5)
                    .map((product) => (
                      <div key={product.id} className="flex justify-between items-center border-b border-olive/10 pb-3">
                        <div>
                          <p className="font-semibold text-navy">{product.name}</p>
                          <p className="text-sm text-navy/60">{product.stock} units × €{product.price.toFixed(2)}</p>
                        </div>
                        <p className="text-lg font-bold text-terracotta">€{(product.price * product.stock).toFixed(2)}</p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-navy/60 text-center py-8">No products yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

