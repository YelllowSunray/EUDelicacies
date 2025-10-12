import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit as limitQuery } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, FirebaseProduct } from './firebase-collections';

export type SellerProduct = FirebaseProduct;

export const categories = [
  "Cheese",
  "Beverages",
  "Oils",
  "Meats",
  "Seafood",
  "Bakery",
  "Snacks",
  "Gourmet Meals",
  "Preserves"
];

// This will be loaded from Firebase now, but keeping for backward compatibility
export const countries = [
  { id: "france", name: "France", flag: "🇫🇷" },
  { id: "italy", name: "Italy", flag: "🇮🇹" },
  { id: "netherlands", name: "Netherlands", flag: "🇳🇱" },
  { id: "germany", name: "Germany", flag: "🇩🇪" },
  { id: "belgium", name: "Belgium", flag: "🇧🇪" }
];

// Add a new product
export async function addProduct(product: Omit<SellerProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const productsRef = collection(db, COLLECTIONS.PRODUCTS);
  const now = new Date().toISOString();
  
  const productData: Omit<FirebaseProduct, 'id'> = {
    ...product,
    active: product.active ?? true,
    featured: product.featured ?? false,
    createdAt: now,
    updatedAt: now
  };
  
  const docRef = await addDoc(productsRef, productData);
  return docRef.id;
}

// Get all products for a specific seller
export async function getSellerProducts(sellerId: string): Promise<SellerProduct[]> {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(productsRef, where('sellerId', '==', sellerId));
    const snapshot = await getDocs(q);
    
    // Sort in code instead of requiring Firestore index
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SellerProduct))
    .sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime; // Newest first
    });
    
    console.log(`Loaded ${products.length} products for seller ${sellerId}`);
    return products;
  } catch (error) {
    console.error('Error fetching seller products:', error);
    return [];
  }
}

// Get all active products
export async function getAllProducts(limitCount?: number): Promise<SellerProduct[]> {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const snapshot = await getDocs(productsRef);
    
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SellerProduct))
    .filter(product => product.active !== false)
    .sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
    
    if (limitCount) {
      products = products.slice(0, limitCount);
    }
    
    console.log(`Loaded ${products.length} products from Firebase`);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Get products by country
export async function getProductsByCountry(countryId: string, limitCount?: number): Promise<SellerProduct[]> {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const snapshot = await getDocs(productsRef);
    
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SellerProduct))
    .filter(product => product.countryId === countryId && product.active !== false)
    .sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
    
    if (limitCount) {
      products = products.slice(0, limitCount);
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching products by country:', error);
    return [];
  }
}

// Get products by category
export async function getProductsByCategory(category: string, limitCount?: number): Promise<SellerProduct[]> {
  try {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const snapshot = await getDocs(productsRef);
    
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as SellerProduct))
    .filter(product => product.category === category && product.active !== false)
    .sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
    
    if (limitCount) {
      products = products.slice(0, limitCount);
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

// Update a product
export async function updateProduct(productId: string, updates: Partial<SellerProduct>): Promise<void> {
  const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  await updateDoc(productRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

// Delete a product
export async function deleteProduct(productId: string): Promise<void> {
  const productRef = doc(db, COLLECTIONS.PRODUCTS, productId);
  await deleteDoc(productRef);
}
