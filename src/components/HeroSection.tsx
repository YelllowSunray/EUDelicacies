import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-olive/10 via-cream to-terracotta/10 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-navy mb-6">
            Taste the Heart of Europe
          </h1>
          <p className="text-xl md:text-2xl text-navy/80 mb-8 leading-relaxed">
            Discover authentic regional delicacies from across the EU. From Alpine cheeses to Mediterranean oils — explore flavours you can trust.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/countries" 
              className="px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-colors font-semibold text-lg"
            >
              Explore Countries
            </Link>
            <Link 
              href="/about" 
              className="px-8 py-4 bg-white text-navy border-2 border-navy rounded-full hover:bg-navy hover:text-white transition-colors font-semibold text-lg"
            >
              Our Story
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <Link 
            href="/category/cheese"
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-3xl mb-2">🧀</div>
            <p className="font-semibold text-navy">Artisan Cheeses</p>
          </Link>
          <Link 
            href="/category/beverages"
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-3xl mb-2">🍷</div>
            <p className="font-semibold text-navy">Regional Wines</p>
          </Link>
          <Link 
            href="/category/bakery"
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-3xl mb-2">🥖</div>
            <p className="font-semibold text-navy">Fresh Bakery</p>
          </Link>
          <Link 
            href="/category/oils"
            className="bg-white/50 backdrop-blur-sm rounded-lg p-6 hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-3xl mb-2">🫒</div>
            <p className="font-semibold text-navy">Premium Oils</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

