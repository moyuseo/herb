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
    return <p className="text-gray-500 text-center py-8">暂无供求信息</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {supplies.map((item) => {
        const isSupply = item.type === "supply";
        return (
          <Link
            key={item.id}
            href="/supply"
            className="block p-3 rounded-lg border border-gray-100 hover:border-primary hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  isSupply
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {isSupply ? "供应" : "求购"}
              </span>
              <span className="text-sm font-medium text-gray-900">
                {item.herb.name}
              </span>
              <span className="text-xs text-gray-400">
                {item.herb.category}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-gray-500">
              <span>数量: {item.quantity}</span>
              {item.price && <span>价格: {item.price}</span>}
              <span>{formatRelativeTime(item.createdAt)}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
