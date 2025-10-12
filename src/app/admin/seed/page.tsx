"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { seedCountries } from "@/lib/firebase-countries";
import { countries } from "@/data/countries";

export default function AdminSeedPage() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only allow authenticated users (you can add admin check later)
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, message]);
  };

  const handleSeedCountries = async () => {
    setSeeding(true);
    setError("");
    setStatus([]);
    
    try {
      addStatus("🌍 Starting to seed countries...");
      addStatus(`📦 Found ${countries.length} countries to seed`);
      
      await seedCountries(countries);
      
      addStatus("✅ Countries seeded successfully!");
      addStatus(`📊 Verifying data...`);
      
      // Verify by fetching
      const { getAllCountries } = await import("@/lib/firebase-countries");
      const fetchedCountries = await getAllCountries();
      
      addStatus(`✅ Verified! ${fetchedCountries.length} countries now in Firebase`);
      addStatus(`🎉 All done! Check /countries page`);
    } catch (err: any) {
      console.error("Seeding error:", err);
      setError(err.message || "Failed to seed data");
      addStatus("❌ Error: " + err.message);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-navy">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            🔧 Admin: Seed Data
          </h1>
          <p className="text-navy/70">
            Populate Firebase with initial data from hardcoded sources
          </p>
        </div>

        {/* Auth Status */}
        <div className={`border-l-4 p-4 mb-6 ${user ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className={`h-5 w-5 ${user ? 'text-green-400' : 'text-red-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              {user ? (
                <p className="text-sm text-green-700">
                  ✅ <strong>Authenticated as:</strong> {user.email} ({userData?.role})
                </p>
              ) : (
                <p className="text-sm text-red-700">
                  ❌ <strong>Not logged in!</strong> Please <a href="/login" className="underline font-semibold">login</a> to seed data.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 mb-2">
                <strong>Before seeding, update Firestore Rules:</strong>
              </p>
              <ol className="text-sm text-yellow-700 list-decimal list-inside space-y-1">
                <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener" className="underline">Firebase Console</a></li>
                <li>Select: <strong>eudelicacies</strong> project</li>
                <li>Click: <strong>Firestore Database</strong> → <strong>Rules</strong></li>
                <li>See instructions in <code className="bg-yellow-100 px-1 rounded">FIRESTORE_RULES_DEV.md</code></li>
              </ol>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Seed Countries */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="font-serif text-2xl font-bold text-navy mb-4">
            🌍 Seed Countries
          </h2>
          <p className="text-navy/70 mb-4">
            This will populate the <code className="bg-cream px-2 py-1 rounded">countries</code> collection 
            with {countries.length} European countries.
          </p>
          <button
            onClick={handleSeedCountries}
            disabled={seeding || !user}
            className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {!user ? "Please Login First" : seeding ? "Seeding..." : "Seed Countries"}
          </button>
          {!user && (
            <p className="text-sm text-red-600 mt-2">
              You must be logged in to seed data. <a href="/login" className="underline font-semibold">Login here</a>
            </p>
          )}
        </div>

        {/* Status Log */}
        {status.length > 0 && (
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm">
            <div className="space-y-1">
              {status.map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-navy mb-2">ℹ️ What gets seeded:</h3>
          <ul className="space-y-2 text-sm text-navy/80">
            <li>✓ <strong>Countries:</strong> All {countries.length} European countries with details</li>
            <li>✓ <strong>Products:</strong> Sellers add products through their dashboard</li>
            <li>✓ <strong>Orders:</strong> Created when users checkout</li>
            <li>✓ <strong>Carts:</strong> Created when users add items</li>
          </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-olive/5 border border-olive/20 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-navy mb-3">📋 After Seeding:</h3>
          <ol className="space-y-2 text-sm text-navy/80 list-decimal list-inside">
            <li>Visit the <a href="/countries" className="text-terracotta hover:underline">Countries page</a> to see loaded data</li>
            <li>As a seller, add products through the <a href="/seller/dashboard" className="text-terracotta hover:underline">Dashboard</a></li>
            <li>Update Firestore security rules (see FIREBASE_SETUP.md)</li>
            <li>Test the complete flow: browse → add to cart → checkout</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

