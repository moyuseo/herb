<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Eye, Search } from 'lucide-vue-next'
import { useNewsStore } from '../stores/news'
import { useRouter } from 'vue-router'

const router = useRouter()
const newsStore = useNewsStore()

const filteredNews = computed(() => newsStore.filteredNews)
const categories = computed(() => newsStore.categories)

function goToDetail(id: number) {
  router.push(`/news/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-[#1B4332] mb-6" style="font-family: 'Noto Serif SC', serif;">资讯中心</h1>

      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="newsStore.selectedCategory = newsStore.selectedCategory === cat ? '' : cat"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              newsStore.selectedCategory === cat
                ? 'bg-[#1B4332] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B4332] hover:text-[#1B4332]'
            ]"
          >
            {{ cat }}
          </button>
        </div>

        <div class="relative md:ml-auto md:w-72">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="newsStore.searchQuery"
            type="text"
            placeholder="搜索新闻..."
            class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1B4332]"
          />
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="item in filteredNews"
          :key="item.id"
          @click="goToDetail(item.id)"
          class="flex bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
        >
          <img :src="item.coverImage" :alt="item.title" class="w-48 h-36 object-cover flex-shrink-0" loading="lazy" />
          <div class="flex flex-col justify-between p-4 flex-1 min-w-0">
            <div>
              <h3 class="text-lg font-semibold text-[#1B4332] line-clamp-1 mb-1">{{ item.title }}</h3>
              <p class="text-sm text-gray-500 line-clamp-2">{{ item.summary }}</p>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-400 mt-2">
              <span class="px-2 py-0.5 rounded bg-[#1B4332]/10 text-[#1B4332] font-medium">{{ item.category }}</span>
              <span class="flex items-center gap-1"><Clock class="w-3 h-3" />{{ item.publishTime }}</span>
              <span class="flex items-center gap-1"><Eye class="w-3 h-3" />{{ item.viewCount }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredNews.length === 0" class="text-center py-16 text-gray-400">
        暂无相关新闻
      </div>
    </div>
  </div>
</template>
