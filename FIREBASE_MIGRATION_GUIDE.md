# 🔄 Firebase Migration Guide

Complete guide for migrating from hardcoded data to Firebase Cloud Firestore.

## 🎯 What's Been Done

### ✅ Created Firebase Infrastructure

1. **Collection Types** (`src/lib/firebase-collections.ts`)
   - Complete TypeScript interfaces for all collections
   - Standardized data structures
   - Organized constants

2. **Helper Functions Created:**
   - `src/lib/firebase-countries.ts` - Country management
   - `src/lib/firebase-orders.ts` - Order system
   - `src/lib/firebase-cart.ts` - Shopping cart
   - `src/lib/products.ts` - Enhanced product management

3. **Pages Created:**
   - `/admin/seed` - Seed data from hardcoded sources
   - Updated `/countries` - Fetch from Firebase
   - Updated `/countries/[id]` - Dynamic country pages with Firebase

4. **Documentation:**
   - `FIRESTORE_RULES.md` - Complete security rules
   - `FIREBASE_MIGRATION_GUIDE.md` - This guide

## 📋 Migration Steps

### Step 1: Update Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (`eudelicacies`)
3. Navigate to **Firestore Database** → **Rules**
4. Copy rules from `FIRESTORE_RULES.md`
5. Click **Publish**

### Step 2: Seed Initial Data

1. Start your dev server: `npm run dev`
2. Navigate to: http://localhost:3000/admin/seed
3. Click "Seed Countries" button
4. Wait for success message
5. Verify data in Firebase Console → Firestore Database

### Step 3: Verify Countries

1. Navigate to: http://localhost:3000/countries
2. Verify all countries appear
3. Click on a country to see details
4. Verify specialties are displayed

### Step 4: Test Product Management

1. Log in as a seller
2. Go to `/seller/dashboard`
3. Add a new product
4. Verify it appears in Firebase Console
5. Edit and delete products to test

### Step 5: Test Product Display

1. Go to `/shop` - All products should load from Firebase
2. Go to `/countries/[country]` - Products filtered by country
3. Go to `/category/[category]` - Products filtered by category

## 🗄️ Firebase Collections Structure

### countries
```typescript
{
  id: "france",
  name: "France",
  flag: "🇫🇷",
  tagline: "The art of refined taste",
  description: "From the rolling vineyards...",
  specialties: ["Champagne", "Brie", ...],
  region: "Western Europe",
  active: true,
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-15T10:00:00.000Z"
}
```

### products
```typescript
{
  id: "auto-generated",
  name: "Aged Gouda Cheese",
  description: "Semi-hard cheese...",
  story: "This traditional Dutch cheese...",
  price: 14.90,
  category: "Cheese",
  country: "Netherlands",
  countryId: "netherlands",
  region: "Gouda",
  stock: 50,
  shelfLife: "2 months",
  pairWith: ["Apples", "Mustard"],
  tags: ["12-Month Aged", "Traditional"],
  sellerId: "user-uid",
  sellerName: "John Doe",
  active: true,
  featured: false,
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-15T10:00:00.000Z"
}
```

### orders
```typescript
{
  id: "auto-generated",
  orderNumber: "EU-2025-001234",
  userId: "buyer-uid",
  userEmail: "buyer@example.com",
  items: [
    {
      productId: "prod-123",
      productName: "Aged Gouda",
      quantity: 2,
      pricePerUnit: 14.90,
      subtotal: 29.80,
      sellerId: "seller-uid",
      sellerName: "John Doe"
    }
  ],
  subtotal: 29.80,
  shippingCost: 5.00,
  tax: 3.48,
  total: 38.28,
  status: "pending",
  paymentStatus: "pending",
  shippingAddress: {...},
  billingAddress: {...},
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-15T10:00:00.000Z"
}
```

### carts
```typescript
{
  userId: "user-uid",
  items: [
    {
      productId: "prod-123",
      productName: "Aged Gouda",
      price: 14.90,
      quantity: 2,
      sellerId: "seller-uid",
      sellerName: "John Doe",
      stock: 50
    }
  ],
  updatedAt: "2025-01-15T10:00:00.000Z"
}
```

