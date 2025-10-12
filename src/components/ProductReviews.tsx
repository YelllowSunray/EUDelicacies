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
      <div className="bg-cream rounded-lg p-6">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-5xl font-bold text-navy">
              {rating.averageRating > 0 ? rating.averageRating.toFixed(1) : "N/A"}
            </div>
            <div className="text-2xl mt-2">
              {rating.averageRating > 0 && renderStars(rating.averageRating)}
            </div>
            <p className="text-sm text-navy/60 mt-2">
              {rating.reviewCount} {rating.reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-navy">
            Customer Reviews
          </h3>
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-olive/20 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-navy">{review.userName}</span>
                    <span className="text-sm text-navy/60">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xl">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-navy/80 leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-cream rounded-lg">
          <div className="text-6xl mb-4">💭</div>
          <p className="text-navy/70">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
}


