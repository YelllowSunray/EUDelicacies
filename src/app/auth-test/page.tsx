"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getRedirectResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthTestPage() {
  const { user, userData, loading } = useAuth();
  const [logs, setLogs] = useState<string[]>([]);
  const [redirectResult, setRedirectResult] = useState<any>(null);
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  useEffect(() => {
    addLog("🔄 AuthTestPage mounted");
    
    // Check localStorage
    const pendingRole = localStorage.getItem('pendingGoogleRole');
    const returnUrl = localStorage.getItem('returnUrl');
    addLog(`💾 localStorage - pendingRole: ${pendingRole}, returnUrl: ${returnUrl}`);
    
    // Check redirect result
    getRedirectResult(auth).then((result) => {
      if (result) {
        addLog(`✅ Redirect result found: ${result.user?.email}`);
        setRedirectResult(result);
      } else {
        addLog(`ℹ️ No redirect result`);
      }
    }).catch((error) => {
      addLog(`❌ Error checking redirect: ${error.code} - ${error.message}`);
    });
  }, []);

  useEffect(() => {
    addLog(`👤 Auth state - User: ${user?.email || 'null'}, Loading: ${loading}, UserData: ${userData?.role || 'null'}`);
  }, [user, userData, loading]);

  const testMobileDetection = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    addLog(`📱 Mobile detection: ${isMobile}`);
    addLog(`🌐 User agent: ${navigator.userAgent}`);
  };

  const testLocalStorage = () => {
    addLog(`💾 Testing localStorage...`);
    try {
      localStorage.setItem('test', 'value');
      const value = localStorage.getItem('test');
      localStorage.removeItem('test');
      addLog(`✅ localStorage works! Test value: ${value}`);
    } catch (error: any) {
      addLog(`❌ localStorage error: ${error.message}`);
    }
  };

  const checkFirebaseConfig = () => {
    addLog(`🔥 Checking Firebase config...`);
    addLog(`Auth instance: ${auth ? 'exists' : 'null'}`);
    addLog(`Current user: ${auth.currentUser?.email || 'null'}`);
    addLog(`App name: ${auth.app.name}`);
  };

  const clearAllStorage = () => {
    localStorage.clear();
    addLog(`🗑️ Cleared all localStorage`);
  };

  const simulateLogin = () => {
    addLog(`🔐 Simulating login flow...`);
    addLog(`⚠️ To test actual Google Sign-In, use the "Go to Login" button below`);
    addLog(`📍 This page is for monitoring auth state only`);
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="font-serif text-3xl font-bold text-navy mb-4">
            🔍 Auth Debug Page
          </h1>
          
          {/* Current State */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="font-semibold text-navy mb-2">Current State:</h2>
            <div className="space-y-1 text-sm">
              <p><strong>User:</strong> {user ? `${user.email} (${user.uid})` : 'Not logged in'}</p>
              <p><strong>Role:</strong> {userData?.role || 'N/A'}</p>
              <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
              <p><strong>Pending Role:</strong> {typeof window !== 'undefined' ? localStorage.getItem('pendingGoogleRole') || 'None' : 'N/A'}</p>
              <p><strong>Return URL:</strong> {typeof window !== 'undefined' ? localStorage.getItem('returnUrl') || 'None' : 'N/A'}</p>
              <p><strong>Redirect Result:</strong> {redirectResult ? `Yes (${redirectResult.user?.email})` : 'No'}</p>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={testMobileDetection}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              📱 Test Mobile Detection
            </button>
            <button
              onClick={testLocalStorage}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              💾 Test localStorage
            </button>
            <button
              onClick={checkFirebaseConfig}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              🔥 Check Firebase
            </button>
            <button
              onClick={clearAllStorage}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              🗑️ Clear Storage
            </button>
          </div>

          {/* Console Logs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-navy">Console Logs:</h2>
              <button
                onClick={() => setLogs([])}
                className="text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear Logs
              </button>
            </div>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet...</p>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-navy mb-4">🔗 Quick Links:</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/login"
              className="px-4 py-3 bg-terracotta text-white text-center rounded-lg hover:bg-terracotta/90 transition-colors font-medium"
            >
              🔐 Go to Login
            </a>
            <a
              href="/signup"
              className="px-4 py-3 bg-olive text-white text-center rounded-lg hover:bg-olive/90 transition-colors font-medium"
            >
              ✨ Go to Signup
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
          <h3 className="font-semibold text-navy mb-3">📋 How to Use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-navy/80">
            <li>Open this page on your iPhone</li>
            <li>Click the test buttons to check each component</li>
            <li>Go to the login page and try signing in</li>
            <li>Come back here to see what happened</li>
            <li>Check the console logs for detailed information</li>
            <li>Take a screenshot and share it if you need help</li>
          </ol>
          
          <div className="mt-4 pt-4 border-t border-yellow-300">
            <p className="text-xs text-navy/70">
              <strong>URL to test:</strong> Open <code className="bg-yellow-200 px-2 py-1 rounded">/auth-test</code> on your phone
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

