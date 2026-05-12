"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NEWS_CATEGORIES = [
  "行业动态",
  "政策法规",
  "市场分析",
  "种植技术",
  "价格行情",
];

interface HerbOption {
  id: number;
  name: string;
}

interface NewsFormData {
  title: string;
  category: string;
  source: string;
  herbId: string;
  content: string;
}

const emptyForm: NewsFormData = {
  title: "",
  category: "行业动态",
  source: "",
  herbId: "",
  content: "",
};

export default function NewsActionPage({
  params,
}: {
  params: Promise<{ action: string }>;
}) {
  const [action, setAction] = useState<string>("");
  const [form, setForm] = useState<NewsFormData>(emptyForm);
  const [herbOptions, setHerbOptions] = useState<HerbOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    params.then((p) => setAction(p.action));
  }, [params]);

  useEffect(() => {
    fetch("/api/herbs")
      .then((res) => res.json())
      .then((data) => setHerbOptions(data));
  }, []);

  useEffect(() => {
    if (action === "edit") {
      const id = searchParams.get("id");
      if (id) {
        setLoading(true);
        fetch(`/api/admin/news/${id}`)
          .then((res) => res.json())
          .then((result) => {
            if (result.success && result.data) {
              const d = result.data;
              setForm({
                title: d.title || "",
                category: d.category || "行业动态",
                source: d.source || "",
                herbId: d.herbId ? String(d.herbId) : "",
                content: d.content || "",
              });
            }
          })
          .finally(() => setLoading(false));
      }
    }
  }, [action, searchParams]);

  const handleSubmit = async (publish: boolean) => {
    if (!form.title || !form.content || !form.category) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        herbId: form.herbId || null,
        isPublished: publish,
      };

      if (action === "edit") {
        const id = searchParams.get("id");
        if (id) {
          await fetch(`/api/admin/news/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }
      } else {
        await fetch("/api/admin/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      router.push("/admin/news");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 text-sm bg-gray-50/50 transition-colors duration-200";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-400">加载中...</div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/news"
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          {action === "edit" ? "编辑资讯" : "新增资讯"}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl">
        <div className="space-y-5">
          <div>
            <label className={labelCls}>标题 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputCls}
              placeholder="请输入资讯标题"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>分类 *</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className={inputCls}
              >
                {NEWS_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>来源</label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className={inputCls}
                placeholder="资讯来源"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>关联品种</label>
            <select
              value={form.herbId}
              onChange={(e) => setForm({ ...form, herbId: e.target.value })}
              className={inputCls}
            >
              <option value="">不关联</option>
              {herbOptions.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>内容 *</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              className={inputCls}
              placeholder="请输入资讯内容"
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Link
              href="/admin/news"
              className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              取消
            </Link>
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving || !form.title || !form.content}
              className="px-5 py-2.5 text-sm font-medium border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
            >
              保存草稿
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving || !form.title || !form.content}
              className="px-5 py-2.5 text-sm font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 shadow-sm transition-colors duration-200"
            >
              {saving ? "保存中..." : "发布"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
