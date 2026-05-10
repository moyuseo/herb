export interface Herb {
  id: number;
  name: string;
  aliases: string | null;
  source: string | null;
  origin: string | null;
  category: string;
  properties: string | null;
  efficacy: string | null;
  usage: string | null;
  specGrade: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceQuote {
  id: number;
  herbId: number;
  price: number;
  change: number;
  changePercent: number;
  origin: string | null;
  spec: string | null;
  date: Date;
  createdAt: Date;
}

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  source: string | null;
  herbId: number | null;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupplyDemand {
  id: number;
  type: string;
  herbId: number;
  quantity: string;
  price: string | null;
  origin: string | null;
  contact: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PriceIndex {
  id: number;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  date: Date;
  createdAt: Date;
}

export interface MarketAnalysis {
  id: number;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HerbDetail extends Herb {
  quotes: PriceQuote[];
  supplies: SupplyDemand[];
  news: NewsArticle[];
}

export interface PriceQuoteWithHerb extends PriceQuote {
  herb: { id: number; name: string; category: string };
}

export interface NewsArticleWithHerb extends NewsArticle {
  herb: { id: number; name: string } | null;
}

export interface SupplyDemandWithHerb extends SupplyDemand {
  herb: { id: number; name: string; category: string };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
