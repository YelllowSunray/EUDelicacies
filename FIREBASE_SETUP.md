# 🔥 Firebase Authentication Setup Guide

Complete guide for the Firebase authentication system with buyer and seller roles.

## ✅ What's Been Implemented

### Authentication Features
- ✅ Firebase Authentication integrated
- ✅ Email/Password signup and login
- ✅ Role-based access (Buyer vs Seller)
- ✅ User data stored in Firestore
- ✅ Protected routes and dashboards
- ✅ Persistent authentication state
- ✅ User profile management

### Pages Created
1. **Login Page** (`/login`) - Sign in with email/password
2. **Signup Page** (`/signup`) - Create account as buyer or seller
3. **Account Page** (`/account`) - User profile and settings
4. **Seller Dashboard** (`/seller/dashboard`) - Seller-only dashboard
5. **Orders Page** (`/orders`) - Order history (protected)

### Components Updated
- **Navbar** - Shows login/signup buttons or user menu based on auth state
- **Layout** - Wrapped with AuthProvider for global auth access

## 🚀 Quick Start

### 1. Firebase Console Setup (IMPORTANT!)

Your Firebase is configured, but you need to enable these services:

#### Enable Authentication:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **eudelicacies**
3. Click **Authentication** in the left sidebar
4. Click **Get Started**
5. Under "Sign-in method", enable **Email/Password**

#### Enable Firestore:
1. In Firebase Console, click **Firestore Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select a location close to your users (Europe recommended)
5. Click **Enable**

#### Set Firestore Rules (Security):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      // Anyone can read products
      allow read: if true;
      // Only the seller who owns the product can create/update/delete
      allow create: if request.auth != null && request.resource.data.sellerId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.sellerId == request.auth.uid;
    }
  }
}
```

### 2. Test the Authentication

#### Create a Buyer Account:
1. Go to `http://localhost:3001/signup`
2. Select "Buy Products" (🛍️)
3. Fill in your details
4. Click "Create Account"
5. You'll be redirected to the home page, logged in

#### Create a Seller Account:
1. Go to `http://localhost:3001/signup`
2. Select "Sell Products" (🏪)
3. Fill in your details
4. Click "Create Account"
5. You'll be redirected to the Seller Dashboard

#### Test Login:
1. Go to `http://localhost:3001/login`
2. Enter your credentials
3. Click "Sign In"

## 📂 File Structure

```
src/
├── lib/
│   └── firebase.ts              # Firebase initialization & config
├── contexts/
│   └── AuthContext.tsx          # Authentication context & hooks
├── app/
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── signup/
│   │   └── page.tsx             # Signup with role selection
│   ├── account/
│   │   └── page.tsx             # User profile page
│   ├── orders/
│   │   └── page.tsx             # Order history (protected)
│   └── seller/
│       └── dashboard/
│           └── page.tsx         # Seller dashboard (protected)
```

## 🔐 How It Works

### 1. Authentication Flow

```
User signs up → Email/Password created in Firebase Auth
              → User data saved to Firestore with role
              → AuthContext updates with user info
              → Navbar shows user menu
              → Protected pages become accessible
```

### 2. User Data Structure (Firestore)

```typescript
{
  uid: "user123",
  email: "user@example.com",
  displayName: "John Doe",
  role: "buyer" | "seller",
  createdAt: "2025-01-15T10:30:00.000Z"
}
```

### 3. Role-Based Access

**Buyers can:**
- Browse products
- Add to cart (ready for implementation)
- Place orders (ready for implementation)
- View order history
- Manage profile

**Sellers can:**
- Everything buyers can do, PLUS:
- Access Seller Dashboard
- Add products (ready for implementation)
- Manage inventory (ready for implementation)
- View sales analytics (ready for implementation)

## 💻 Using Authentication in Your Code

### Check if User is Logged In

```typescript
"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function MyComponent() {
  const { user, userData, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in</p>;

  return (
    <div>
      <h1>Welcome {user.displayName}!</h1>
      <p>Role: {userData?.role}</p>
    </div>
  );
}
```

### Protect a Page (Buyers Only)

```typescript
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return <div>Protected content</div>;
}
```

### Protect a Page (Sellers Only)

```typescript
"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SellerOnlyPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userData?.role !== "seller")) {
      router.push("/");
    }
  }, [user, userData, loading, router]);

  if (loading || !user || userData?.role !== "seller") return null;

  return <div>Seller-only content</div>;
}
```

### Sign Out

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  router.push("/");
};
```

## 🎯 Navigation Changes

### When Logged Out:
- Navbar shows: **Login** and **Sign Up** buttons

### When Logged In (Buyer):
- Navbar shows: User menu with name
- Menu options:
  - My Account
  - My Orders
  - Sign Out
- Cart icon visible

### When Logged In (Seller):
- Navbar shows: User menu with name + Seller icon
- Menu options:
  - My Account
  - Seller Dashboard
  - My Orders
  - Sign Out
- Dashboard link in main navigation

## 🔧 Next Steps for Full E-Commerce

### Ready to Implement:
1. **Shopping Cart State Management** - Add context/state for cart
2. **Checkout Process** - Integrate Stripe/Mollie payments
3. **Order Creation** - Save orders to Firestore
4. **Product Management** - Allow sellers to add/edit products
5. **Order Fulfillment** - Seller order management system
6. **Email Notifications** - Order confirmations, shipping updates

### Firestore Collections to Create:
```
/products - Store all products
/orders - Store all orders
/carts - Store user shopping carts
/reviews - Store product reviews
```

## 🎨 Authentication UI Features

### Login Page
- Email/password form
- Remember me checkbox
- Forgot password link
- Link to signup
- Error handling

### Signup Page
- Role selection (Buyer/Seller) with visual toggle
- Name, email, password fields
- Password confirmation
- Terms acceptance
- Redirects based on role

### User Menu (Navbar)
- User avatar/icon based on role
- Display name
- Role badge (Buyer/Seller)
- Quick access to account pages
- Logout button

## 🔒 Security Features

✅ Firebase Authentication (industry-standard security)
✅ Password validation (minimum 6 characters)
✅ Email verification ready
✅ Secure password storage (handled by Firebase)
✅ Protected routes
✅ Role-based access control
✅ HTTPS only in production

## 📝 Testing Checklist

- [ ] Sign up as a buyer
- [ ] Sign up as a seller
- [ ] Log in with buyer account
- [ ] Log in with seller account
- [ ] Access seller dashboard as seller
- [ ] Try to access seller dashboard as buyer (should redirect)
- [ ] Log out
- [ ] Try to access protected pages while logged out
- [ ] Check user menu on mobile
- [ ] Verify role badges display correctly

## 🐛 Troubleshooting

### "auth/configuration-not-found"
→ Enable Email/Password in Firebase Console

### "Missing or insufficient permissions"
→ Update Firestore rules (see above)

### User data not loading
→ Check Firestore console to verify data is being saved

### Redirect loops
→ Clear browser cache and localStorage

## 🎉 You're All Set!

Your Firebase authentication is fully integrated with:
- ✅ Email/password authentication
- ✅ Role-based access (buyer/seller)
- ✅ Protected routes
- ✅ User profiles
- ✅ Seller dashboard
- ✅ Beautiful UI

Start testing at: **http://localhost:3001/signup**

---

**Need help?** Check the Firebase Console or contact support!

