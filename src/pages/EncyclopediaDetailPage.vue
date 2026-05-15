<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Leaf, Heart } from 'lucide-vue-next'
import { herbs } from '../mock'

const route = useRoute()
const router = useRouter()

const herb = computed(() => {
  return herbs.find(h => h.id === Number(route.params.id))
})

const infoItems = computed(() => {
  if (!herb.value) return []
  const h = herb.value
  return [
    { label: '别名', value: h.alias.join('、') },
    { label: '类别', value: h.category },
    { label: '科属', value: h.family },
    { label: '药用部位', value: h.part },
    { label: '性味', value: h.nature },
    { label: '归经', value: h.meridian.join('、') },
  ]
})
</script>

<template>
  <div class="min-h-screen bg-[#FAF8F5]" v-if="herb">
    <div class="max-w-4xl mx-auto px-4 py-6">
      <button @click="router.back()" class="flex items-center gap-1 text-sm mb-4 text-[#1B4332] hover:underline">
        <ArrowLeft :size="18" /> 返回
      </button>

      <div class="bg-gradient-to-br from-[#1B4332] to-[#2D5A47] rounded-xl p-6 mb-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold" style="font-family: 'Noto Serif SC', serif;">{{ herb.name }}</h1>
          <Heart :size="22" class="text-[#C8A951] cursor-pointer hover:scale-110 transition-transform" />
        </div>
        <div class="flex justify-center">
          <div class="w-40 h-40 rounded-xl overflow-hidden border-2 border-[#C8A951]/50">
            <img :src="herb.image" :alt="herb.name" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div v-for="item in infoItems" :key="item.label" class="flex flex-col">
            <span class="text-xs text-gray-400">{{ item.label }}</span>
            <span class="text-sm text-[#1B4332] font-medium mt-0.5">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
        <div class="flex items-center gap-2 mb-2">
          <Leaf :size="16" class="text-[#1B4332]" />
          <h3 class="font-bold text-[#1B4332] text-sm">功效</h3>
        </div>
        <p class="text-sm text-gray-600 leading-relaxed">{{ herb.efficacy }}</p>
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
        <h3 class="font-bold text-[#1B4332] text-sm mb-2">用法用量</h3>
        <p class="text-sm text-gray-600 leading-relaxed">{{ herb.usage }}</p>
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-4">
        <h3 class="font-bold text-[#1B4332] text-sm mb-2">禁忌</h3>
        <p class="text-sm text-red-500 leading-relaxed">{{ herb.contraindication }}</p>
      </div>

      <div class="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h3 class="font-bold text-[#1B4332] text-sm mb-2">详细描述</h3>
        <p class="text-sm text-gray-600 leading-relaxed">{{ herb.description }}</p>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-gray-400">
    药材信息不存在
  </div>
</template>
