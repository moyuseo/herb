import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getNewsById, getRelatedNews } from "@/lib/db";
import { ArrowLeft, Calendar, Tag, Radio } from "lucide-react";

const categoryColors: Record<string, string> = {
  行业动态: "bg-blue-100 text-blue-700",
  政策法规: "bg-red-100 text-red-700",
  市场分析: "bg-amber-100 text-amber-700",
  产地信息: "bg-emerald-100 text-emerald-700",
  种植技术: "bg-purple-100 text-purple-700",
};

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    notFound();
  }

  const article = await getNewsById(id);

  if (!article) {
    notFound();
  }

  const related = await getRelatedNews(article.category, article.id, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/news"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-all duration-200 mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        返回资讯列表
      </Link>

      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mt-5 pb-6 border-b border-gray-100">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  categoryColors[article.category] || "bg-gray-100 text-gray-600"
                }`}
              >
                <Tag className="h-3 w-3" />
                {article.category}
              </span>
              {article.source && (
                <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                  <Radio className="h-3.5 w-3.5" />
                  {article.source}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(article.createdAt), "yyyy-MM-dd HH:mm")}
              </span>
            </div>

            <div
              className="mt-6 prose prose-sm max-w-none
                prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-7
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-lg prose-img:shadow-sm
                prose-blockquote:border-l-primary prose-blockquote:bg-primary-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                prose-table:border prose-th:bg-gray-50 prose-th:p-2 prose-td:p-2 prose-td:border-t"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {related.length > 0 && (
          <aside className="w-full lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-gray-100 bg-white shadow-sm p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-primary" />
                相关推荐
              </h3>
              <ul className="space-y-1">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/news/${item.id}`}
                      className="group block p-3 -mx-3 rounded-xl hover:bg-gray-50/80 transition-colors duration-200"
                    >
                      <p className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            categoryColors[item.category] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.category}
                        </span>
                        <span>{format(new Date(item.createdAt), "yyyy-MM-dd")}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
