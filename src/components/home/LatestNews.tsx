import Link from "next/link";
import { Newspaper } from "lucide-react";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  publishedAt: Date | null;
  createdAt: Date;
}

interface LatestNewsProps {
  news: NewsItem[];
}

const categoryStyles: Record<string, string> = {
  行业动态: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60",
  政策法规: "bg-red-50 text-red-700 ring-1 ring-red-200/60",
  市场分析: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60",
  产地信息: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60",
  种植技术: "bg-purple-50 text-purple-700 ring-1 ring-purple-200/60",
};

const defaultCategoryStyle = "bg-gray-50 text-gray-600 ring-1 ring-gray-200/60";

function formatDate(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function LatestNews({ news }: LatestNewsProps) {
  if (news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-gray-400">
        <Newspaper className="h-10 w-10 mb-3 stroke-[1.2]" />
        <p className="text-sm font-medium">暂无资讯</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-100/80">
      {news.map((item) => (
        <li key={item.id}>
          <Link
            href={`/news/${item.id}`}
            className="flex items-center justify-between gap-3 -mx-3 px-3 py-3 rounded-lg transition-all duration-200 hover:bg-primary-50/60 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`shrink-0 text-[11px] leading-tight px-2 py-0.5 rounded-full font-medium tracking-wide ${categoryStyles[item.category] ?? defaultCategoryStyle}`}
              >
                {item.category}
              </span>
              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors duration-200 truncate">
                {item.title}
              </span>
            </div>
            <time className="shrink-0 text-xs text-gray-400 tabular-nums">
              {formatDate(item.publishedAt ?? item.createdAt)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
