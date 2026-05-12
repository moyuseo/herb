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
      color: "text-accent-red",
      iconBg: "bg-red-50",
      border: "border-l-accent-red",
    },
    {
      label: "下跌品种",
      count: downCount,
      icon: TrendingDown,
      color: "text-accent-green",
      iconBg: "bg-green-50",
      border: "border-l-accent-green",
    },
    {
      label: "持平品种",
      count: flatCount,
      icon: Minus,
      color: "text-text-tertiary",
      iconBg: "bg-gray-50",
      border: "border-l-text-tertiary",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white rounded-xl shadow-sm border border-l-4 ${card.border} p-6 card-hover flex items-center gap-5`}
        >
          <div className={`${card.iconBg} ${card.color} p-3 rounded-full`}>
            <card.icon className="h-5 w-5" />
          </div>
          <div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.count}</p>
            <p className="text-sm text-text-tertiary mt-1">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
