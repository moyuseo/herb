export function formatPrice(price: number): string {
  return price.toFixed(2)
}

export function formatChange(change: number): string {
  const sign = change > 0 ? '+' : ''
  return `${sign}${change.toFixed(2)}%`
}

export function formatDate(dateStr: string): string {
  return dateStr.slice(0, 10)
}

export function getTrendColor(trend: 'up' | 'down' | 'stable'): string {
  if (trend === 'up') return '#E53935'
  if (trend === 'down') return '#43A047'
  return '#78909C'
}

export function getTrendText(trend: 'up' | 'down' | 'stable'): string {
  if (trend === 'up') return '涨'
  if (trend === 'down') return '跌'
  return '稳'
}

export function generatePriceHistory(basePrice: number, days: number): { dates: string[]; prices: number[] } {
  const dates: string[] = []
  const prices: number[] = []
  const now = new Date()
  let price = basePrice * (0.7 + Math.random() * 0.3)

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    dates.push(date.toISOString().slice(0, 10))
    price = price * (0.97 + Math.random() * 0.06)
    prices.push(Math.round(price * 100) / 100)
  }

  return { dates, prices }
}
