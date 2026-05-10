import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface IndexSummaryProps {
  value: number;
  change: number;
  changePercent: number;
  date: string;
}

export default function IndexSummary({
  value,
  change,
  changePercent,
  date,
}: IndexSummaryProps) {
  const isUp = change > 0;
  const isDown = change < 0;
  const isFlat = change === 0;
  const colorClass = isUp
    ? "text-red-600"
    : isDown
      ? "text-green-600"
      : "text-gray-600";
  const bgColorClass = isUp
    ? "bg-red-50"
    : isDown
      ? "bg-green-50"
      : "bg-gray-50";
  const sign = isUp ? "+" : "";

  const TrendIcon = isUp
    ? TrendingUp
    : isDown
      ? TrendingDown
      : Minus;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">综合指数</p>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-bold text-gray-900">
              {value.toFixed(2)}
            </span>
            <div className={`flex items-center gap-1 ${colorClass}`}>
              <TrendIcon className="h-5 w-5" />
              <span className="text-lg font-semibold">
                {sign}{change.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${bgColorClass} ${colorClass}`}
            >
              {sign}{changePercent.toFixed(2)}%
            </span>
            <span className="text-xs text-gray-400">
              截至 {new Date(date).toLocaleDateString("zh-CN")}
            </span>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <p className="text-xs text-gray-400">日涨跌额</p>
            <p className={`text-lg font-semibold ${colorClass}`}>
              {sign}{change.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">日涨跌幅</p>
            <p className={`text-lg font-semibold ${colorClass}`}>
              {sign}{changePercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
