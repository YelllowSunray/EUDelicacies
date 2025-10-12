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

      alert("✓ Thank you for your review!");
      onReviewSubmitted();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-olive/20 p-6">
      <h3 className="font-serif text-xl font-bold text-navy mb-4">
        Review: {productName}
      </h3>

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
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-4xl transition-transform hover:scale-110"
              >
                {star <= (hoveredRating || rating) ? '⭐' : '☆'}
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-navy/60 mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
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


