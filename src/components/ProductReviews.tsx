"use client";

import { useEffect, useState } from "react";
import { getProductReviews, getProductRating, type Review } from "@/lib/reviews";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const [reviewsData, ratingData] = await Promise.all([
        getProductReviews(productId),
        getProductRating(productId)
      ]);
      
      setReviews(reviewsData);
      setRating(ratingData);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`}>⭐</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half">⭐</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="opacity-30">⭐</span>);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-navy/70">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {rating.reviewCount > 0 && (
        <div className="bg-gradient-to-br from-gold/20 to-cream rounded-lg p-8 border-2 border-gold/30">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-navy mb-2">
                {rating.averageRating.toFixed(1)}
              </div>
              <div className="text-3xl mb-2">
                {renderStars(rating.averageRating)}
              </div>
              <p className="text-sm text-navy/70 font-medium">
                Based on {rating.reviewCount} {rating.reviewCount === 1 ? 'review' : 'reviews'}
              </p>
            </div>
            <div className="flex-1 w-full sm:w-auto">
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-sm text-navy/80 text-center sm:text-left">
                  <strong>Verified Reviews</strong> from customers who purchased this product
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-navy">
              All Reviews ({reviews.length})
            </h3>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white border-2 border-olive/20 rounded-lg p-6 hover:border-olive/40 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-olive/20 to-terracotta/20 rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-navy text-lg">{review.userName}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="text-2xl">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-navy/60">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                        ✓ Verified Purchase
                      </div>
                    </div>
                    
                    {/* Review Text */}
                    <p className="text-navy/90 leading-relaxed mt-3">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-gradient-to-br from-cream to-olive/5 rounded-lg border-2 border-dashed border-olive/30">
          <div className="text-7xl mb-4">⭐</div>
          <h3 className="font-serif text-2xl font-bold text-navy mb-2">
            No Reviews Yet
          </h3>
          <p className="text-navy/70 mb-4">
            Be the first to share your experience with this product!
          </p>
          <p className="text-sm text-navy/60">
            💡 Purchase this product to leave a review and get 10% off your next order
          </p>
        </div>
      )}
    </div>
  );
}


