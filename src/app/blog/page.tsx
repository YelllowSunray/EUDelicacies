import { Metadata } from "next";
import Link from "next/link";
import { generateMetadata as generateSEOMetadata, SEO_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "European Food Blog - Recipes, Stories & Culinary Traditions",
  description: "Discover authentic European recipes, culinary stories, and food traditions from across 29+ countries. Learn about artisan producers, traditional cooking methods, and regional specialties.",
  keywords: [
    ...SEO_KEYWORDS.homepage,
    'european recipes',
    'traditional cooking',
    'culinary traditions europe',
    'european food blog',
    'artisan food stories',
    'regional european cuisine',
    'authentic european recipes',
    'european cooking techniques',
    'food culture europe',
    'traditional european dishes',
    'european gastronomy',
  ],
  type: 'website',
  url: '/blog',
});

// Sample blog posts data (in a real app, this would come from a CMS or database)
const blogPosts = [
  {
    id: 'authentic-italian-pasta-traditions',
    title: 'The Art of Authentic Italian Pasta: From Grain to Plate',
    excerpt: 'Discover the centuries-old traditions behind Italy\'s most beloved pasta varieties, from the wheat fields of Puglia to the artisan workshops of Emilia-Romagna.',
    image: '/blog/italian-pasta.jpg',
    category: 'Traditions',
    country: 'Italy',
    readTime: '8 min read',
    publishedAt: '2024-10-10',
    tags: ['pasta', 'italy', 'traditions', 'artisan'],
  },
  {
    id: 'french-cheese-aging-secrets',
    title: 'French Cheese Aging: The Science Behind Perfect Flavor',
    excerpt: 'Explore the meticulous art of French cheese aging, where time, temperature, and tradition create some of the world\'s most complex flavors.',
    image: '/blog/french-cheese.jpg',
    category: 'Craftsmanship',
    country: 'France',
    readTime: '6 min read',
    publishedAt: '2024-10-08',
    tags: ['cheese', 'france', 'aging', 'craftsmanship'],
  },
  {
    id: 'spanish-olive-oil-harvest',
    title: 'Spanish Olive Oil: From Ancient Groves to Modern Tables',
    excerpt: 'Journey through Spain\'s olive groves to understand how traditional harvesting methods produce some of the world\'s finest extra virgin olive oils.',
    image: '/blog/spanish-olive-oil.jpg',
    category: 'Production',
    country: 'Spain',
    readTime: '7 min read',
    publishedAt: '2024-10-05',
    tags: ['olive oil', 'spain', 'harvest', 'production'],
  },
  {
    id: 'german-bread-baking-heritage',
    title: 'German Bread Heritage: 300+ Varieties of Tradition',
    excerpt: 'Discover why Germany has over 300 types of bread and how centuries of baking tradition continue to influence European cuisine today.',
    image: '/blog/german-bread.jpg',
    category: 'Heritage',
    country: 'Germany',
    readTime: '9 min read',
    publishedAt: '2024-10-03',
    tags: ['bread', 'germany', 'heritage', 'baking'],
  },
  {
    id: 'greek-honey-ancient-traditions',
    title: 'Greek Honey: Ancient Traditions in Modern Beekeeping',
    excerpt: 'Learn about Greece\'s 4,000-year honey tradition and how modern beekeepers preserve ancient methods while protecting native bee populations.',
    image: '/blog/greek-honey.jpg',
    category: 'Sustainability',
    country: 'Greece',
    readTime: '5 min read',
    publishedAt: '2024-10-01',
    tags: ['honey', 'greece', 'sustainability', 'beekeeping'],
  },
  {
    id: 'belgian-chocolate-craftsmanship',
    title: 'Belgian Chocolate Craftsmanship: The Art of Perfection',
    excerpt: 'Explore the meticulous craftsmanship behind Belgian chocolate, from bean selection to the final praline, and why Belgium sets the global standard.',
    image: '/blog/belgian-chocolate.jpg',
    category: 'Craftsmanship',
    country: 'Belgium',
    readTime: '6 min read',
    publishedAt: '2024-09-28',
    tags: ['chocolate', 'belgium', 'craftsmanship', 'artisan'],
  },
];

const categories = ['All', 'Traditions', 'Craftsmanship', 'Production', 'Heritage', 'Sustainability'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-olive to-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl font-bold mb-6">
            European Food Stories
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Discover the rich culinary heritage of Europe through authentic stories, traditional recipes, 
            and the passionate artisans who keep these traditions alive.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  📸 {post.country} Food Story
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>{post.country}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
                
                <h2 className="font-serif text-xl font-bold text-navy mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-700 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-olive/10 text-olive px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={`/blog/${post.id}`}
                  className="inline-flex items-center text-terracotta hover:text-terracotta/80 font-medium"
                >
                  Read Full Story
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="bg-olive/5 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-navy mb-4">
            Stay Updated with European Food Stories
          </h2>
          <p className="text-lg text-navy/70 mb-8">
            Get weekly stories about European culinary traditions, new product discoveries, and exclusive recipes from our artisan partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-olive"
            />
            <button className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-navy mb-6">
            Explore European Culinary Heritage
          </h2>
          <p className="text-gray-700 mb-6">
            Our European food blog celebrates the rich culinary traditions that have shaped the continent's gastronomy for centuries. 
            From the sun-drenched olive groves of Spain to the alpine cheese caves of Switzerland, we bring you authentic stories 
            from the artisans who preserve these time-honored traditions.
          </p>
          <p className="text-gray-700 mb-6">
            Discover traditional recipes passed down through generations, learn about sustainable farming practices that protect 
            Europe's biodiversity, and meet the passionate producers who craft exceptional delicacies using methods perfected over centuries.
          </p>
          <p className="text-gray-700">
            Whether you're a food enthusiast, professional chef, or simply curious about European culture, our blog offers insights 
            into the stories behind every product in our marketplace. Each article is carefully researched and written to honor 
            the heritage and craftsmanship of Europe's finest food artisans.
          </p>
        </div>
      </section>
    </div>
  );
}
