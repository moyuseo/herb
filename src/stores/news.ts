import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { newsList } from '../mock'
import type { NewsItem } from '../utils/types'

export const useNewsStore = defineStore('news', () => {
  const newsItems = ref<NewsItem[]>(newsList)
  const selectedCategory = ref('')
  const searchQuery = ref('')

  const categories = ['品种分析', '药市动态', '集采资讯', '政策法规', '采购招标', '种植技术']

  const filteredNews = computed(() => {
    let result = newsItems.value
    if (selectedCategory.value) {
      result = result.filter(n => n.category === selectedCategory.value)
    }
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      result = result.filter(n => n.title.includes(q) || n.summary.includes(q))
    }
    return result
  })

  function getNewsById(id: number): NewsItem | undefined {
    return newsItems.value.find(n => n.id === id)
  }

  return {
    newsItems, selectedCategory, searchQuery, categories,
    filteredNews, getNewsById,
  }
})
