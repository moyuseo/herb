import type { Metadata } from "next";
import { getHerbById } from "@/lib/db";
import { notFound } from "next/navigation";
import PriceChart from "@/components/prices/PriceChart";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const herb = await getHerbById(Number(id));

  if (!herb) {
    return { title: "品种未找到 - 中药材信息网" };
  }

  return {
    title: `${herb.name} - 价格行情 - 中药材信息网`,
    description: `${herb.name}中药材价格行情、历史走势及品种信息。${herb.efficacy || ""}`,
  };
}

export default async function HerbDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const herbId = Number(id);

  if (isNaN(herbId)) {
    notFound();
  }

  const herb = await getHerbById(herbId);

  if (!herb) {
    notFound();
  }

  const latestQuote = herb.quotes[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href="/prices"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-all duration-200 mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
        返回行情列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8 sticky top-24">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {herb.name}
            </h1>
            {herb.aliases && (
              <p className="text-sm text-gray-400 mt-1.5 break-words">
                别名：{herb.aliases}
              </p>
            )}

            <div className="mt-6 space-y-4">
              {herb.category && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                  <div className="w-1.5 h-full min-h-[2rem] rounded-full bg-primary-200 shrink-0 self-stretch" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">分类</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">
                      {herb.category}
                    </p>
                  </div>
                </div>
              )}
              {herb.origin && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                  <div className="w-1.5 h-full min-h-[2rem] rounded-full bg-emerald-200 shrink-0 self-stretch" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">产地</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">
                      {herb.origin}
                    </p>
                  </div>
                </div>
              )}
              {herb.specGrade && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                  <div className="w-1.5 h-full min-h-[2rem] rounded-full bg-sky-200 shrink-0 self-stretch" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">规格等级</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5">
                      {herb.specGrade}
                    </p>
                  </div>
                </div>
              )}
              {herb.properties && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                  <div className="w-1.5 h-full min-h-[2rem] rounded-full bg-violet-200 shrink-0 self-stretch" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">性味归经</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5 leading-relaxed">
                      {herb.properties}
                    </p>
                  </div>
                </div>
              )}
              {herb.efficacy && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80">
                  <div className="w-1.5 h-full min-h-[2rem] rounded-full bg-amber-200 shrink-0 self-stretch" />
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">功效</p>
                    <p className="text-sm font-medium text-gray-800 mt-0.5 leading-relaxed">
                      {herb.efficacy}
                    </p>
                  </div>
                </div>
              )}
              {latestQuote && (
                <div className="pt-5 mt-2 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">最新价格</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900 tracking-tight">
                      ¥{latestQuote.price.toFixed(2)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-semibold ${
                        latestQuote.change >= 0
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {latestQuote.change >= 0 ? "+" : ""}
                      {latestQuote.change.toFixed(2)}(
                      {latestQuote.change >= 0 ? "+" : ""}
                      {latestQuote.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  {latestQuote.origin && (
                    <p className="text-xs text-gray-400 mt-2">
                      产地：{latestQuote.origin} · 规格：{latestQuote.spec || "-"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2.5">
              <div className="w-1.5 h-6 rounded-full bg-primary" />
              历史走势
            </h2>
            <PriceChart herbId={herb.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
