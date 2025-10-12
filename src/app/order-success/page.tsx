"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');

  return (
    <div className="min-h-screen bg-cream py-16 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-lg shadow-lg p-12">
          {/* Success Animation */}
          <div className="mb-6">
            <div className="inline-block animate-bounce">
              <div className="text-6xl">✅</div>
            </div>
          </div>
          
          <h1 className="font-serif text-4xl font-bold text-navy mb-4">
            Order Placed Successfully!
          </h1>
          
          {orderNumber && (
            <div className="mb-6">
              <p className="text-sm text-navy/60 mb-2">Your Order Number</p>
              <p className="text-2xl font-mono font-bold text-terracotta bg-terracotta/10 py-3 px-6 rounded-lg inline-block">
                {orderNumber}
              </p>
            </div>
          )}
          
          <div className="bg-olive/10 border-2 border-olive/30 rounded-lg p-6 mb-8">
            <p className="text-navy font-medium text-lg mb-2">
              🎉 Thank you for your order!
            </p>
            <p className="text-navy/70 leading-relaxed">
              A confirmation email has been sent to your email address.
              The seller(s) will contact you directly to arrange payment and delivery.
            </p>
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-navy mb-4 flex items-center gap-2">
              <span className="text-xl">📧</span>
              What happens next?
            </h3>
            <ul className="space-y-3 text-sm text-navy/70">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center font-semibold text-xs">1</span>
                <span>You'll receive an order confirmation email within a few minutes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center font-semibold text-xs">2</span>
                <span>The seller(s) will contact you via email or phone within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center font-semibold text-xs">3</span>
                <span>They will arrange payment method (bank transfer, PayPal, etc.) and delivery details</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center font-semibold text-xs">4</span>
                <span>Track your order status and communicate with sellers through your account</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-terracotta/20 text-terracotta rounded-full flex items-center justify-center font-semibold text-xs">5</span>
                <span><strong>Once delivered</strong>, please leave a review (out of 5 stars) to help other customers!</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-gold/20 to-terracotta/20 border-2 border-gold/40 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">⭐</div>
              <h3 className="font-serif text-xl font-bold text-navy">Get 10% Off Your Next Order!</h3>
            </div>
            <p className="text-sm text-navy/80 mb-2">
              <strong>Leave a review</strong> after receiving your order and we'll send you a <strong>10% discount code</strong> for your next purchase!
            </p>
            <p className="text-xs text-navy/60">
              Visit <strong>My Orders</strong> → Click <strong>"⭐ Review"</strong> on any delivered item → Get your discount code instantly!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-8 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-medium shadow-md hover:shadow-lg"
            >
              📦 View My Orders
            </Link>
            <Link
              href="/shop"
              className="px-8 py-3 bg-white border-2 border-terracotta text-terracotta rounded-full hover:bg-terracotta/5 transition-colors font-medium"
            >
              🛍️ Continue Shopping
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-olive/20">
            <p className="text-xs text-navy/50">
              Need help? Contact us at <a href="mailto:iyersamir@gmail.com" className="text-terracotta hover:underline">iyersamir@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream py-16 flex items-center justify-center">
        <div className="text-navy">Loading...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

