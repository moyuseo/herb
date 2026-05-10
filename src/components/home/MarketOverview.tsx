import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketOverviewProps {
  upCount: number;
  downCount: number;
  flatCount: number;
}

export default function MarketOverview({ upCount, downCount, flatCount }: MarketOverviewProps) {
  const cards = [
    {
      label: "上涨品种",
      count: upCount,
      icon: TrendingUp,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
    },
    {
      label: "下跌品种",
      count: downCount,
      icon: TrendingDown,
      color: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
    },
    {
      label: "持平品种",
      count: flatCount,
      icon: Minus,
      color: "text-gray-600",
      bg: "bg-gray-50",
      border: "border-gray-200",
      iconBg: "bg-gray-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`${card.bg} ${card.border} border rounded-xl p-5 flex items-center gap-4`}
        >
          <div className={`${card.iconBg} ${card.color} p-3 rounded-lg`}>
            <card.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color}`}>{card.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
