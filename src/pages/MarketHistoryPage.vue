<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useHerbStore } from '../stores/herb'
import * as echarts from 'echarts'

const herbStore = useHerbStore()

const herbName = ref('')
const currentHerbId = ref<number | null>(null)
const activeRange = ref('1y')
const chartRef = ref<HTMLElement | null>(null)
const searched = ref(false)

let chartInstance: echarts.ECharts | null = null

const timeRanges = [
  { label: '1月', value: '1m' },
  { label: '3月', value: '3m' },
  { label: '1年', value: '1y' },
  { label: '3年', value: '3y' },
  { label: '全部', value: 'all' }
]

const currentHerb = computed(() => {
  if (!currentHerbId.value) return null
  return herbStore.getHerbById(currentHerbId.value)
})

const priceHistoryData = computed(() => {
  if (!currentHerbId.value) return []
  return herbStore.getHerbPriceHistory(currentHerbId.value)
})

const hasData = computed(() => priceHistoryData.value.length > 0)

function getRangeSlice(arr: any[], range: string) {
  const len = arr.length
  if (range === '1m') return arr.slice(Math.max(0, len - 30))
  if (range === '3m') return arr.slice(Math.max(0, len - 90))
  if (range === '1y') return arr.slice(Math.max(0, len - 365))
  if (range === '3y') return arr.slice(Math.max(0, len - 1095))
  return arr
}

function onSearch() {
  if (!herbName.value.trim()) return
  const found = herbStore.herbList.find(h => h.name === herbName.value.trim())
  if (!found) {
    searched.value = true
    currentHerbId.value = null
    return
  }
  currentHerbId.value = found.id
  searched.value = true
  nextTick(() => renderChart())
}

function renderChart() {
  if (!chartRef.value || priceHistoryData.value.length === 0) return
  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const history = priceHistoryData.value
  const dates = getRangeSlice(history[0]?.dates || [], activeRange.value)

  const series = history.map((h, idx) => {
    const prices = getRangeSlice(h.prices, activeRange.value)
    return {
      name: h.spec,
      type: 'line' as const,
      data: prices,
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2 },
      itemStyle: { color: ['#1B5E20', '#C8A951', '#E53935', '#43A047'][idx % 4] },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(27,94,32,0.15)' },
          { offset: 1, color: 'rgba(27,94,32,0.02)' }
        ])
      }
    }
  })

  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 60, right: 30, top: 30, bottom: 40 },
    xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 10 } },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 11, formatter: (v: number) => `¥${v.toFixed(0)}` }
    },
    series,
  }, true)
}

watch(activeRange, () => {
  if (currentHerbId.value) renderChart()
})

onMounted(() => {
  window.addEventListener('resize', () => chartInstance?.resize())
})

onUnmounted(() => {
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5] py-6 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-2xl font-bold text-[#1B5E20] mb-6" style="font-family: 'Noto Serif SC', serif;">历史价格查询</h1>

      <div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center gap-4 mb-6">
          <el-input v-model="herbName" placeholder="输入药材名称搜索" clearable class="w-64" @keyup.enter="onSearch" />
          <button class="px-4 py-2 bg-[#1B5E20] text-white rounded-lg hover:bg-[#2E7D32] transition-colors" @click="onSearch">
            查询
          </button>
        </div>

        <div v-if="currentHerb" class="mb-4">
          <h2 class="text-lg font-semibold text-[#1B5E20]">{{ currentHerb.name }}</h2>
        </div>

        <div v-if="currentHerb" class="flex items-center gap-2 mb-6">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            :class="[
              'px-3 py-1 rounded-full text-sm border transition-colors',
              activeRange === range.value
                ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B5E20]'
            ]"
            @click="activeRange = range.value"
          >
            {{ range.label }}
          </button>
        </div>

        <div v-if="hasData" ref="chartRef" class="w-full h-96" />
        <div v-else-if="searched" class="text-center text-gray-400 py-20">
          {{ currentHerbId ? '暂无价格数据' : '未找到该品种，请检查名称后重试' }}
        </div>
      </div>
    </div>
  </div>
</template>
