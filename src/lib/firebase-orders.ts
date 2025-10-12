/**
 * Firebase Orders Helper Functions
 * Handles all Firestore operations for orders collection
 */

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, FirebaseOrder, OrderItem, ShippingAddress, OrderStatus } from './firebase-collections';

/**
 * Generate a human-readable order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `EU${timestamp}${random}`;
}

/**
 * Create a new order
 */
export async function createOrder(orderData: {
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
}): Promise<FirebaseOrder> {
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();
  
  const newOrder = {
    orderNumber,
    ...orderData,
    createdAt: now,
    updatedAt: now,
  };

  const docRef = await addDoc(ordersRef, newOrder);
  
  return {
    id: docRef.id,
    ...newOrder,
  };
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<FirebaseOrder | null> {
  const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
  const orderSnap = await getDoc(orderRef);
  
  if (!orderSnap.exists()) {
    return null;
  }
  
  return {
    id: orderSnap.id,
    ...orderSnap.data()
  } as FirebaseOrder;
}

/**
 * Get all orders for a user (buyer)
 */
export async function getUserOrders(userId: string): Promise<FirebaseOrder[]> {
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const q = query(ordersRef, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  
  const orders = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as FirebaseOrder))
  .sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime; // Newest first
  });
  
  console.log(`Loaded ${orders.length} orders for user ${userId}`);
  return orders;
}

/**
 * Get all orders containing products from a specific seller
 */
export async function getSellerOrders(sellerId: string): Promise<FirebaseOrder[]> {
  const ordersRef = collection(db, COLLECTIONS.ORDERS);
  const snapshot = await getDocs(ordersRef);
  
  // Filter orders that contain items from this seller
  const sellerOrders = snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseOrder))
    .filter(order => 
      order.items.some(item => item.sellerId === sellerId)
    )
    .sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime; // Newest first
    });
  
  console.log(`Loaded ${sellerOrders.length} orders for seller ${sellerId}`);
  return sellerOrders;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string, 
  status: OrderStatus,
  trackingNumber?: string
): Promise<void> {
  const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
  const updates: any = {
    status,
    updatedAt: new Date().toISOString(),
  };
  
  if (trackingNumber) {
    updates.trackingNumber = trackingNumber;
  }
  
  if (status === 'delivered') {
    updates.deliveredAt = new Date().toISOString();
  }
  
  await updateDoc(orderRef, updates);
  console.log(`Order ${orderId} status updated to ${status}`);
}

/**
 * Update order details
 */
export async function updateOrder(orderId: string, updates: Partial<FirebaseOrder>): Promise<void> {
  const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
  await updateDoc(orderRef, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
  console.log(`Order ${orderId} updated`);
}

/**
 * Get order statistics for a seller
 */
export async function getSellerOrderStats(sellerId: string): Promise<{
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}> {
  const orders = await getSellerOrders(sellerId);
  
  let totalRevenue = 0;
  orders.forEach(order => {
    const sellerItems = order.items.filter(item => item.sellerId === sellerId);
    sellerItems.forEach(item => {
      totalRevenue += item.subtotal;
    });
  });
  
  return {
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    processingOrders: orders.filter(o => o.status === 'processing').length,
    shippedOrders: orders.filter(o => o.status === 'shipped').length,
    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    totalRevenue,
  };
}
