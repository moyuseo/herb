import Link from "next/link";
import { format } from "date-fns";
import { getNewsList } from "@/lib/db";
import CategoryFilter from "@/components/news/CategoryFilter";
import { Newspaper, ChevronLeft, ChevronRight } from "lucide-react";

const categoryColors: Record<string, string> = {
  行业动态: "bg-blue-100 text-blue-700",
  政策法规: "bg-red-100 text-red-700",
  市场分析: "bg-amber-100 text-amber-700",
  产地信息: "bg-emerald-100 text-emerald-700",
  种植技术: "bg-purple-100 text-purple-700",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").slice(0, 150);
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || undefined;
  const page = parseInt(params.page || "1", 10);

  const result = await getNewsList({
    category,
    isPublished: true,
    page,
    pageSize: 10,
  });

  const { data, total, totalPages } = result;

  function getPageUrl(p: number) {
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    sp.set("page", String(p));
    return `/news?${sp.toString()}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="h-7 w-7 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900">行业资讯</h1>
        <span className="text-sm text-gray-400">共 {total} 条</span>
      </div>

      <div className="mb-6">
        <CategoryFilter />
      </div>

      {data.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>暂无资讯内容</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="block bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:border-primary hover:shadow-md transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors truncate">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {stripHtml(article.content)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-400">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    categoryColors[article.category] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {article.category}
                </span>
                {article.source && <span>来源：{article.source}</span>}
                <span>{format(new Date(article.createdAt), "yyyy-MM-dd HH:mm")}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mt-8">
          {page > 1 ? (
            <Link
              href={getPageUrl(page - 1)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-300 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
              上一页
            </span>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 7) return true;
                if (p === 1 || p === totalPages) return true;
                return Math.abs(p - page) <= 2;
              })
              .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                  acc.push("ellipsis");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((item, idx) =>
                item === "ellipsis" ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={getPageUrl(item)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      page === item
                        ? "bg-primary text-white"
                        : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </Link>
                )
              )}
          </div>

          {page < totalPages ? (
            <Link
              href={getPageUrl(page + 1)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-300 cursor-not-allowed">
              下一页
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
