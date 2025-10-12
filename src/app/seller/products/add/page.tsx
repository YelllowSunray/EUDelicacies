"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addProduct, categories } from "@/lib/products";
import { getAllCountries } from "@/lib/firebase-countries";
import { uploadProductImage, validateImageFile, compressImage } from "@/lib/firebase-storage";
import { FirebaseCountry } from "@/lib/firebase-collections";
import Link from "next/link";
import Image from "next/image";

export default function AddProductPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [countries, setCountries] = useState<FirebaseCountry[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    story: "",
    price: "",
    category: categories[0],
    country: "",
    countryId: "",
    region: "",
    stock: "",
    shelfLife: "",
    pairWith: "",
    tags: ""
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "seller")) {
      router.push("/");
    }
    loadCountries();
  }, [user, userData, loading, router]);

  const loadCountries = async () => {
    const data = await getAllCountries();
    setCountries(data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "countryId") {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid image file");
      return;
    }

    setImageFile(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (!user || !userData) {
        throw new Error("User not authenticated");
      }

      // Create temporary product ID
      const tempProductId = `temp_${Date.now()}`;
      
      let imageUrl = "";
      
      // Upload image if provided
      if (imageFile) {
        setUploadingImage(true);
        // Compress image before upload
        const compressedFile = await compressImage(imageFile);
        imageUrl = await uploadProductImage(compressedFile, tempProductId, user.uid);
        setUploadingImage(false);
      }

      const product = {
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
        imageUrl: imageUrl || undefined,
        sellerId: user.uid,
        sellerName: user.displayName || "Unknown Seller",
        active: true,
        featured: false
      };

      await addProduct(product);
      router.push("/seller/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to add product");
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  if (loading || !user || userData?.role !== "seller") {
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
            Add New Product
          </h1>
          <p className="text-navy/70">
            List a new product from your collection
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Product Image Upload */}
          <div className="border-2 border-dashed border-olive/30 rounded-lg p-6">
            <label className="block text-sm font-medium text-navy mb-2">
              Product Image
            </label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Product preview"
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-navy/70 mb-4">Upload a photo of your product</p>
                  <label className="cursor-pointer px-6 py-3 bg-olive text-white rounded-lg hover:bg-olive/90 transition-colors font-medium">
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-navy/60 mt-2">
                    JPG, PNG, GIF or WebP (max 5MB)
                  </p>
                </div>
              )}
              {uploadingImage && (
                <div className="text-center text-olive font-medium">
                  Uploading image...
                </div>
              )}
            </div>
          </div>

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
                placeholder="e.g., Aged Gouda Cheese"
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
                name="countryId"
                value={formData.countryId}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
              >
                <option value="">Select Country</option>
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
                placeholder="e.g., Gouda, Tuscany"
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
                placeholder="14.90"
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
                placeholder="50"
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
                placeholder="e.g., 2 months, 1 year"
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
                placeholder="A brief description of your product"
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
                placeholder="Tell the story behind your product. How is it made? What makes it special?"
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
                placeholder="Wine, Bread, Honey (comma-separated)"
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
                placeholder="Organic, Handmade, Award-winning (comma-separated)"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="flex-1 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? "Uploading Image..." : submitting ? "Adding Product..." : "Add Product"}
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
