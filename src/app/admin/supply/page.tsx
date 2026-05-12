"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X } from "lucide-react";

interface SupplyItem {
  id: number;
  type: string;
  herbId: number;
  quantity: string;
  price: string | null;
  origin: string | null;
  contact: string;
  description: string | null;
  status: string;
  createdAt: string;
  herb: { id: number; name: string; category: string };
}

const STATUS_OPTIONS = [
  { value: "", label: "全部" },
  { value: "pending", label: "待审核" },
  { value: "approved", label: "已通过" },
  { value: "rejected", label: "已拒绝" },
];

const statusLabel: Record<string, { text: string; cls: string }> = {
  pending: { text: "待审核", cls: "bg-amber-50 text-amber-700" },
  approved: { text: "已通过", cls: "bg-emerald-50 text-emerald-700" },
  rejected: { text: "已拒绝", cls: "bg-red-50 text-red-700" },
};

export default function SupplyAdminPage() {
  const [items, setItems] = useState<SupplyItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");

  const fetchItems = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          pageSize: "10",
        });
        if (filterStatus) params.set("status", filterStatus);

        const res = await fetch(`/api/admin/supply?${params}`);
        const data = await res.json();
        setItems(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } finally {
        setLoading(false);
      }
    },
    [filterStatus]
  );

  useEffect(() => {
    fetchItems(page);
  }, [page, fetchItems]);

  const handleReview = async (id: number, status: "approved" | "rejected") => {
    try {
      await fetch(`/api/admin/supply/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchItems(page);
    } catch {
      alert("操作失败");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">供求审核</h2>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors duration-200"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  品种
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  数量
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  价格
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  联系方式
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    加载中...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    暂无数据
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const sl = statusLabel[item.status] || {
                    text: item.status,
                    cls: "bg-gray-100 text-gray-600",
                  };
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${
                            item.type === "supply"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-violet-50 text-violet-700"
                          }`}
                        >
                          {item.type === "supply" ? "供应" : "求购"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {item.herb?.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.price || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {item.contact}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${sl.cls}`}
                        >
                          {sl.text}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleReview(item.id, "approved")
                              }
                              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors duration-200"
                            >
                              <Check className="h-3.5 w-3.5" />
                              通过
                            </button>
                            <button
                              onClick={() =>
                                handleReview(item.id, "rejected")
                              }
                              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm transition-colors duration-200"
                            >
                              <X className="h-3.5 w-3.5" />
                              拒绝
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">已处理</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/30">
            <span className="text-sm text-gray-500">
              共 {total} 条，第 {page}/{totalPages} 页
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-1.5 text-sm font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors duration-150"
              >
                上一页
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-1.5 text-sm font-medium border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors duration-150"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
