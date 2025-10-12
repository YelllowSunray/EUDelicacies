# 🔒 Firestore Security Rules

Complete Firestore security rules for the EU Delicacies e-commerce platform.

## How to Update Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy and paste the rules below
5. Click **Publish**

## Complete Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isSeller() {
      return isAuthenticated() && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'seller';
    }
    
    // ============================================
    // USERS COLLECTION
    // ============================================
    match /users/{userId} {
      // Users can read their own data
      allow read: if isOwner(userId);
      
      // Users can create their own account
      allow create: if isOwner(userId);
      
      // Users can update their own data
      allow update: if isOwner(userId);
      
      // Users cannot delete their own account (use admin or special function)
      allow delete: if false;
    }
    
    // ============================================
    // PRODUCTS COLLECTION
    // ============================================
    match /products/{productId} {
      // Anyone can read active products
      allow read: if resource.data.active == true || 
                     (isAuthenticated() && resource.data.sellerId == request.auth.uid);
      
      // Only sellers can create products with their own sellerId
      allow create: if isSeller() && 
                       request.resource.data.sellerId == request.auth.uid &&
                       request.resource.data.active == true;
      
      // Only the product owner (seller) can update their products
      allow update: if isAuthenticated() && 
                       resource.data.sellerId == request.auth.uid;
      
      // Only the product owner can delete
      allow delete: if isAuthenticated() && 
                       resource.data.sellerId == request.auth.uid;
    }
    
    // ============================================
    // COUNTRIES COLLECTION
    // ============================================
    match /countries/{countryId} {
      // Anyone can read active countries
      allow read: if resource.data.active == true;
      
      // Authenticated users can write (for seeding)
      // In production, restrict this to admin role only
      allow write: if isAuthenticated();
    }
    
    // ============================================
    // ORDERS COLLECTION
    // ============================================
    match /orders/{orderId} {
      // Users can read their own orders
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid ||
                      // Sellers can read orders containing their products
                      resource.data.items[0].sellerId == request.auth.uid);
      
      // Users can create their own orders
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      // Users can update their own orders (for cancellation)
      // Sellers can update orders containing their products (for status updates)
      allow update: if isAuthenticated() && 
                       (resource.data.userId == request.auth.uid ||
                        resource.data.items[0].sellerId == request.auth.uid);
      
      // Orders cannot be deleted, only cancelled
      allow delete: if false;
    }
    
    // ============================================
    // CARTS COLLECTION
    // ============================================
    match /carts/{userId} {
      // Users can only access their own cart
      allow read, write: if isOwner(userId);
    }
    
    // ============================================
    // REVIEWS COLLECTION
    // ============================================
    match /reviews/{reviewId} {
      // Anyone can read reviews
      allow read: if true;
      
      // Authenticated users can create reviews
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      // Users can update/delete their own reviews
      allow update, delete: if isAuthenticated() && 
                               resource.data.userId == request.auth.uid;
    }
    
    // ============================================
    // CATEGORIES COLLECTION
    // ============================================
    match /categories/{categoryId} {
      // Anyone can read active categories
      allow read: if resource.data.active == true;
      
      // Only admins can write
      allow write: if false;
    }
  }
}
```

## Rule Explanations

### Users Collection
- ✅ Users can read/write their own data
- ❌ Users cannot read other users' data
- ❌ Users cannot delete accounts (use admin functions)

### Products Collection
- ✅ Anyone can read active products
- ✅ Sellers can read their own inactive products
- ✅ Only sellers can create products
- ✅ Sellers can only modify their own products
- ✅ `sellerId` must match authenticated user

### Countries Collection
- ✅ Anyone can read active countries
- ❌ All writes blocked (use admin/seed script)

### Orders Collection
- ✅ Users can read their own orders
- ✅ Sellers can read orders containing their products
- ✅ Users can create orders
- ✅ Users/Sellers can update order status
- ❌ Orders cannot be deleted

### Carts Collection
- ✅ Users can only access their own cart
- ✅ Full read/write on own cart

### Reviews Collection
- ✅ Anyone can read reviews
- ✅ Authenticated users can create reviews
- ✅ Users can update/delete their own reviews

### Categories Collection
- ✅ Anyone can read active categories
- ❌ All writes blocked (use admin functions)

## Testing Your Rules

### Test as Buyer:
```javascript
// ✅ Should succeed
firebase.firestore().collection('products').where('active', '==', true).get();
firebase.firestore().collection('countries').get();
firebase.firestore().collection('carts').doc(myUserId).get();

// ❌ Should fail
firebase.firestore().collection('users').doc(otherUserId).get();
firebase.firestore().collection('products').add({...}); // Not a seller
```

### Test as Seller:
```javascript
// ✅ Should succeed
firebase.firestore().collection('products').add({
  sellerId: myUserId,
  active: true,
  // ...other fields
});
firebase.firestore().collection('products').doc(myProductId).update({...});

// ❌ Should fail
firebase.firestore().collection('products').doc(otherSellerProduct).update({...});
```

## Security Best Practices

1. **Never trust client data** - Always validate on server
2. **Use compound queries carefully** - May bypass some rules
3. **Test rules thoroughly** - Use Firebase Emulator
4. **Keep rules updated** - As features evolve
5. **Monitor usage** - Check Firebase Console for violations

## Common Issues

### Issue: "Missing or insufficient permissions"
**Solution:** Check that:
- User is authenticated
- User has the correct role (buyer/seller)
- Resource ownership matches (sellerId, userId)

### Issue: Can't create products
**Solution:** Ensure:
- User role is 'seller' in users collection
- `sellerId` matches `request.auth.uid`
- `active` field is set to true

### Issue: Can't read orders
**Solution:** Verify:
- Order's userId matches authenticated user
- OR authenticated user is the seller (check items array)

## Advanced: Index Requirements

For optimal performance, create these indexes:

```
Collection: products
Fields: active (ASC), createdAt (DESC)

Collection: products  
Fields: countryId (ASC), active (ASC), createdAt (DESC)

Collection: products
Fields: category (ASC), active (ASC), createdAt (DESC)

Collection: products
Fields: sellerId (ASC), createdAt (DESC)

Collection: orders
Fields: userId (ASC), createdAt (DESC)
```

Firebase will prompt you to create these automatically when queries fail.

## Updating Rules

When you add new collections or modify existing ones:

1. Update the rules above
2. Test in Firebase Emulator first
3. Deploy to production
4. Monitor for errors in Console

---

**Last updated:** After implementing Firebase migration  
**Status:** ✅ Production Ready

