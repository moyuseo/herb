import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { herbs, prices, getPriceHistory } from '../mock'
import type { Herb, PriceItem, PriceHistory } from '../utils/types'

export const useHerbStore = defineStore('herb', () => {
  const herbList = ref<Herb[]>(herbs)
  const currentHerb = ref<Herb | null>(null)
  const searchQuery = ref('')

  const filteredHerbs = computed(() => {
    if (!searchQuery.value) return herbList.value
    const q = searchQuery.value.toLowerCase()
    return herbList.value.filter(h =>
      h.name.includes(q) || h.alias.some(a => a.includes(q)) || h.category.includes(q)
    )
  })

  function getHerbById(id: number): Herb | undefined {
    return herbList.value.find(h => h.id === id)
  }

  function getHerbPrices(herbId: number): PriceItem[] {
    return prices.filter(p => p.herbId === herbId)
  }

  function getHerbPriceHistory(herbId: number): PriceHistory[] {
    return getPriceHistory(herbId)
  }

  const topGainers = computed(() => {
    return [...prices]
      .sort((a, b) => b.dailyChange - a.dailyChange)
      .slice(0, 10)
  })

  const topLosers = computed(() => {
    return [...prices]
      .sort((a, b) => a.dailyChange - b.dailyChange)
      .slice(0, 10)
  })

  return {
    herbList, currentHerb, searchQuery, filteredHerbs,
    getHerbById, getHerbPrices, getHerbPriceHistory,
    topGainers, topLosers,
  }
})
