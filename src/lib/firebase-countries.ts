/**
 * Firebase Countries Management
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  orderBy 
} from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS, FirebaseCountry } from './firebase-collections';

/**
 * Get all active countries
 */
export async function getAllCountries(): Promise<FirebaseCountry[]> {
  try {
    const countriesRef = collection(db, COLLECTIONS.COUNTRIES);
    // Try simple query first (no index needed)
    const snapshot = await getDocs(countriesRef);
    
    const countries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseCountry))
    .filter(country => country.active !== false) // Filter active in code
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort in code
    
    console.log(`Loaded ${countries.length} countries from Firebase`);
    return countries;
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
}

/**
 * Get country by ID
 */
export async function getCountryById(countryId: string): Promise<FirebaseCountry | null> {
  try {
    const countryRef = doc(db, COLLECTIONS.COUNTRIES, countryId);
    const snapshot = await getDoc(countryRef);
    
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data()
      } as FirebaseCountry;
    }
    return null;
  } catch (error) {
    console.error('Error fetching country:', error);
    return null;
  }
}

/**
 * Get countries by region
 */
export async function getCountriesByRegion(region: string): Promise<FirebaseCountry[]> {
  try {
    const countriesRef = collection(db, COLLECTIONS.COUNTRIES);
    const snapshot = await getDocs(countriesRef);
    
    const countries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FirebaseCountry))
    .filter(country => country.region === region && country.active !== false)
    .sort((a, b) => a.name.localeCompare(b.name));
    
    return countries;
  } catch (error) {
    console.error('Error fetching countries by region:', error);
    return [];
  }
}

/**
 * Add or update a country (Admin function)
 */
export async function upsertCountry(country: Omit<FirebaseCountry, 'createdAt' | 'updatedAt'>): Promise<void> {
  try {
    const countryRef = doc(db, COLLECTIONS.COUNTRIES, country.id);
    const existingDoc = await getDoc(countryRef);
    
    const now = new Date().toISOString();
    
    if (existingDoc.exists()) {
      // Update existing
      await updateDoc(countryRef, {
        ...country,
        updatedAt: now
      });
    } else {
      // Create new
      await setDoc(countryRef, {
        ...country,
        createdAt: now,
        updatedAt: now
      });
    }
  } catch (error) {
    console.error('Error upserting country:', error);
    throw error;
  }
}

/**
 * Seed countries from hardcoded data (Admin function)
 */
export async function seedCountries(countries: any[]): Promise<void> {
  try {
    const promises = countries.map(country => {
      const countryData: Omit<FirebaseCountry, 'createdAt' | 'updatedAt'> = {
        id: country.id,
        name: country.name,
        flag: country.flag,
        tagline: country.tagline,
        description: country.description,
        specialties: country.specialties,
        region: country.region,
        active: true
      };
      return upsertCountry(countryData);
    });
    
    await Promise.all(promises);
    console.log(`Successfully seeded ${countries.length} countries`);
  } catch (error) {
    console.error('Error seeding countries:', error);
    throw error;
  }
}

