"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { getSellerProducts, updateProduct, categories, countries, type SellerProduct } from "@/lib/products";
import Link from "next/link";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    story: "",
    price: "",
    category: "",
    country: "",
    countryId: "",
    region: "",
    stock: "",
    shelfLife: "",
    pairWith: "",
    tags: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "seller")) {
      router.push("/");
    }
  }, [user, userData, loading, router]);

  useEffect(() => {
    if (user && userData?.role === "seller") {
      loadProduct();
    }
  }, [user, userData, resolvedParams.id]);

  const loadProduct = async () => {
    if (!user) return;
    try {
      const products = await getSellerProducts(user.uid);
      const prod = products.find(p => p.id === resolvedParams.id);
      
      if (!prod) {
        setError("Product not found");
        return;
      }

      setProduct(prod);
      setFormData({
        name: prod.name,
        description: prod.description,
        story: prod.story,
        price: prod.price.toString(),
        category: prod.category,
        country: prod.country,
        countryId: prod.countryId,
        region: prod.region,
        stock: prod.stock.toString(),
        shelfLife: prod.shelfLife,
        pairWith: prod.pairWith.join(', '),
        tags: prod.tags.join(', ')
      });
    } catch (error) {
      console.error("Error loading product:", error);
      setError("Failed to load product");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "country") {
      const selectedCountry = countries.find(c => c.id === value);
      setFormData({
        ...formData,
        country: selectedCountry?.name || "",
        countryId: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const updates = {
        name: formData.name,
        description: formData.description,
        story: formData.story,
        price: parseFloat(formData.price),
        category: formData.category,
        country: formData.country,
        countryId: formData.countryId,
        region: formData.region,
        stock: parseInt(formData.stock),
        shelfLife: formData.shelfLife,
        pairWith: formData.pairWith.split(',').map(item => item.trim()).filter(item => item),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      await updateProduct(resolvedParams.id, updates);
      router.push("/seller/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to update product");
      setSubmitting(false);
    }
  };

  if (loading || !user || userData?.role !== "seller" || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-navy">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/seller/dashboard" className="text-olive hover:text-terracotta transition-colors mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            Edit Product
          </h1>
          <p className="text-navy/70">
            Update your product information
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Country *
              </label>
              <select
                name="country"
                value={formData.countryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              >
                {countries.map(country => (
                  <option key={country.id} value={country.id}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Region *
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Price (€) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Shelf Life *
              </label>
              <input
                type="text"
                name="shelfLife"
                value={formData.shelfLife}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy mb-2">
                Product Story *
              </label>
              <textarea
                name="story"
                value={formData.story}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Perfect Pairings
              </label>
              <input
                type="text"
                name="pairWith"
                value={formData.pairWith}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                placeholder="Wine, Bread, Cheese (comma-separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                placeholder="Organic, Handmade (comma-separated)"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating Product..." : "Update Product"}
            </button>
            <Link
              href="/seller/dashboard"
              className="px-8 py-3 bg-gray-200 text-navy rounded-lg hover:bg-gray-300 transition-colors font-medium text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

