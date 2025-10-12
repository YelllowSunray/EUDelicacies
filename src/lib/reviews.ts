/**
 * Firebase Reviews Management
 */

import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, orderBy, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  orderId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Add a review
 */
export async function addReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    console.log('📝 Adding review for product:', reviewData.productId);
    const reviewsRef = collection(db, 'reviews');
    
    const newReview = {
      ...reviewData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(reviewsRef, newReview);
    console.log('✅ Review added with ID:', docRef.id);
    
    // Update product's average rating
    await updateProductRating(reviewData.productId);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding review:', error);
    throw error;
  }
}

/**
 * Get reviews for a product
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('productId', '==', productId)
    );
    
    const snapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    snapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      } as Review);
    });
    
    // Sort by createdAt in JavaScript (to avoid needing index)
    reviews.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA; // Newest first
    });
    
    console.log(`📝 Loaded ${reviews.length} reviews for product ${productId}`);
    return reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

/**
 * Check if user has already reviewed a product in a specific order
 */
export async function hasUserReviewedProduct(userId: string, productId: string, orderId: string): Promise<boolean> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('userId', '==', userId),
      where('productId', '==', productId),
      where('orderId', '==', orderId)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking review:', error);
    return false;
  }
}

/**
 * Get product's average rating and review count
 */
export async function getProductRating(productId: string): Promise<{ averageRating: number; reviewCount: number }> {
  try {
    const reviews = await getProductReviews(productId);
    
    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: reviews.length
    };
  } catch (error) {
    console.error('Error calculating product rating:', error);
    return { averageRating: 0, reviewCount: 0 };
  }
}

/**
 * Update product document with latest rating
 */
async function updateProductRating(productId: string): Promise<void> {
  try {
    const { averageRating, reviewCount } = await getProductRating(productId);
    
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      averageRating,
      reviewCount,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

/**
 * Get reviews by a specific user
 */
export async function getUserReviews(userId: string): Promise<Review[]> {
  try {
    const reviewsRef = collection(db, 'reviews');
    const q = query(
      reviewsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const reviews: Review[] = [];
    
    snapshot.forEach((doc) => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      } as Review);
    });
    
    return reviews;
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
}


