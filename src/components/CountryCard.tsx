import Link from "next/link";

interface CountryCardProps {
  country: {
    id: string;
    name: string;
    flag: string;
    tagline: string;
    specialties: string[];
  };
}

export default function CountryCard({ country }: CountryCardProps) {
  return (
    <Link href={`/countries/${country.id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer">
        <div className="bg-gradient-to-br from-olive/20 to-terracotta/20 h-48 flex items-center justify-center">
          <div className="text-8xl">{country.flag}</div>
        </div>
        <div className="p-6">
          <h3 className="font-serif text-2xl font-bold text-navy mb-2">
            {country.name}
          </h3>
          <p className="text-olive mb-4 italic">{country.tagline}</p>
          <div className="flex flex-wrap gap-2">
            {country.specialties.slice(0, 3).map((specialty, idx) => (
              <span 
                key={idx}
                className="px-3 py-1 bg-cream text-navy text-sm rounded-full border border-olive/30"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

