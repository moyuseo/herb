export interface Herb {
  id: number
  name: string
  alias: string[]
  category: string
  family: string
  part: string
  nature: string
  meridian: string[]
  efficacy: string
  contraindication: string
  image: string
  description: string
  usage: string
  originLocations: { lat: number; lng: number; name: string }[]
}

export interface PriceItem {
  id: number
  herbId: number
  herbName: string
  spec: string
  market: string
  origin: string
  price: number
  prevPrice: number
  dailyChange: number
  monthlyChange: number
  trend: 'up' | 'down' | 'stable'
  updateTime: string
}

export interface PriceHistory {
  herbId: number
  spec: string
  market: string
  dates: string[]
  prices: number[]
}

export interface NewsItem {
  id: number
  title: string
  category: string
  summary: string
  content: string
  coverImage: string
  publishTime: string
  viewCount: number
  relatedHerbs: number[]
}

export interface TradeItem {
  id: number
  type: 'supply' | 'demand'
  herbName: string
  spec: string
  origin: string
  quantity: string
  price: string
  contact: string
  publishTime: string
  status: 'active' | 'expired'
  quoteCount: number
  deliveryAddress: string
}

export interface MarketIndex {
  date: string
  compositeIndex: number
  herbIndex: number
  animalIndex: number
  mineralIndex: number
}

export interface HerbCategory {
  key: string
  name: string
  icon: string
  count: number
}
