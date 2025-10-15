import { Metadata } from "next";
import Script from "next/script";
import { generateMetadata as generateSEOMetadata, SEO_KEYWORDS, generateEnhancedOrganizationStructuredData } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "About EU Delicacies - Authentic European Food Marketplace",
  description: "Learn about EU Delicacies, Europe's premier marketplace for authentic delicacies. Discover our mission to connect food lovers with verified artisan producers across 29+ European countries.",
  keywords: [
    ...SEO_KEYWORDS.homepage,
    'about eu delicacies',
    'european food marketplace',
    'authentic european producers',
    'artisan food verification',
    'european culinary heritage',
    'sustainable food sourcing',
    'traditional food preservation',
    'european food culture',
    'gourmet food platform',
    'artisan food network',
  ],
  type: 'website',
  url: '/about',
});

export default function AboutPage() {
  // Generate structured data for the About page
  const aboutPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About EU Delicacies',
    description: 'Learn about EU Delicacies, Europe\'s premier marketplace for authentic delicacies from verified artisan producers.',
    url: 'https://www.delicacies.eu/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'EU Delicacies',
      description: 'Premium European delicacies marketplace connecting food lovers with authentic artisan producers across Europe.',
      foundingDate: '2024',
      mission: 'To preserve and celebrate European culinary heritage by connecting passionate food lovers with authentic artisan producers.',
      values: [
        'Authenticity and quality',
        'Supporting local artisans',
        'Sustainable practices',
        'Cultural preservation',
        'Customer satisfaction'
      ],
    },
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Structured Data */}
      <Script
        id="about-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageStructuredData),
        }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-olive to-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl font-bold mb-6">
              Taste the Heart of Europe
            </h1>
            <p className="text-xl text-white/90 mb-8">
              We're passionate about connecting food lovers with authentic European delicacies, 
              preserving culinary traditions, and supporting artisan producers across the continent.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl font-bold text-navy mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              EU Delicacies was founded with a simple yet profound mission: to preserve and celebrate 
              European culinary heritage by creating a direct connection between passionate food lovers 
              and authentic artisan producers.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              We believe that every product tells a story – of tradition, craftsmanship, and the 
              passionate people who dedicate their lives to creating exceptional food. Our platform 
              serves as a bridge, bringing these stories and flavors directly to your table.
            </p>
            <p className="text-lg text-gray-700">
              By supporting small-scale producers and traditional methods, we're not just selling food; 
              we're preserving culture, supporting sustainable practices, and ensuring that future 
              generations can experience the authentic tastes of Europe.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="font-serif text-2xl font-bold text-navy mb-4">Our Values</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-terracotta text-xl mr-3">✓</span>
                <div>
                  <strong className="text-navy">Authenticity & Quality</strong>
                  <p className="text-gray-600">Every product is verified for authenticity and meets our strict quality standards.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-terracotta text-xl mr-3">✓</span>
                <div>
                  <strong className="text-navy">Supporting Artisans</strong>
                  <p className="text-gray-600">We prioritize small-scale producers and traditional craftsmanship methods.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-terracotta text-xl mr-3">✓</span>
                <div>
                  <strong className="text-navy">Sustainability</strong>
                  <p className="text-gray-600">We promote eco-friendly practices and responsible sourcing.</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-terracotta text-xl mr-3">✓</span>
                <div>
                  <strong className="text-navy">Cultural Preservation</strong>
                  <p className="text-gray-600">Protecting traditional recipes and production methods for future generations.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-olive/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-navy text-center mb-12">
            Our Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-terracotta mb-2">29+</div>
              <div className="text-lg font-medium text-navy mb-1">European Countries</div>
              <div className="text-gray-600">Represented on our platform</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-terracotta mb-2">500+</div>
              <div className="text-lg font-medium text-navy mb-1">Verified Producers</div>
              <div className="text-gray-600">Artisan partners across Europe</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-terracotta mb-2">2,000+</div>
              <div className="text-lg font-medium text-navy mb-1">Authentic Products</div>
              <div className="text-gray-600">Carefully curated delicacies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-terracotta mb-2">50,000+</div>
              <div className="text-lg font-medium text-navy mb-1">Happy Customers</div>
              <div className="text-gray-600">Across the European Union</div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif text-4xl font-bold text-navy text-center mb-12">
          How We Ensure Authenticity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-navy mb-3">Rigorous Verification</h3>
            <p className="text-gray-700">
              Every producer undergoes a comprehensive verification process, including on-site visits, 
              documentation review, and product testing to ensure authenticity and quality.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-navy mb-3">Direct Partnerships</h3>
            <p className="text-gray-700">
              We work directly with producers, eliminating middlemen to ensure fair prices for artisans 
              and authentic products for customers, while building long-term relationships.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-navy mb-3">Continuous Monitoring</h3>
            <p className="text-gray-700">
              Our quality assurance team continuously monitors products and processes, conducting 
              regular reviews and customer feedback analysis to maintain our high standards.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-navy text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍💼</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-navy mb-2">Marco Rossi</h3>
              <p className="text-terracotta font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-700">
                Former chef with 15 years of experience in European cuisine, passionate about 
                preserving traditional food culture and supporting local artisans.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👩‍🔬</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-navy mb-2">Dr. Elena Schmidt</h3>
              <p className="text-terracotta font-medium mb-2">Head of Quality Assurance</p>
              <p className="text-gray-700">
                Food scientist with expertise in traditional production methods and quality control, 
                ensuring every product meets our authenticity standards.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍🌾</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-navy mb-2">Jean-Pierre Dubois</h3>
              <p className="text-terracotta font-medium mb-2">Producer Relations Manager</p>
              <p className="text-gray-700">
                Third-generation farmer turned business developer, specializing in building 
                relationships with artisan producers across Europe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="bg-olive/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-bold text-navy mb-6">
              Our Commitment to Sustainability
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              We believe that authentic food production and environmental responsibility go hand in hand. 
              Our sustainability initiatives support both the planet and the communities we serve.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-serif text-xl font-bold text-navy mb-3">🌱 Eco-Friendly Packaging</h3>
                <p className="text-gray-700">
                  We use biodegradable and recyclable packaging materials, minimizing environmental 
                  impact while ensuring product freshness and quality during delivery.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-serif text-xl font-bold text-navy mb-3">🚚 Carbon-Neutral Shipping</h3>
                <p className="text-gray-700">
                  Our logistics network is optimized for efficiency, and we offset carbon emissions 
                  from shipping through verified environmental projects across Europe.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-serif text-xl font-bold text-navy mb-3">🤝 Fair Trade Practices</h3>
                <p className="text-gray-700">
                  We ensure fair compensation for producers and promote ethical business practices 
                  that support local communities and traditional livelihoods.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <h3 className="font-serif text-xl font-bold text-navy mb-3">🔄 Circular Economy</h3>
                <p className="text-gray-700">
                  We support producers who practice sustainable agriculture, waste reduction, 
                  and circular economy principles in their operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-serif text-4xl font-bold text-navy mb-6">
          Join Our European Food Journey
        </h2>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Whether you're a food lover seeking authentic flavors or an artisan producer wanting to share 
          your craft with the world, we invite you to be part of our community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/shop" 
            className="inline-block px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold"
          >
            Explore Products
          </a>
          <a 
            href="/contact" 
            className="inline-block px-8 py-4 bg-olive text-white rounded-full hover:bg-olive/90 transition-colors font-semibold"
          >
            Become a Partner
          </a>
        </div>
      </section>
    </div>
  );
}