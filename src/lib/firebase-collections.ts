/**
 * Firebase Collections and Types
 * Central type definitions for all Firebase collections
 */

import { Timestamp } from 'firebase/firestore';

// ============================================
// COUNTRIES
// ============================================
export interface FirebaseCountry {
  id: string;
  name: string;
  flag: string;
  tagline: string;
  description: string;
  specialties: string[];
  region: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PRODUCTS (Enhanced)
// ============================================
export interface FirebaseProduct {
  id: string;
  name: string;
  description: string;
  story: string;
  price: number;
  category: string;
  country: string;
  countryId: string;
  region: string;
  stock: number;
  shelfLife: string;
  pairWith: string[];
  tags: string[];
  imageUrl?: string;
  sellerId: string;
  sellerName: string;
  active: boolean;
  featured: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ORDERS
// ============================================
export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage?: string;
  sellerId: string;
  sellerName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface FirebaseOrder {
  id: string;
  orderNumber: string; // Human-readable order number
  userId: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

// ============================================
// CART
// ============================================
export interface CartItem {
  productId: string;
  productName: string;
  productImage?: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  stock: number; // For validation
}

export interface FirebaseCart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

// ============================================
// REVIEWS
// ============================================
export interface FirebaseReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  verified: boolean; // Verified purchase
  helpful: number; // Helpful count
  createdAt: string;
  updatedAt: string;
}

// ============================================
// USER PROFILE (Enhanced)
// ============================================
export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'buyer' | 'seller';
  avatar?: string;
  phone?: string;
  
  // Addresses
  defaultShippingAddress?: ShippingAddress;
  defaultBillingAddress?: ShippingAddress;
  savedAddresses?: ShippingAddress[];
  
  // Seller-specific
  sellerInfo?: {
    businessName: string;
    businessDescription: string;
    verified: boolean;
    rating?: number;
    totalSales: number;
    joinedAsSellerAt: string;
  };
  
  // Buyer-specific
  buyerInfo?: {
    totalOrders: number;
    totalSpent: number;
  };
  
  // Preferences
  emailNotifications: {
    orderUpdates: boolean;
    newProducts: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CATEGORIES
// ============================================
export interface FirebaseCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  productCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// COLLECTION NAMES (Constants)
// ============================================
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  COUNTRIES: 'countries',
  ORDERS: 'orders',
  CARTS: 'carts',
  REVIEWS: 'reviews',
  CATEGORIES: 'categories',
} as const;

