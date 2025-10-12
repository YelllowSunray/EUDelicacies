import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, orderNumber, customerEmail, customerName, orderTotal, items, shippingAddress, notes, sellers } = body;

    // Validate required fields
    if (!type || !orderNumber || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'buyer_confirmation') {
      // Send confirmation email to buyer
      const buyerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #8B7355 0%, #D4A574 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4A574; }
            .item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .total { font-size: 24px; font-weight: bold; color: #8B7355; text-align: right; margin-top: 20px; }
            .discount-box { background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .button { display: inline-block; padding: 12px 30px; background: #8B7355; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Order Confirmation</h1>
              <p>Thank you for your order!</p>
            </div>
            <div class="content">
              <p>Hello ${customerName},</p>
              <p>Thank you for your order from <strong>EU Delicacies</strong>! We're excited to bring authentic European flavors to your door.</p>
              
              <div class="order-details">
                <h2>📦 Order Details</h2>
                <p><strong>Order Number:</strong> ${orderNumber}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                
                <h3 style="margin-top: 20px;">Items:</h3>
                ${items.map((item: any) => `
                  <div class="item">
                    <strong>${item.productName}</strong> x${item.quantity} - €${item.subtotal.toFixed(2)}
                  </div>
                `).join('')}
                
                <div class="total">Total: ${orderTotal}</div>
              </div>

              <div class="order-details">
                <h3>📍 Shipping Address</h3>
                <p>
                  ${shippingAddress.fullName}<br>
                  ${shippingAddress.addressLine1}<br>
                  ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + '<br>' : ''}
                  ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
                  ${shippingAddress.country}<br>
                  Phone: ${shippingAddress.phone}
                </p>
              </div>

              ${notes ? `
                <div class="order-details">
                  <h3>📝 Your Notes</h3>
                  <p>${notes}</p>
                </div>
              ` : ''}

              <div class="order-details">
                <h3>⏰ Next Steps</h3>
                <p>The seller(s) will contact you within 24-48 hours via email or phone to:</p>
                <ul>
                  <li>Arrange payment details</li>
                  <li>Confirm delivery schedule</li>
                  <li>Answer any questions you may have</li>
                </ul>
              </div>

              <div class="discount-box">
                <h2>⭐ GET 10% OFF YOUR NEXT ORDER!</h2>
                <p><strong>Leave a review and get a discount code!</strong></p>
                <p>After receiving your order:</p>
                <ol style="text-align: left; display: inline-block;">
                  <li>Go to My Orders page</li>
                  <li>Click "⭐ Review" on any delivered item</li>
                  <li>Write your review (text + 1-5 stars)</li>
                  <li>Get your 10% discount code instantly!</li>
                </ol>
                <p>Your honest feedback helps other food lovers discover great products!</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders" class="button">📱 Track Your Order</a>
              </div>

              <p>If you have any questions, feel free to reply to this email or contact us at <a href="mailto:eudelicacies@gmail.com">eudelicacies@gmail.com</a></p>
              
              <p>Best regards,<br><strong>EU Delicacies Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EU Delicacies. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"EU Delicacies" <${process.env.GMAIL_USER}>`,
        to: customerEmail,
        subject: `✅ Order Confirmation #${orderNumber}`,
        html: buyerHtml,
      });

      return NextResponse.json({ success: true, message: 'Buyer email sent' });
    }

    if (type === 'seller_notification') {
      // Send notification email to seller
      const sellerHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3; }
            .item { padding: 10px 0; border-bottom: 1px solid #eee; }
            .seller-section { background: #E3F2FD; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .total { font-size: 24px; font-weight: bold; color: #1976D2; text-align: right; margin-top: 20px; }
            .action-box { background: #FFF3E0; padding: 20px; border-radius: 8px; border: 2px solid #FF9800; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔔 NEW ORDER RECEIVED!</h1>
              <p>Action Required</p>
            </div>
            <div class="content">
              <div class="order-details">
                <h2>Order #${orderNumber}</h2>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>

              <div class="order-details">
                <h3>👤 Customer Information</h3>
                <p>
                  <strong>Name:</strong> ${customerName}<br>
                  <strong>Email:</strong> <a href="mailto:${customerEmail}">${customerEmail}</a><br>
                  <strong>Phone:</strong> ${shippingAddress.phone}
                </p>
              </div>

              <div class="order-details">
                <h3>📍 Shipping Address</h3>
                <p>
                  ${shippingAddress.fullName}<br>
                  ${shippingAddress.addressLine1}<br>
                  ${shippingAddress.addressLine2 ? shippingAddress.addressLine2 + '<br>' : ''}
                  ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.postalCode}<br>
                  ${shippingAddress.country}
                </p>
              </div>

              <div class="order-details">
                <h3>📦 Items by Seller</h3>
                ${sellers.map((seller: any) => `
                  <div class="seller-section">
                    <h4>${seller.name}</h4>
                    ${seller.items.map((item: any) => `
                      <div class="item">
                        <strong>${item.productName}</strong> x${item.quantity} = €${item.subtotal.toFixed(2)}
                      </div>
                    `).join('')}
                    <p style="text-align: right; font-weight: bold; margin-top: 10px;">
                      Subtotal: €${seller.total.toFixed(2)}
                    </p>
                  </div>
                `).join('')}
                
                <div class="total">Grand Total: ${orderTotal}</div>
              </div>

              ${notes ? `
                <div class="order-details">
                  <h3>📝 Customer Notes</h3>
                  <p>${notes}</p>
                </div>
              ` : ''}

              <div class="action-box">
                <h3>⚠️ ACTION REQUIRED</h3>
                <ol>
                  <li><strong>Contact the customer within 24-48 hours</strong></li>
                  <li>Arrange payment method (bank transfer, PayPal, etc.)</li>
                  <li>Confirm delivery schedule</li>
                  <li>Update order status in your dashboard</li>
                </ol>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/seller/dashboard" class="button">📱 View in Dashboard</a>
              </div>

              <p>💡 <strong>Tip:</strong> Reply directly to this email or contact the customer at <a href="mailto:${customerEmail}">${customerEmail}</a></p>
              
              <p>Best regards,<br><strong>EU Delicacies Platform</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} EU Delicacies. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"EU Delicacies Orders" <${process.env.GMAIL_USER}>`,
        to: 'iyersamir@gmail.com', // Seller email
        subject: `🔔 NEW ORDER #${orderNumber} - Action Required`,
        html: sellerHtml,
      });

      return NextResponse.json({ success: true, message: 'Seller email sent' });
    }

    return NextResponse.json(
      { error: 'Invalid email type' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send email', details: error.message },
      { status: 500 }
    );
  }
}

