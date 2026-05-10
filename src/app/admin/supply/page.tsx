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
  pending: { text: "待审核", cls: "bg-yellow-100 text-yellow-700" },
  approved: { text: "已通过", cls: "bg-green-100 text-green-700" },
  rejected: { text: "已拒绝", cls: "bg-red-100 text-red-700" },
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">供求审核</h2>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  类型
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  品种
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  数量
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  价格
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  联系方式
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  状态
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    加载中...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-400"
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
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            item.type === "supply"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {item.type === "supply" ? "供应" : "求购"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {item.herb?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.price || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {item.contact}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${sl.cls}`}
                        >
                          {sl.text}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleReview(item.id, "approved")
                              }
                              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              <Check className="h-3 w-3" />
                              通过
                            </button>
                            <button
                              onClick={() =>
                                handleReview(item.id, "rejected")
                              }
                              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              <X className="h-3 w-3" />
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
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-500">
              共 {total} 条，第 {page}/{totalPages} 页
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100"
              >
                上一页
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-50 hover:bg-gray-100"
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
