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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">中药材价格行情</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">涨跌排行</h2>
        <TopMovers />
      </section>

      <section className="mb-6">
        <PriceFilters />
      </section>

      <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  品种
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  分类
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  最新价
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  涨跌额
                </th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">
                  涨跌幅
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  产地
                </th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  规格
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {result.data.map((quote) => {
                const isUp = quote.change >= 0;
                return (
                  <tr
                    key={quote.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/prices/${quote.herb.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {quote.herb.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {quote.herb.category}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      ¥{quote.price.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        isUp ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isUp ? "+" : ""}
                      {quote.change.toFixed(2)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        isUp ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isUp ? "+" : ""}
                      {quote.changePercent.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {quote.origin || "-"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {quote.spec || "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {result.data.length === 0 && (
          <div className="text-center py-12 text-gray-400">暂无行情数据</div>
        )}

        {result.totalPages > 1 && (
          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
          />
        )}
      </section>
    </div>
  );
}
