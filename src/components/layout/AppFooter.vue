<script setup lang="ts">
</script>

<template>
  <footer class="bg-[#1a1a1a] text-gray-400 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-8 h-8 bg-[#C8A951] rounded-lg flex items-center justify-center">
              <span class="text-[#1B5E20] font-bold text-sm">本</span>
            </div>
            <span class="text-white font-bold" style="font-family: 'Noto Serif SC', serif;">本草行情</span>
          </div>
          <p class="text-sm leading-relaxed">中药材行业一站式行情信息服务平台，致力于为产业链上下游提供精准、及时、专业的市场数据与行业资讯。</p>
        </div>
        <div>
          <h4 class="text-white font-medium mb-4">行情服务</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/market" class="hover:text-[#C8A951] transition-colors">市场价格</router-link></li>
            <li><router-link to="/market/history" class="hover:text-[#C8A951] transition-colors">历史价格</router-link></li>
            <li><router-link to="/data" class="hover:text-[#C8A951] transition-colors">价格指数</router-link></li>
            <li><router-link to="/data" class="hover:text-[#C8A951] transition-colors">产地热力图</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-medium mb-4">信息中心</h4>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/news" class="hover:text-[#C8A951] transition-colors">品种分析</router-link></li>
            <li><router-link to="/news" class="hover:text-[#C8A951] transition-colors">药市动态</router-link></li>
            <li><router-link to="/trade" class="hover:text-[#C8A951] transition-colors">供求大厅</router-link></li>
            <li><router-link to="/encyclopedia" class="hover:text-[#C8A951] transition-colors">药材百科</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-medium mb-4">关于我们</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-[#C8A951] transition-colors">平台介绍</a></li>
            <li><a href="#" class="hover:text-[#C8A951] transition-colors">联系我们</a></li>
            <li><a href="#" class="hover:text-[#C8A951] transition-colors">服务协议</a></li>
            <li><a href="#" class="hover:text-[#C8A951] transition-colors">隐私政策</a></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        <p>© 2026 本草行情 TCM Market Intelligence. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
