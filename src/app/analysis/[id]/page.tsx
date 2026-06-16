import Link from "next/link";
import { notFound } from "next/navigation";
import { getMarketAnalysisById, getRelatedAnalysis } from "@/lib/db";
import { ArrowLeft } from "lucide-react";

const categoryColors: Record<string, string> = {
  产地分析: "bg-blue-100 text-blue-700",
  供需分析: "bg-amber-100 text-amber-700",
  趋势预测: "bg-purple-100 text-purple-700",
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    notFound();
  }

  const analysis = await getMarketAnalysisById(id);

  if (!analysis || !analysis.isPublished) {
    notFound();
  }

  const related = await getRelatedAnalysis(analysis.category, id);

  const paragraphs = analysis.content.split("\n").filter(Boolean);
  const htmlContent = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (/^[一二三四五六七八九十]+、/.test(trimmed)) {
        return `<h2>${trimmed}</h2>`;
      }
      if (/^\d+\./.test(trimmed)) {
        return `<h3>${trimmed}</h3>`;
      }
      return `<p>${trimmed}</p>`;
    })
    .join("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/analysis"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors mb-8 animate-fade-in-up"
      >
        <ArrowLeft className="h-4 w-4" />
        返回市场分析列表
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0 animate-fade-in-up delay-100">
          <header className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <span
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  categoryColors[analysis.category] || "bg-gray-100 text-gray-600"
                }`}
              >
                {analysis.category}
              </span>
              <span className="text-sm text-text-tertiary">
                {formatDate(analysis.publishedAt || analysis.createdAt)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight leading-snug">
              {analysis.title}
            </h1>
          </header>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8">
            <div
              className="prose-tcm"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
        </article>

        {related.length > 0 && (
          <aside className="lg:w-80 shrink-0 animate-slide-in-right delay-200">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
                <h3 className="text-lg font-bold text-text-primary mb-5">
                  相关推荐
                </h3>
                <div className="space-y-4">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      href={`/analysis/${item.id}`}
                      className="block group p-3 -mx-3 rounded-xl hover:bg-surface-alt transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            categoryColors[item.category] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-text-tertiary mt-2">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
