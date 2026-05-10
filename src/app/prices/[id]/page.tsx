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
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        返回行情列表
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900">{herb.name}</h1>
            {herb.aliases && (
              <p className="text-sm text-gray-500 mt-1 break-words">
                别名：{herb.aliases}
              </p>
            )}

            <div className="mt-4 space-y-3">
              {herb.category && (
                <div>
                  <span className="text-sm text-gray-500">分类</span>
                  <p className="text-sm font-medium text-gray-900">
                    {herb.category}
                  </p>
                </div>
              )}
              {herb.origin && (
                <div>
                  <span className="text-sm text-gray-500">产地</span>
                  <p className="text-sm font-medium text-gray-900">
                    {herb.origin}
                  </p>
                </div>
              )}
              {herb.specGrade && (
                <div>
                  <span className="text-sm text-gray-500">规格等级</span>
                  <p className="text-sm font-medium text-gray-900">
                    {herb.specGrade}
                  </p>
                </div>
              )}
              {herb.properties && (
                <div>
                  <span className="text-sm text-gray-500">性味归经</span>
                  <p className="text-sm font-medium text-gray-900">
                    {herb.properties}
                  </p>
                </div>
              )}
              {herb.efficacy && (
                <div>
                  <span className="text-sm text-gray-500">功效</span>
                  <p className="text-sm font-medium text-gray-900">
                    {herb.efficacy}
                  </p>
                </div>
              )}
              {latestQuote && (
                <div className="pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-500">最新价格</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-gray-900">
                      ¥{latestQuote.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        latestQuote.change >= 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {latestQuote.change >= 0 ? "+" : ""}
                      {latestQuote.change.toFixed(2)}(
                      {latestQuote.change >= 0 ? "+" : ""}
                      {latestQuote.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  {latestQuote.origin && (
                    <p className="text-xs text-gray-400 mt-1">
                      产地：{latestQuote.origin} | 规格：{latestQuote.spec || "-"}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              历史走势
            </h2>
            <PriceChart herbId={herb.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
