import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-navy text-cream mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">EU Delicacies</h3>
            <p className="text-sm text-cream/80 mb-4">
              Connecting people across Europe through authentic flavours.
            </p>
            <div className="flex gap-4 text-2xl">
              <a href="#" className="hover:text-gold transition-colors" aria-label="Instagram">📷</a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="Facebook">📘</a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="Twitter">🐦</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link href="/shop" className="hover:text-gold transition-colors">All Products</Link></li>
              <li><Link href="/countries" className="hover:text-gold transition-colors">Countries</Link></li>
              <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-gold transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link href="/category/cheese" className="hover:text-gold transition-colors">Cheeses & Dairy</Link></li>
              <li><Link href="/category/beverages" className="hover:text-gold transition-colors">Wines & Spirits</Link></li>
              <li><Link href="/category/oils" className="hover:text-gold transition-colors">Preserves & Oils</Link></li>
              <li><Link href="/category/meats" className="hover:text-gold transition-colors">Meats & Seafood</Link></li>
              <li><Link href="/category/bakery" className="hover:text-gold transition-colors">Sweets & Bakery</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Countries</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link href="/countries/france" className="hover:text-gold transition-colors">🇫🇷 France</Link></li>
              <li><Link href="/countries/italy" className="hover:text-gold transition-colors">🇮🇹 Italy</Link></li>
              <li><Link href="/countries/netherlands" className="hover:text-gold transition-colors">🇳🇱 Netherlands</Link></li>
              <li><Link href="/countries/germany" className="hover:text-gold transition-colors">🇩🇪 Germany</Link></li>
              <li><Link href="/countries/belgium" className="hover:text-gold transition-colors">🇧🇪 Belgium</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cream/20 mt-8 pt-8 text-center text-sm text-cream/60">
          <p>© 2025 EU Delicacies. Celebrating Europe's shared culinary heritage.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/shipping" className="hover:text-gold transition-colors">Shipping Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

