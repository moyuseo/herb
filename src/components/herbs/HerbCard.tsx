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
      className="group block p-5 rounded-xl border border-gray-200 bg-white hover:border-primary hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
          {herb.name}
        </h3>
        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 text-primary text-xs font-medium">
          <Tag className="h-3 w-3" />
          {herb.category}
        </span>
      </div>

      {herb.aliases && (
        <p className="mt-2 text-sm text-gray-500">
          <span className="text-gray-400">别名：</span>
          {herb.aliases}
        </p>
      )}

      {herb.origin && (
        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          {herb.origin}
        </p>
      )}
    </Link>
  );
}
