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
      color: "bg-green-500",
    },
    {
      label: "行情数",
      value: stats?.quoteCount ?? "-",
      icon: TrendingUp,
      color: "bg-blue-500",
    },
    {
      label: "资讯数",
      value: stats?.newsCount ?? "-",
      icon: Newspaper,
      color: "bg-yellow-500",
    },
    {
      label: "待审核供求数",
      value: stats?.pendingSupplyCount ?? "-",
      icon: ClipboardCheck,
      color: "bg-red-500",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        欢迎来到管理后台
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4">
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800">
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
