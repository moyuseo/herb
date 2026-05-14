import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { tradeItems } from '../mock'
import type { TradeItem } from '../utils/types'

export const useTradeStore = defineStore('trade', () => {
  const items = ref<TradeItem[]>(tradeItems)
  const activeTab = ref<'supply' | 'demand'>('supply')
  const searchQuery = ref('')

  const supplyList = computed(() => items.value.filter(i => i.type === 'supply'))
  const demandList = computed(() => items.value.filter(i => i.type === 'demand'))

  const filteredItems = computed(() => {
    const list = activeTab.value === 'supply' ? supplyList.value : demandList.value
    if (!searchQuery.value) return list
    const q = searchQuery.value.toLowerCase()
    return list.filter(i => i.herbName.includes(q) || i.spec.includes(q) || i.origin.includes(q))
  })

  return {
    items, activeTab, searchQuery,
    supplyList, demandList, filteredItems,
  }
})
