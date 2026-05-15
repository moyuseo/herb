<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePriceStore } from '../stores/price'
import { useHerbStore } from '../stores/herb'
import { markets } from '../mock'
import { formatPrice, formatChange, getTrendColor, getTrendText } from '../utils/format'

const router = useRouter()
const priceStore = usePriceStore()
const herbStore = useHerbStore()

const activeTab = ref('market')
const selectedMarket = ref('')
const searchText = ref('')
const selectedProvince = ref('')
const originSearch = ref('')

const provinces = computed(() => {
  const set = new Set(priceStore.priceList.map(i => i.origin).filter(Boolean))
  return Array.from(set)
})

const filteredMarketData = computed(() => {
  return priceStore.priceList.filter(item => {
    const matchMarket = !selectedMarket.value || item.market === selectedMarket.value
    const matchSearch = !searchText.value || item.herbName.includes(searchText.value)
    return matchMarket && matchSearch
  })
})

const filteredOriginData = computed(() => {
  return priceStore.priceList.filter(item => {
    const matchProvince = !selectedProvince.value || item.origin === selectedProvince.value
    const matchSearch = !originSearch.value || item.herbName.includes(originSearch.value)
    return matchProvince && matchSearch
  })
})

function onRowClick(row: any) {
  router.push(`/herb/${row.herbId}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] py-6 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold text-[#1B4332] mb-6" style="font-family: 'Noto Serif SC', serif;">行情价格中心</h1>

      <el-tabs v-model="activeTab" class="mb-6">
        <el-tab-pane label="市场价格" name="market" />
        <el-tab-pane label="产地价格" name="origin" />
      </el-tabs>

      <div v-if="activeTab === 'market'" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 p-4 border-b border-gray-100">
          <el-select v-model="selectedMarket" placeholder="选择市场" clearable class="w-48">
            <el-option v-for="m in markets" :key="m" :label="m" :value="m" />
          </el-select>
          <el-input v-model="searchText" placeholder="搜索药材名称" clearable class="w-64" />
        </div>
        <el-table :data="filteredMarketData" stripe @row-click="onRowClick" class="cursor-pointer">
          <el-table-column prop="herbName" label="药材名称" min-width="120">
            <template #default="{ row }">
              <span class="font-medium text-[#1B4332]">{{ row.herbName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" min-width="100" />
          <el-table-column prop="market" label="市场" min-width="100" />
          <el-table-column prop="price" label="价格(元/kg)" min-width="120">
            <template #default="{ row }">
              <span class="font-semibold">¥{{ formatPrice(row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="日涨跌" min-width="100">
            <template #default="{ row }">
              <span :style="{ color: getTrendColor(row.trend) }">
                {{ formatChange(row.dailyChange) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="月涨跌" min-width="100">
            <template #default="{ row }">
              <span :style="{ color: getTrendColor(row.monthlyChange > 0 ? 'up' : row.monthlyChange < 0 ? 'down' : 'stable') }">
                {{ formatChange(row.monthlyChange) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="走势" min-width="80" align="center">
            <template #default="{ row }">
              <span class="inline-block px-2 py-0.5 text-xs rounded-full" :style="{ backgroundColor: getTrendColor(row.trend) + '15', color: getTrendColor(row.trend) }">
                {{ getTrendText(row.trend) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="activeTab === 'origin'" class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="flex items-center gap-4 p-4 border-b border-gray-100">
          <el-select v-model="selectedProvince" placeholder="选择产地" clearable class="w-48">
            <el-option v-for="p in provinces" :key="p" :label="p" :value="p" />
          </el-select>
          <el-input v-model="originSearch" placeholder="搜索药材名称" clearable class="w-64" />
        </div>
        <el-table :data="filteredOriginData" stripe @row-click="onRowClick" class="cursor-pointer">
          <el-table-column prop="herbName" label="药材名称" min-width="120">
            <template #default="{ row }">
              <span class="font-medium text-[#1B4332]">{{ row.herbName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="spec" label="规格" min-width="100" />
          <el-table-column prop="origin" label="产地" min-width="120" />
          <el-table-column prop="price" label="价格(元/kg)" min-width="120">
            <template #default="{ row }">
              <span class="font-semibold">¥{{ formatPrice(row.price) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="月涨跌" min-width="100">
            <template #default="{ row }">
              <span :style="{ color: getTrendColor(row.monthlyChange > 0 ? 'up' : row.monthlyChange < 0 ? 'down' : 'stable') }">
                {{ formatChange(row.monthlyChange) }}
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
