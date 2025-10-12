/**
 * Firebase Cart Management
 */

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, FirebaseCart, CartItem } from './firebase-collections';

/**
 * Get user's cart
 */
export async function getCart(userId: string): Promise<FirebaseCart | null> {
  try {
    const cartRef = doc(db, COLLECTIONS.CARTS, userId);
    const snapshot = await getDoc(cartRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as FirebaseCart;
    }
    
    // Return empty cart if doesn't exist
    return {
      userId,
      items: [],
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return null;
  }
}

/**
 * Add item to cart
 */
export async function addToCart(userId: string, item: CartItem): Promise<void> {
  try {
    const cartRef = doc(db, COLLECTIONS.CARTS, userId);
    const cart = await getCart(userId);
    
    if (!cart) {
      throw new Error('Failed to get cart');
    }
    
    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(i => i.productId === item.productId);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.items.push(item);
    }
    
    cart.updatedAt = new Date().toISOString();
    
    await setDoc(cartRef, cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  userId: string, 
  productId: string, 
  quantity: number
): Promise<void> {
  try {
    const cartRef = doc(db, COLLECTIONS.CARTS, userId);
    const cart = await getCart(userId);
    
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    const itemIndex = cart.items.findIndex(i => i.productId === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
      }
      
      cart.updatedAt = new Date().toISOString();
      await setDoc(cartRef, cart);
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(userId: string, productId: string): Promise<void> {
  try {
    const cartRef = doc(db, COLLECTIONS.CARTS, userId);
    const cart = await getCart(userId);
    
    if (!cart) {
      throw new Error('Cart not found');
    }
    
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.updatedAt = new Date().toISOString();
    
    await setDoc(cartRef, cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Clear entire cart
 */
export async function clearCart(userId: string): Promise<void> {
  try {
    const cartRef = doc(db, COLLECTIONS.CARTS, userId);
    await setDoc(cartRef, {
      userId,
      items: [],
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

/**
 * Get cart total
 */
export function calculateCartTotal(cart: FirebaseCart): number {
  return cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

/**
 * Get cart item count
 */
export function getCartItemCount(cart: FirebaseCart): number {
  return cart.items.reduce((count, item) => count + item.quantity, 0);
}

