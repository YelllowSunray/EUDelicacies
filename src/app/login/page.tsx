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

// Detect Safari specifically (iOS Safari has issues with redirects)
function isSafari() {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  return isSafariBrowser || isIOS;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [checkingRedirect, setCheckingRedirect] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const mobile = isMobileDevice();
    const safari = isSafari();
    setIsMobile(mobile);
    
    console.log('📱 Device detection:', { mobile, safari, userAgent: navigator.userAgent });
    
    // Check URL params for return URL (in case it was passed via query string)
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('returnUrl');
    if (returnUrl) {
      console.log('📍 Storing return URL:', returnUrl);
      localStorage.setItem('returnUrl', returnUrl);
    }
    
    // Check if coming back from Google redirect
    const mode = urlParams.get('mode');
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const pendingRole = localStorage.getItem('pendingGoogleRole');
    
    console.log('🔍 URL params:', { mode, hasCode: !!code, hasState: !!state, pendingRole });
    
    if (pendingRole || mode === 'select_account' || code || state) {
      console.log('🔄 Detected redirect from Google, waiting for auth...');
      setCheckingRedirect(true);
      setLoading(true);
      
      // Set a much longer timeout for mobile Safari (it can be slow)
      const timeout = safari ? 20000 : 10000;
      const checkInterval = setInterval(() => {
        // Check if auth completed
        if (user) {
          console.log('✅ User detected during interval check');
          clearInterval(checkInterval);
          setCheckingRedirect(false);
          setLoading(false);
        }
      }, 500);
      
      setTimeout(() => {
        console.log('⏰ Timeout reached, stopping loading state');
        clearInterval(checkInterval);
        setCheckingRedirect(false);
        setLoading(false);
        
        // If still not logged in after long timeout, show error
        if (!user) {
          console.error('❌ Login timeout - user not detected after', timeout, 'ms');
          setError('Login is taking longer than expected. Please wait a moment and refresh the page, or try again.');
        }
      }, timeout);
    }
  }, [user]);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      console.log('✅ User logged in, redirecting...');
      
      // Check if there's a return URL
      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl) {
        console.log('📍 Redirecting to:', returnUrl);
        localStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        router.push("/");
      }
    } else if (checkingRedirect && !loading) {
      // If we were checking for redirect but no user appeared, stop loading
      setCheckingRedirect(false);
    }
  }, [user, router, checkingRedirect, loading]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
      
      // Check if there's a return URL
      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl) {
        localStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        setError("Invalid email or password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError(error.message || "Failed to sign in. Please try again.");
      }
      setLoading(false);
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
          {typeof window !== 'undefined' && localStorage.getItem('returnUrl') && (
            <div className="mt-4 inline-block bg-terracotta/10 border border-terracotta/30 px-4 py-2 rounded-full">
              <p className="text-sm text-terracotta font-medium">
                🔐 Sign in to continue shopping
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

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
