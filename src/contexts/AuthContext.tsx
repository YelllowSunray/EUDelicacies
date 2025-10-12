"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export type UserRole = 'buyer' | 'seller';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  upgradeToSeller: () => Promise<void>;
  downgradeToBuyer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
  upgradeToSeller: async () => {},
  downgradeToBuyer: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Store additional user data in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: role,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', user.uid), userData);
    setUserData(userData);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async (role: UserRole = 'buyer') => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user document exists, if not create one
    const userRef = doc(db, 'users', result.user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Create new user document for Google sign-in
      const newUser: UserData = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || 'User',
        role: role,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(userRef, newUser);
      setUserData(newUser);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const upgradeToSeller = async () => {
    if (!user) throw new Error("No user logged in");
    
    // Update role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      role: 'seller'
    }, { merge: true });

    // Update local state
    if (userData) {
      setUserData({
        ...userData,
        role: 'seller'
      });
    }
  };

  const downgradeToBuyer = async () => {
    if (!user) throw new Error("No user logged in");
    
    // Update role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      role: 'buyer'
    }, { merge: true });

    // Update local state
    if (userData) {
      setUserData({
        ...userData,
        role: 'buyer'
      });
    }
  };

  const value = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    upgradeToSeller,
    downgradeToBuyer,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

