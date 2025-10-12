# 🛒 Order Flow Testing Guide

This guide helps you test and debug the complete order flow from cart to order confirmation.

---

## 📋 Complete Order Flow

```
1. Browse Products → 2. Add to Cart → 3. View Cart → 4. Checkout → 5. Order Created → 6. Emails Sent → 7. Order Displayed
```

---

## ✅ Step-by-Step Testing

### **Step 1: Add Products to Cart**

1. **Go to**: http://localhost:3000/shop
2. **Action**: Click "Add to Cart 🛒" on any product
3. **Expected Result**:
   - ✓ "Added to cart!" message appears
   - ✓ Cart icon in navbar shows item count
   - ✓ Console log: Product added successfully

**⚠️ Troubleshooting**:
- If button is disabled → Product is out of stock
- If "Please login" alert → Not logged in
- Check browser console for errors

---

### **Step 2: View Cart**

1. **Go to**: http://localhost:3000/cart
2. **Expected Result**:
   - ✓ All cart items displayed with images
   - ✓ Quantity can be adjusted with +/- buttons
   - ✓ Subtotals calculate correctly
   - ✓ "Proceed to Checkout" button visible

**⚠️ Troubleshooting**:
- If cart is empty → Items not saved to Firebase
- Check console: Look for `Loaded X items from cart`
- Verify user is logged in

---

###  **Step 3: Checkout**

1. **Go to**: http://localhost:3000/checkout
2. **Action**: Fill in shipping information
3. **Required fields**:
   - Full Name
   - Address Line 1
   - City
   - State/Province
   - Postal Code
   - Country
   - Phone Number
4. **Optional**: Add order notes
5. **Click**: "Place Order"

**Expected Result**:
- ✓ Button changes to "Processing..."
- ✓ No validation errors

**⚠️ Troubleshooting**:
- If redirected to `/cart` → Cart was empty
- If redirected to `/login` → Not logged in
- If validation error → Check required fields
- Check console for detailed logs

---

### **Step 4: Order Creation & Emails**

**Expected Console Logs** (in order):
```
📧 Sending order emails for order: EU12345678901
📧 Sending buyer confirmation to: your-email@example.com
✅ Buyer email sent successfully
📧 Sending seller notification to: iyersamir@gmail.com
✅ Seller email sent successfully
```

**Expected Firebase Document**:
- Collection: `orders`
- Document ID: Auto-generated
- Status: `pending`
- Payment Status: `pending`

**Expected Emails** (via Formspree to `iyersamir@gmail.com`):

**Email 1: Buyer Confirmation**
- Subject: `✅ Order Confirmation #EU12345678901`
- Contains: Order number, items, total, shipping address, next steps

**Email 2: Seller Notification**
- Subject: `🔔 NEW ORDER #EU12345678901 - Action Required`
- Contains: Customer details, items by seller, action required

**⚠️ Troubleshooting**:
- **If emails not sent**: Check browser console
  - Look for `❌ Buyer email failed` or `❌ Seller email failed`
  - Check Formspree endpoint is correct in `.env.local`
  - Verify Formspree form is active
- **If order creation fails**:
  - Check console: `Order creation error`
  - Verify Firebase permissions (see Firestore Rules)
  - Check all required fields are present

---

### **Step 5: Order Success Page**

**Expected Redirect**: http://localhost:3000/order-success?orderId=XXXXX

**Expected Result**:
- ✓ Green checkmark icon
- ✓ "Order Placed Successfully!" message
- ✓ Order ID displayed
- ✓ Next steps explained
- ✓ "View My Orders" button
- ✓ Cart is now empty

---

### **Step 6: View Orders (Buyer)**

1. **Go to**: http://localhost:3000/orders
2. **Expected Result**:
   - ✓ Order appears in list
   - ✓ Order status badge (Pending/Processing/Shipped/Delivered)
   - ✓ Order details visible:
     - Items with images
     - Shipping address
     - Order total
     - Order notes (if any)

**⚠️ Troubleshooting**:
- If "No Orders Yet" → Order not saved to Firebase
- Check console: `Loaded X orders for user YYYY`
- Verify order was created (check Firebase Console)

---

### **Step 7: Seller Dashboard**

1. **Login as a seller**
2. **Go to**: http://localhost:3000/seller/dashboard
3. **Expected Result**:
   - ✓ Order statistics updated (pending orders +1)
   - ✓ Recent orders section shows new order
   - ✓ Can update order status via dropdown
   - ✓ Customer details visible
   - ✓ "Contact Customer" email link works
   - ✓ "View Details" link works

**⚠️ Troubleshooting**:
- If order not showing → Check seller ID matches
- Check console: `Loaded X orders for seller YYYY`
- Verify product sellerId matches user ID

---

## 🐛 Common Issues & Fixes

### Issue 1: "Orders don't show up"

**Possible Causes**:
1. ❌ Order not created in Firebase
2. ❌ User ID mismatch
3. ❌ Firestore permissions blocking read

**How to Debug**:
```javascript
// Check browser console for:
console.log('Order created:', order.id);
console.log('Loaded X orders for user YYYY');
```

