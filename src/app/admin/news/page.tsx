"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";

const NEWS_CATEGORIES = [
  "行业动态",
  "政策法规",
  "市场分析",
  "种植技术",
  "价格行情",
];

interface NewsArticle {
  id: number;
  title: string;
  category: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  herb: { id: number; name: string } | null;
}

export default function NewsAdminPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchArticles = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          pageSize: "10",
        });
        if (filterCategory) params.set("category", filterCategory);
        if (filterStatus) params.set("isPublished", filterStatus);

        const res = await fetch(`/api/admin/news?${params}`);
        const data = await res.json();
        setArticles(data.data);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } finally {
        setLoading(false);
      }
    },
    [filterCategory, filterStatus]
  );

  useEffect(() => {
    fetchArticles(page);
  }, [page, fetchArticles]);

  const togglePublish = async (id: number) => {
    try {
      await fetch(`/api/admin/news/${id}/publish`, { method: "PUT" });
      fetchArticles(page);
    } catch {
      alert("操作失败");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">资讯管理</h2>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          新增资讯
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors duration-200"
        >
          <option value="">全部分类</option>
          {NEWS_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-colors duration-200"
        >
          <option value="">全部状态</option>
          <option value="true">已发布</option>
          <option value="false">草稿</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  标题
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  发布时间
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
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    加载中...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    暂无数据
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 font-semibold text-gray-800 max-w-xs truncate">
                      {article.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {article.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${
                          article.isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {article.isPublished ? "已发布" : "草稿"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString(
                            "zh-CN"
                          )
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/admin/news/edit?id=${article.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                          title="编辑"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => togglePublish(article.id)}
                          className={`p-2 rounded-lg transition-colors duration-150 ${
                            article.isPublished
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={article.isPublished ? "下架" : "发布"}
                        >
                          {article.isPublished ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
