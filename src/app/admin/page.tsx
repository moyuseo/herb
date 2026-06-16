"use client";

import { useEffect, useState } from "react";
import { Leaf, TrendingUp, Newspaper, ClipboardCheck } from "lucide-react";

interface Stats {
  herbCount: number;
  quoteCount: number;
  newsCount: number;
  pendingSupplyCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  const cards = [
    {
      label: "品种数",
      value: stats?.herbCount ?? "-",
      icon: Leaf,
      accent: "bg-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      label: "行情数",
      value: stats?.quoteCount ?? "-",
      icon: TrendingUp,
      accent: "bg-blue-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "资讯数",
      value: stats?.newsCount ?? "-",
      icon: Newspaper,
      accent: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
    },
    {
      label: "待审核供求数",
      value: stats?.pendingSupplyCount ?? "-",
      icon: ClipboardCheck,
      accent: "bg-rose-500",
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8 tracking-tight">
        欢迎来到管理后台
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`${card.bg} p-3.5 rounded-2xl`}>
                  <Icon className={`h-6 w-6 ${card.text}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-0.5">
                    {card.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
