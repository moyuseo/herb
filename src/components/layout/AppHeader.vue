<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Menu, X } from 'lucide-vue-next'

const router = useRouter()
const searchQuery = ref('')
const mobileMenuOpen = ref(false)

const navItems = [
  { label: '首页', path: '/' },
  { label: '行情中心', path: '/market' },
  { label: '资讯中心', path: '/news' },
  { label: '供求大厅', path: '/trade' },
  { label: '药材百科', path: '/encyclopedia' },
  { label: '数据中心', path: '/data' },
]

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/market', query: { q: searchQuery.value } })
  }
}
</script>

<template>
  <header class="bg-gradient-to-r from-[#1B4332] to-[#2D5A47] shadow-lg sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-3 shrink-0">
          <div class="w-10 h-10 bg-[#C8A951] rounded-lg flex items-center justify-center">
            <span class="text-[#1B4332] font-bold text-lg">本</span>
          </div>
          <div>
            <h1 class="text-white text-lg font-bold tracking-wide" style="font-family: 'Noto Serif SC', serif;">本草行情</h1>
            <p class="text-green-200 text-[10px] -mt-1">TCM Market Intelligence</p>
          </div>
        </router-link>

        <nav class="hidden lg:flex items-center gap-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="px-3 py-2 text-sm text-green-100 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
            active-class="!text-white !bg-white/15 font-medium"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <div class="hidden lg:flex items-center gap-3">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              placeholder="搜索药材品种..."
              class="w-48 h-8 pl-8 pr-3 text-sm bg-white/10 border border-white/20 rounded-full text-white placeholder-green-200 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
            />
            <Search class="absolute left-2.5 top-1.5 w-4 h-4 text-green-200" />
          </div>
          <button class="px-4 py-1.5 text-sm bg-[#C8A951] text-[#1B4332] font-medium rounded-full hover:bg-[#d4b85e] transition-colors">
            登录
          </button>
        </div>

        <button @click="mobileMenuOpen = !mobileMenuOpen" class="lg:hidden text-white p-2">
          <X v-if="mobileMenuOpen" class="w-6 h-6" />
          <Menu v-else class="w-6 h-6" />
        </button>
      </div>
    </div>

    <transition name="slide">
      <div v-if="mobileMenuOpen" class="lg:hidden bg-[#1B4332] border-t border-white/10 pb-4">
        <div class="px-4 pt-2 pb-3">
          <div class="relative">
            <input
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              placeholder="搜索药材品种..."
              class="w-full h-10 pl-10 pr-4 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-green-200 focus:outline-none focus:bg-white/20"
            />
            <Search class="absolute left-3 top-2.5 w-5 h-5 text-green-200" />
          </div>
        </div>
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="mobileMenuOpen = false"
          class="block px-6 py-3 text-green-100 hover:text-white hover:bg-white/10 transition-colors"
          active-class="!text-white !bg-white/15"
        >
          {{ item.label }}
        </router-link>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
