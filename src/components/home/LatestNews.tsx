import Link from "next/link";

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

function formatDate(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function LatestNews({ news }: LatestNewsProps) {
  if (news.length === 0) {
    return <p className="text-gray-500 text-center py-8">暂无资讯</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {news.map((item) => (
        <li key={item.id} className="py-3 first:pt-0 last:pb-0">
          <Link
            href={`/news/${item.id}`}
            className="flex items-center justify-between group hover:bg-gray-50 -mx-2 px-2 py-1 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="shrink-0 text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-800 font-medium">
                {item.category}
              </span>
              <span className="text-sm text-gray-800 group-hover:text-primary truncate">
                {item.title}
              </span>
            </div>
            <time className="shrink-0 text-xs text-gray-400 ml-2 sm:ml-3 hidden sm:block">
              {formatDate(item.publishedAt ?? item.createdAt)}
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
