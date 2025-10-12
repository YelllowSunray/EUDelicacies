export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy mb-6">
            Shipping Information
          </h1>
          <p className="text-xl text-navy/80">
            Fast, reliable delivery across the European Union
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          {/* Shipping Coverage */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
              🌍 EU-Wide Coverage
            </h2>
            <p className="text-navy/80 leading-relaxed mb-4">
              We ship to all 27 European Union member states. As part of the EU single market, 
              there are no customs duties or additional paperwork required for your orders.
            </p>
            <div className="bg-cream rounded-lg p-6">
              <p className="font-semibold text-navy mb-2">Countries we serve:</p>
              <p className="text-sm text-navy/80">
                Austria, Belgium, Bulgaria, Croatia, Cyprus, Czech Republic, Denmark, Estonia, 
                Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, 
                Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, 
                Spain, Sweden
              </p>
            </div>
          </section>

          {/* Delivery Times */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
              ⏱️ Delivery Times
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-navy mb-3">Standard Delivery</h3>
                <p className="text-terracotta text-2xl font-bold mb-2">3-7 business days</p>
                <p className="text-sm text-navy/70">
                  Most orders arrive within this timeframe. Exact timing depends on product 
                  origin and destination.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-navy mb-3">Express Delivery</h3>
                <p className="text-terracotta text-2xl font-bold mb-2">1-3 business days</p>
                <p className="text-sm text-navy/70">
                  Available for select products. Express shipping costs are calculated at checkout.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Costs */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
              💶 Shipping Costs
            </h2>
            <p className="text-navy/80 leading-relaxed mb-4">
              Shipping costs are calculated automatically based on:
            </p>
            <ul className="list-disc list-inside space-y-2 text-navy/80 mb-4">
              <li>Product weight and dimensions</li>
              <li>Shipping distance</li>
              <li>Delivery speed (standard or express)</li>
              <li>Special handling requirements (temperature-controlled, fragile, etc.)</li>
            </ul>
            <div className="bg-gold/10 border-l-4 border-gold p-4 rounded">
              <p className="font-semibold text-navy">
                💡 Free shipping on orders over €75 within the same country!
              </p>
            </div>
          </section>

          {/* Carriers */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
              📦 Our Shipping Partners
            </h2>
            <p className="text-navy/80 leading-relaxed mb-4">
              We work with trusted European logistics providers to ensure your products arrive 
              safely and on time:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="font-bold text-navy">DHL</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="font-bold text-navy">PostNL</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center">
                <p className="font-bold text-navy">DPD</p>
              </div>
            </div>
          </section>

          {/* Tracking */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
              🔍 Order Tracking
            </h2>
            <p className="text-navy/80 leading-relaxed mb-4">
              Once your order ships, you'll receive:
            </p>
            <ul className="list-disc list-inside space-y-2 text-navy/80">
              <li>Email confirmation with tracking number</li>
              <li>Real-time tracking link</li>
              <li>Estimated delivery date</li>
              <li>SMS notifications (optional)</li>
            </ul>
          </section>

          {/* Special Items */}
          <section className="mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
              🧊 Special Handling
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-navy mb-2">Temperature-Sensitive Products</h3>
                <p className="text-navy/80">
                  Items like cheese, seafood, and certain wines are shipped with cooling elements 
                  and insulated packaging to maintain freshness.
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-semibold text-navy mb-2">Fragile Items</h3>
                <p className="text-navy/80">
                  Glass bottles and delicate products receive extra protective packaging and 
                  "Fragile" handling instructions.
                </p>
              </div>
            </div>
          </section>

          {/* Issues */}
          <section>
            <h2 className="font-serif text-3xl font-bold text-navy mb-4">
              ⚠️ Delivery Issues
            </h2>
            <p className="text-navy/80 leading-relaxed mb-4">
              If your order arrives damaged, incorrect, or doesn't arrive at all:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-navy/80 mb-4">
              <li>Contact us within 48 hours with your order number and photos (if applicable)</li>
              <li>We'll investigate with the carrier</li>
              <li>You'll receive a replacement or full refund</li>
            </ol>
            <p className="text-navy/80">
              Your satisfaction is our priority. We stand behind every product we deliver.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

