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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border border-primary/10 p-6 sm:p-8 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
            <Newspaper className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              行业资讯
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              共 <span className="font-semibold text-primary">{total}</span> 条资讯
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <CategoryFilter />
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-5">
            <Newspaper className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-gray-400 text-base font-medium">暂无资讯内容</p>
          <p className="text-gray-300 text-sm mt-1">敬请期待更多行业动态</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.id}`}
              className="group block bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                        categoryColors[article.category] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
                    {article.title}
                  </h2>
                  <p className="mt-2.5 text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {stripHtml(article.content)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4 pt-3.5 border-t border-gray-50 text-xs text-gray-400">
                {article.source && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
                    来源：{article.source}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-gray-300" />
                  {format(new Date(article.createdAt), "yyyy-MM-dd HH:mm")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {page > 1 ? (
            <Link
              href={getPageUrl(page - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-primary/40 hover:text-primary hover:shadow-sm transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
              上一页
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-300 cursor-not-allowed">
              <ChevronLeft className="h-4 w-4" />
              上一页
            </span>
          )}

          <div className="flex items-center gap-1.5">
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
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-gray-300 text-sm select-none"
                  >
                    ...
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={getPageUrl(item)}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      page === item
                        ? "bg-primary text-white shadow-md shadow-primary/25"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:text-primary hover:shadow-sm"
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
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-primary/40 hover:text-primary hover:shadow-sm transition-all duration-200"
            >
              下一页
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-300 cursor-not-allowed">
              下一页
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
