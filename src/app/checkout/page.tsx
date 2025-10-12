"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/firebase-orders";
import { ShippingAddress, OrderItem } from "@/lib/firebase-collections";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [error, setError] = useState("");

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [notes, setNotes] = useState("");

  // Handle redirects in useEffect to avoid render-time navigation
  // Don't redirect if order is complete (prevents redirect after cart clear)
  useEffect(() => {
    if (orderComplete) return; // Don't redirect if order was just completed
    
    if (!user) {
      router.push('/login');
    } else if (items.length === 0) {
      router.push('/cart');
    }
  }, [user, items, router, orderComplete]);

  // Show loading state while redirecting (but not if order is complete)
  if (!orderComplete && (!user || items.length === 0)) {
    return (
      <div className="min-h-screen bg-cream py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-navy">Redirecting...</p>
        </div>
      </div>
    );
  }
  
  // Show processing state after order is submitted
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-cream py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-navy text-xl font-semibold mb-2">Processing your order...</p>
          <p className="text-navy/60">Please wait while we redirect you</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!shippingAddress.fullName || !shippingAddress.addressLine1 || 
        !shippingAddress.city || !shippingAddress.postalCode || 
        !shippingAddress.country || !shippingAddress.phone) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Ensure user exists
      if (!user) {
        setError("You must be logged in to place an order.");
        setIsSubmitting(false);
        return;
      }

      // Convert cart items to order items
      const orderItems: OrderItem[] = items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        quantity: item.quantity,
        pricePerUnit: item.price,
        subtotal: item.price * item.quantity,
      }));

      console.log('📦 Creating order...');
      
      // Create order
      const order = await createOrder({
        userId: user.uid,
        userEmail: user.email || "",
        items: orderItems,
        subtotal: total,
        shippingCost: 0, // TBD by seller
        tax: 0, // TBD by seller
        total: total,
        status: 'pending',
        shippingAddress: shippingAddress,
        billingAddress: shippingAddress, // Same as shipping for now
        paymentMethod: 'seller_contact',
        paymentStatus: 'pending',
        notes: notes,
      });

      console.log('✅ Order created:', order.orderNumber);

      // Mark order as complete BEFORE clearing cart
      // This prevents the useEffect from redirecting to /cart
      setOrderComplete(true);

      // Send confirmation emails (don't wait for these to complete)
      sendOrderEmails(order.id, order.orderNumber).catch(err => 
        console.error('Email sending failed (non-critical):', err)
      );

      // Clear cart
      console.log('🧹 Clearing cart...');
      await clearCart();

      // Small delay to ensure cart context updates
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to success page with order details
      console.log('🎉 Redirecting to success page...');
      router.push(`/order-success?orderId=${order.id}&orderNumber=${order.orderNumber}`);
    } catch (err) {
      console.error('❌ Order creation error:', err);
      setError('Failed to create order. Please try again.');
      setIsSubmitting(false);
      setOrderComplete(false);
    }
  };

  const sendOrderEmails = async (orderId: string, orderNumber: string) => {
    console.log('📧 Sending order emails for order:', orderNumber);
    
    // Prepare item list for emails
    const itemsList = items.map(item => 
      `${item.productName} x${item.quantity} - €${(item.price * item.quantity).toFixed(2)}`
    ).join(', ');

    // Get unique sellers
    const uniqueSellers = new Map<string, { name: string; items: typeof items }>();
    items.forEach(item => {
      if (!uniqueSellers.has(item.sellerId)) {
        uniqueSellers.set(item.sellerId, { name: item.sellerName, items: [] });
      }
      uniqueSellers.get(item.sellerId)!.items.push(item);
    });

    // Send buyer confirmation email
    try {
      console.log('📧 Sending buyer confirmation to:', user?.email);
      const buyerResponse = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _replyto: user?.email,
          _subject: `✅ Order Confirmation #${orderNumber}`,
          orderType: "buyer_confirmation",
          orderNumber: orderNumber,
          customerName: shippingAddress.fullName,
          customerEmail: user?.email,
          orderTotal: `€${total.toFixed(2)}`,
          items: itemsList,
          message: `
✅ ORDER CONFIRMATION

Hello ${shippingAddress.fullName},

Thank you for your order from EU Delicacies!

📦 Order Details:
━━━━━━━━━━━━━━━━━━━━━━
Order Number: ${orderNumber}
Order Date: ${new Date().toLocaleDateString('en-GB')}
Total: €${total.toFixed(2)}

Items:
${itemsList}

📍 Shipping Address:
${shippingAddress.fullName}
${shippingAddress.addressLine1}
${shippingAddress.addressLine2 || ''}
${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
${shippingAddress.country}
Phone: ${shippingAddress.phone}

${notes ? `📝 Your Notes:\n${notes}\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━

⏰ NEXT STEPS:
The seller(s) will contact you within 24-48 hours via email or phone to:
• Arrange payment details
• Confirm delivery schedule
• Answer any questions

📱 Track Your Order:
Visit ${typeof window !== 'undefined' ? window.location.origin : ''}/orders

Need help? Contact us at iyersamir@gmail.com

Best regards,
EU Delicacies Team
          `
        })
      });

      if (buyerResponse.ok) {
        console.log('✅ Buyer email sent successfully');
      } else {
        console.error('❌ Buyer email failed:', await buyerResponse.text());
      }
    } catch (error) {
      console.error('❌ Error sending buyer email:', error);
    }

    // Send seller notification (combined for all sellers)
    try {
      const sellersList = Array.from(uniqueSellers.entries()).map(([sellerId, sellerData]) => {
        const sellerTotal = sellerData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const sellerItems = sellerData.items.map(item => 
          `  • ${item.productName} x${item.quantity} = €${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        return `
━━━ ${sellerData.name} ━━━
${sellerItems}
Subtotal: €${sellerTotal.toFixed(2)}`;
      }).join('\n\n');

      console.log('📧 Sending seller notification to: iyersamir@gmail.com');
      const sellerResponse = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `🔔 NEW ORDER #${orderNumber} - Action Required`,
          orderType: "seller_notification",
          orderNumber: orderNumber,
          sellerCount: uniqueSellers.size,
          orderTotal: `€${total.toFixed(2)}`,
          message: `
🎉 NEW ORDER RECEIVED!

Order #${orderNumber}
Date: ${new Date().toLocaleDateString('en-GB', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 CUSTOMER INFORMATION:
Name: ${shippingAddress.fullName}
Email: ${user?.email}
Phone: ${shippingAddress.phone}

📍 SHIPPING ADDRESS:
${shippingAddress.addressLine1}
${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + '\n' : ''}${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}
${shippingAddress.country}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 ITEMS BY SELLER:
${sellersList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 GRAND TOTAL: €${total.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${notes ? `📝 CUSTOMER NOTES:\n${notes}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` : ''}

⚠️ ACTION REQUIRED:
1. Contact the customer within 24-48 hours
2. Arrange payment method (bank transfer, PayPal, etc.)
3. Confirm delivery schedule
4. Update order status in your dashboard

📱 View Order Details:
${typeof window !== 'undefined' ? window.location.origin : ''}/seller/dashboard

💡 TIP: Reply directly to the customer at ${user?.email}

Best regards,
EU Delicacies Platform
          `
        })
      });

      if (sellerResponse.ok) {
        console.log('✅ Seller email sent successfully');
      } else {
        console.error('❌ Seller email failed:', await sellerResponse.text());
      }
    } catch (error) {
      console.error('❌ Error sending seller email:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-serif text-4xl font-bold text-navy mb-8">
          Checkout
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-navy font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-navy font-medium mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    placeholder="Street address, P.O. box"
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-navy font-medium mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                  />
                </div>

                <div>
                  <label className="block text-navy font-medium mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div>
                  <label className="block text-navy font-medium mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div>
                  <label className="block text-navy font-medium mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div>
                  <label className="block text-navy font-medium mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-navy font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-navy font-medium mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions or preferences..."
                    rows={4}
                    className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="font-serif text-2xl font-bold text-navy mb-6">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-navy">
                      {item.productName} x{item.quantity}
                    </span>
                    <span className="text-navy font-semibold">
                      €{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-olive/20">
                <div className="flex justify-between text-navy">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-navy">
                  <span>Shipping</span>
                  <span className="text-olive text-sm">TBD by seller</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-navy mb-6">
                <span>Total</span>
                <span className="text-terracotta">€{total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-4"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>

              <div className="bg-gold/10 border border-gold/30 rounded-lg p-4">
                <p className="text-xs text-navy/80 leading-relaxed">
                  <strong>💡 Note:</strong> No payment is required now. After placing your order, the seller(s) will contact you directly via email to arrange payment and delivery details.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

