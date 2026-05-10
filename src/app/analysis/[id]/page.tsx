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
        return `<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">${trimmed}</h2>`;
      }
      if (/^\d+\./.test(trimmed)) {
        return `<h3 class="text-lg font-medium text-gray-800 mt-4 mb-2">${trimmed}</h3>`;
      }
      return `<p class="text-gray-600 leading-relaxed mb-4">${trimmed}</p>`;
    })
    .join("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/analysis"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回市场分析列表
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  categoryColors[analysis.category] || "bg-gray-100 text-gray-600"
                }`}
              >
                {analysis.category}
              </span>
              <span className="text-sm text-gray-400">
                {formatDate(analysis.publishedAt || analysis.createdAt)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {analysis.title}
            </h1>
          </header>

          <div
            className="prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        {related.length > 0 && (
          <aside className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                相关推荐
              </h3>
              <div className="space-y-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/analysis/${item.id}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          categoryColors[item.category] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(item.publishedAt || item.createdAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
