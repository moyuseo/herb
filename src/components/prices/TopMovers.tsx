"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MoverItem {
  id: number;
  herbId: number;
  price: number;
  change: number;
  changePercent: number;
  herb: { id: number; name: string; category: string };
}

export default function TopMovers() {
  const [gainers, setGainers] = useState<MoverItem[]>([]);
  const [losers, setLosers] = useState<MoverItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prices/top-movers")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setGainers(json.data.gainers);
          setLosers(json.data.losers);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-pulse bg-gray-100 rounded-xl h-80" />
        <div className="animate-pulse bg-gray-100 rounded-xl h-80" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-400 px-4 py-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-white" />
          <h3 className="text-white font-semibold">涨幅排行</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {gainers.map((item, index) => (
            <Link
              key={item.id}
              href={`/prices/${item.herb.id}`}
              className="flex items-center px-3 sm:px-4 py-2.5 hover:bg-red-50 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <span className="ml-2 sm:ml-3 flex-1 text-sm font-medium text-gray-900 truncate">
                {item.herb.name}
              </span>
              <span className="text-sm text-gray-600 mr-2 sm:mr-3 hidden sm:inline">
                ¥{item.price.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-red-600">
                +{item.changePercent.toFixed(2)}%
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-400 px-4 py-3 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-white" />
          <h3 className="text-white font-semibold">跌幅排行</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {losers.map((item, index) => (
            <Link
              key={item.id}
              href={`/prices/${item.herb.id}`}
              className="flex items-center px-3 sm:px-4 py-2.5 hover:bg-green-50 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <span className="ml-2 sm:ml-3 flex-1 text-sm font-medium text-gray-900 truncate">
                {item.herb.name}
              </span>
              <span className="text-sm text-gray-600 mr-2 sm:mr-3 hidden sm:inline">
                ¥{item.price.toFixed(2)}
              </span>
              <span className="text-sm font-semibold text-green-600">
                {item.changePercent.toFixed(2)}%
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
