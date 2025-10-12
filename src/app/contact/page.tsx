"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "general", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-navy/80">
            Have questions? Want to become a seller? We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-navy mb-6">
              Send Us a Message
            </h2>
            
            {submitted && (
              <div className="bg-olive/10 border border-olive text-navy px-6 py-4 rounded-lg mb-6">
                ✓ Thank you! Your message has been received. We'll get back to you soon.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-navy font-medium mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-navy font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-navy font-medium mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive"
                >
                  <option value="general">General Inquiry</option>
                  <option value="seller">Become a Seller</option>
                  <option value="wholesale">Wholesale Partnership</option>
                  <option value="support">Customer Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-navy font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-olive/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive resize-none"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Info & FAQ */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="font-serif text-2xl font-bold text-navy mb-6">
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">📧</div>
                  <div>
                    <p className="font-semibold text-navy">Email</p>
                    <p className="text-navy/70">iyersamir@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl">📍</div>
                  <div>
                    <p className="font-semibold text-navy">Headquarters</p>
                    <p className="text-navy/70">Brussels, Belgium</p>
                    <p className="text-navy/70">European Union</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <p className="font-semibold text-navy">Business Hours</p>
                    <p className="text-navy/70">Monday - Friday: 9:00 - 18:00 CET</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-olive/5 rounded-lg p-8">
              <h3 className="font-serif text-2xl font-bold text-navy mb-6">
                Interested in Selling?
              </h3>
              <p className="text-navy/80 mb-4">
                Are you an artisan producer or regional food business looking to reach customers 
                across the EU? We'd love to hear from you!
              </p>
              <ul className="space-y-2 text-navy/80">
                <li>✓ Simple onboarding process</li>
                <li>✓ Transparent fee structure</li>
                <li>✓ EU-wide logistics support</li>
                <li>✓ Dedicated seller dashboard</li>
              </ul>
              <p className="text-sm text-navy/60 mt-4">
                Select "Become a Seller" in the form to get started.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Teaser */}
      <section className="bg-navy text-cream py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="font-serif text-2xl font-bold mb-4">
            Have Questions?
          </h3>
          <p className="text-cream/80">
            Check out our FAQ page (coming soon) or reach out directly — we're here to help!
          </p>
        </div>
      </section>
    </div>
  );
}

