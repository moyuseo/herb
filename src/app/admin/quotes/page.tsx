"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil } from "lucide-react";
import Modal from "@/components/admin/Modal";

interface HerbOption {
  id: number;
  name: string;
}

interface Quote {
  id: number;
  herbId: number;
  price: number;
  change: number;
  changePercent: number;
  origin: string | null;
  spec: string | null;
  date: string;
  herb: { id: number; name: string; category: string };
}

interface QuoteFormData {
  herbId: string;
  price: string;
  change: string;
  changePercent: string;
  origin: string;
  spec: string;
  date: string;
}

const emptyForm: QuoteFormData = {
  herbId: "",
  price: "",
  change: "0",
  changePercent: "0",
  origin: "",
  spec: "",
  date: new Date().toISOString().split("T")[0],
};

export default function QuotesAdminPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [form, setForm] = useState<QuoteFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [herbOptions, setHerbOptions] = useState<HerbOption[]>([]);

  const fetchQuotes = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/quotes?page=${p}&pageSize=10`);
      const data = await res.json();
      setQuotes(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHerbOptions = useCallback(async () => {
    const res = await fetch("/api/herbs");
    const data = await res.json();
    setHerbOptions(data);
  }, []);

  useEffect(() => {
    fetchQuotes(page);
  }, [page, fetchQuotes]);

  useEffect(() => {
    fetchHerbOptions();
  }, [fetchHerbOptions]);

  const openAddModal = () => {
    setEditingQuote(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (quote: Quote) => {
    setEditingQuote(quote);
    setForm({
      herbId: String(quote.herbId),
      price: String(quote.price),
      change: String(quote.change),
      changePercent: String(quote.changePercent),
      origin: quote.origin || "",
      spec: quote.spec || "",
      date: quote.date ? new Date(quote.date).toISOString().split("T")[0] : "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.herbId || !form.price || !form.date) return;
    setSaving(true);
    try {
      if (editingQuote) {
        await fetch(`/api/admin/quotes/${editingQuote.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/quotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      fetchQuotes(page);
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">行情管理</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          录入行情
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  品种
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  价格
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  涨跌额
                </th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">
                  涨跌幅
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  日期
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
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    加载中...
                  </td>
                </tr>
              ) : quotes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    暂无数据
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {quote.herb?.name || "-"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-800">
                      {quote.price.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${
                        quote.change > 0
                          ? "text-red-600"
                          : quote.change < 0
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {quote.change > 0 ? "+" : ""}
                      {quote.change.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${
                        quote.changePercent > 0
                          ? "text-red-600"
                          : quote.changePercent < 0
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {quote.changePercent > 0 ? "+" : ""}
                      {quote.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {quote.date
                        ? new Date(quote.date).toLocaleDateString("zh-CN")
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEditModal(quote)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="编辑"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingQuote ? "编辑行情" : "录入行情"}
      >
        <div className="space-y-4">
          <div>
            <label className={labelCls}>品种 *</label>
            <select
              value={form.herbId}
              onChange={(e) => setForm({ ...form, herbId: e.target.value })}
              className={inputCls}
            >
              <option value="">请选择品种</option>
              {herbOptions.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>价格 *</label>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>涨跌额</label>
              <input
                type="number"
                step="0.01"
                value={form.change}
                onChange={(e) => setForm({ ...form, change: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>涨跌幅(%)</label>
              <input
                type="number"
                step="0.01"
                value={form.changePercent}
                onChange={(e) =>
                  setForm({ ...form, changePercent: e.target.value })
                }
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>产地</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>规格</label>
              <input
                type="text"
                value={form.spec}
                onChange={(e) => setForm({ ...form, spec: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>日期 *</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || !form.herbId || !form.price || !form.date}
              className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
