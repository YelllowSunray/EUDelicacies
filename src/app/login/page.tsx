"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Detect if device is mobile
function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);

    try {
      console.log('🔐 Starting Google sign-in, isMobile:', isMobile);
      await signInWithGoogle('buyer', isMobile); // Pass mobile flag
      
      // For desktop popup, redirect immediately
      // For mobile redirect, page will reload automatically
      if (!isMobile) {
        router.push("/");
      }
    } catch (error: any) {
      console.error("❌ Google login error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
        setLoading(false);
      } else if (error.code === "auth/popup-blocked") {
        setError("Pop-up blocked. Switching to mobile-friendly method...");
        // Try redirect as fallback
        try {
          console.log('🔄 Retrying with redirect method...');
          await signInWithGoogle('buyer', true);
          // Will redirect, so don't set loading to false
        } catch (redirectError: any) {
          console.error('❌ Redirect also failed:', redirectError);
          setError(`Failed to sign in: ${redirectError.message}`);
          setLoading(false);
        }
      } else if (error.code === "auth/cancelled-popup-request") {
        // User cancelled, don't show error
        setError("");
        setLoading(false);
      } else if (error.code === "auth/unauthorized-domain" || error.code === "auth/operation-not-allowed") {
        setError("Google Sign-In is not properly configured. Please contact support.");
        setLoading(false);
      } else if (error.code === "auth/network-request-failed") {
        setError("Network error. Please check your internet connection and try again.");
        setLoading(false);
      } else {
        setError(`Failed to sign in: ${error.message || "Please try again."}`);
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            Welcome Back
          </h1>
          <p className="text-navy/70">
            Sign in to your EU Delicacies account
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 bg-white border-2 border-olive/30 text-navy rounded-full hover:bg-cream transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-sm"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? (isMobile ? "Redirecting to Google..." : "Signing in...") : "Sign in with Google"}
          </button>
          
          {isMobile && !loading && (
            <p className="text-xs text-center text-navy/60 mt-3">
              📱 Mobile-friendly sign-in
            </p>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-navy/70">
              Don't have an account?{" "}
              <Link href="/signup" className="text-terracotta hover:text-terracotta/80 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-olive/20">
            <p className="text-xs text-navy/60 text-center">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-terracotta hover:underline">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-terracotta hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-olive hover:text-terracotta transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
