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
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult
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
  signInWithGoogle: (role?: UserRole, useMobile?: boolean) => Promise<void>;
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
    console.log('🔄 AuthContext: Setting up auth');
    
    // Check for redirect result FIRST
    const checkRedirect = async () => {
      try {
        console.log('🔍 Checking redirect result...');
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
          console.log('✅ Redirect success:', result.user.email);
          const userRef = doc(db, 'users', result.user.uid);
          const userSnap = await getDoc(userRef);
          
          if (!userSnap.exists()) {
            const pendingRole = localStorage.getItem('pendingGoogleRole') as UserRole || 'buyer';
            const newUser: UserData = {
              uid: result.user.uid,
              email: result.user.email!,
              displayName: result.user.displayName || 'User',
              role: pendingRole,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, newUser);
            console.log('✅ User created');
          }
          localStorage.removeItem('pendingGoogleRole');
        } else {
          console.log('ℹ️ No redirect result');
        }
      } catch (error: any) {
        console.error('❌ Redirect error:', error.code, error.message);
      }
    };
    
    checkRedirect();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('👤 Auth state:', user ? user.email : 'logged out');
      setUser(user);
      
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
          console.log('✅ User data loaded');
        } else {
          // Check if this is from a redirect result
          const pendingRole = localStorage.getItem('pendingGoogleRole') as UserRole | null;
          if (pendingRole) {
            const newUser: UserData = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || 'User',
              role: pendingRole,
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', user.uid), newUser);
            setUserData(newUser);
            localStorage.removeItem('pendingGoogleRole');
            console.log('✅ New user created');
          } else {
            // Create default buyer account
            const newUser: UserData = {
              uid: user.uid,
              email: user.email!,
              displayName: user.displayName || 'User',
              role: 'buyer',
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', user.uid), newUser);
            setUserData(newUser);
            console.log('✅ Default buyer created');
          }
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

  const signInWithGoogle = async (role: UserRole = 'buyer', useMobile: boolean = false) => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      // Use redirect for mobile devices
      if (useMobile) {
        console.log('📱 Using redirect-based Google sign-in for mobile');
        localStorage.setItem('pendingGoogleRole', role);
        await signInWithRedirect(auth, provider);
        // Function returns here, redirect happens, user comes back
        return;
      }
      
      // Use popup for desktop
      console.log('💻 Using popup-based Google sign-in for desktop');
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
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      throw error; // Re-throw to be handled by caller
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

