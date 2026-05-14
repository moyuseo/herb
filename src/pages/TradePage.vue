<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Phone } from 'lucide-vue-next'
import { useTradeStore } from '../stores/trade'

const tradeStore = useTradeStore()
const activeTab = ref<'supply' | 'demand'>('supply')
const keyword = ref('')

const filteredSupplies = computed(() => {
  return tradeStore.supplyList.filter(s =>
    s.herbName.includes(keyword.value) || s.origin.includes(keyword.value)
  )
})

const filteredDemands = computed(() => {
  return tradeStore.demandList.filter(d =>
    d.herbName.includes(keyword.value)
  )
})
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5]">
    <div class="max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-[#1B5E20] mb-6" style="font-family: 'Noto Serif SC', serif;">供求大厅</h1>

      <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div class="flex border-b border-gray-100">
          <button
            :class="['flex-1 py-3 text-center text-sm font-medium transition-colors', activeTab === 'supply' ? 'text-[#1B5E20] border-b-2 border-[#1B5E20] bg-green-50/50' : 'text-gray-500 hover:text-[#1B5E20]']"
            @click="activeTab = 'supply'"
          >供应信息</button>
          <button
            :class="['flex-1 py-3 text-center text-sm font-medium transition-colors', activeTab === 'demand' ? 'text-[#1B5E20] border-b-2 border-[#1B5E20] bg-green-50/50' : 'text-gray-500 hover:text-[#1B5E20]']"
            @click="activeTab = 'demand'"
          >求购信息</button>
        </div>
        <div class="p-4">
          <div class="relative w-64">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="keyword" placeholder="搜索药材名称或产地" class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1B5E20]" />
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'supply'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in filteredSupplies" :key="item.id" class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">供</span>
            <span class="font-bold text-[#1B5E20]">{{ item.herbName }}</span>
            <span class="text-xs text-gray-400">{{ item.spec }}</span>
          </div>
          <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
            <span>产地：{{ item.origin }}</span>
            <span>数量：{{ item.quantity }}</span>
            <span class="text-[#C8A951] font-semibold">价格：{{ item.price }}</span>
            <span class="text-gray-400 text-xs">{{ item.publishTime }}</span>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-50 flex items-center justify-end text-sm text-gray-400">
            <Phone :size="14" class="mr-1" />
            <span>{{ item.contact }}</span>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in filteredDemands" :key="item.id" class="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-2 mb-3">
            <span class="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded">求</span>
            <span class="font-bold text-[#1B5E20]">{{ item.herbName }}</span>
            <span class="text-xs text-gray-400">{{ item.spec }}</span>
          </div>
          <div class="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
            <span>需求数量：{{ item.quantity }}</span>
            <span>交货地：{{ item.deliveryAddress }}</span>
            <span class="text-[#C8A951] font-semibold">已报价：{{ item.quoteCount }}条</span>
          </div>
          <div class="mt-3 pt-3 border-t border-gray-50 flex items-center justify-end text-sm text-gray-400">
            <Phone :size="14" class="mr-1" />
            <span>{{ item.contact }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
