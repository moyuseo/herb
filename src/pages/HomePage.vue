<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHerbStore } from '../stores/herb'
import { usePriceStore } from '../stores/price'
import { useNewsStore } from '../stores/news'
import { useTradeStore } from '../stores/trade'
import { herbCategories, marketIndexData } from '../mock'
import { formatPrice, formatChange, getTrendColor, getTrendText } from '../utils/format'
import { TrendingUp, TrendingDown, Minus, ArrowRight, Clock, Eye, Phone, Flame } from 'lucide-vue-next'

const router = useRouter()
const herbStore = useHerbStore()
const priceStore = usePriceStore()
const newsStore = useNewsStore()
const tradeStore = useTradeStore()

const stats = computed(() => priceStore.stats)
const latestIndex = computed(() => marketIndexData[marketIndexData.length - 1])
const prevIndex = computed(() => marketIndexData[marketIndexData.length - 2])
const indexChange = computed(() => {
  if (!latestIndex.value || !prevIndex.value) return 0
  return ((latestIndex.value.compositeIndex - prevIndex.value.compositeIndex) / prevIndex.value.compositeIndex * 100)
})

const topGainers = computed(() => herbStore.topGainers)
const topLosers = computed(() => herbStore.topLosers)
const latestNews = computed(() => newsStore.filteredNews.slice(0, 5))
const supplyItems = computed(() => tradeStore.supplyList.slice(0, 4))
const demandItems = computed(() => tradeStore.demandList.slice(0, 4))
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-[#1B4332] via-[#2D5A47] to-[#388E3C] overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#C8A951] blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-white blur-3xl"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div class="lg:col-span-1 flex flex-col justify-center">
            <h2 class="text-white text-2xl font-bold mb-2" style="font-family: 'Noto Serif SC', serif;">今日行情概览</h2>
            <p class="text-green-200 text-sm">{{ new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
          </div>
          <div class="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p class="text-green-200 text-xs mb-1">综合指数</p>
              <p class="text-white text-2xl font-bold">{{ latestIndex?.compositeIndex.toFixed(2) }}</p>
              <p class="text-sm mt-1" :class="indexChange >= 0 ? 'text-red-300' : 'text-green-300'">
                {{ indexChange >= 0 ? '▲' : '▼' }} {{ Math.abs(indexChange).toFixed(2) }}%
              </p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p class="text-green-200 text-xs mb-1">上涨品种</p>
              <p class="text-red-300 text-2xl font-bold">{{ stats.up }}</p>
              <div class="flex items-center gap-1 mt-1"><TrendingUp class="w-3 h-3 text-red-300" /><span class="text-red-300 text-xs">涨</span></div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p class="text-green-200 text-xs mb-1">下跌品种</p>
              <p class="text-green-300 text-2xl font-bold">{{ stats.down }}</p>
              <div class="flex items-center gap-1 mt-1"><TrendingDown class="w-3 h-3 text-green-300" /><span class="text-green-300 text-xs">跌</span></div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p class="text-green-200 text-xs mb-1">持平品种</p>
              <p class="text-gray-300 text-2xl font-bold">{{ stats.stable }}</p>
              <div class="flex items-center gap-1 mt-1"><Minus class="w-3 h-3 text-gray-300" /><span class="text-gray-300 text-xs">稳</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Category Navigation -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">品种分类</h3>
          <router-link to="/encyclopedia" class="text-sm text-[#C8A951] hover:underline flex items-center gap-1">
            查看全部 <ArrowRight class="w-3 h-3" />
          </router-link>
        </div>
        <div class="grid grid-cols-5 md:grid-cols-10 gap-3">
          <router-link
            v-for="cat in herbCategories"
            :key="cat.key"
            :to="{ path: '/market', query: { category: cat.key } }"
            class="flex flex-col items-center gap-1.5 p-3 bg-white rounded-xl border border-gray-100 hover:border-[#C8A951] hover:shadow-md transition-all duration-200 group"
          >
            <span class="text-2xl group-hover:scale-110 transition-transform">{{ cat.icon }}</span>
            <span class="text-xs text-gray-600 group-hover:text-[#1B4332] font-medium">{{ cat.name }}</span>
          </router-link>
        </div>
      </section>

      <!-- Top Gainers & Losers -->
      <section class="mb-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-red-50 to-white px-5 py-3 border-b border-red-100 flex items-center gap-2">
              <Flame class="w-4 h-4 text-red-500" />
              <h3 class="font-bold text-red-700">涨幅排行</h3>
            </div>
            <div class="p-4">
              <div
                v-for="(item, idx) in topGainers"
                :key="item.id"
                @click="router.push(`/herb/${item.herbId}`)"
                class="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-red-50/50 px-2 rounded transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span class="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" :class="idx < 3 ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600'">{{ idx + 1 }}</span>
                  <span class="font-medium text-gray-800">{{ item.herbName }}</span>
                  <span class="text-xs text-gray-400">{{ item.spec }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-600">¥{{ formatPrice(item.price) }}</span>
                  <span class="text-sm font-medium text-red-500 w-16 text-right">+{{ item.dailyChange.toFixed(2) }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="bg-gradient-to-r from-green-50 to-white px-5 py-3 border-b border-green-100 flex items-center gap-2">
              <TrendingDown class="w-4 h-4 text-green-600" />
              <h3 class="font-bold text-green-700">跌幅排行</h3>
            </div>
            <div class="p-4">
              <div
                v-for="(item, idx) in topLosers"
                :key="item.id"
                @click="router.push(`/herb/${item.herbId}`)"
                class="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-green-50/50 px-2 rounded transition-colors"
              >
                <div class="flex items-center gap-3">
                  <span class="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" :class="idx < 3 ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600'">{{ idx + 1 }}</span>
                  <span class="font-medium text-gray-800">{{ item.herbName }}</span>
                  <span class="text-xs text-gray-400">{{ item.spec }}</span>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-600">¥{{ formatPrice(item.price) }}</span>
                  <span class="text-sm font-medium text-green-600 w-16 text-right">{{ item.dailyChange.toFixed(2) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- News & Trade -->
      <section class="mb-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- News -->
          <div class="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">热门资讯</h3>
              <router-link to="/news" class="text-sm text-[#C8A951] hover:underline flex items-center gap-1">
                更多 <ArrowRight class="w-3 h-3" />
              </router-link>
            </div>
            <div class="divide-y divide-gray-50">
              <router-link
                v-for="news in latestNews"
                :key="news.id"
                :to="`/news/${news.id}`"
                class="flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors"
              >
                <img :src="news.coverImage" :alt="news.title" class="w-24 h-16 object-cover rounded-lg shrink-0" loading="lazy" />
                <div class="flex-1 min-w-0">
                  <h4 class="text-sm font-medium text-gray-800 line-clamp-2 mb-1">{{ news.title }}</h4>
                  <p class="text-xs text-gray-400 line-clamp-1">{{ news.summary }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-xs px-2 py-0.5 bg-[#1B4332]/5 text-[#1B4332] rounded-full">{{ news.category }}</span>
                    <span class="text-xs text-gray-400 flex items-center gap-1"><Clock class="w-3 h-3" />{{ news.publishTime.slice(5, 16) }}</span>
                    <span class="text-xs text-gray-400 flex items-center gap-1"><Eye class="w-3 h-3" />{{ news.viewCount }}</span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Trade Quick View -->
          <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">最新供求</h3>
              <router-link to="/trade" class="text-sm text-[#C8A951] hover:underline flex items-center gap-1">
                更多 <ArrowRight class="w-3 h-3" />
              </router-link>
            </div>
            <div class="p-4 space-y-3">
              <div
                v-for="item in [...supplyItems.slice(0, 2), ...demandItems.slice(0, 2)]"
                :key="item.id"
                class="p-3 rounded-lg border border-gray-100 hover:border-[#C8A951] transition-colors"
              >
                <div class="flex items-center justify-between mb-1.5">
                  <span class="font-medium text-gray-800">{{ item.herbName }}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full" :class="item.type === 'supply' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'">
                    {{ item.type === 'supply' ? '供' : '求' }}
                  </span>
                </div>
                <div class="text-xs text-gray-400 space-y-0.5">
                  <p>规格：{{ item.spec }} | 数量：{{ item.quantity }}</p>
                  <p>产地：{{ item.origin }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Market Price Quick View -->
      <section class="mb-10">
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 class="font-bold text-[#1B4332]" style="font-family: 'Noto Serif SC', serif;">市场价格快览</h3>
            <router-link to="/market" class="text-sm text-[#C8A951] hover:underline flex items-center gap-1">
              查看全部 <ArrowRight class="w-3 h-3" />
            </router-link>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-500">
                  <th class="px-4 py-3 text-left font-medium">品种</th>
                  <th class="px-4 py-3 text-left font-medium">规格</th>
                  <th class="px-4 py-3 text-left font-medium">市场</th>
                  <th class="px-4 py-3 text-right font-medium">今日价</th>
                  <th class="px-4 py-3 text-right font-medium">日涨跌</th>
                  <th class="px-4 py-3 text-right font-medium">月涨跌</th>
                  <th class="px-4 py-3 text-center font-medium">走势</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in priceStore.priceList.slice(0, 12)"
                  :key="item.id"
                  @click="router.push(`/herb/${item.herbId}`)"
                  class="border-b border-gray-50 hover:bg-[#1B4332]/5 cursor-pointer transition-colors"
                >
                  <td class="px-4 py-3 font-medium text-[#1B4332]">{{ item.herbName }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ item.spec }}</td>
                  <td class="px-4 py-3 text-gray-500">{{ item.market }}</td>
                  <td class="px-4 py-3 text-right font-medium">¥{{ formatPrice(item.price) }}</td>
                  <td class="px-4 py-3 text-right font-medium" :style="{ color: getTrendColor(item.trend) }">
                    {{ formatChange(item.dailyChange) }}
                  </td>
                  <td class="px-4 py-3 text-right font-medium" :style="{ color: getTrendColor(item.monthlyChange > 0 ? 'up' : item.monthlyChange < 0 ? 'down' : 'stable') }">
                    {{ formatChange(item.monthlyChange) }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span class="inline-block px-2 py-0.5 text-xs rounded-full" :style="{ backgroundColor: getTrendColor(item.trend) + '15', color: getTrendColor(item.trend) }">
                      {{ getTrendText(item.trend) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
