"use client";

import { useState } from "react";
import { addReview } from "@/lib/reviews";

interface ReviewFormProps {
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  orderId: string;
  onReviewSubmitted: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  productId,
  productName,
  userId,
  userName,
  orderId,
  onReviewSubmitted,
  onCancel
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    
    if (comment.trim().length < 10) {
      setError("Please write at least 10 characters");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await addReview({
        productId,
        productName,
        userId,
        userName,
        orderId,
        rating,
        comment: comment.trim(),
      });

      // Generate discount code (simple format: REVIEW10-XXXXX)
      const discountCode = `REVIEW10-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      alert(`✓ Thank you for your review!\n\n🎉 Here's your 10% discount code:\n\n${discountCode}\n\nUse this code on your next order!\n(Save this code - it won't be shown again)`);
      onReviewSubmitted();
    } catch (err: any) {
      console.error("Error submitting review:", err);
      console.error("Error details:", err.code, err.message);
      
      let errorMessage = "Failed to submit review. ";
      if (err.code === 'permission-denied') {
        errorMessage += "Permission denied. Please make sure Firestore rules are deployed.";
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += "Please try again.";
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-olive/20 p-6">
      <h3 className="font-serif text-xl font-bold text-navy mb-4">
        Review: {productName}
      </h3>

      {/* Discount Incentive */}
      <div className="bg-gradient-to-r from-gold/10 to-terracotta/10 border border-gold/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🎁</span>
          <span className="font-bold text-navy">Get 10% Off!</span>
        </div>
        <p className="text-sm text-navy/70">
          Complete this review and receive an instant <strong>10% discount code</strong> for your next purchase!
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-3">
            Your Rating *
          </label>
          <div className="flex gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-2 sm:p-3 text-4xl sm:text-5xl transition-all hover:scale-110 active:scale-95 rounded-lg hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-gold"
                aria-label={`Rate ${star} out of 5 stars`}
              >
                {star <= (hoveredRating || rating) ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-base font-semibold text-navy mt-3">
              {rating === 1 && "⭐ Poor"}
              {rating === 2 && "⭐⭐ Fair"}
              {rating === 3 && "⭐⭐⭐ Good"}
              {rating === 4 && "⭐⭐⭐⭐ Very Good"}
              {rating === 5 && "⭐⭐⭐⭐⭐ Excellent!"}
            </p>
          )}
          {!rating && (
            <p className="text-sm text-navy/50 mt-2">
              Tap to select your rating
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-navy mb-2">
            Your Review *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Tell us about your experience with this product..."
            className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive resize-none"
            required
          />
          <p className="text-xs text-navy/60 mt-1">
            {comment.length} characters (minimum 10)
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || rating === 0 || comment.trim().length < 10}
            className="flex-1 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-6 py-3 bg-gray-200 text-navy rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}


