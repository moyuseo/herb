import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma, Prisma };

export interface HerbListFilters {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getHerbList(filters: HerbListFilters = {}) {
  const { category, search, page = 1, pageSize = 20 } = filters;

  const where: Prisma.HerbWhereInput = {};
  if (category) {
    where.category = category;
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { aliases: { contains: search } },
      { origin: { contains: search } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.herb.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.herb.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export interface PriceListFilters {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getPriceList(filters: PriceListFilters = {}) {
  const { category, search, page = 1, pageSize = 20 } = filters;

  const latestQuote = await prisma.priceQuote.findFirst({
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (!latestQuote) {
    return { data: [], total: 0, page, pageSize, totalPages: 0 };
  }

  const where: Prisma.PriceQuoteWhereInput = {
    date: latestQuote.date,
  };

  if (category || search) {
    const herbWhere: Prisma.HerbWhereInput = {};
    if (category) herbWhere.category = category;
    if (search) {
      herbWhere.OR = [
        { name: { contains: search } },
        { aliases: { contains: search } },
      ];
    }
    where.herb = herbWhere;
  }

  const [data, total] = await Promise.all([
    prisma.priceQuote.findMany({
      where,
      include: { herb: { select: { id: true, name: true, category: true } } },
      orderBy: { changePercent: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.priceQuote.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getHerbById(id: number) {
  return prisma.herb.findUnique({
    where: { id },
    include: {
      quotes: {
        orderBy: { date: "desc" },
        take: 30,
      },
      supplies: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      news: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });
}

export interface QuoteFilters {
  herbId?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export async function getLatestQuotes(filters: QuoteFilters = {}) {
  const { herbId, startDate, endDate, page = 1, pageSize = 20 } = filters;

  const where: Prisma.PriceQuoteWhereInput = {};
  if (herbId) {
    where.herbId = herbId;
  }
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = startDate;
    if (endDate) where.date.lte = endDate;
  }

  const [data, total] = await Promise.all([
    prisma.priceQuote.findMany({
      where,
      include: { herb: { select: { id: true, name: true, category: true } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.priceQuote.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getQuoteHistory(herbId: number, days: number = 30) {
  if (days <= 0) {
    return prisma.priceQuote.findMany({
      where: { herbId },
      orderBy: { date: "asc" },
    });
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return prisma.priceQuote.findMany({
    where: {
      herbId,
      date: { gte: startDate },
    },
    orderBy: { date: "asc" },
  });
}

export async function getTopGainers(limit: number = 10) {
  const latestDate = await prisma.priceQuote.findFirst({
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (!latestDate) return [];

  return prisma.priceQuote.findMany({
    where: { date: latestDate.date },
    include: { herb: { select: { id: true, name: true, category: true } } },
    orderBy: { changePercent: "desc" },
    take: limit,
  });
}

export async function getTopLosers(limit: number = 10) {
  const latestDate = await prisma.priceQuote.findFirst({
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (!latestDate) return [];

  return prisma.priceQuote.findMany({
    where: { date: latestDate.date },
    include: { herb: { select: { id: true, name: true, category: true } } },
    orderBy: { changePercent: "asc" },
    take: limit,
  });
}

export interface NewsFilters {
  category?: string;
  herbId?: number;
  isPublished?: boolean;
  page?: number;
  pageSize?: number;
}

export async function getNewsList(filters: NewsFilters = {}) {
  const { category, herbId, isPublished, page = 1, pageSize = 20 } = filters;

  const where: Prisma.NewsArticleWhereInput = {};
  if (category) where.category = category;
  if (herbId) where.herbId = herbId;
  if (isPublished !== undefined) where.isPublished = isPublished;

  const [data, total] = await Promise.all([
    prisma.newsArticle.findMany({
      where,
      include: { herb: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsArticle.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getNewsById(id: number) {
  return prisma.newsArticle.findUnique({
    where: { id },
    include: { herb: { select: { id: true, name: true } } },
  });
}

export async function getRelatedNews(category: string, excludeId: number, limit: number = 5) {
  return prisma.newsArticle.findMany({
    where: {
      category,
      isPublished: true,
      id: { not: excludeId },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      category: true,
      source: true,
      createdAt: true,
    },
  });
}

export interface SupplyDemandFilters {
  type?: string;
  herbId?: number;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export async function getSupplyDemandList(filters: SupplyDemandFilters = {}) {
  const { type, herbId, status, search, page = 1, pageSize = 20 } = filters;

  const where: Prisma.SupplyDemandWhereInput = {};
  if (type) where.type = type;
  if (herbId) where.herbId = herbId;
  if (status) where.status = status;
  if (search) {
    where.herb = { name: { contains: search } };
  }

  const [data, total] = await Promise.all([
    prisma.supplyDemand.findMany({
      where,
      include: { herb: { select: { id: true, name: true, category: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.supplyDemand.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getPriceIndexList(name?: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const where: Prisma.PriceIndexWhereInput = {
    date: { gte: startDate },
  };
  if (name) where.name = name;

  return prisma.priceIndex.findMany({
    where,
    orderBy: { date: "asc" },
  });
}

export async function getLatestPriceIndex() {
  return prisma.priceIndex.findFirst({
    orderBy: { date: "desc" },
  });
}

export async function getLatestCompositeIndex() {
  return prisma.priceIndex.findFirst({
    where: { name: "综合指数" },
    orderBy: { date: "desc" },
  });
}

export async function getCompositeIndexHistory(days: number = 30) {
  return getPriceIndexList("综合指数", days);
}

export async function getLatestCategoryIndices() {
  const latestRecord = await prisma.priceIndex.findFirst({
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (!latestRecord) return [];

  return prisma.priceIndex.findMany({
    where: {
      date: latestRecord.date,
      NOT: { name: "综合指数" },
    },
    orderBy: { changePercent: "desc" },
  });
}

export async function getLatestIndexTable() {
  const latestRecord = await prisma.priceIndex.findFirst({
    orderBy: { date: "desc" },
    select: { date: true },
  });

  if (!latestRecord) return [];

  return prisma.priceIndex.findMany({
    where: { date: latestRecord.date },
    orderBy: { name: "asc" },
  });
}

export interface MarketAnalysisFilters {
  category?: string;
  isPublished?: boolean;
  page?: number;
  pageSize?: number;
}

export async function getMarketAnalysisById(id: number) {
  return prisma.marketAnalysis.findUnique({
    where: { id },
  });
}

export async function getRelatedAnalysis(category: string, excludeId: number, limit: number = 5) {
  return prisma.marketAnalysis.findMany({
    where: {
      category,
      isPublished: true,
      id: { not: excludeId },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getMarketAnalysisList(filters: MarketAnalysisFilters = {}) {
  const { category, isPublished, page = 1, pageSize = 20 } = filters;

  const where: Prisma.MarketAnalysisWhereInput = {};
  if (category) where.category = category;
  if (isPublished !== undefined) where.isPublished = isPublished;

  const [data, total] = await Promise.all([
    prisma.marketAnalysis.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.marketAnalysis.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getSupplyDemandById(id: number) {
  return prisma.supplyDemand.findUnique({
    where: { id },
    include: { herb: { select: { id: true, name: true, category: true } } },
  });
}
