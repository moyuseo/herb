"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 h-96" />
  ),
});

const timeRanges = [
  { label: "7天", days: 7 },
  { label: "30天", days: 30 },
  { label: "90天", days: 90 },
  { label: "1年", days: 365 },
  { label: "全部", days: 0 },
];

interface QuoteRecord {
  date: string;
  price: number;
}

export default function PriceChart({ herbId }: { herbId: number }) {
  const [days, setDays] = useState(30);
  const [history, setHistory] = useState<QuoteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prices/${herbId}?days=${days}`);
      const json = await res.json();
      if (json.success) {
        setHistory(json.data.history);
      }
    } finally {
      setLoading(false);
    }
  }, [herbId, days]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const dates = history.map((q) => {
    const d = new Date(q.date);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
  const prices = history.map((q) => q.price);

  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const avgPrice = prices.length
    ? prices.reduce((a, b) => a + b, 0) / prices.length
    : 0;
  const latestPrice = prices.length ? prices[prices.length - 1] : 0;

  const option = {
    tooltip: {
      trigger: "axis" as const,
      formatter: (params: Array<{ name: string; value: number }>) => {
        const p = params[0];
        return `${p.name}<br/>价格: ¥${p.value.toFixed(2)}`;
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category" as const,
      data: dates,
      boundaryGap: false,
    },
    yAxis: {
      type: "value" as const,
      name: "价格(元/公斤)",
      scale: true,
    },
    series: [
      {
        type: "line" as const,
        data: prices,
        smooth: true,
        lineStyle: { width: 2, color: "#16a34a" },
        itemStyle: { color: "#16a34a" },
        areaStyle: {
          color: {
            type: "linear" as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(22, 163, 74, 0.3)" },
              { offset: 1, color: "rgba(22, 163, 74, 0.05)" },
            ],
          },
        },
      },
    ],
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-5">
        {timeRanges.map((range) => (
          <button
            key={range.days}
            onClick={() => setDays(range.days)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              days === range.days
                ? "bg-primary text-white shadow-sm shadow-primary/25"
                : "bg-gray-50 text-gray-500 hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="animate-pulse rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 h-64 sm:h-96" />
      ) : history.length > 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <ReactECharts
            option={option}
            style={{ height: "100%", width: "100%" }}
            className="h-64 sm:h-96"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 py-20 text-center text-gray-400">
          暂无历史数据
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <StatCard
          label="最高价"
          value={`¥${maxPrice.toFixed(2)}`}
          color="text-red-500"
        />
        <StatCard
          label="最低价"
          value={`¥${minPrice.toFixed(2)}`}
          color="text-emerald-500"
        />
        <StatCard
          label="平均价"
          value={`¥${avgPrice.toFixed(2)}`}
          color="text-blue-500"
        />
        <StatCard
          label="最新价"
          value={`¥${latestPrice.toFixed(2)}`}
          color="text-primary"
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm transition-shadow duration-200 hover:shadow-md">
      <p className="text-xs font-medium tracking-wide text-gray-400 uppercase">
        {label}
      </p>
      <p className={`mt-2 text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
