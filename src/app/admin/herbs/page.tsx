"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "@/components/admin/Modal";

const CATEGORIES = [
  "根及根茎类",
  "果实种子类",
  "全草类",
  "花叶类",
  "树皮类",
  "动物类",
  "矿物类",
  "菌藻类",
  "其他类",
];

interface Herb {
  id: number;
  name: string;
  aliases: string | null;
  source: string | null;
  origin: string | null;
  category: string;
  properties: string | null;
  efficacy: string | null;
  usage: string | null;
  specGrade: string | null;
  description: string | null;
  imageUrl: string | null;
}

interface HerbFormData {
  name: string;
  aliases: string;
  source: string;
  origin: string;
  category: string;
  properties: string;
  efficacy: string;
  usage: string;
  specGrade: string;
  description: string;
  imageUrl: string;
}

const emptyForm: HerbFormData = {
  name: "",
  aliases: "",
  source: "",
  origin: "",
  category: "根及根茎类",
  properties: "",
  efficacy: "",
  usage: "",
  specGrade: "",
  description: "",
  imageUrl: "",
};

export default function HerbsAdminPage() {
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHerb, setEditingHerb] = useState<Herb | null>(null);
  const [form, setForm] = useState<HerbFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchHerbs = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/herbs?page=${p}&pageSize=10`);
      const data = await res.json();
      setHerbs(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHerbs(page);
  }, [page, fetchHerbs]);

  const openAddModal = () => {
    setEditingHerb(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (herb: Herb) => {
    setEditingHerb(herb);
    setForm({
      name: herb.name,
      aliases: herb.aliases || "",
      source: herb.source || "",
      origin: herb.origin || "",
      category: herb.category,
      properties: herb.properties || "",
      efficacy: herb.efficacy || "",
      usage: herb.usage || "",
      specGrade: herb.specGrade || "",
      description: herb.description || "",
      imageUrl: herb.imageUrl || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category) return;
    setSaving(true);
    try {
      if (editingHerb) {
        await fetch(`/api/admin/herbs/${editingHerb.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch("/api/admin/herbs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      setModalOpen(false);
      fetchHerbs(page);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/herbs/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      fetchHerbs(page);
    } catch {
      alert("删除失败");
    }
  };

  const inputCls =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">品种管理</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
        >
          <Plus className="h-4 w-4" />
          新增品种
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  名称
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  分类
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  产地
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    加载中...
                  </td>
                </tr>
              ) : herbs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                herbs.map((herb) => (
                  <tr key={herb.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {herb.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{herb.category}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {herb.origin || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(herb)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="编辑"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {deleteConfirm === herb.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(herb.id)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              确认
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                              取消
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(herb.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="删除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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
        title={editingHerb ? "编辑品种" : "新增品种"}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>名称 *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>分类 *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>别名</label>
              <input
                type="text"
                value={form.aliases}
                onChange={(e) => setForm({ ...form, aliases: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>产地</label>
              <input
                type="text"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>来源</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>规格等级</label>
              <input
                type="text"
                value={form.specGrade}
                onChange={(e) =>
                  setForm({ ...form, specGrade: e.target.value })
                }
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>性味归经</label>
            <input
              type="text"
              value={form.properties}
              onChange={(e) =>
                setForm({ ...form, properties: e.target.value })
              }
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>功效</label>
            <input
              type="text"
              value={form.efficacy}
              onChange={(e) => setForm({ ...form, efficacy: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>用法用量</label>
            <input
              type="text"
              value={form.usage}
              onChange={(e) => setForm({ ...form, usage: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>图片URL</label>
            <input
              type="text"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>描述</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
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
              disabled={saving || !form.name || !form.category}
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
