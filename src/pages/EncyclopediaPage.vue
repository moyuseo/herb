<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'
import { herbs, herbCategories } from '../mock'

const router = useRouter()
const keyword = ref('')
const activeCategory = ref('全部')

const categories = ['全部', ...herbCategories.map(c => c.name)]

const filteredHerbs = computed(() => {
  return herbs.filter(h => {
    const matchName = !keyword.value || h.name.includes(keyword.value) || h.alias.some(a => a.includes(keyword.value))
    const matchCategory = activeCategory.value === '全部' || h.category === herbCategories.find(c => c.name === activeCategory.value)?.key
    return matchName && matchCategory
  })
})

function goDetail(id: number) {
  router.push(`/encyclopedia/${id}`)
}
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-[#1B4332] mb-6" style="font-family: 'Noto Serif SC', serif;">药材百科</h1>

      <div class="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat"
            :class="['px-3 py-1.5 rounded-full text-sm transition-colors', activeCategory === cat ? 'bg-[#1B4332] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1B4332]']"
            @click="activeCategory = cat"
          >{{ cat }}</button>
        </div>
        <div class="relative md:ml-auto md:w-64">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="keyword" placeholder="搜索药材名称" class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:border-[#1B4332]" />
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="herb in filteredHerbs"
          :key="herb.id"
          class="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:shadow-md hover:border-[#C8A951] transition-all"
          @click="goDetail(herb.id)"
        >
          <div class="h-36 bg-gray-100 overflow-hidden">
            <img :src="herb.image" :alt="herb.name" class="w-full h-full object-cover" loading="lazy" />
          </div>
          <div class="p-3">
            <h3 class="font-bold text-[#1B4332] text-sm">{{ herb.name }}</h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ herb.family }} · {{ herb.part }}</p>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ herb.efficacy }}</p>
          </div>
        </div>
      </div>

      <div v-if="filteredHerbs.length === 0" class="text-center py-16 text-gray-400">
        暂无匹配的药材
      </div>
    </div>
  </div>
</template>
