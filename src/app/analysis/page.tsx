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
    <div className="flex flex-wrap items-center justify-center gap-1.5 mt-10">
      {page > 1 && (
        <Link
          href={getPageHref(page - 1)}
          className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-surface-alt hover:border-primary/30 transition-all"
        >
          上一页
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={getPageHref(p)}
          className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
            p === page
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "border border-border text-text-secondary hover:bg-surface-alt hover:border-primary/30"
          }`}
        >
          {p}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={getPageHref(page + 1)}
          className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-surface-alt hover:border-primary/30 transition-all"
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
      <div className="text-center py-20 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-alt mb-5">
          <LineChart className="h-8 w-8 text-text-tertiary" />
        </div>
        <p className="text-lg font-semibold text-text-secondary mb-1">暂无分析文章</p>
        <p className="text-sm text-text-tertiary">当前分类下还没有发布任何文章</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {result.data.map((item, i) => (
          <Link
            key={item.id}
            href={`/analysis/${item.id}`}
            className="group block bg-white rounded-2xl border border-border p-6 card-hover animate-fade-in-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  categoryColors[item.category] || "bg-gray-100 text-gray-600"
                }`}
              >
                {item.category}
              </span>
              <span className="text-xs text-text-tertiary">
                {formatDate(item.publishedAt || item.createdAt)}
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-snug">
              {item.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
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
      <div className="mb-10 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <LineChart className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            市场分析
          </h1>
        </div>
        <p className="text-text-secondary ml-[52px]">
          深度解读中药材市场趋势与投资机会
        </p>
      </div>

      <div className="mb-8 animate-fade-in-up delay-100">
        <Suspense fallback={<div className="h-10" />}>
          <CategoryFilter />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-5 w-16 rounded-lg bg-gray-100" />
                  <div className="h-4 w-24 rounded bg-gray-100" />
                </div>
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-1.5" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
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
