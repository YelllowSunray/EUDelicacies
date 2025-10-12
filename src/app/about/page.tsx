export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6">
            Our Story
          </h1>
          <p className="text-xl text-navy/80 leading-relaxed">
            Celebrating Europe's shared culinary heritage through authentic flavours and artisan producers.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="font-serif text-4xl font-bold text-navy mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-navy/80 leading-relaxed mb-6">
            EU Delicacies connects people across Europe through authentic flavours. We believe that food 
            is more than sustenance — it's a celebration of culture, tradition, and shared heritage.
          </p>
          <p className="text-lg text-navy/80 leading-relaxed mb-6">
            Our platform makes it simple to discover and import delicacies from neighbouring EU countries, 
            whether you're a food lover ordering for yourself or a business sourcing regional goods. 
            It's more than just a marketplace — it's a bridge between cultures.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-olive/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-navy mb-12 text-center">
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-serif text-2xl font-bold text-navy mb-3">
                Authenticity
              </h3>
              <p className="text-navy/80">
                Only verified local producers and genuine regional goods. Every product tells the story 
                of its origin, maker, and tradition.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-serif text-2xl font-bold text-navy mb-3">
                Accessibility
              </h3>
              <p className="text-navy/80">
                Making cross-border food discovery easy, legal, and delightful. From browsing to delivery, 
                we handle the complexity so you can enjoy the experience.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="font-serif text-2xl font-bold text-navy mb-3">
                Sustainability
              </h3>
              <p className="text-navy/80">
                Promoting small-batch production, low-waste practices, and eco-friendly packaging. 
                We support producers who care about the planet.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md">
              <div className="text-4xl mb-4">🇪🇺</div>
              <h3 className="font-serif text-2xl font-bold text-navy mb-3">
                Unity in Diversity
              </h3>
              <p className="text-navy/80">
                Celebrating what makes each European culture unique while recognizing our shared 
                culinary heritage. Food unites us all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="font-serif text-4xl font-bold text-navy mb-12 text-center">
          Who We Serve
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="font-serif text-xl font-bold text-navy mb-3">
              Food Enthusiasts
            </h3>
            <p className="text-navy/70">
              Travelers, expats, and culinary explorers who love authentic local foods and want 
              to taste their neighbours' traditions.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="font-serif text-xl font-bold text-navy mb-3">
              Small Businesses
            </h3>
            <p className="text-navy/70">
              Restaurants, cafés, and delicatessens sourcing premium regional ingredients 
              for their customers.
            </p>
          </div>

          <div className="text-center">
            <div className="text-5xl mb-4">👨‍🌾</div>
            <h3 className="font-serif text-xl font-bold text-navy mb-3">
              Artisan Producers
            </h3>
            <p className="text-navy/70">
              Family-run farms and specialty makers who want to reach new audiences across 
              the EU without complex logistics.
            </p>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-navy text-cream py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-4xl font-bold mb-6">
            Our Vision
          </h2>
          <p className="text-xl leading-relaxed">
            We envision a Europe where borders don't limit taste — where a food lover in Amsterdam 
            can easily enjoy Sicilian olive oil, where a Polish student in Paris can order honey 
            from home, and where small producers can thrive by sharing their craft across nations.
          </p>
          <p className="text-xl mt-6 text-gold">
            "Taste your neighbours' traditions."
          </p>
        </div>
      </section>
    </div>
  );
}

