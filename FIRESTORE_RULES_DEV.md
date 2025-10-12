# 🔓 Development Firestore Rules (TEMPORARY)

**⚠️ USE ONLY FOR DEVELOPMENT - NOT PRODUCTION**

These rules allow all authenticated users to read/write everything. Perfect for testing and seeding data.

## Copy these rules to Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all authenticated users to read/write everything
    // ⚠️ ONLY FOR DEVELOPMENT
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Steps to Update:

1. **Go to:** https://console.firebase.google.com
2. **Select:** eudelicacies project
3. **Click:** Firestore Database (left menu)
4. **Click:** Rules tab (top)
5. **Delete all existing rules**
6. **Paste:** The rules above
7. **Click:** Publish

## After Seeding Successfully:

Once you've seeded all data and tested everything, replace with the production rules from `FIRESTORE_RULES.md`.

---

**Current Issue:** Your Firebase Console still has the old restrictive rules that block writes to countries collection.

