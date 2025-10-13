import { Metadata } from "next";
import Script from "next/script";
import { generateMetadata as generateSEOMetadata, generateFAQStructuredData } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Frequently Asked Questions - EU Delicacies",
  description: "Find answers to common questions about ordering European delicacies, shipping, payments, returns, and more. Get help with your EU Delicacies marketplace experience.",
  keywords: [
    'european food faq',
    'delicacies shipping',
    'european marketplace help',
    'gourmet food delivery',
    'artisan food questions',
    'european delicacies support',
  ],
  type: 'website',
  url: '/faq',
});

const faqs = [
  {
    question: "What is EU Delicacies?",
    answer: "EU Delicacies is an online marketplace connecting food lovers with authentic European delicacies from local producers across 29+ European countries. We offer artisan cheeses, premium wines, traditional preserves, gourmet specialties, and more - all sourced directly from verified European producers."
  },
  {
    question: "Which countries do you deliver to?",
    answer: "We currently deliver across all European Union member states. Shipping times and costs vary by destination country. Most orders arrive within 3-7 business days depending on your location and the product's origin."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is shipped, you'll receive a confirmation email with a tracking number. You can also view your order status by logging into your account and visiting the 'My Orders' section in your dashboard."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as PayPal and bank transfers for orders within the EU. All transactions are secure and encrypted."
  },
  {
    question: "Are all products authentic and verified?",
    answer: "Yes! Every seller on our platform is verified, and all products are sourced directly from local European producers. We ensure authenticity, quality, and traditional production methods for all delicacies on our marketplace."
  },
  {
    question: "What is your return policy?",
    answer: "Due to the perishable nature of food products, we can only accept returns for items that arrive damaged or spoiled. Please contact our customer service within 48 hours of delivery with photos of the issue, and we'll process a refund or replacement immediately."
  },
  {
    question: "How are products packaged for shipping?",
    answer: "All products are carefully packaged by our sellers using food-safe materials and temperature-controlled packaging when necessary. We ensure your delicacies arrive fresh and in perfect condition."
  },
  {
    question: "Can I become a seller on EU Delicacies?",
    answer: "Absolutely! If you're a European food producer or artisan, you can apply to become a seller. Simply create an account, upgrade to a seller account, and start listing your authentic products. We review all seller applications to maintain our quality standards."
  },
  {
    question: "Do you offer bulk or wholesale ordering?",
    answer: "Yes, many of our sellers offer bulk pricing for larger orders. Please contact the seller directly through their product page, or reach out to our customer service team for assistance with wholesale inquiries."
  },
  {
    question: "How do I contact customer support?",
    answer: "You can reach our customer service team at eudelicacies@gmail.com. We typically respond within 24 hours during business days. For urgent matters regarding your order, please mention your order number in the subject line."
  },
  {
    question: "Are there any discounts or promotions available?",
    answer: "Yes! We regularly offer promotions and discounts. Sign up for our newsletter to receive exclusive offers. Additionally, you can earn a 10% discount code by leaving a review after your purchase."
  },
  {
    question: "How fresh are the products?",
    answer: "All products are prepared and shipped fresh by our sellers. Each product listing includes information about shelf life and storage recommendations. We work only with producers who maintain the highest quality standards."
  },
];

export default function FAQPage() {
  const faqStructuredData = generateFAQStructuredData(faqs);

  return (
    <div>
      {/* FAQ Structured Data for rich snippets */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-cream/30 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-olive/10 to-terracotta/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif text-5xl font-bold text-navy mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-navy/70">
              Everything you need to know about EU Delicacies
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-navy/10 p-6 hover:shadow-md transition-shadow"
              >
                <h2 className="font-serif text-2xl font-bold text-navy mb-3">
                  {faq.question}
                </h2>
                <p className="text-navy/70 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-gradient-to-r from-gold/10 to-terracotta/10 rounded-lg p-8">
            <h3 className="font-serif text-2xl font-bold text-navy mb-3">
              Still have questions?
            </h3>
            <p className="text-navy/70 mb-6">
              Our customer service team is here to help you with any inquiries.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
