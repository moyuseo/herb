<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { marketIndexData } from '../mock'
import { usePriceStore } from '../stores/price'

const priceStore = usePriceStore()

const lineChartRef = ref<HTMLElement | null>(null)
const barChartRef = ref<HTMLElement | null>(null)
let lineChart: echarts.ECharts | null = null
let barChart: echarts.ECharts | null = null

const stats = priceStore.stats

onMounted(() => {
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    lineChart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, textStyle: { fontSize: 11 } },
      grid: { left: 50, right: 20, top: 20, bottom: 40 },
      xAxis: {
        type: 'category',
        data: marketIndexData.map(d => d.date),
        axisLabel: { fontSize: 10, color: '#999' },
        axisLine: { lineStyle: { color: '#ddd' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#999' },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
      },
      series: [
        {
          name: '综合指数',
          data: marketIndexData.map(d => d.compositeIndex),
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#1B4332', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(27,94,32,0.25)' },
              { offset: 1, color: 'rgba(27,94,32,0.02)' },
            ]),
          },
        },
        {
          name: '药材指数',
          data: marketIndexData.map(d => d.herbIndex),
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#C8A951', width: 2 },
        },
      ],
    })
  }

  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    barChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: 50, right: 20, top: 20, bottom: 30 },
      xAxis: {
        type: 'category',
        data: ['上涨', '下跌', '持平'],
        axisLabel: { fontSize: 11, color: '#666' },
        axisLine: { lineStyle: { color: '#ddd' } },
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 10, color: '#999' },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
      },
      series: [{
        type: 'bar',
        data: [
          { value: stats.up, itemStyle: { color: '#E53935' } },
          { value: stats.down, itemStyle: { color: '#43A047' } },
          { value: stats.stable, itemStyle: { color: '#78909C' } },
        ],
        barWidth: 48,
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      }],
    })
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  lineChart?.dispose()
  barChart?.dispose()
})

function handleResize() {
  lineChart?.resize()
  barChart?.resize()
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-[#1B4332] mb-6" style="font-family: 'Noto Serif SC', serif;">数据中心</h1>

      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p class="text-xs text-gray-400 mb-1">上涨品种</p>
          <p class="text-3xl font-bold text-[#E53935]">{{ stats.up }}</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p class="text-xs text-gray-400 mb-1">下跌品种</p>
          <p class="text-3xl font-bold text-[#43A047]">{{ stats.down }}</p>
        </div>
        <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-center">
          <p class="text-xs text-gray-400 mb-1">持平品种</p>
          <p class="text-3xl font-bold text-[#78909C]">{{ stats.stable }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <h2 class="text-lg font-bold text-[#1B4332] mb-4" style="font-family: 'Noto Serif SC', serif;">市场综合指数</h2>
        <div ref="lineChartRef" class="w-full h-72"></div>
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-[#1B4332] mb-4" style="font-family: 'Noto Serif SC', serif;">涨跌统计</h2>
        <div ref="barChartRef" class="w-full h-64"></div>
      </div>
    </div>
  </div>
</template>
