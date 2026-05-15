<script setup lang="ts">
import { ref, shallowRef, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as echarts from 'echarts'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ArrowLeft, MapPin, TrendingUp, Clock, Eye } from 'lucide-vue-next'
import { formatPrice, formatChange, getTrendColor, getTrendText } from '../utils/format'
import { herbs, newsList, tradeItems } from '../mock'
import { useHerbStore } from '../stores/herb'

const route = useRoute()
const router = useRouter()
const herbStore = useHerbStore()

const herbId = computed(() => Number(route.params.id))
const herb = computed(() => herbs.find(h => h.id === herbId.value))
const herbPrices = computed(() => herbStore.getHerbPrices(herbId.value))
const priceHistoryData = computed(() => herbStore.getHerbPriceHistory(herbId.value))

const relatedNews = computed(() => {
  if (!herb.value) return []
  return newsList.filter(n => n.relatedHerbs.includes(herbId.value)).slice(0, 3)
})

const relatedTrades = computed(() => {
  if (!herb.value) return []
  return tradeItems.filter(t => t.herbName === herb.value!.name).slice(0, 3)
})

const chartRef = ref<HTMLElement | null>(null)
let chartInstance: echarts.ECharts | null = null

const mapRef = ref<HTMLElement | null>(null)
let mapInstance: L.Map | null = null

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  const history = priceHistoryData.value
  if (history.length === 0) return

  const series = history.map((h, idx) => ({
    name: h.spec,
    type: 'line' as const,
    data: h.prices,
    smooth: true,
    lineStyle: { width: 2 },
    itemStyle: { color: ['#1B4332', '#C8A951', '#E53935', '#43A047'][idx % 4] },
    areaStyle: { opacity: 0.05 },
  }))

  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: history[0]?.dates || [], axisLabel: { fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { formatter: (v: number) => '¥' + v.toFixed(0) } },
    series,
  })
}

function initMap() {
  if (!mapRef.value || !herb.value?.originLocations?.length) return
  const first = herb.value.originLocations[0]
  mapInstance = L.map(mapRef.value).setView([first.lat, first.lng], 5)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapInstance)
  herb.value.originLocations.forEach(o => {
    L.marker([o.lat, o.lng]).addTo(mapInstance!).bindPopup(`<b>${o.name}</b>`)
  })
}

onMounted(() => {
  nextTick(() => {
    initChart()
    initMap()
  })
  window.addEventListener('resize', () => chartInstance?.resize())
})

onUnmounted(() => {
  chartInstance?.dispose()
  mapInstance?.remove()
})

watch(herbId, () => {
  nextTick(() => {
    chartInstance?.dispose()
    mapInstance?.remove()
    initChart()
    initMap()
  })
})

function goBack() { router.back() }
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5]">
    <div class="max-w-5xl mx-auto px-4 py-6">
      <button @click="goBack" class="flex items-center gap-1 text-sm mb-4 text-[#1B4332] hover:underline">
        <ArrowLeft :size="18" /> 返回
      </button>

      <div v-if="herb" class="space-y-5">
        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">{{ herb.name }}</h1>
              <p class="text-gray-500 text-sm mt-1">别名：{{ herb.alias.join('、') }}</p>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-medium text-white bg-[#C8A951]">
              {{ herb.category }}
            </span>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            <div><span class="text-gray-400 text-xs">科属</span><p class="text-sm font-medium mt-1">{{ herb.family }}</p></div>
            <div><span class="text-gray-400 text-xs">药用部位</span><p class="text-sm font-medium mt-1">{{ herb.part }}</p></div>
            <div><span class="text-gray-400 text-xs">性味</span><p class="text-sm font-medium mt-1">{{ herb.nature }}</p></div>
            <div><span class="text-gray-400 text-xs">归经</span><p class="text-sm font-medium mt-1">{{ herb.meridian.join('、') }}</p></div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-sm"><span class="font-medium text-[#1B4332]">功效：</span>{{ herb.efficacy }}</p>
            <p class="text-sm mt-2"><span class="font-medium text-red-600">禁忌：</span>{{ herb.contraindication }}</p>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-bold mb-4 text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">
            <TrendingUp :size="20" class="inline mr-1" />多规格价格对比
          </h2>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="text-gray-400 text-xs border-b border-gray-100">
                  <th class="py-2 text-left">规格</th>
                  <th class="py-2 text-left">市场</th>
                  <th class="py-2 text-right">价格</th>
                  <th class="py-2 text-right">日涨跌</th>
                  <th class="py-2 text-center">走势</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in herbPrices" :key="p.id" class="border-b border-gray-50">
                  <td class="py-2">{{ p.spec }}</td>
                  <td class="py-2 text-gray-500">{{ p.market }}</td>
                  <td class="py-2 text-right font-medium">¥{{ formatPrice(p.price) }}</td>
                  <td class="py-2 text-right" :style="{ color: getTrendColor(p.trend) }">
                    {{ formatChange(p.dailyChange) }}
                  </td>
                  <td class="py-2 text-center">
                    <span class="inline-block px-2 py-0.5 text-xs rounded-full" :style="{ backgroundColor: getTrendColor(p.trend) + '15', color: getTrendColor(p.trend) }">
                      {{ getTrendText(p.trend) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-bold mb-4 text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">
            <TrendingUp :size="20" class="inline mr-1" />价格走势
          </h2>
          <div ref="chartRef" class="w-full h-72"></div>
        </div>

        <div class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-bold mb-4 text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">
            <MapPin :size="20" class="inline mr-1" />产地分布
          </h2>
          <div ref="mapRef" class="w-full h-72 rounded-lg z-0"></div>
        </div>

        <div v-if="relatedNews.length" class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-bold mb-4 text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">
            <Clock :size="20" class="inline mr-1" />相关资讯
          </h2>
          <div class="space-y-3">
            <router-link v-for="n in relatedNews" :key="n.id" :to="`/news/${n.id}`"
              class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 hover:text-[#1B4332] transition-colors">
              <span class="text-sm truncate flex-1">{{ n.title }}</span>
              <span class="text-xs text-gray-400 ml-3">{{ n.publishTime.slice(5, 16) }}</span>
            </router-link>
          </div>
        </div>

        <div v-if="relatedTrades.length" class="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h2 class="text-lg font-bold mb-4 text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">
            <Eye :size="20" class="inline mr-1" />相关供求
          </h2>
          <div class="space-y-3">
            <div v-for="t in relatedTrades" :key="t.id"
              class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full" :class="t.type === 'supply' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'">
                  {{ t.type === 'supply' ? '供' : '求' }}
                </span>
                <span class="text-sm">{{ t.spec }} | {{ t.quantity }}</span>
              </div>
              <span class="text-sm text-gray-500">{{ t.price }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-20 text-gray-400">
        <p class="text-lg">品种不存在</p>
      </div>
    </div>
  </div>
</template>
