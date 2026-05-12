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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            价格指数
          </h1>
        </div>
        <p className="text-text-secondary ml-[52px]">
          中药材价格指数走势与数据分析，综合指数及分类指数实时行情
        </p>
      </div>

      {compositeIndex ? (
        <div className="animate-fade-in-up delay-100">
          <IndexSummary
            value={compositeIndex.value}
            change={compositeIndex.change}
            changePercent={compositeIndex.changePercent}
            date={compositeIndex.date.toISOString()}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-8 text-center text-text-tertiary animate-fade-in-up delay-100">
          暂无综合指数数据
        </div>
      )}

      <div className="animate-fade-in-up delay-200">
        <IndexChart initialData={serializedChartData} />
      </div>

      {categoryIndices.length > 0 && (
        <section className="animate-fade-in-up delay-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-primary" />
            <h2 className="text-xl font-bold text-text-primary">分类指数</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryIndices.map((item, i) => {
              const isUp = item.change > 0;
              const isDown = item.change < 0;
              const colorClass = isUp
                ? "text-accent-red"
                : isDown
                  ? "text-accent-green"
                  : "text-text-tertiary";
              const bgClass = isUp
                ? "bg-red-50"
                : isDown
                  ? "bg-green-50"
                  : "bg-gray-50";
              const sign = isUp ? "+" : "";
              const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border border-border p-5 card-hover animate-fade-in-up`}
                  style={{ animationDelay: `${300 + i * 60}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-text-secondary truncate">
                      {item.name}
                    </h3>
                    <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${bgClass}`}>
                      <Icon className={`h-3.5 w-3.5 ${colorClass}`} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-text-primary tracking-tight">
                    {item.value.toFixed(2)}
                  </p>
                  <div className={`mt-2 text-sm font-medium ${colorClass}`}>
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
        <section className="animate-fade-in-up delay-400">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full bg-primary" />
            <h2 className="text-xl font-bold text-text-primary">指数数据明细</h2>
          </div>
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-alt">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                      指数名称
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                      当前指数
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                      日涨跌
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                      日涨跌幅
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-text-tertiary uppercase tracking-wider hidden sm:table-cell">
                      日期
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {tableData.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-alt/60 transition-colors">
                      <td className="px-5 py-3.5 text-sm font-semibold text-text-primary">
                        {item.name}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-primary text-right font-mono font-medium">
                        {item.value.toFixed(2)}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-right">
                        <ChangeCell
                          change={item.change}
                          changePercent={item.changePercent}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-sm text-right">
                        <span
                          className={
                            item.changePercent > 0
                              ? "text-accent-red font-medium"
                              : item.changePercent < 0
                                ? "text-accent-green font-medium"
                                : "text-text-tertiary"
                          }
                        >
                          {item.changePercent > 0 ? "+" : ""}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-text-tertiary text-right hidden sm:table-cell">
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
