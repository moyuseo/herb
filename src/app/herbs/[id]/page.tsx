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
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回品种列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="p-4 sm:p-6 rounded-xl border border-gray-200 bg-white">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {herb.name}
                </h1>
                {herb.aliases && (
                  <p className="mt-1 text-gray-500 break-words">
                    <span className="text-gray-400">别名：</span>
                    {herb.aliases}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-50 text-primary text-sm font-medium">
                <Tag className="h-3.5 w-3.5" />
                {herb.category}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {herb.source && (
                <div className="flex items-start gap-2">
                  <Leaf className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">来源</p>
                    <p className="text-sm text-gray-700">{herb.source}</p>
                  </div>
                </div>
              )}
              {herb.origin && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">产地</p>
                    <p className="text-sm text-gray-700">{herb.origin}</p>
                  </div>
                </div>
              )}
            </div>

            {herb.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {herb.description}
                </p>
              </div>
            )}
          </section>

          <section className="p-4 sm:p-6 rounded-xl border border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary" />
              性味归经与功效
            </h2>
            <div className="space-y-4">
              {herb.properties && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    性味归经
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {herb.properties}
                  </p>
                </div>
              )}
              {herb.efficacy && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    功效主治
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {herb.efficacy}
                  </p>
                </div>
              )}
              {herb.usage && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    用法用量
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {herb.usage}
                  </p>
                </div>
              )}
              {!herb.properties && !herb.efficacy && !herb.usage && (
                <p className="text-sm text-gray-400">暂无性味归经与功效信息</p>
              )}
            </div>
          </section>

          <section className="p-4 sm:p-6 rounded-xl border border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              规格等级
            </h2>
            {herb.specGrade ? (
              <p className="text-sm text-gray-700 leading-relaxed">
                {herb.specGrade}
              </p>
            ) : (
              <p className="text-sm text-gray-400">暂无规格等级信息</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="p-4 sm:p-6 rounded-xl border border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Pill className="h-5 w-5 text-primary" />
              市场行情摘要
            </h2>
            {latestQuote ? (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ¥{latestQuote.price.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-sm font-medium ${
                      latestQuote.changePercent > 0
                        ? "text-red-500"
                        : latestQuote.changePercent < 0
                        ? "text-green-500"
                        : "text-gray-500"
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
                <div className="text-xs text-gray-400">
                  {latestQuote.origin && <span>{latestQuote.origin} · </span>}
                  {latestQuote.spec && <span>{latestQuote.spec} · </span>}
                  更新于{" "}
                  {new Date(latestQuote.date).toLocaleDateString("zh-CN")}
                </div>
                <Link
                  href={`/prices?herbId=${herb.id}`}
                  className="inline-block mt-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  查看行情详情 →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-400">暂无行情数据</p>
            )}
          </section>

          <section className="p-4 sm:p-6 rounded-xl border border-gray-200 bg-white">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              相关资讯
            </h2>
            {herb.news.length > 0 ? (
              <ul className="space-y-3">
                {herb.news.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/news/${article.id}`}
                      className="group block text-sm text-gray-700 hover:text-primary transition-colors"
                    >
                      <span className="font-medium group-hover:underline">
                        {article.title}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5">
                        {new Date(article.createdAt).toLocaleDateString(
                          "zh-CN"
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">暂无相关资讯</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
