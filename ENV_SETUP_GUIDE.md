# 🔐 Environment Variables Setup Guide

This guide explains how to set up environment variables for the EU Delicacies project.

---

## 📋 Overview

The application uses environment variables to store sensitive information like API keys and configuration values. This keeps them secure and separate from your code.

---

## 🚀 Quick Start

### 1. Copy the Example File

```bash
cp .env.example .env.local
```

### 2. Fill in Your Values

Open `.env.local` and replace the placeholder values with your actual credentials:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
# ... etc
```

### 3. Restart Your Dev Server

```bash
npm run dev
```

**Important:** You must restart the dev server whenever you change environment variables.

---

## 🔑 Required Environment Variables

### Firebase Configuration

These are required for Firebase Authentication, Firestore, and Storage to work:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Authentication domain | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket name | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | Firebase Console → Project Settings → General |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Analytics measurement ID | Firebase Console → Project Settings → General |

**How to get Firebase credentials:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`eudelicacies`)
3. Click the gear icon ⚙️ → Project Settings
4. Scroll down to "Your apps" section
5. Select your web app or create one
6. Copy the config values

### Formspree Configuration

Required for the contact form:

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | Formspree form endpoint URL | [Formspree Dashboard](https://formspree.io/forms) |

**How to get Formspree endpoint:**

1. Go to [Formspree.io](https://formspree.io/)
2. Sign up or log in
3. Create a new form
4. Copy the form endpoint (e.g., `https://formspree.io/f/xvgwweba`)

---

## 🌐 Environment Variable Prefixes

Next.js has specific rules for environment variables:

### `NEXT_PUBLIC_` Prefix

Variables with this prefix are **exposed to the browser** (client-side).

- ✅ **Use for:** Firebase config, public API endpoints
- ❌ **Don't use for:** Secret keys, API tokens, database credentials

**Example:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=abc123  # Available in browser ✅
```

### No Prefix

Variables without prefix are **server-side only** (not exposed to browser).

- ✅ **Use for:** Database URLs, secret keys, private API tokens
- ❌ **Don't use for:** Client-side configs that need to be accessed in React components

**Example:**
```env
DATABASE_URL=secret_connection_string  # Server-only ✅
```

---

## 🔒 Security Best Practices

### ✅ DO:

1. **Add `.env.local` to `.gitignore`** (already done in this project)
2. **Never commit `.env.local`** to Git
3. **Use `.env.example`** to document required variables (without real values)
4. **Rotate keys** if they're accidentally exposed
5. **Use different keys** for development and production

### ❌ DON'T:

1. **Don't commit real API keys** to Git
2. **Don't share `.env.local`** publicly or in chat
3. **Don't use production keys** in development
4. **Don't hardcode secrets** in your code

---

## 📦 Deployment (Production)

When deploying to production, you need to set environment variables in your hosting platform:

### Vercel Deployment

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings → Environment Variables**
4. Add each variable:
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `your_production_api_key`
   - Environment: Production, Preview, Development (select as needed)
5. Redeploy your app

### Netlify Deployment

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Select your site
3. Go to **Site settings → Build & deploy → Environment**
4. Click **Edit variables**
5. Add each variable and value
6. Redeploy your site

### Other Platforms

Most hosting platforms have an environment variables section:
- Railway: Settings → Variables
- Render: Environment → Environment Variables
- AWS Amplify: App settings → Environment variables
- Heroku: Settings → Config Vars

---

## 🧪 Testing Your Setup

After setting up your environment variables:

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Check for errors in the console:**
   - Open your browser dev tools
   - Look for Firebase initialization errors
   - Try logging in to test Firebase Auth

3. **Test the contact form:**
   - Go to `/contact`
   - Submit the form
   - Check if the email is sent via Formspree

4. **Verify Firebase connection:**
   - Try signing up/logging in
   - Try adding a product to cart
   - Check if data is saved to Firestore

---

## ❓ Troubleshooting

### Error: "Missing Firebase configuration"

**Problem:** Environment variables are not loaded.

**Solution:**
1. Make sure `.env.local` exists in your project root
2. Check that variable names are spelled correctly (with `NEXT_PUBLIC_` prefix)
3. Restart your dev server (`npm run dev`)

### Error: "Firebase: Error (auth/invalid-api-key)"

**Problem:** Invalid Firebase API key.

**Solution:**
1. Check that you copied the correct API key from Firebase Console
2. Make sure there are no extra spaces or quotes around the value
3. Verify you're using the correct Firebase project

### Contact form not working

**Problem:** Formspree endpoint is incorrect.

**Solution:**
1. Verify your Formspree endpoint URL
2. Check that the URL includes `https://` and has the correct form ID
3. Test the endpoint directly on Formspree.io

### Environment variables not updating

**Problem:** Next.js caches environment variables.

**Solution:**
1. Stop your dev server (Ctrl+C)
2. Delete `.next` folder: `rm -rf .next` (or manually)
3. Restart: `npm run dev`

---

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Formspree Documentation](https://help.formspree.io/)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🆘 Need Help?

If you're still having issues:

1. Check that `.env.local` is in your project root directory
2. Ensure all variables start with `NEXT_PUBLIC_` for client-side access
3. Verify there are no typos in variable names
4. Make sure `.env.local` has no extra spaces or quotes
5. Restart your development server

**Example of correct `.env.local` format:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBXawHywcfsl5SQtfbgpLJCNtqP3wCicUc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=eudelicacies.firebaseapp.com
```

**❌ Common mistakes:**
```env
# Wrong - quotes around value
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBXawHywcfsl5SQtfbgpLJCNtqP3wCicUc"

# Wrong - spaces around =
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyBXawHywcfsl5SQtfbgpLJCNtqP3wCicUc

# Wrong - missing NEXT_PUBLIC_ prefix
FIREBASE_API_KEY=AIzaSyBXawHywcfsl5SQtfbgpLJCNtqP3wCicUc
```

