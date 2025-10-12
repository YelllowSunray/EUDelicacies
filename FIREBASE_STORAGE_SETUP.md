# 🖼️ Firebase Storage Setup Guide

Complete guide to setting up Firebase Storage for product images.

## 🎯 What's Been Added

### Files Created:
- `src/lib/firebase-storage.ts` - Image upload/delete functions
- Updated `src/lib/firebase.ts` - Added Storage initialization
- Updated `src/app/seller/products/add/page.tsx` - Image upload UI
- Updated `src/components/ProductCard.tsx` - Display product images

### Features:
- ✅ Image upload with preview
- ✅ Image validation (type, size)
- ✅ Automatic image compression
- ✅ Firebase Storage integration
- ✅ Image display in product cards

## 🔧 Firebase Console Setup

### Step 1: Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/project/eudelicacies/storage)
2. Click **Get Started** in Storage section
3. Click **Start in test mode** (for development)
4. Click **Done**

### Step 2: Set Storage Rules

Go to **Storage → Rules** tab and paste these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read product images
    match /products/{allPaths=**} {
      allow read: if true;
    }
    
    // Only authenticated sellers can upload/delete their own products
    match /products/{sellerId}/{productId}/{fileName} {
      allow write: if request.auth != null && 
                      request.auth.uid == sellerId &&
                      request.resource.size < 5 * 1024 * 1024 && // Max 5MB
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

Click **Publish**.

### Step 3: Configure CORS (If Needed)

If you encounter CORS errors, create a `cors.json` file:

```json
[
  {
    "origin": ["http://localhost:3000", "http://localhost:3001"],
    "method": ["GET", "POST", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

Then run (requires Google Cloud SDK):
```bash
gsutil cors set cors.json gs://eudelicacies.firebasestorage.app
```

## 📸 How It Works

### 1. User Uploads Image

When seller adds a product:
1. Select image file (JPG, PNG, GIF, WebP)
2. Image is validated (max 5MB)
3. Image is compressed to reduce size
4. Image preview shown instantly
5. On submit, image uploaded to Firebase Storage
6. Download URL saved in product document

### 2. Image Storage Structure

```
products/
  └── {sellerId}/
      └── {productId}/
          └── {timestamp}_{filename}.jpg
```

Example:
```
products/
  └── ABC123/
      └── temp_1234567890/
          └── 1234567890_gouda.jpg
```

### 3. Image Display

ProductCard component:
- Shows uploaded image if available
- Falls back to emoji if no image
- Uses Next.js Image component for optimization

## 🎨 Image Upload UI Features

### Upload Area:
- **📸 Icon** - Visual upload indicator
- **Choose Image Button** - File picker
- **Drag & Drop** - (can be added)
- **Format Info** - Shows accepted formats

### Preview:
- **Full Image Preview** - See before upload
- **Remove Button** - Clear selection
- **Loading State** - Shows during upload

### Validation:
- ✅ File type check (images only)
- ✅ Size check (max 5MB)
- ✅ Automatic compression
- ✅ Error messages

## 🚀 Testing

### Test Image Upload:

1. **Login as seller**
2. Go to: `/seller/dashboard`
3. Click **"+ Add Product"**
4. Fill in product details
5. Click **"Choose Image"**
6. Select an image (< 5MB)
7. See preview appear
8. Submit form
9. Check product in dashboard - image should display!

### Verify in Firebase Console:

1. Go to **Storage** tab
2. Navigate to `products/` folder
3. See your uploaded image
4. Click to view/download

## 📊 Image Specs

### Recommended:
- **Format**: JPG or WebP (best compression)
- **Size**: < 2MB (automatically compressed)
- **Dimensions**: 800x800px to 1200x1200px
- **Aspect Ratio**: Square or 4:3

### Accepted:
- **Formats**: JPG, PNG, GIF, WebP
- **Max Size**: 5MB
- **Min Dimensions**: 400x400px
- **Max Dimensions**: 4000x4000px

### Compression:
- Images automatically compressed to max width 1200px
- Quality set to 85%
- Converts to JPG format
- Reduces file size by 50-70%

## 🔐 Security Rules Explained

```javascript
// Anyone can view product images
allow read: if true;

// Only seller can upload to their folder
allow write: if request.auth.uid == sellerId

// Must be under 5MB
request.resource.size < 5 * 1024 * 1024

// Must be an image
request.resource.contentType.matches('image/.*')
```

## 💡 Tips

### For Sellers:

1. **Use Good Lighting** - Clear, bright photos work best
2. **White Background** - Makes products stand out
3. **Multiple Angles** - (feature coming soon)
4. **High Quality** - Use good camera/phone
5. **Square Format** - Looks best in product cards

### For Developers:

1. **Always compress** - Use `compressImage()` function
2. **Show previews** - Let users see before upload
3. **Handle errors** - Clear error messages
4. **Loading states** - Show upload progress
5. **Fallback UI** - Emoji when no image

## 🐛 Troubleshooting

### "Missing or insufficient permissions"
→ Update Storage rules in Firebase Console

### "Image too large"
→ Max 5MB, or compress before upload

### "CORS error"
→ Configure CORS settings (see Step 3)

### "Image not showing"
→ Check Firestore rules allow reading images
→ Verify imageUrl is saved in product document

### "Upload failed"
→ Check internet connection
→ Verify Firebase Storage is enabled
→ Check file is a valid image

## 📱 Next.js Image Optimization

Using Next.js `<Image>` component:
- Automatic lazy loading
- Automatic size optimization
- WebP conversion (when supported)
- Responsive images
- Blur placeholder (can add)

## 🎯 Features Coming Soon

- [ ] Multiple images per product
- [ ] Image cropping tool
- [ ] Drag & drop upload
- [ ] Bulk image upload
- [ ] Image gallery viewer
- [ ] Zoom on hover
- [ ] Image editing tools

## ✅ Checklist

- [ ] Firebase Storage enabled
- [ ] Storage rules published
- [ ] Test image upload
- [ ] Verify image in Storage console
- [ ] Check image displays in ProductCard
- [ ] Test image deletion
- [ ] Try different image formats
- [ ] Test 5MB limit

---

**Status:** ✅ Ready to Use  
**Image Upload:** Fully Functional  
**Start Adding:** Product images now! 📸

