import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { prices, markets } from '../mock'
import type { PriceItem } from '../utils/types'

export const usePriceStore = defineStore('price', () => {
  const priceList = ref<PriceItem[]>(prices)
  const selectedMarket = ref('')
  const searchQuery = ref('')
  const priceType = ref<'market' | 'origin'>('market')

  const filteredPrices = computed(() => {
    let result = priceList.value
    if (selectedMarket.value) {
      result = result.filter(p => p.market === selectedMarket.value)
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(p => p.herbName.includes(q) || p.spec.includes(q))
    }
    return result
  })

  const marketOptions = computed(() => markets)

  const stats = computed(() => {
    const up = priceList.value.filter(p => p.trend === 'up').length
    const down = priceList.value.filter(p => p.trend === 'down').length
    const stable = priceList.value.filter(p => p.trend === 'stable').length
    return { up, down, stable, total: priceList.value.length }
  })

  return {
    priceList, selectedMarket, searchQuery, priceType,
    filteredPrices, marketOptions, stats,
  }
})
