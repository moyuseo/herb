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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/prices/top-movers")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setGainers(json.data.gainers || []);
          setLosers(json.data.losers || []);
        } else {
          setError("获取数据失败");
        }
      })
      .catch((err) => {
        console.error("TopMovers fetch error:", err);
        setError(err.message || "网络错误");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="animate-pulse rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 p-6">
          <div className="mb-4 h-8 w-32 rounded-lg bg-gray-200" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="animate-pulse rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 p-6">
          <div className="mb-4 h-8 w-32 rounded-lg bg-gray-200" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="h-6 w-6 rounded-full bg-gray-200" />
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="ml-auto h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 text-center">
          <TrendingUp className="h-8 w-8 text-red-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">涨幅排行加载失败</p>
          <p className="text-xs text-gray-300 mt-1">{error}</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 text-center">
          <TrendingDown className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">跌幅排行加载失败</p>
          <p className="text-xs text-gray-300 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (gainers.length === 0 && losers.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 text-center">
          <TrendingUp className="h-8 w-8 text-red-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">暂无涨幅数据</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 text-center">
          <TrendingDown className="h-8 w-8 text-emerald-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">暂无跌幅数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-400 px-5 py-3.5 flex items-center gap-2.5">
          <TrendingUp className="h-5 w-5 text-white/90" />
          <h3 className="text-white font-bold tracking-wide">涨幅排行</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {gainers.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">暂无数据</div>
          ) : (
            gainers.map((item, index) => (
              <Link
                key={item.id}
                href={`/prices/${item.herb.id}`}
                className="flex items-center px-5 py-3 transition-colors duration-200 hover:bg-red-50/60"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-500">
                  {index + 1}
                </span>
                <span className="ml-3 flex-1 truncate text-sm font-semibold text-gray-800">
                  {item.herb.name}
                </span>
                <span className="mr-4 hidden text-sm text-gray-400 sm:inline">
                  ¥{item.price.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-red-500">
                  +{item.changePercent.toFixed(2)}%
                </span>
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-green-400 px-5 py-3.5 flex items-center gap-2.5">
          <TrendingDown className="h-5 w-5 text-white/90" />
          <h3 className="text-white font-bold tracking-wide">跌幅排行</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {losers.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">暂无数据</div>
          ) : (
            losers.map((item, index) => (
              <Link
                key={item.id}
                href={`/prices/${item.herb.id}`}
                className="flex items-center px-5 py-3 transition-colors duration-200 hover:bg-green-50/60"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-xs font-bold text-emerald-500">
                  {index + 1}
                </span>
                <span className="ml-3 flex-1 truncate text-sm font-semibold text-gray-800">
                  {item.herb.name}
                </span>
                <span className="mr-4 hidden text-sm text-gray-400 sm:inline">
                  ¥{item.price.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-emerald-500">
                  {item.changePercent.toFixed(2)}%
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
