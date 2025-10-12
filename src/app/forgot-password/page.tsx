"use client";

import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError("Failed to send password reset email. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            Forgot Password?
          </h1>
          <p className="text-navy/70">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {success ? (
            <div>
              <div className="bg-olive/10 border border-olive/30 text-navy px-4 py-3 rounded mb-6">
                <p className="font-semibold mb-2">✓ Email Sent!</p>
                <p className="text-sm">
                  We've sent password reset instructions to <strong>{email || "your email"}</strong>.
                  Please check your inbox and spam folder.
                </p>
              </div>

              <div className="space-y-4">
                <Link
                  href="/login"
                  className="block w-full py-3 bg-terracotta text-white text-center rounded-full hover:bg-terracotta/90 transition-colors font-semibold"
                >
                  Back to Login
                </Link>

                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="w-full py-3 bg-white border-2 border-terracotta text-terracotta text-center rounded-full hover:bg-terracotta/5 transition-colors font-semibold"
                >
                  Send Another Email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-navy mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                  placeholder="your@email.com"
                />
                <p className="mt-2 text-xs text-navy/60">
                  Enter the email address associated with your account
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-olive hover:text-terracotta transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-navy/80">
            <strong>💡 Tip:</strong> If you don't receive the email within a few minutes:
          </p>
          <ul className="mt-2 text-xs text-navy/70 space-y-1 ml-4">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure you entered the correct email</li>
            <li>• Wait a few minutes and try again</li>
            <li>• Contact support if the problem persists</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