### users (Enhanced)
```typescript
{
  uid: "user-uid",
  email: "user@example.com",
  displayName: "John Doe",
  role: "seller" | "buyer",
  emailNotifications: {
    orderUpdates: true,
    newProducts: true,
    promotions: false,
    newsletter: false
  },
  defaultShippingAddress: {...},
  sellerInfo: {
    businessName: "John's Artisan Foods",
    verified: true,
    rating: 4.8,
    totalSales: 150
  },
  createdAt: "2025-01-15T10:00:00.000Z",
  updatedAt: "2025-01-15T10:00:00.000Z"
}
```

## 🔧 Using Firebase Helpers

### Countries

```typescript
import { getAllCountries, getCountryById } from '@/lib/firebase-countries';

// Get all active countries
const countries = await getAllCountries();

// Get specific country
const country = await getCountryById('france');
```

### Products

```typescript
import { 
  getAllProducts, 
  getProductsByCountry,
  getProductsByCategory,
  addProduct,
  updateProduct,
  deleteProduct
} from '@/lib/products';

// Get all active products
const products = await getAllProducts();

// Get products by country
const frenchProducts = await getProductsByCountry('france');

// Get products by category
const cheeses = await getProductsByCategory('Cheese');

// Add product (seller only)
const productId = await addProduct({
  name: "Aged Gouda",
  description: "...",
  // ...other fields
});
```

### Orders

```typescript
import { 
  createOrder,
  getUserOrders,
  getSellerOrders,
  updateOrderStatus
} from '@/lib/firebase-orders';

// Create order
const orderId = await createOrder({
  userId: user.uid,
  userEmail: user.email,
  items: [...],
  // ...other fields
});

// Get user's orders
const myOrders = await getUserOrders(user.uid);

// Get seller's orders
const sellerOrders = await getSellerOrders(sellerId);

// Update order status
await updateOrderStatus(orderId, 'shipped', {
  trackingNumber: 'TRACK123'
});
```

### Cart

```typescript
import { 
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
} from '@/lib/firebase-cart';

// Get cart
const cart = await getCart(userId);

// Add to cart
await addToCart(userId, {
  productId: 'prod-123',
  productName: 'Aged Gouda',
  price: 14.90,
  quantity: 1,
  sellerId: 'seller-uid',
  sellerName: 'John Doe',
  stock: 50
});

// Update quantity
await updateCartItemQuantity(userId, 'prod-123', 3);

// Remove item
await removeFromCart(userId, 'prod-123');

// Clear cart
await clearCart(userId);
```

## 🎨 UI Integration Example

```typescript
"use client";

import { useState, useEffect } from 'react';
import { getAllProducts } from '@/lib/products';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

## 🔐 Security Notes

1. **Client-side validation** - Always validate on client
2. **Server-side enforcement** - Firestore rules enforce security
3. **User roles** - Check user role before showing seller features
4. **Data ownership** - Users can only modify their own data

## 🚀 Next Steps

### Immediate:
- [ ] Update Firestore rules
- [ ] Run seed script
- [ ] Test all features

### Soon:
- [ ] Add product images (Firebase Storage)
- [ ] Implement checkout flow
- [ ] Add order tracking
- [ ] Implement reviews system

### Future:
- [ ] Real-time updates with `onSnapshot`
- [ ] Full-text search with Algolia
- [ ] Analytics dashboard
- [ ] Email notifications

## 🐛 Troubleshooting

### "Missing or insufficient permissions"
- Check Firestore rules are updated
- Verify user is authenticated
- Check user role in Firestore

### "No countries appearing"
- Run the seed script at `/admin/seed`
- Check Firebase Console → Firestore Database
- Verify `active` field is `true`

### "Can't add products"
- Verify user role is 'seller' in Firestore
- Check `sellerId` matches authenticated user
- Verify Firestore rules allow product creation

### "Orders not showing"
- Check `userId` matches authenticated user
- Verify orders collection exists
- Check Firestore rules

## 📊 Performance Tips

1. **Use pagination** - Don't load all products at once
2. **Cache results** - Use React state to cache data
3. **Optimize queries** - Create composite indexes
4. **Lazy load** - Load data only when needed

## ✅ Migration Checklist

- [x] Created Firebase collection types
- [x] Created helper functions for all collections
- [x] Created admin seed page
- [x] Updated countries pages to use Firebase
- [x] Enhanced product management
- [x] Created order system
- [x] Created cart system
- [x] Documented security rules
- [x] Created migration guide
- [ ] Update shop page to use Firebase
- [ ] Update category pages to use Firebase
- [ ] Implement checkout with Firebase
- [ ] Test end-to-end flow

---

**Status:** 🟢 Ready for testing  
**Last Updated:** After Firebase migration implementation

