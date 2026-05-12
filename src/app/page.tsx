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
      <section className="hero-gradient relative overflow-hidden text-white py-20 sm:py-28">
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 animate-fade-in-up"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.25)" }}
          >
            中药材信息网
          </h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-3xl mx-auto mb-10 animate-fade-in-up delay-100 leading-relaxed">
            专业的中药材行业信息门户，为您提供价格行情、品种数据、行业资讯、供求信息等全方位服务
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5 animate-fade-in-up delay-200">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/25 backdrop-blur-sm border border-emerald-400/30 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              涨 {overview.upCount}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/25 backdrop-blur-sm border border-red-400/30 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              跌 {overview.downCount}
            </span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-white/60" />
              平 {overview.flatCount}
            </span>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <MarketOverview
            upCount={overview.upCount}
            downCount={overview.downCount}
            flatCount={overview.flatCount}
          />
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-surface-alt py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">热点品种</h2>
            </div>
            <Link
              href="/prices"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              查看更多 →
            </Link>
          </div>
          <div className="animate-fade-in-up delay-100">
            <HotHerbs herbs={hotHerbs} />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                    <Newspaper className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">最新资讯</h2>
                </div>
                <Link
                  href="/news"
                  className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  查看更多 →
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6 animate-fade-in-up delay-100">
                <LatestNews news={latestNews} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">综合指数走势</h2>
                </div>
                <Link
                  href="/index"
                  className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  查看更多 →
                </Link>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-5 sm:p-6 animate-fade-in-up delay-200">
                {indexData.length > 0 ? (
                  <IndexMiniChart data={indexData} />
                ) : (
                  <p className="text-gray-500 text-center py-8">暂无指数数据</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-surface-alt py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <Handshake className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">最新供求信息</h2>
            </div>
            <Link
              href="/supply"
              className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
            >
              查看更多 →
            </Link>
          </div>
          <div className="animate-fade-in-up delay-100">
            <LatestSupply supplies={latestSupply} />
          </div>
        </div>
      </section>
    </div>
  );
}
