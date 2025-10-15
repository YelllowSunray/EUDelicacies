"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, userData, logout } = useAuth();
  const { itemCount } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-olive/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3">
            <div>
              <h1 className="font-serif font-bold text-2xl text-navy">
                EU Delicacies
              </h1>
              <p className="text-xs text-olive">Taste the heart of Europe</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-navy hover:text-terracotta transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/shop" 
              className="text-navy hover:text-terracotta transition-colors font-medium"
            >
              Shop
            </Link>
            <Link 
              href="/countries" 
              className="text-navy hover:text-terracotta transition-colors font-medium"
            >
              Countries
            </Link>
            <Link 
              href="/blog" 
              className="text-navy hover:text-terracotta transition-colors font-medium"
            >
              Blog
            </Link>
            <Link 
              href="/about" 
              className="text-navy hover:text-terracotta transition-colors font-medium"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-navy hover:text-terracotta transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {userData?.role === "seller" && (
              <Link 
                href="/seller/dashboard" 
                className="text-navy hover:text-terracotta transition-colors font-medium"
              >
                Seller Dashboard
              </Link>
            )}
            {user ? (
              <>
                <Link 
                  href="/cart"
                  className="relative text-navy hover:text-terracotta transition-colors"
                  title="Shopping Cart"
                >
                  <span className="text-2xl">🛒</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-terracotta text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-olive/10 hover:bg-olive/20 rounded-full transition-colors"
                  >
                    <span className="text-xl">
                      {userData?.role === "seller" ? "👤" : "🙋"}
                    </span>
                    <span className="font-medium text-navy text-sm">
                      {user.displayName || "User"}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-olive/20 py-2">
                      <div className="px-4 py-2 border-b border-olive/20">
                        <p className="text-sm font-semibold text-navy">{user.displayName}</p>
                        <p className="text-xs text-navy/60">{user.email}</p>
                        {userData?.role && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-gold/20 text-navy text-xs rounded-full">
                            {userData.role === "seller" ? "🏪 Seller" : "🛍️ Buyer"}
                          </span>
                        )}
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-navy hover:bg-cream transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-navy hover:bg-cream transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        ⚙️ Settings
                      </Link>
                      {userData?.role === "seller" && (
                        <Link
                          href="/seller/dashboard"
                          className="block px-4 py-2 text-sm text-navy hover:bg-cream transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Seller Dashboard
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-navy hover:bg-cream transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-cream transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="hidden sm:block px-6 py-2 text-navy hover:text-terracotta transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="hidden sm:block px-6 py-2 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-navy"
              aria-label="Toggle menu"
            >
              <span className="text-2xl">{mobileMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-olive/20">
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-navy hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/shop" 
                className="text-navy hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link 
                href="/countries" 
                className="text-navy hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Countries
              </Link>
              <Link 
                href="/blog" 
                className="text-navy hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              {userData?.role === "seller" && (
                <Link 
                  href="/seller/dashboard" 
                  className="text-navy hover:text-terracotta transition-colors font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Seller Dashboard
                </Link>
              )}
              <Link 
                href="/about" 
                className="text-navy hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-navy hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              {user ? (
                <>
                  <div className="border-t border-olive/20 pt-3">
                    <p className="text-sm font-semibold text-navy px-2 mb-2">
                      {user.displayName}
                    </p>
                    <Link 
                      href="/account" 
                      className="text-navy hover:text-terracotta transition-colors font-medium py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link 
                      href="/orders" 
                      className="text-navy hover:text-terracotta transition-colors font-medium py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      href="/settings" 
                      className="text-navy hover:text-terracotta transition-colors font-medium py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-700 transition-colors font-medium py-2 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-olive/20 pt-3">
                    <Link 
                      href="/login" 
                      className="text-navy hover:text-terracotta transition-colors font-medium py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      href="/signup" 
                      className="text-terracotta hover:text-terracotta/80 transition-colors font-medium py-2 block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

