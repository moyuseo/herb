import Link from "next/link";
import { MapPin, Tag } from "lucide-react";

interface HerbCardProps {
  herb: {
    id: number;
    name: string;
    aliases: string | null;
    category: string;
    origin: string | null;
    imageUrl: string | null;
  };
}

export default function HerbCard({ herb }: HerbCardProps) {
  return (
    <Link
      href={`/herbs/${herb.id}`}
      className="card-hover group block rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
          {herb.name}
        </h3>
        <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Tag className="h-3 w-3" />
          {herb.category}
        </span>
      </div>

      {herb.aliases && (
        <p className="mt-3 flex items-center gap-1.5 text-sm text-gray-400">
          <span className="text-gray-300">别名：</span>
          <span className="text-gray-500">{herb.aliases}</span>
        </p>
      )}

      {herb.origin && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-primary/40 shrink-0" />
          <span>{herb.origin}</span>
        </p>
      )}
    </Link>
  );
}
