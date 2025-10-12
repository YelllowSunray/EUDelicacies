export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-navy/80">
            Last updated: October 12, 2025
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Agreement to Terms</h2>
          <p className="text-navy/80 leading-relaxed">
            By accessing and using EU Delicacies, you agree to be bound by these Terms of Service 
            and all applicable laws and regulations. If you do not agree with any of these terms, 
            you are prohibited from using this site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Use of Service</h2>
          <div className="space-y-4 text-navy/80">
            <p className="leading-relaxed">
              EU Delicacies is a marketplace connecting buyers with artisan food producers across the EU. 
              You may use our service for lawful purposes only.
            </p>
            <p className="font-semibold text-navy">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful code or malware</li>
              <li>Attempt unauthorized access to our systems</li>
              <li>Use the service for fraudulent purposes</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Product Information</h2>
          <p className="text-navy/80 leading-relaxed">
            We strive to provide accurate product descriptions, but we do not warrant that descriptions 
            are error-free or complete. Products are subject to availability, and we reserve the right 
            to discontinue products at any time.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Pricing and Payment</h2>
          <ul className="list-disc list-inside space-y-2 text-navy/80">
            <li>All prices are in Euros (€) and include applicable VAT</li>
            <li>Prices are subject to change without notice</li>
            <li>Payment is processed securely through Stripe or Mollie</li>
            <li>We reserve the right to refuse or cancel orders</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Returns and Refunds</h2>
          <p className="text-navy/80 leading-relaxed mb-4">
            In accordance with EU consumer rights:
          </p>
          <ul className="list-disc list-inside space-y-2 text-navy/80">
            <li>You have a 14-day right of withdrawal for non-perishable items</li>
            <li>Perishable food items cannot be returned unless damaged or defective</li>
            <li>Contact us within 48 hours if products arrive damaged</li>
            <li>Refunds are processed within 14 days of approved returns</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Limitation of Liability</h2>
          <p className="text-navy/80 leading-relaxed">
            EU Delicacies and its suppliers shall not be liable for any indirect, incidental, special, 
            or consequential damages arising from your use of the service. Our total liability shall not 
            exceed the amount you paid for the product in question.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Governing Law</h2>
          <p className="text-navy/80 leading-relaxed">
            These terms are governed by and construed in accordance with the laws of the European Union 
            and the Kingdom of Belgium, without regard to conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Changes to Terms</h2>
          <p className="text-navy/80 leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be effective immediately 
            upon posting. Your continued use of the service constitutes acceptance of modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Contact Information</h2>
          <p className="text-navy/80 leading-relaxed">
            For questions about these Terms of Service, contact us at: 
            <a href="mailto:legal@eudelicacies.eu" className="text-terracotta hover:underline ml-1">
              legal@eudelicacies.eu
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

