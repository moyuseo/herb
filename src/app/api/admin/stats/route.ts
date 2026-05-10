import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [herbCount, quoteCount, newsCount, pendingSupplyCount] =
    await Promise.all([
      prisma.herb.count(),
      prisma.priceQuote.count(),
      prisma.newsArticle.count(),
      prisma.supplyDemand.count({ where: { status: "pending" } }),
    ]);

  return NextResponse.json({
    herbCount,
    quoteCount,
    newsCount,
    pendingSupplyCount,
  });
}