**Fix**:
1. Check Firebase Console → Firestore → `orders` collection
2. Verify order document exists
3. Check order.userId matches current user.uid
4. Review Firestore rules (should allow authenticated reads)

---

### Issue 2: "Emails not sending"

**Possible Causes**:
1. ❌ Formspree endpoint not configured
2. ❌ Formspree form not active
3. ❌ Network/CORS error

**How to Debug**:
```javascript
// Check browser console for:
console.log('📧 Sending buyer confirmation to:', email);
console.log('✅ Buyer email sent successfully');
// OR
console.error('❌ Buyer email failed:', error);
```

**Fix**:
1. Verify `.env.local` has `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
2. Check Formspree dashboard - form should be active
3. Test Formspree endpoint directly: https://formspree.io/forms/YOUR_FORM_ID/test
4. Check browser Network tab for failed requests

---

### Issue 3: "Cart items missing seller info"

**Symptoms**: Error when adding to cart or checking out

**Fix**: Products must have:
- `sellerId` (string)
- `sellerName` (string)
- `stock` (number)

Check product data in Firebase → `products` collection

---

### Issue 4: "Checkout redirect loop"

**Symptoms**: Keeps redirecting between `/cart` and `/checkout`

**Cause**: Empty cart or missing user

**Fix**:
1. Make sure cart has items
2. Verify user is logged in
3. Check useEffect dependencies in checkout page

---

## 🔍 Debugging Checklist

Before testing, verify:

- [ ] `.env.local` file exists with all variables
- [ ] Firebase project is active and accessible
- [ ] Firestore rules allow authenticated users to read/write
- [ ] User is logged in
- [ ] Products have sellerId, sellerName, and stock fields
- [ ] Formspree form is active and receiving submissions
- [ ] Browser console is open (F12) to see logs

---

## 📊 Firebase Data Structure

### Orders Collection Structure

```javascript
{
  id: "auto-generated",
  orderNumber: "EU1734567890123",
  userId: "user123",
  userEmail: "buyer@example.com",
  items: [
    {
      productId: "prod123",
      productName: "Gouda Cheese",
      productImage: "https://...",
      sellerId: "seller123",
      sellerName: "Dutch Delights",
      quantity: 2,
      pricePerUnit: 12.99,
      subtotal: 25.98
    }
  ],
  subtotal: 25.98,
  shippingCost: 0,
  tax: 0,
  total: 25.98,
  status: "pending", // pending | processing | shipped | delivered | cancelled
  shippingAddress: { /* ... */ },
  billingAddress: { /* ... */ },
  paymentMethod: "seller_contact",
  paymentStatus: "pending",
  notes: "Please call before delivery",
  createdAt: "2024-01-15T10:30:00.000Z",
  updatedAt: "2024-01-15T10:30:00.000Z"
}
```

---

## 🧪 Manual Testing Scenarios

### Scenario 1: Single Seller Order
1. Add 2 products from same seller
2. Complete checkout
3. Verify: 1 email to buyer, 1 to seller

### Scenario 2: Multiple Sellers Order
1. Add products from 2 different sellers
2. Complete checkout
3. Verify: 1 email to buyer, 1 combined email listing both sellers

### Scenario 3: Order Status Updates
1. Create order
2. Go to seller dashboard
3. Update order status dropdown
4. Verify status changes in buyer's orders page

### Scenario 4: Empty Cart Protection
1. Go directly to `/checkout`
2. Verify: Redirected to `/cart`

### Scenario 5: Unauthenticated Access
1. Logout
2. Try to access `/checkout`
3. Verify: Redirected to `/login`

---

## 📧 Formspree Configuration

**Current Setup**:
- Endpoint: `https://formspree.io/f/xvgwweba`
- Target Email: `iyersamir@gmail.com`
- Purpose: ALL order notifications (buyer confirmations + seller notifications)

**Note**: In production, you would:
1. Send buyer confirmations to buyer's email
2. Send seller notifications to each seller's registered email
3. Use a transactional email service (SendGrid, AWS SES, etc.)

For now, ALL emails go to `iyersamir@gmail.com` for monitoring.

---

## 🆘 Still Having Issues?

1. **Check browser console** (F12 → Console tab)
   - Look for red errors
   - Look for email send logs (📧, ✅, ❌)
   - Look for Firebase errors

2. **Check Network tab** (F12 → Network tab)
   - Filter by "formspree"
   - Check response status (should be 200)
   - Check request payload

3. **Check Firebase Console**
   - Firestore → `orders` collection
   - Verify documents are being created

4. **Check Formspree Dashboard**
   - https://formspree.io/forms
   - View submissions
   - Check for errors

5. **Restart dev server**
   - Stop (Ctrl+C)
   - Run `npm run dev`

---

## ✨ Expected Success Flow

When everything works correctly:

```
User adds products → Cart badge updates ✅
User views cart → Items displayed ✅
User proceeds to checkout → Form loads ✅
User fills form → Validation passes ✅
User clicks "Place Order" → Processing... ✅
Order created in Firebase ✅
Buyer email sent ✅
Seller email sent ✅
Cart cleared ✅
Redirected to success page ✅
Order visible in orders page ✅
Seller sees order in dashboard ✅
```

**Result**: 🎉 Order flow complete!

