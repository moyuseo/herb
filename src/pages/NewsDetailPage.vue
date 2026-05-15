<script setup lang="ts">
import { computed } from 'vue'
import { Clock, Eye, ArrowLeft, Tag } from 'lucide-vue-next'
import { useNewsStore } from '../stores/news'
import { useRoute, useRouter } from 'vue-router'
import { herbs } from '../mock'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const article = computed(() => newsStore.getNewsById(Number(route.params.id)))

const relatedHerbs = computed(() => {
  if (!article.value) return []
  return article.value.relatedHerbs
    .map(id => herbs.find(h => h.id === id))
    .filter(Boolean)
})

const relatedNews = computed(() => {
  if (!article.value) return []
  return newsStore.newsItems
    .filter(n => n.id !== article.value!.id && n.category === article.value!.category)
    .slice(0, 4)
})

function goBack() {
  router.back()
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5]" v-if="article">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <button @click="goBack" class="flex items-center gap-1 text-sm text-gray-500 hover:text-[#1B4332] mb-6 transition-colors">
        <ArrowLeft class="w-4 h-4" />返回列表
      </button>

      <article class="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <h1 class="text-2xl font-bold text-[#1B4332] mb-4" style="font-family: 'Noto Serif SC', serif;">{{ article.title }}</h1>

        <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
          <span class="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1B4332]/10 text-[#1B4332] font-medium">
            <Tag class="w-3 h-3" />{{ article.category }}
          </span>
          <span class="flex items-center gap-1"><Clock class="w-4 h-4" />{{ article.publishTime }}</span>
          <span class="flex items-center gap-1"><Eye class="w-4 h-4" />{{ article.viewCount }} 次浏览</span>
        </div>

        <div class="text-gray-700 leading-relaxed whitespace-pre-line">{{ article.content }}</div>
      </article>

      <section v-if="relatedHerbs.length" class="mt-8">
        <h2 class="text-xl font-semibold text-[#1B4332] mb-4" style="font-family: 'Noto Serif SC', serif;">相关药材</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="herb in relatedHerbs"
            :key="herb!.id"
            @click="router.push(`/herb/${herb!.id}`)"
            class="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-[#C8A951] transition-all"
          >
            <img :src="herb!.image" :alt="herb!.name" class="w-full h-28 object-cover rounded-lg mb-2" loading="lazy" />
            <p class="text-sm font-medium text-[#1B4332]">{{ herb!.name }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ herb!.alias.join('、') }}</p>
          </div>
        </div>
      </section>

      <section v-if="relatedNews.length" class="mt-8">
        <h2 class="text-xl font-semibold text-[#1B4332] mb-4" style="font-family: 'Noto Serif SC', serif;">相关新闻</h2>
        <div class="space-y-3">
          <div
            v-for="news in relatedNews"
            :key="news.id"
            @click="router.push(`/news/${news.id}`)"
            class="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md hover:border-[#C8A951] transition-all"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-[#C8A951] flex-shrink-0" />
            <span class="text-sm text-gray-700 line-clamp-1 flex-1">{{ news.title }}</span>
            <span class="text-xs text-gray-400 flex-shrink-0">{{ news.publishTime }}</span>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-gray-400">
    文章不存在
  </div>
</template>
