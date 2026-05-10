import Link from "next/link";
import { Suspense } from "react";
import { getMarketAnalysisList } from "@/lib/db";
import CategoryFilter from "@/components/analysis/CategoryFilter";
import { LineChart } from "lucide-react";

const categoryColors: Record<string, string> = {
  产地分析: "bg-blue-100 text-blue-700",
  供需分析: "bg-amber-100 text-amber-700",
  趋势预测: "bg-purple-100 text-purple-700",
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").slice(0, 150) + "...";
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Pagination({
  page,
  totalPages,
  category,
}: {
  page: number;
  totalPages: number;
  category: string;
}) {
  if (totalPages <= 1) return null;

  function getPageHref(p: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    params.set("page", String(p));
    return `/analysis?${params.toString()}`;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mt-8">
      {page > 1 && (
        <Link
          href={getPageHref(page - 1)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          上一页
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={getPageHref(p)}
          className={`px-3 py-2 rounded-lg text-sm transition-colors ${
            p === page
              ? "bg-primary text-white"
              : "border border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={getPageHref(page + 1)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          下一页
        </Link>
      )}
    </div>
  );
}

async function AnalysisList({
  category,
  page,
}: {
  category?: string;
  page: number;
}) {
  const result = await getMarketAnalysisList({
    category: category || undefined,
    isPublished: true,
    page,
    pageSize: 10,
  });

  if (result.data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <LineChart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg">暂无分析文章</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.data.map((item) => (
          <Link
            key={item.id}
            href={`/analysis/${item.id}`}
            className="group block p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  categoryColors[item.category] || "bg-gray-100 text-gray-600"
                }`}
              >
                {item.category}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(item.publishedAt || item.createdAt)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
              {stripHtml(item.content)}
            </p>
          </Link>
        ))}
      </div>
      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        category={category || ""}
      />
    </>
  );
}

export default async function AnalysisPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category = params.category || "";
  const page = parseInt(params.page || "1", 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">市场分析</h1>
        <p className="text-gray-500">
          深度解读中药材市场趋势与投资机会
        </p>
      </div>

      <div className="mb-6">
        <Suspense fallback={<div className="h-10" />}>
          <CategoryFilter />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-6 rounded-xl border border-gray-200 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        }
      >
        <AnalysisList category={category} page={page} />
      </Suspense>
    </div>
  );
}
