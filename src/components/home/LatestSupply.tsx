import Link from "next/link";

interface SupplyItem {
  id: number;
  type: string;
  quantity: string;
  price: string | null;
  origin: string | null;
  description: string | null;
  createdAt: Date;
  herb: { id: number; name: string; category: string };
}

interface LatestSupplyProps {
  supplies: SupplyItem[];
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}分钟前`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}小时前`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}天前`;
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export default function LatestSupply({ supplies }: LatestSupplyProps) {
  if (supplies.length === 0) {
    return <p className="text-gray-400 text-center py-12 text-sm">暂无供求信息</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {supplies.map((item) => {
        const isSupply = item.type === "supply";
        return (
          <Link
            key={item.id}
            href="/supply"
            className="card-hover block bg-white rounded-2xl border border-gray-100 p-5 transition-all"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <span
                className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                  isSupply
                    ? "bg-blue-50 text-blue-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {isSupply ? "供应" : "求购"}
              </span>
              <span className="text-xs text-gray-400">{item.herb.category}</span>
            </div>

            <h3 className="text-base font-semibold text-gray-900 mb-3">
              {item.herb.name}
            </h3>

            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {item.quantity}
              </span>
              {item.price && (
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {item.price}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <span className="text-xs text-gray-400">
                {formatRelativeTime(item.createdAt)}
              </span>
              {item.origin && (
                <span className="text-xs text-gray-400">{item.origin}</span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
