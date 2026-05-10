import Link from "next/link";

interface HotHerb {
  id: number;
  herbId: number;
  price: number;
  change: number;
  changePercent: number;
  herb: { id: number; name: string; category: string };
}

interface HotHerbsProps {
  herbs: HotHerb[];
}

export default function HotHerbs({ herbs }: HotHerbsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {herbs.map((herb) => {
        const isUp = herb.changePercent > 0;
        const isFlat = herb.changePercent === 0;
        const changeColor = isFlat
          ? "text-gray-600"
          : isUp
            ? "text-red-600"
            : "text-green-600";

        return (
          <Link
            key={herb.id}
            href={`/herbs/${herb.herb.id}`}
            className="block p-4 rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">{herb.herb.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700">
                {herb.herb.category}
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm text-gray-500">当前价格</p>
                <p className="text-xl font-bold text-gray-900">
                  ¥{herb.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${changeColor}`}>
                  {isUp ? "+" : ""}{herb.change.toFixed(2)}
                </p>
                <p className={`text-lg font-bold ${changeColor}`}>
                  {isUp ? "+" : ""}{herb.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
