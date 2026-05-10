import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  getTopGainers,
  getTopLosers,
  getNewsList,
  getPriceIndexList,
  getSupplyDemandList,
} from "@/lib/db";
import MarketOverview from "@/components/home/MarketOverview";
import HotHerbs from "@/components/home/HotHerbs";
import LatestNews from "@/components/home/LatestNews";
import IndexMiniChart from "@/components/home/IndexMiniChart";
import LatestSupply from "@/components/home/LatestSupply";
import { TrendingUp, Newspaper, BarChart3, Handshake } from "lucide-react";

async function getMarketOverview() {
  const latestQuote = await prisma.priceQuote.findFirst({
    orderBy: { date: "desc" },
    select: { date: true },
  });

  let upCount = 0;
  let downCount = 0;
  let flatCount = 0;

  if (latestQuote) {
    const allTodayQuotes = await prisma.priceQuote.findMany({
      where: { date: latestQuote.date },
      select: { changePercent: true },
    });

    for (const q of allTodayQuotes) {
      if (q.changePercent > 0) upCount++;
      else if (q.changePercent < 0) downCount++;
      else flatCount++;
    }
  }

  return { upCount, downCount, flatCount };
}

export default async function Home() {
  const [overview, topGainers, topLosers, newsResult, indexData, supplyResult] =
    await Promise.all([
      getMarketOverview(),
      getTopGainers(3),
      getTopLosers(3),
      getNewsList({ isPublished: true, pageSize: 5 }),
      getPriceIndexList("综合指数", 30),
      getSupplyDemandList({ status: "approved", pageSize: 6 }),
    ]);

  const hotHerbs = [...topGainers, ...topLosers];
  const latestNews = newsResult.data;
  const latestSupply = supplyResult.data;

  return (
    <div>
      <section className="bg-primary text-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">中药材信息网</h1>
          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto">
            专业的中药材行业信息门户，为您提供价格行情、品种数据、行业资讯、供求信息等全方位服务
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-gray-900">今日行情概览</h2>
          </div>
          <MarketOverview
            upCount={overview.upCount}
            downCount={overview.downCount}
            flatCount={overview.flatCount}
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">热点品种</h2>
            </div>
            <Link
              href="/prices"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              查看更多 →
            </Link>
          </div>
          <HotHerbs herbs={hotHerbs} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">最新资讯</h2>
              </div>
              <Link
                href="/news"
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                查看更多 →
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <LatestNews news={latestNews} />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">综合指数走势</h2>
              </div>
              <Link
                href="/index"
                className="text-sm text-primary hover:text-primary-dark transition-colors"
              >
                查看更多 →
              </Link>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {indexData.length > 0 ? (
                <IndexMiniChart data={indexData} />
              ) : (
                <p className="text-gray-500 text-center py-8">暂无指数数据</p>
              )}
            </div>
          </section>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-gray-900">最新供求信息</h2>
            </div>
            <Link
              href="/supply"
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              查看更多 →
            </Link>
          </div>
          <LatestSupply supplies={latestSupply} />
        </section>
      </div>
    </div>
  );
}
