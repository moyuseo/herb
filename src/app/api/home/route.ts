import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
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

    const topGainers = latestQuote
      ? await prisma.priceQuote.findMany({
          where: { date: latestQuote.date },
          include: { herb: { select: { id: true, name: true, category: true } } },
          orderBy: { changePercent: "desc" },
          take: 3,
        })
      : [];

    const topLosers = latestQuote
      ? await prisma.priceQuote.findMany({
          where: { date: latestQuote.date },
          include: { herb: { select: { id: true, name: true, category: true } } },
          orderBy: { changePercent: "asc" },
          take: 3,
        })
      : [];

    const latestNews = await prisma.newsArticle.findMany({
      where: { isPublished: true },
      include: { herb: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const indexData = await prisma.priceIndex.findMany({
      where: {
        name: "综合指数",
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: "asc" },
    });

    const latestSupply = await prisma.supplyDemand.findMany({
      where: { status: "approved" },
      include: { herb: { select: { id: true, name: true, category: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: { upCount, downCount, flatCount },
        hotHerbs: [...topGainers, ...topLosers],
        latestNews,
        indexData,
        latestSupply,
      },
    });
  } catch (error) {
    console.error("Failed to fetch home data:", error);
    return NextResponse.json(
      { success: false, error: "获取首页数据失败" },
      { status: 500 }
    );
  }
}
