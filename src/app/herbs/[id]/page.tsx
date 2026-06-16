import { notFound } from "next/navigation";
import Link from "next/link";
import { getHerbById } from "@/lib/db";
import {
  ArrowLeft,
  Tag,
  MapPin,
  Leaf,
  Beaker,
  Pill,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Minus,
  Newspaper,
} from "lucide-react";

interface HerbDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HerbDetailPage({ params }: HerbDetailPageProps) {
  const { id } = await params;
  const herbId = parseInt(id, 10);

  if (isNaN(herbId)) {
    notFound();
  }

  const herb = await getHerbById(herbId);

  if (!herb) {
    notFound();
  }

  const latestQuote = herb.quotes[0] ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/herbs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-all duration-200 mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        返回品种列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {herb.name}
                </h1>
                {herb.aliases && (
                  <p className="mt-2 text-gray-400 text-sm break-words">
                    别名：{herb.aliases}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary-50 to-primary-100/60 text-primary text-sm font-semibold shadow-sm">
                <Tag className="h-3.5 w-3.5" />
                {herb.category}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {herb.source && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary shrink-0">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">来源</p>
                    <p className="text-sm text-gray-700 mt-0.5">{herb.source}</p>
                  </div>
                </div>
              )}
              {herb.origin && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">产地</p>
                    <p className="text-sm text-gray-700 mt-0.5">{herb.origin}</p>
                  </div>
                </div>
              )}
            </div>

            {herb.description && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {herb.description}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 text-violet-500">
                <Beaker className="h-4 w-4" />
              </div>
              性味归经与功效
            </h2>
            <div className="space-y-5">
              {herb.properties && (
                <div className="pl-4 border-l-2 border-violet-200">
                  <p className="text-xs font-semibold text-violet-500 uppercase tracking-wider mb-1">
                    性味归经
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {herb.properties}
                  </p>
                </div>
              )}
              {herb.efficacy && (
                <div className="pl-4 border-l-2 border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">
                    功效主治
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {herb.efficacy}
                  </p>
                </div>
              )}
              {herb.usage && (
                <div className="pl-4 border-l-2 border-amber-200">
                  <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
                    用法用量
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {herb.usage}
                  </p>
                </div>
              )}
              {!herb.properties && !herb.efficacy && !herb.usage && (
                <p className="text-sm text-gray-400 italic">暂无性味归经与功效信息</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sky-50 text-sky-500">
                <ClipboardList className="h-4 w-4" />
              </div>
              规格等级
            </h2>
            {herb.specGrade ? (
              <p className="text-sm text-gray-700 leading-relaxed pl-4 border-l-2 border-sky-200">
                {herb.specGrade}
              </p>
            ) : (
              <p className="text-sm text-gray-400 italic">暂无规格等级信息</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 text-rose-500">
                <Pill className="h-4 w-4" />
              </div>
              市场行情摘要
            </h2>
            {latestQuote ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">
                    ¥{latestQuote.price.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-semibold ${
                      latestQuote.changePercent > 0
                        ? "bg-red-50 text-red-600"
                        : latestQuote.changePercent < 0
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {latestQuote.changePercent > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : latestQuote.changePercent < 0 ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <Minus className="h-4 w-4" />
                    )}
                    {latestQuote.changePercent > 0 ? "+" : ""}
                    {latestQuote.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  {latestQuote.origin && <span>{latestQuote.origin} · </span>}
                  {latestQuote.spec && <span>{latestQuote.spec} · </span>}
                  更新于{" "}
                  {new Date(latestQuote.date).toLocaleDateString("zh-CN")}
                </div>
                <Link
                  href={`/prices?herbId=${herb.id}`}
                  className="inline-flex items-center gap-1 mt-1 text-sm text-primary hover:text-primary-dark font-semibold transition-colors group"
                >
                  查看行情详情
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">暂无行情数据</p>
            )}
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-500">
                <Newspaper className="h-4 w-4" />
              </div>
              相关资讯
            </h2>
            {herb.news.length > 0 ? (
              <ul className="space-y-1">
                {herb.news.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/news/${article.id}`}
                      className="group block p-3 -mx-3 rounded-xl hover:bg-gray-50/80 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </span>
                      <span className="block text-xs text-gray-400 mt-1.5">
                        {new Date(article.createdAt).toLocaleDateString("zh-CN")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">暂无相关资讯</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
