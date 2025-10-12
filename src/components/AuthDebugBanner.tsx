"use client";

import { useEffect, useState } from "react";

export default function AuthDebugBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkPending = () => {
      const pendingRole = localStorage.getItem('pendingGoogleRole');
      setShowBanner(!!pendingRole);
    };

    checkPending();
    
    // Check every second in case it changes
    const interval = setInterval(checkPending, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!showBanner) return null;

  return (
    <div className="bg-yellow-400 text-black text-center py-2 text-sm font-semibold sticky top-0 z-50">
      ⏳ Completing Google sign-in... Please wait.
    </div>
  );
}

