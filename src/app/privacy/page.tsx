export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-navy/80">
            Last updated: October 12, 2025
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg">
        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Introduction</h2>
          <p className="text-navy/80 leading-relaxed">
            EU Delicacies ("we," "our," or "us") respects your privacy and is committed to protecting 
            your personal data. This privacy policy explains how we collect, use, and safeguard your 
            information when you visit our website and use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">GDPR Compliance</h2>
          <p className="text-navy/80 leading-relaxed mb-4">
            We comply with the General Data Protection Regulation (GDPR) and other EU data protection laws. 
            As an EU-based platform, we ensure your data is processed lawfully, transparently, and securely.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Information We Collect</h2>
          <div className="space-y-4 text-navy/80">
            <div>
              <h3 className="font-semibold text-navy mb-2">Personal Information:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Name and contact details</li>
                <li>Billing and shipping addresses</li>
                <li>Email address and phone number</li>
                <li>Payment information (processed securely through Stripe/Mollie)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-navy mb-2">Usage Data:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Browsing behavior and preferences</li>
                <li>Device and browser information</li>
                <li>IP address and location data</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-2 text-navy/80">
            <li>Processing and fulfilling your orders</li>
            <li>Communicating about your purchases and account</li>
            <li>Improving our website and services</li>
            <li>Sending marketing communications (with your consent)</li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Your Rights</h2>
          <p className="text-navy/80 mb-4">Under GDPR, you have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-navy/80">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Data Security</h2>
          <p className="text-navy/80 leading-relaxed">
            We implement appropriate technical and organizational measures to protect your data against 
            unauthorized access, alteration, disclosure, or destruction. Payment information is encrypted 
            and processed through secure, PCI-compliant payment providers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">Contact Us</h2>
          <p className="text-navy/80 leading-relaxed">
            For privacy-related questions or to exercise your rights, contact us at: 
            <a href="mailto:privacy@eudelicacies.eu" className="text-terracotta hover:underline ml-1">
              privacy@eudelicacies.eu
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

