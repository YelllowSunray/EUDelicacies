import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { getProductById } from "@/lib/products";
import type { SellerProduct } from "@/lib/products";
import ProductReviews from "@/components/ProductReviews";
import AddToCartButton from "@/components/AddToCartButton";
import { generateMetadata as generateSEOMetadata, generateProductStructuredData, generateBreadcrumbStructuredData, SEO_KEYWORDS } from "@/lib/seo";
import { getProductRating } from "@/lib/reviews";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  
  try {
    const product = await getProductById(resolvedParams.id);
    
    if (!product) {
      return generateSEOMetadata({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        url: `/products/${resolvedParams.id}`,
      });
    }

    const rating = await getProductRating(product.id);
    
    return generateSEOMetadata({
      title: `${product.name} - Authentic ${product.country} Delicacy`,
      description: `${product.description} Premium ${product.category.toLowerCase()} from ${product.country}. Order authentic European delicacies with fast delivery. €${product.price}`,
      keywords: [
        ...SEO_KEYWORDS.products,
        product.name.toLowerCase(),
        product.category.toLowerCase(),
        product.country.toLowerCase(),
        `${product.country.toLowerCase()} food`,
        `authentic ${product.category.toLowerCase()}`,
        `buy ${product.name.toLowerCase()}`,
        `${product.country.toLowerCase()} delicacies`,
      ],
      type: 'product',
      url: `/products/${product.id}`,
      image: product.imageUrl,
      price: product.price,
      currency: 'EUR',
      availability: 'in stock',
      brand: product.country,
      category: product.category,
    });
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return generateSEOMetadata({
      title: "Product Not Found",
      description: "The requested product could not be found.",
      url: `/products/${resolvedParams.id}`,
    });
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  let product: SellerProduct | null = null;
  let rating = null;
  
  try {
    product = await getProductById(resolvedParams.id);
    if (!product) {
      notFound();
    }
    
    rating = await getProductRating(product.id);
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }

  // Generate structured data
  const productStructuredData = generateProductStructuredData({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    category: product.category,
    country: product.country,
    sellerId: product.sellerId,
    sellerName: product.sellerName,
    rating: rating?.averageRating,
    reviewCount: rating?.totalReviews,
  });

  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Shop', url: '/shop' },
    { name: product.category, url: `/shop?category=${encodeURIComponent(product.category)}` },
    { name: product.name, url: `/products/${product.id}` },
  ]);

  return (
    <div className="min-h-screen bg-cream">
      {/* Structured Data */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-olive/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-navy/60 hover:text-navy transition-colors">
              Home
            </Link>
            <span className="text-navy/40">/</span>
            <Link href="/shop" className="text-navy/60 hover:text-navy transition-colors">
              Shop
            </Link>
            <span className="text-navy/40">/</span>
            <Link 
              href={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-navy/60 hover:text-navy transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-navy/40">/</span>
            <span className="text-navy font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden bg-cream">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} - Authentic ${product.country} delicacy`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              {/* Country Badge */}
              <div className="absolute top-4 left-4 bg-navy text-white px-3 py-1 rounded-full text-sm font-medium">
                🇪🇺 {product.country}
              </div>
              
              {/* Rating Badge */}
              {rating && rating.averageRating > 0 && (
                <div className="absolute top-4 right-4 bg-gold text-navy px-3 py-1 rounded-full text-sm font-medium">
                  ⭐ {rating.averageRating.toFixed(1)} ({rating.totalReviews})
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="flex-1">
                <h1 className="font-serif text-3xl font-bold text-navy mb-2">
                  {product.name}
                </h1>
                
                <p className="text-navy/60 mb-4">
                  Authentic {product.category} from {product.country}
                </p>
                
                <div className="text-3xl font-bold text-terracotta mb-6">
                  €{product.price.toFixed(2)}
                </div>
                
                <div className="prose prose-navy max-w-none mb-8">
                  <h3 className="text-lg font-semibold text-navy mb-2">Description</h3>
                  <p className="text-navy/80 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-cream rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-navy/60">Category</span>
                    <p className="text-navy font-medium">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-navy/60">Origin</span>
                    <p className="text-navy font-medium">{product.country}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-navy/60">Seller</span>
                    <p className="text-navy font-medium">{product.sellerName || 'EU Delicacies Seller'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-navy/60">Availability</span>
                    <p className="text-green-600 font-medium">✅ In Stock</p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-12">
          <ProductReviews productId={product.id} />
        </div>

        {/* Related Products or Back to Shop */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-olive text-white rounded-full hover:bg-olive/90 transition-colors font-semibold"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}