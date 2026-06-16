import type { Metadata } from "next";
import { getPriceList } from "@/lib/db";
import PriceFilters from "@/components/prices/PriceFilters";
import TopMovers from "@/components/prices/TopMovers";
import Pagination from "@/components/prices/Pagination";
import Link from "next/link";

export const metadata: Metadata = {
  title: "价格行情 - 中药材信息网",
  description:
    "中药材价格行情，实时掌握全国各大中药材市场价格动态，涨跌排行一目了然。",
};

export default async function PricesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category =
    typeof params.category === "string" ? params.category : undefined;
  const search =
    typeof params.search === "string" ? params.search : undefined;
  const page = Number(params.page) || 1;

  const result = await getPriceList({ category, search, page, pageSize: 20 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          中药材价格行情
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          实时掌握全国各大中药材市场价格动态，涨跌排行一目了然
        </p>
      </div>

      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-5 w-1 rounded-full bg-primary" />
          <h2 className="text-lg font-semibold text-gray-900">涨跌排行</h2>
        </div>
        <TopMovers />
      </section>

      <section className="mb-6">
        <PriceFilters />
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-alt">
                <th className="px-6 py-3.5 text-left font-medium uppercase tracking-wider text-xs text-gray-500">
                  品种
                </th>
                <th className="px-6 py-3.5 text-left font-medium uppercase tracking-wider text-xs text-gray-500">
                  分类
                </th>
                <th className="px-6 py-3.5 text-right font-medium uppercase tracking-wider text-xs text-gray-500">
                  最新价
                </th>
                <th className="px-6 py-3.5 text-right font-medium uppercase tracking-wider text-xs text-gray-500">
                  涨跌额
                </th>
                <th className="px-6 py-3.5 text-right font-medium uppercase tracking-wider text-xs text-gray-500">
                  涨跌幅
                </th>
                <th className="px-6 py-3.5 text-left font-medium uppercase tracking-wider text-xs text-gray-500">
                  产地
                </th>
                <th className="px-6 py-3.5 text-left font-medium uppercase tracking-wider text-xs text-gray-500">
                  规格
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {result.data.map((quote) => {
                const isUp = quote.change >= 0;
                return (
                  <tr
                    key={quote.id}
                    className="hover:bg-gray-50/80 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/prices/${quote.herb.id}`}
                        className="text-primary font-medium hover:underline decoration-primary/40 underline-offset-2 transition-colors"
                      >
                        {quote.herb.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {quote.herb.category}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold tabular-nums text-gray-900">
                      ¥{quote.price.toFixed(2)}
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold tabular-nums ${
                        isUp ? "text-red-600" : "text-emerald-600"
                      }`}
                    >
                      {isUp ? "+" : ""}
                      {quote.change.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tabular-nums ${
                          isUp
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {quote.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {quote.origin || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {quote.spec || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {result.data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              className="w-12 h-12 mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">暂无行情数据</p>
          </div>
        )}

        {result.totalPages > 1 && (
          <div className="border-t border-gray-100">
            <Pagination
              currentPage={result.page}
              totalPages={result.totalPages}
            />
          </div>
        )}
      </section>
    </div>
  );
}
