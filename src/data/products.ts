export interface Product {
  id: string;
  name: string;
  country: string;
  countryId: string;
  region: string;
  category: string;
  description: string;
  story: string;
  price: number;
  stock: number;
  rating: number;
  shelfLife: string;
  pairWith: string[];
  tags: string[];
  seller: string;
}

export const products: Product[] = [
  // FRANCE
  {
    id: "champagne-reims",
    name: "Champagne de Reims",
    country: "France",
    countryId: "france",
    region: "Reims",
    category: "Beverages",
    description: "Authentic sparkling wine from Reims, aged in limestone caves.",
    story: "Crafted by a family-owned champagne house in the heart of Champagne region since 1875. Aged for 36 months in natural limestone cellars, this elegant brut offers notes of green apple, brioche, and a hint of almond.",
    price: 45.90,
    stock: 28,
    rating: 4.8,
    shelfLife: "5 years",
    pairWith: ["Oysters", "Smoked salmon", "Soft cheeses"],
    tags: ["Sparkling", "Premium", "Family Estate"],
    seller: "Maison Dubois Champagne"
  },
  {
    id: "brie-meaux",
    name: "Brie de Meaux",
    country: "France",
    countryId: "france",
    region: "Île-de-France",
    category: "Cheese",
    description: "Soft cow's milk cheese with nutty aroma and creamy texture.",
    story: "Known as the 'King of Cheeses' since the Congress of Vienna in 1815. This AOC-protected Brie is made from raw cow's milk and aged for 6-8 weeks, developing a bloomy white rind and a rich, buttery interior.",
    price: 12.50,
    stock: 45,
    rating: 4.9,
    shelfLife: "3 weeks",
    pairWith: ["Fresh baguette", "Honey", "Grapes", "Champagne"],
    tags: ["AOC Protected", "Raw Milk", "Artisan"],
    seller: "Fromagerie Ganot"
  },
  {
    id: "duck-confit",
    name: "Duck Confit",
    country: "France",
    countryId: "france",
    region: "Gascony",
    category: "Gourmet Meals",
    description: "Traditional preserved duck leg from Gascony, rich and tender.",
    story: "A time-honored Gascon tradition where duck legs are salt-cured, then slowly cooked and preserved in their own fat. The result is impossibly tender meat with crispy skin when reheated — a cornerstone of French country cooking.",
    price: 18.90,
    stock: 32,
    rating: 4.7,
    shelfLife: "6 months",
    pairWith: ["Potatoes", "Green salad", "Red wine"],
    tags: ["Traditional", "Ready to Heat", "Gourmet"],
    seller: "Ferme du Sud-Ouest"
  },

  // ITALY
  {
    id: "sicilian-olive-oil",
    name: "Sicilian Extra Virgin Olive Oil",
    country: "Italy",
    countryId: "italy",
    region: "Sicily",
    category: "Oils",
    description: "Cold-pressed extra virgin oil, fruity and peppery.",
    story: "Produced from Nocellara del Belice olives grown on a family estate near Mount Etna. Hand-harvested and cold-pressed within 24 hours, this oil offers a perfect balance of fruity sweetness and peppery finish.",
    price: 16.50,
    stock: 67,
    rating: 4.9,
    shelfLife: "18 months",
    pairWith: ["Bread", "Salads", "Grilled vegetables", "Pasta"],
    tags: ["Organic", "Cold-Pressed", "Family Farm"],
    seller: "Oliveto Belice"
  },
  {
    id: "parma-prosciutto",
    name: "Prosciutto di Parma",
    country: "Italy",
    countryId: "italy",
    region: "Parma",
    category: "Meats",
    description: "Thinly sliced cured ham, aged for 18 months.",
    story: "Made exclusively in the hills around Parma, this DOP-protected prosciutto is crafted using only Italian pork, sea salt, and time. Aged for a minimum of 18 months, it develops a sweet, delicate flavor and melt-in-your-mouth texture.",
    price: 24.90,
    stock: 41,
    rating: 4.9,
    shelfLife: "4 months",
    pairWith: ["Melon", "Figs", "Mozzarella", "Grissini"],
    tags: ["DOP Protected", "18-Month Aged", "Premium"],
    seller: "Salumificio Emilia"
  },
  {
    id: "limoncello",
    name: "Limoncello di Amalfi",
    country: "Italy",
    countryId: "italy",
    region: "Amalfi Coast",
    category: "Beverages",
    description: "Lemon liqueur from Amalfi Coast, sweet and refreshing.",
    story: "Crafted from the famous Sfusato Amalfitano lemons, whose thick, fragrant peels are infused in pure alcohol before being blended with sugar syrup. Best served ice-cold after dinner as a digestif.",
    price: 19.90,
    stock: 53,
    rating: 4.6,
    shelfLife: "2 years",
    pairWith: ["Desserts", "Ice cream", "Cocktails"],
    tags: ["IGP Lemons", "Traditional Recipe", "Handcrafted"],
    seller: "Limoni della Costa"
  },

  // NETHERLANDS
  {
    id: "aged-gouda",
    name: "Aged Gouda Cheese",
    country: "Netherlands",
    countryId: "netherlands",
    region: "Gouda",
    category: "Cheese",
    description: "Semi-hard cheese with caramel notes, aged 12 months.",
    story: "This traditional Dutch cheese is made from cow's milk and aged for 12 months, developing crunchy protein crystals and deep, complex caramel flavors. A true taste of Dutch dairy craftsmanship.",
    price: 14.90,
    stock: 58,
    rating: 4.8,
    shelfLife: "2 months",
    pairWith: ["Apples", "Mustard", "Crackers", "Beer"],
    tags: ["12-Month Aged", "Traditional", "Award-Winning"],
    seller: "Kaasboerderij Van der Berg"
  },
  {
    id: "stroopwafels",
    name: "Dutch Stroopwafels",
    country: "Netherlands",
    countryId: "netherlands",
    region: "Gouda",
    category: "Snacks",
    description: "Thin waffle cookies with caramel syrup filling.",
    story: "Invented in Gouda in the 1780s, these iconic treats are made by pressing thin waffles filled with warm caramel syrup. Place one over your coffee cup to soften the caramel — the authentic Dutch way to enjoy them.",
    price: 8.90,
    stock: 92,
    rating: 4.7,
    shelfLife: "3 months",
    pairWith: ["Coffee", "Tea", "Hot chocolate"],
    tags: ["Traditional", "Artisan Bakery", "Authentic Recipe"],
    seller: "Bakkerij Gouda Origineel"
  },
  {
    id: "dutch-herring",
    name: "Dutch Herring (Hollandse Nieuwe)",
    country: "Netherlands",
    countryId: "netherlands",
    region: "North Sea",
    category: "Seafood",
    description: "Lightly salted raw herring, traditional Dutch street food.",
    story: "A Dutch tradition dating back centuries. The first catch of young herring each season is lightly salt-cured and eaten raw, typically with onions and pickles. An authentic taste of Dutch maritime culture.",
    price: 11.90,
    stock: 26,
    rating: 4.5,
    shelfLife: "2 weeks (frozen)",
    pairWith: ["Onions", "Pickles", "Rye bread", "Jenever"],
    tags: ["Seasonal", "Traditional", "Street Food"],
    seller: "Vishandel Noord"
  },

  // GERMANY
  {
    id: "black-forest-ham",
    name: "Black Forest Ham",
    country: "Germany",
    countryId: "germany",
    region: "Baden-Württemberg",
    category: "Meats",
    description: "Smoked cured ham from Baden-Württemberg.",
    story: "Authentic Schwarzwälder Schinken, protected by PGI status. This ham is dry-cured with salt and spices, then cold-smoked over fir and pine for several weeks, creating its distinctive flavor and dark exterior.",
    price: 22.50,
    stock: 37,
    rating: 4.8,
    shelfLife: "3 months",
    pairWith: ["Rye bread", "Cheese", "Pickles", "Mustard"],
    tags: ["PGI Protected", "Cold-Smoked", "Traditional"],
    seller: "Metzgerei Schwarzwald"
  },
  {
    id: "bavarian-pretzels",
    name: "Bavarian Pretzels",
    country: "Germany",
    countryId: "germany",
    region: "Bavaria",
    category: "Bakery",
    description: "Freshly baked Bavarian pretzels, soft interior and crisp crust.",
    story: "The iconic Bavarian Brezel, with its distinctive knot shape, is dipped in lye before baking to achieve its characteristic dark brown crust and unique flavor. Best enjoyed fresh with butter or mustard.",
    price: 4.90,
    stock: 120,
    rating: 4.6,
    shelfLife: "3 days",
    pairWith: ["Beer", "Butter", "Obatzda cheese", "Mustard"],
    tags: ["Fresh Daily", "Traditional Recipe", "Bakery"],
    seller: "Bäckerei München Tradition"
  },
  {
    id: "mosel-riesling",
    name: "Mosel Valley Riesling",
    country: "Germany",
    countryId: "germany",
    region: "Mosel Valley",
    category: "Beverages",
    description: "Aromatic white wine from Mosel Valley.",
    story: "Grown on steep slate slopes overlooking the Mosel River, these Riesling grapes develop intense aromatics and perfect acidity. This wine showcases notes of peach, apricot, and mineral undertones.",
    price: 21.90,
    stock: 44,
    rating: 4.7,
    shelfLife: "10+ years",
    pairWith: ["Fish", "Asian cuisine", "Spicy dishes", "Soft cheeses"],
    tags: ["Estate Bottled", "Sustainable", "Award-Winning"],
    seller: "Weingut Moseltraum"
  },

  // BELGIUM
  {
    id: "belgian-chocolate",
    name: "Belgian Dark Chocolate",
    country: "Belgium",
    countryId: "belgium",
    region: "Brussels",
    category: "Snacks",
    description: "Premium dark chocolate made by master chocolatiers.",
    story: "Crafted in Brussels using the finest cocoa beans and traditional Belgian chocolate-making techniques. This 70% dark chocolate offers rich, complex flavors with notes of red fruit and subtle sweetness.",
    price: 12.90,
    stock: 85,
    rating: 4.9,
    shelfLife: "12 months",
    pairWith: ["Coffee", "Red wine", "Berries"],
    tags: ["70% Cocoa", "Master Chocolatier", "Premium"],
    seller: "Chocolaterie Royale"
  },
  {
    id: "liege-waffles",
    name: "Liège Waffles",
    country: "Belgium",
    countryId: "belgium",
    region: "Liège",
    category: "Bakery",
    description: "Authentic Belgian waffles with pearl sugar.",
    story: "Unlike Brussels waffles, Liège waffles are made with a brioche-like dough studded with pearl sugar that caramelizes during baking. Invented in the 18th century, they're still made following traditional recipes.",
    price: 9.90,
    stock: 76,
    rating: 4.7,
    shelfLife: "1 week",
    pairWith: ["Coffee", "Chocolate sauce", "Whipped cream", "Fresh fruit"],
    tags: ["Traditional", "Pearl Sugar", "Artisan Bakery"],
    seller: "Gaufres de Liège Authentique"
  },
  {
    id: "belgian-beer-dubbel",
    name: "Belgian Abbey Dubbel",
    country: "Belgium",
    countryId: "belgium",
    region: "Flanders",
    category: "Beverages",
    description: "Rich abbey-style dark ale with complex malt flavors.",
    story: "Brewed in the tradition of Trappist monks, this Dubbel-style ale offers deep malt flavors with notes of dark fruit, caramel, and subtle spice. A perfect example of Belgium's world-renowned brewing heritage.",
    price: 5.90,
    stock: 156,
    rating: 4.8,
    shelfLife: "2 years",
    pairWith: ["Cheese", "Stews", "Roasted meats", "Chocolate"],
    tags: ["Abbey Style", "Traditional Brewing", "Belgian Beer"],
    seller: "Brasserie des Moines"
  }
];

export function getProductsByCountry(countryId: string): Product[] {
  return products.filter(product => product.countryId === countryId);
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

