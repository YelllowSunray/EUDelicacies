"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AccountPage() {
  const { user, userData, loading, upgradeToSeller, downgradeToBuyer } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "settings">("profile");
  
  // Role change modal
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-navy mb-2">
            My Account
          </h1>
          <p className="text-navy/70">
            Manage your profile and orders
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">
                  {userData?.role === "seller" ? "👤" : "🙋"}
                </div>
                <h2 className="font-serif text-xl font-bold text-navy">
                  {user.displayName}
                </h2>
                <p className="text-sm text-navy/60">{user.email}</p>
                {userData?.role && (
                  <span className="inline-block mt-2 px-3 py-1 bg-gold/20 text-navy text-sm rounded-full">
                    {userData.role === "seller" ? "🏪 Seller" : "🛍️ Buyer"}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-olive/10 text-navy font-semibold"
                      : "text-navy/70 hover:bg-cream"
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "orders"
                      ? "bg-olive/10 text-navy font-semibold"
                      : "text-navy/70 hover:bg-cream"
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-olive/10 text-navy font-semibold"
                      : "text-navy/70 hover:bg-cream"
                  }`}
                >
                  Settings
                </button>
              </div>

              {userData?.role === "seller" && (
                <div className="mt-6 pt-6 border-t border-olive/20">
                  <Link
                    href="/seller/dashboard"
                    className="block w-full text-center px-4 py-2 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                  Profile Information
                </h2>

                <div className="space-y-6">
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={userData?.role === "seller" ? "Seller Account" : "Buyer Account"}
                      disabled
                      className="w-full px-4 py-3 border border-olive/30 rounded-lg bg-cream/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : "N/A"}
                      disabled
                      className="w-full px-4 py-3 border border-olive/30 rounded-lg bg-cream/50"
                    />
                  </div>

                  <div className="pt-4">
                    <button className="px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium">
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                  Order History
                </h2>

                <div className="text-center py-12 bg-cream rounded-lg">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-navy/70 mb-2">
                    You haven't placed any orders yet
                  </p>
                  <p className="text-sm text-navy/60 mb-6">
                    Start exploring our authentic European delicacies!
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
                  >
                    Browse Products
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                  Account Settings
                </h2>

                <div className="space-y-6">
                  <div className="pb-6 border-b border-olive/20">
                    <h3 className="font-semibold text-navy mb-4">
                      Account Type
                    </h3>
                    <div className="flex items-center gap-3 mb-4">
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
                    <p className="text-sm text-navy/60">
                      {userData?.role === "seller" 
                        ? "Switch back to a buyer account if you no longer want to sell products."
                        : "Upgrade to a seller account to start selling your authentic European products."}
                    </p>
                  </div>

                  <div className="pb-6 border-b border-olive/20">
                    <h3 className="font-semibold text-navy mb-4">
                      Email Notifications
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-terracotta" defaultChecked />
                        <span className="text-navy/80">Order updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-terracotta" defaultChecked />
                        <span className="text-navy/80">New products from favorite sellers</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="mr-3 h-4 w-4 text-terracotta" />
                        <span className="text-navy/80">Promotional emails</span>
                      </label>
                    </div>
                  </div>

                  <div className="pb-6 border-b border-olive/20">
                    <h3 className="font-semibold text-navy mb-4">
                      Password
                    </h3>
                    <Link 
                      href="/settings"
                      className="inline-block px-4 py-2 border border-navy text-navy rounded-full hover:bg-navy hover:text-white transition-colors"
                    >
                      Change Password
                    </Link>
                  </div>

                  <div>
                    <h3 className="font-semibold text-red-600 mb-4">
                      Danger Zone
                    </h3>
                    <button className="px-4 py-2 border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
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

