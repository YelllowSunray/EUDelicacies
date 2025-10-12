"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import Link from "next/link";

export default function SettingsPage() {
  const { user, userData, loading, upgradeToSeller, downgradeToBuyer } = useAuth();
  const router = useRouter();

  // Password change
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Account type change
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [roleChangeType, setRoleChangeType] = useState<"upgrade" | "downgrade">("upgrade");
  const [roleReason, setRoleReason] = useState("");
  const [changingRole, setChangingRole] = useState(false);
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      if (!user?.email) return;

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setPasswordSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
      setTimeout(() => setPasswordSuccess(""), 3000);
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setPasswordError("Current password is incorrect");
      } else {
        setPasswordError("Failed to change password. Please try again.");
      }
    }
  };

  const handleRoleChange = async () => {
    if (!roleReason.trim()) {
      setRoleError("Please provide a reason for this change");
      return;
    }

    setChangingRole(true);
    setRoleError("");

    try {
      if (roleChangeType === "upgrade") {
        await upgradeToSeller();
        setTimeout(() => {
          router.push("/seller/dashboard");
        }, 1500);
      } else {
        await downgradeToBuyer();
        setTimeout(() => {
          setShowRoleModal(false);
          setChangingRole(false);
          setRoleReason("");
        }, 1500);
      }
    } catch (error) {
      setRoleError("Failed to change account type. Please try again.");
      setChangingRole(false);
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
          <Link href="/account" className="text-olive hover:text-terracotta transition-colors mb-4 inline-block">
            ← Back to Account
          </Link>
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            Settings
          </h1>
          <p className="text-navy/70">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Success Messages */}
        {passwordSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
            ✓ {passwordSuccess}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-serif text-2xl font-bold text-navy mb-6">
              Profile Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user.displayName || ""}
                  disabled
                  className="w-full px-4 py-3 border border-olive/30 rounded-lg bg-cream/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-olive/30 rounded-lg bg-cream/50"
                />
                <p className="text-xs text-navy/60 mt-1">
                  Email cannot be changed for security reasons
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-navy mb-2">
                  Account Type
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={userData?.role === "seller" ? "Seller Account" : "Buyer Account"}
                    disabled
                    className="flex-1 px-4 py-3 border border-olive/30 rounded-lg bg-cream/50"
                  />
                  {userData?.role === "buyer" ? (
                    <button
                      onClick={() => {
                        setRoleChangeType("upgrade");
                        setShowRoleModal(true);
                      }}
                      className="px-6 py-3 bg-gold/20 text-navy rounded-lg hover:bg-gold/30 transition-colors font-medium border border-gold/40"
                    >
                      🏪 Upgrade to Seller
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setRoleChangeType("downgrade");
                        setShowRoleModal(true);
                      }}
                      className="px-6 py-3 bg-blue-50 text-navy rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-200"
                    >
                      🛍️ Switch to Buyer
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Password Change */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="font-serif text-2xl font-bold text-navy mb-6">
              Password & Security
            </h2>

            {!showPasswordChange ? (
              <button
                onClick={() => setShowPasswordChange(true)}
                className="px-6 py-3 bg-olive/10 text-navy rounded-lg hover:bg-olive/20 transition-colors font-medium"
              >
                Change Password
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {passwordError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-navy mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordChange(false);
                      setPasswordError("");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="px-6 py-3 bg-gray-200 text-navy rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="font-serif text-2xl font-bold text-red-700 mb-4">
              Danger Zone
            </h2>
            <p className="text-sm text-navy/70 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Role Change Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-8">
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
              {roleChangeType === "upgrade" ? "🏪 Become a Seller" : "🛍️ Switch to Buyer"}
            </h2>

            {changingRole ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4 animate-bounce">✨</div>
                <p className="text-xl text-navy font-semibold mb-2">
                  {roleChangeType === "upgrade" ? "Upgrading your account..." : "Switching to buyer account..."}
                </p>
                <p className="text-navy/70">
                  {roleChangeType === "upgrade" 
                    ? "Welcome to the EU Delicacies seller community!" 
                    : "Returning to buyer mode..."}
                </p>
              </div>
            ) : (
              <>
                <p className="text-navy/80 mb-6">
                  {roleChangeType === "upgrade"
                    ? "Ready to share your authentic European products with customers across the EU? Tell us a bit about what you'd like to sell."
                    : "Are you sure you want to switch back to a buyer account? You'll lose access to your seller dashboard and product listings."}
                </p>

                {roleError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {roleError}
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      {roleChangeType === "upgrade" 
                        ? "Why do you want to become a seller? *" 
                        : "Why are you switching back to buyer? *"}
                    </label>
                    <textarea
                      value={roleReason}
                      onChange={(e) => setRoleReason(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive resize-none"
                      placeholder={roleChangeType === "upgrade"
                        ? "Tell us about the products you want to sell, your business, or your passion for European cuisine..."
                        : "Let us know your reason for switching back..."}
                    />
                  </div>

                  {roleChangeType === "upgrade" && (
                    <div className="bg-olive/5 rounded-lg p-4 border border-olive/20">
                      <h3 className="font-semibold text-navy mb-2">As a seller, you'll get:</h3>
                      <ul className="space-y-1 text-sm text-navy/80">
                        <li>✓ Your own seller dashboard</li>
                        <li>✓ Product listing management</li>
                        <li>✓ Order & inventory tracking</li>
                        <li>✓ Sales analytics</li>
                        <li>✓ Direct access to EU customers</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleRoleChange}
                    disabled={!roleReason.trim()}
                    className="flex-1 px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {roleChangeType === "upgrade" ? "Upgrade to Seller" : "Switch to Buyer"}
                  </button>
                  <button
                    onClick={() => {
                      setShowRoleModal(false);
                      setRoleReason("");
                      setRoleError("");
                    }}
                    className="px-6 py-3 bg-gray-200 text-navy rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

