import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/HomePage.vue') },
    { path: '/market', name: 'market', component: () => import('../pages/MarketPage.vue') },
    { path: '/market/history', name: 'marketHistory', component: () => import('../pages/MarketHistoryPage.vue') },
    { path: '/herb/:id', name: 'herbDetail', component: () => import('../pages/HerbDetailPage.vue') },
    { path: '/news', name: 'news', component: () => import('../pages/NewsPage.vue') },
    { path: '/news/:id', name: 'newsDetail', component: () => import('../pages/NewsDetailPage.vue') },
    { path: '/trade', name: 'trade', component: () => import('../pages/TradePage.vue') },
    { path: '/encyclopedia', name: 'encyclopedia', component: () => import('../pages/EncyclopediaPage.vue') },
    { path: '/encyclopedia/:id', name: 'encyclopediaDetail', component: () => import('../pages/EncyclopediaDetailPage.vue') },
    { path: '/data', name: 'dataCenter', component: () => import('../pages/DataCenterPage.vue') },
  ],
})

export default router
