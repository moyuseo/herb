import { format } from "date-fns";
import {
  getCompositeIndexHistory,
  getLatestCompositeIndex,
  getLatestCategoryIndices,
  getLatestIndexTable,
} from "@/lib/db";
import IndexChart from "@/components/index/IndexChart";
import IndexSummary from "@/components/index/IndexSummary";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const metadata = {
  title: "价格指数 - 中药材信息网",
  description: "中药材价格指数走势与数据分析，综合指数及分类指数实时行情",
};

function ChangeCell({ change, changePercent }: { change: number; changePercent: number }) {
  const isUp = change > 0;
  const isDown = change < 0;
  const colorClass = isUp ? "text-red-600" : isDown ? "text-green-600" : "text-gray-600";
  const sign = isUp ? "+" : "";
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <div className={`flex items-center gap-1 ${colorClass}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{sign}{change.toFixed(2)}</span>
      <span className="text-xs">({sign}{changePercent.toFixed(2)}%)</span>
    </div>
  );
}

export default async function IndexPage() {
  const [compositeIndex, chartData, categoryIndices, tableData] =
    await Promise.all([
      getLatestCompositeIndex(),
      getCompositeIndexHistory(30),
      getLatestCategoryIndices(),
      getLatestIndexTable(),
    ]);

  const serializedChartData = chartData.map((d) => ({
    ...d,
    date: d.date.toISOString(),
    createdAt: d.createdAt.toISOString(),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">价格指数</h1>
        <p className="mt-1 text-sm text-gray-500">
          中药材价格指数走势与数据分析
        </p>
      </div>

      {compositeIndex ? (
        <IndexSummary
          value={compositeIndex.value}
          change={compositeIndex.change}
          changePercent={compositeIndex.changePercent}
          date={compositeIndex.date.toISOString()}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 text-center text-gray-400">
          暂无综合指数数据
        </div>
      )}

      <IndexChart initialData={serializedChartData} />

      {categoryIndices.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            分类指数
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryIndices.map((item) => {
              const isUp = item.change > 0;
              const isDown = item.change < 0;
              const colorClass = isUp
                ? "text-red-600"
                : isDown
                  ? "text-green-600"
                  : "text-gray-600";
              const sign = isUp ? "+" : "";
              const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-700">
                      {item.name}
                    </h3>
                    <Icon className={`h-4 w-4 ${colorClass}`} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.value.toFixed(2)}
                  </p>
                  <div className={`mt-1 text-sm ${colorClass}`}>
                    {sign}
                    {item.change.toFixed(2)} ({sign}
                    {item.changePercent.toFixed(2)}%)
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {tableData.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            指数数据明细
          </h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      指数名称
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      当前指数
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日涨跌
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日涨跌幅
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      日期
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-mono">
                        {item.value.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <ChangeCell
                          change={item.change}
                          changePercent={item.changePercent}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        <span
                          className={
                            item.changePercent > 0
                              ? "text-red-600"
                              : item.changePercent < 0
                                ? "text-green-600"
                                : "text-gray-600"
                          }
                        >
                          {item.changePercent > 0 ? "+" : ""}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-right hidden sm:table-cell">
                        {format(new Date(item.date), "yyyy-MM-dd")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
