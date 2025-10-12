"use client";

import { useState } from "react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is EU Delicacies?",
    answer: "EU Delicacies is a cross-border food marketplace connecting people across Europe with authentic artisan delicacies. We make it simple to discover and purchase regional specialties from neighboring EU countries, supporting small producers and celebrating Europe's culinary heritage."
  },
  {
    question: "Which countries do you ship to?",
    answer: "We ship to all 27 European Union member states. Our platform currently features products from France, Italy, Netherlands, Germany, and Belgium, with plans to expand to Spain, Portugal, Austria, Greece, and Poland soon."
  },
  {
    question: "How long does shipping take?",
    answer: "Delivery times vary by product and destination, but typically range from 3-7 business days within the EU. Each product page shows estimated shipping times. We use reliable carriers like DHL, PostNL, and DPD for EU-wide delivery."
  },
  {
    question: "Are all products authentic?",
    answer: "Absolutely! We only work with verified local producers and artisan makers. Every seller must provide EU business registration and food safety compliance documentation. Each product includes its origin story and producer information."
  },
  {
    question: "How do I become a seller?",
    answer: "We welcome artisan producers and regional food businesses! Visit our Contact page and select 'Become a Seller' to get started. You'll need EU business registration, food safety certifications, and product information. Our team will guide you through the simple onboarding process."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and EU-specific payment methods through our secure payment partners Stripe and Mollie. All transactions are encrypted and secure."
  },
  {
    question: "Can I return products?",
    answer: "Due to the nature of food products, returns are handled on a case-by-case basis. If you receive damaged or incorrect items, please contact us within 48 hours with photos. We follow EU consumer rights regulations including the 14-day return window for non-perishable items."
  },
  {
    question: "How are products packaged?",
    answer: "All products are carefully packaged by sellers using food-safe materials. We encourage eco-friendly packaging and many of our sellers use sustainable, recyclable materials. Temperature-sensitive items are shipped with appropriate cooling elements."
  },
  {
    question: "Do you have subscription boxes?",
    answer: "Curated subscription boxes are coming soon! You'll be able to subscribe to monthly taste experiences featuring different countries or themes. Sign up for our newsletter to be notified when subscriptions launch."
  },
  {
    question: "What about customs and duties?",
    answer: "Since we operate within the EU single market, there are no customs duties or extra paperwork for shipments between EU countries. Prices shown include applicable VAT."
  },
  {
    question: "Can businesses order in bulk?",
    answer: "Yes! We're developing a B2B tier for restaurants, cafés, and specialty stores. For wholesale inquiries, please contact us through our Contact page selecting 'Wholesale Partnership'."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email. You can use this to monitor your delivery in real-time through your carrier's website."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-navy/80">
            Everything you need to know about EU Delicacies
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex justify-between items-center hover:bg-cream/50 transition-colors"
              >
                <span className="font-semibold text-navy text-left pr-4">
                  {faq.question}
                </span>
                <span className="text-2xl text-olive flex-shrink-0">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-navy/80 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-olive/5 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">
            Still have questions?
          </h2>
          <p className="text-navy/80 mb-6">
            Can't find what you're looking for? We're here to help!
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

