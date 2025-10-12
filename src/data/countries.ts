export interface Country {
  id: string;
  name: string;
  flag: string;
  tagline: string;
  description: string;
  specialties: string[];
  region: string;
}

export const countries: Country[] = [
  // Western Europe
  {
    id: "france",
    name: "France",
    flag: "🇫🇷",
    tagline: "The art of refined taste",
    description: "From the rolling vineyards of Bordeaux to the artisan cheese cellars of Normandy, France offers a culinary heritage unmatched in depth and sophistication. Every region tells its own delicious story.",
    specialties: ["Champagne", "Brie", "Bordeaux Wine", "Foie Gras", "Macarons", "Duck Confit"],
    region: "Western Europe"
  },
  {
    id: "belgium",
    name: "Belgium",
    flag: "🇧🇪",
    tagline: "Sweet sophistication",
    description: "Belgium may be small, but its culinary reputation is mighty. World-renowned for its chocolate, exceptional beers, crispy waffles, and delicate pralines — Belgium is a paradise for food lovers.",
    specialties: ["Belgian Chocolate", "Waffles", "Belgian Beer", "Speculoos", "Pralines", "Frites"],
    region: "Western Europe"
  },
  {
    id: "netherlands",
    name: "Netherlands",
    flag: "🇳🇱",
    tagline: "Honest & hearty flavours",
    description: "The Netherlands brings centuries of dairy mastery and maritime tradition. Famous for its golden Gouda, sweet stroopwafels, and herring prepared the Dutch way — simple, authentic, and delicious.",
    specialties: ["Gouda Cheese", "Stroopwafels", "Herring", "Jenever", "Drop", "Poffertjes"],
    region: "Western Europe"
  },
  {
    id: "ireland",
    name: "Ireland",
    flag: "🇮🇪",
    tagline: "Hearty traditions from the Emerald Isle",
    description: "Ireland's food culture reflects its pastoral heritage and maritime bounty. From rich Irish butter and farmhouse cheeses to world-class whiskey and fresh seafood, Irish products are honest, wholesome, and full of character.",
    specialties: ["Irish Whiskey", "Kerrygold Butter", "Smoked Salmon", "Cheddar", "Soda Bread", "Black Pudding"],
    region: "Western Europe"
  },
  {
    id: "luxembourg",
    name: "Luxembourg",
    flag: "🇱🇺",
    tagline: "Hidden gem of gourmet delights",
    description: "Luxembourg's cuisine blends French elegance with German heartiness. Known for its exceptional wines from the Moselle Valley and unique specialties like Judd mat Gaardebounen, this small nation offers big flavors.",
    specialties: ["Moselle Wine", "Smoked Pork", "Quetschentaart", "Gromperekichelcher", "Honey", "Ardennes Ham"],
    region: "Western Europe"
  },
  {
    id: "austria",
    name: "Austria",
    flag: "🇦🇹",
    tagline: "Alpine excellence & imperial elegance",
    description: "Austrian cuisine combines mountain tradition with Viennese refinement. From crispy Wiener Schnitzel to delicate Sachertorte, from alpine cheeses to aromatic pumpkin seed oil, Austria delights at every turn.",
    specialties: ["Sachertorte", "Pumpkin Seed Oil", "Alpine Cheese", "Apfelstrudel", "Mozartkugel", "Schnaps"],
    region: "Western Europe"
  },
  {
    id: "switzerland",
    name: "Switzerland",
    flag: "🇨🇭",
    tagline: "Mountain perfection on every plate",
    description: "Swiss culinary traditions are as precise as their watches. World-famous for fondue, raclette, and the finest chocolate, Switzerland's alpine products embody quality, purity, and centuries of artisan expertise.",
    specialties: ["Swiss Chocolate", "Gruyère Cheese", "Emmental", "Raclette", "Rösti", "Absinthe"],
    region: "Western Europe"
  },

  // Southern Europe
  {
    id: "italy",
    name: "Italy",
    flag: "🇮🇹",
    tagline: "Passion in every bite",
    description: "Italian cuisine is a celebration of simplicity and quality. From Sicilian olive groves to Tuscan vineyards, from Parma's prosciutto to Naples' mozzarella — Italy's regions offer distinct and unforgettable flavours.",
    specialties: ["Olive Oil", "Prosciutto", "Parmigiano", "Limoncello", "Balsamic Vinegar", "Pasta"],
    region: "Southern Europe"
  },
  {
    id: "spain",
    name: "Spain",
    flag: "🇪🇸",
    tagline: "Sun-soaked flavours & vibrant traditions",
    description: "Spain's culinary landscape is as diverse as its regions. From Iberian ham and Manchego cheese to saffron-infused paella rice and sherries from Jerez, Spanish products burst with Mediterranean sunshine and passion.",
    specialties: ["Jamón Ibérico", "Manchego Cheese", "Olive Oil", "Paella Rice", "Chorizo", "Sherry Wine"],
    region: "Southern Europe"
  },
  {
    id: "portugal",
    name: "Portugal",
    flag: "🇵🇹",
    tagline: "Atlantic treasures & timeless recipes",
    description: "Portugal's maritime heritage shines through its food. Famous for Port wine, salted cod, pastéis de nata, and golden olive oil, Portuguese cuisine combines tradition, quality, and the flavors of the Atlantic.",
    specialties: ["Port Wine", "Bacalhau", "Pastéis de Nata", "Olive Oil", "Vinho Verde", "Sardines"],
    region: "Southern Europe"
  },
  {
    id: "greece",
    name: "Greece",
    flag: "🇬🇷",
    tagline: "Ancient wisdom in every flavor",
    description: "Greek cuisine celebrates the Mediterranean diet in its purest form. From tangy feta and kalamata olives to golden honey and ouzo, Greek products carry millennia of tradition and the warmth of the Aegean sun.",
    specialties: ["Feta Cheese", "Kalamata Olives", "Olive Oil", "Greek Honey", "Ouzo", "Halva"],
    region: "Southern Europe"
  },
  {
    id: "croatia",
    name: "Croatia",
    flag: "🇭🇷",
    tagline: "Adriatic gems & Mediterranean soul",
    description: "Croatian cuisine blends Mediterranean freshness with Central European richness. From Istrian truffles and Pag cheese to dalmatian olive oil and lavender honey, Croatia offers undiscovered culinary treasures.",
    specialties: ["Pag Cheese", "Istrian Truffle", "Olive Oil", "Prosciutto", "Lavender Honey", "Rakija"],
    region: "Southern Europe"
  },
  {
    id: "malta",
    name: "Malta",
    flag: "🇲🇹",
    tagline: "Mediterranean crossroads of flavor",
    description: "Malta's cuisine reflects centuries of cultural exchange. From unique Gbejniet cheese and sun-dried tomatoes to honey rings and capers, Maltese products are infused with Mediterranean sunshine and tradition.",
    specialties: ["Gbejniet Cheese", "Capers", "Sun-dried Tomatoes", "Honey Rings", "Olive Oil", "Kunserva"],
    region: "Southern Europe"
  },

  // Central Europe
  {
    id: "germany",
    name: "Germany",
    flag: "🇩🇪",
    tagline: "Tradition meets craftsmanship",
    description: "German culinary traditions run deep, from the Black Forest's smoked hams to Bavaria's pretzels and the Mosel Valley's aromatic Riesling wines. Quality, precision, and rich flavours define German food culture.",
    specialties: ["Black Forest Ham", "Pretzels", "Riesling Wine", "Sauerkraut", "Lebkuchen", "Bratwurst"],
    region: "Central Europe"
  },
  {
    id: "poland",
    name: "Poland",
    flag: "🇵🇱",
    tagline: "Hearty soul food & artisan traditions",
    description: "Polish cuisine is built on generations of home cooking and artisan crafts. From smoked sausages and pierogi to honey vodka and pickles, Polish products offer comfort, flavor, and authenticity.",
    specialties: ["Kielbasa", "Pierogi", "Vodka", "Pickles", "Honey", "Oscypek Cheese"],
    region: "Central Europe"
  },
  {
    id: "czech-republic",
    name: "Czech Republic",
    flag: "🇨🇿",
    tagline: "Bohemian flavours & brewing mastery",
    description: "The Czech Republic is the birthplace of Pilsner beer and home to rich culinary traditions. From world-class beers to hearty sausages, spa wafers, and traditional spirits, Czech products are crafted with care.",
    specialties: ["Pilsner Beer", "Becherovka", "Spa Wafers", "Smoked Cheese", "Sausages", "Kolache"],
    region: "Central Europe"
  },
  {
    id: "hungary",
    name: "Hungary",
    flag: "🇭🇺",
    tagline: "Paprika passion & Magyar magic",
    description: "Hungarian cuisine is bold and flavorful, built on paprika, heritage recipes, and artisan craftsmanship. From world-famous salami and Tokaji wine to spicy pastes and fruit brandies, Hungary satisfies adventurous palates.",
    specialties: ["Hungarian Salami", "Paprika", "Tokaji Wine", "Goulash Paste", "Pick Sausage", "Pálinka"],
    region: "Central Europe"
  },
  {
    id: "slovakia",
    name: "Slovakia",
    flag: "🇸🇰",
    tagline: "Mountain heritage & rustic charm",
    description: "Slovak cuisine celebrates pastoral traditions and mountain life. From sheep cheese and smoked meats to juniper spirits and traditional pastries, Slovak products are authentic, rustic, and deeply rooted in nature.",
    specialties: ["Bryndza Cheese", "Slivovitz", "Smoked Meat", "Honey", "Juniper Spirit", "Lokše"],
    region: "Central Europe"
  },

  // Northern Europe
  {
    id: "sweden",
    name: "Sweden",
    flag: "🇸🇪",
    tagline: "Nordic purity & innovative traditions",
    description: "Swedish food culture balances tradition with innovation. From lingonberry preserves and crisp bread to artisan aquavit and gravlax, Swedish products embody Scandinavian simplicity, quality, and natural purity.",
    specialties: ["Lingonberry Jam", "Gravlax", "Aquavit", "Knäckebröd", "Cloudberry Jam", "Herring"],
    region: "Northern Europe"
  },
  {
    id: "denmark",
    name: "Denmark",
    flag: "🇩🇰",
    tagline: "Hygge in every bite",
    description: "Danish culinary traditions combine comfort with quality. From rich butter cookies and artisan cheeses to smoked fish and craft beer, Danish products reflect the cozy, contented spirit of hygge.",
    specialties: ["Danish Butter Cookies", "Blue Cheese", "Smoked Salmon", "Rye Bread", "Schnapps", "Remoulade"],
    region: "Northern Europe"
  },
  {
    id: "norway",
    name: "Norway",
    flag: "🇳🇴",
    tagline: "Fjord-fresh & mountain-pure",
    description: "Norwegian cuisine honors the bounty of the sea and mountains. From world-class salmon and brown cheese to cloudberries and aquavit, Norwegian products are pure, pristine, and full of Nordic character.",
    specialties: ["Smoked Salmon", "Brunost", "Cloudberries", "Aquavit", "Cod", "Lefse"],
    region: "Northern Europe"
  },
  {
    id: "finland",
    name: "Finland",
    flag: "🇫🇮",
    tagline: "Forest flavours & arctic magic",
    description: "Finnish cuisine draws on pristine forests and crystal lakes. From unique Leipäjuusto cheese and rye bread to wild berries and salmiakki, Finnish products capture the essence of the Nordic wilderness.",
    specialties: ["Leipäjuusto", "Rye Bread", "Salmiakki", "Cloudberry", "Karelian Pasty", "Arctic Berries"],
    region: "Northern Europe"
  },
  {
    id: "iceland",
    name: "Iceland",
    flag: "🇮🇸",
    tagline: "Fire & ice cuisine",
    description: "Icelandic food culture is shaped by volcanic landscapes and Atlantic waters. From unique skyr dairy and smoked lamb to black lava salt and brennivín spirit, Icelandic products are as dramatic as the land itself.",
    specialties: ["Skyr", "Smoked Lamb", "Lava Salt", "Brennivín", "Arctic Char", "Dried Fish"],
    region: "Northern Europe"
  },

  // Eastern Europe
  {
    id: "romania",
    name: "Romania",
    flag: "🇷🇴",
    tagline: "Carpathian treasures & rustic charm",
    description: "Romanian cuisine reflects the bounty of the Carpathian Mountains and Danube plains. From sheep cheese and sausages to plum brandy and honey, Romanian products are authentic, hearty, and full of tradition.",
    specialties: ["Telemea Cheese", "Mici Sausage", "Țuică", "Honey", "Zacusca", "Cozonac"],
    region: "Eastern Europe"
  },
  {
    id: "bulgaria",
    name: "Bulgaria",
    flag: "🇧🇬",
    tagline: "Rose valley richness & Thracian heritage",
    description: "Bulgaria offers unique culinary treasures, from tangy sirene cheese and kashkaval to rose products and rakia. Bulgarian products carry ancient Thracian traditions and the richness of fertile valleys.",
    specialties: ["Sirene Cheese", "Rose Products", "Rakia", "Lyutenitsa", "Kashkaval", "Bulgarian Yogurt"],
    region: "Eastern Europe"
  },
  {
    id: "estonia",
    name: "Estonia",
    flag: "🇪🇪",
    tagline: "Baltic heritage & forest bounty",
    description: "Estonian cuisine celebrates the gifts of forest and sea. From unique black bread and smoked sprats to wild berry preserves and Vana Tallinn liqueur, Estonian products are pure, traditional, and distinctively Nordic.",
    specialties: ["Black Bread", "Vana Tallinn", "Smoked Sprats", "Wild Berry Jam", "Honey", "Kama"],
    region: "Eastern Europe"
  },
  {
    id: "latvia",
    name: "Latvia",
    flag: "🇱🇻",
    tagline: "Baltic soul & natural purity",
    description: "Latvian food traditions honor nature's cycles and rural heritage. From caraway cheese and smoked fish to Riga Black Balsam and wild cranberries, Latvian products are honest, wholesome, and deeply rooted.",
    specialties: ["Caraway Cheese", "Black Balsam", "Smoked Fish", "Wild Cranberries", "Rye Bread", "Honey"],
    region: "Eastern Europe"
  },
  {
    id: "lithuania",
    name: "Lithuania",
    flag: "🇱🇹",
    tagline: "Amber land flavours",
    description: "Lithuanian cuisine reflects centuries of farming and foraging traditions. From curd cheese and smoked meats to sea buckthorn and honey spirits, Lithuanian products capture the spirit of the Baltic countryside.",
    specialties: ["Curd Cheese", "Smoked Meat", "Sea Buckthorn", "Midus", "Rye Bread", "Beetroot Soup"],
    region: "Eastern Europe"
  },
  {
    id: "slovenia",
    name: "Slovenia",
    flag: "🇸🇮",
    tagline: "Alpine-Mediterranean fusion",
    description: "Slovenia's cuisine bridges Alpine and Mediterranean worlds. From pumpkin seed oil and Karst prosciutto to honey and natural wines, Slovenian products showcase remarkable diversity in a small, beautiful country.",
    specialties: ["Pumpkin Seed Oil", "Karst Prosciutto", "Honey", "Potica", "Natural Wine", "Sea Salt"],
    region: "Eastern Europe"
  }
];

export function getCountryById(id: string): Country | undefined {
  return countries.find(country => country.id === id);
}

