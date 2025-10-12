"use client";

import { useState, useEffect } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl) {
        localStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else {
        router.push("/");
      }
    }
  }, [user, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, name, role);
      
      // Redirect based on role
      const returnUrl = localStorage.getItem('returnUrl');
      if (returnUrl) {
        localStorage.removeItem('returnUrl');
        router.push(returnUrl);
      } else if (role === "seller") {
        router.push("/seller/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use a stronger password.");
      } else {
        setError(error.message || "Failed to create account. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            Join EU Delicacies
          </h1>
          <p className="text-navy/70">
            Create your account to start exploring
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-navy mb-3">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("buyer")}
                disabled={loading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === "buyer"
                    ? "border-terracotta bg-terracotta/5 ring-2 ring-terracotta/30"
                    : "border-olive/20 hover:border-olive/40"
                } disabled:opacity-50`}
              >
                <div className="text-3xl mb-2">🛍️</div>
                <div className="font-semibold text-navy">Buy Products</div>
                <div className="text-xs text-navy/60 mt-1">As a customer</div>
              </button>
              <button
                type="button"
                onClick={() => setRole("seller")}
                disabled={loading}
                className={`p-4 rounded-lg border-2 transition-all ${
                  role === "seller"
                    ? "border-terracotta bg-terracotta/5 ring-2 ring-terracotta/30"
                    : "border-olive/20 hover:border-olive/40"
                } disabled:opacity-50`}
              >
                <div className="text-3xl mb-2">🏪</div>
                <div className="font-semibold text-navy">Sell Products</div>
                <div className="text-xs text-navy/60 mt-1">As a merchant</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-navy mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                placeholder="John Doe"
                required
                disabled={loading}
              />
            </div>

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
                minLength={6}
              />
              <p className="text-xs text-navy/60 mt-1">At least 6 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-navy mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive focus:border-transparent"
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Creating account..." : role === "seller" ? "Create Seller Account" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-navy/70">
              Already have an account?{" "}
              <Link href="/login" className="text-terracotta hover:text-terracotta/80 font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-olive/20">
            <p className="text-xs text-navy/60 text-center">
              By creating an account, you agree to our{" "}
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
