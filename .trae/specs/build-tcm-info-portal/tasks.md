# Tasks

- [x] Task 1: 初始化 Next.js 项目基础架构
  - [x] SubTask 1.1: 使用 create-next-app 创建 Next.js 14+ 项目（App Router、TypeScript、Tailwind CSS）
  - [x] SubTask 1.2: 配置项目目录结构（app路由、components、lib、types等）
  - [x] SubTask 1.3: 安装核心依赖（Prisma、ECharts、lucide-react等）
  - [x] SubTask 1.4: 创建全局布局组件（Header导航、Footer、侧边栏）

- [x] Task 2: 设计数据库模型与数据层
  - [x] SubTask 2.1: 编写 Prisma Schema（品种、行情、资讯、供求、指数、用户等模型）
  - [x] SubTask 2.2: 执行数据库迁移
  - [x] SubTask 2.3: 编写种子数据脚本（预置20+品种、行情、资讯等示例数据）
  - [x] SubTask 2.4: 创建数据访问工具函数（lib/db.ts）

- [x] Task 3: 实现首页聚合展示
  - [x] SubTask 3.1: 创建首页布局与组件结构
  - [x] SubTask 3.2: 实现行情概览卡片（涨跌统计、热点品种）
  - [x] SubTask 3.3: 实现最新资讯列表组件
  - [x] SubTask 3.4: 实现价格指数迷你走势图
  - [x] SubTask 3.5: 实现最新供求信息摘要组件

- [x] Task 4: 实现中药材价格行情模块
  - [x] SubTask 4.1: 创建行情列表页面（表格展示、分类筛选、搜索）
  - [x] SubTask 4.2: 实现涨跌排行组件（涨幅/跌幅前10）
  - [x] SubTask 4.3: 创建品种行情详情页面（ECharts历史走势图、价格统计）
  - [x] SubTask 4.4: 实现行情数据 API 路由

- [x] Task 5: 实现中药材品种数据库模块
  - [x] SubTask 5.1: 创建品种列表页面（分类筛选、搜索）
  - [x] SubTask 5.2: 创建品种详情页面（基本信息、性味归经、功效、行情、资讯）
  - [x] SubTask 5.3: 实现品种数据 API 路由

- [x] Task 6: 实现行业资讯模块
  - [x] SubTask 6.1: 创建资讯列表页面（分类筛选、分页）
  - [x] SubTask 6.2: 创建资讯详情页面（正文、相关推荐）
  - [x] SubTask 6.3: 实现资讯 API 路由

- [x] Task 7: 实现供求信息模块
  - [x] SubTask 7.1: 创建供求信息列表页面（类型筛选、品种筛选）
  - [x] SubTask 7.2: 创建供求信息发布表单页面
  - [x] SubTask 7.3: 实现供求信息 API 路由

- [x] Task 8: 实现价格指数模块
  - [x] SubTask 8.1: 创建价格指数页面（综合指数走势图、分类指数）
  - [x] SubTask 8.2: 实现指数数据 API 路由

- [x] Task 9: 实现市场分析模块
  - [x] SubTask 9.1: 创建市场分析文章列表页面（分类筛选）
  - [x] SubTask 9.2: 创建分析文章详情页面
  - [x] SubTask 9.3: 实现分析文章 API 路由

- [x] Task 10: 实现后台管理功能
  - [x] SubTask 10.1: 创建后台管理布局与导航
  - [x] SubTask 10.2: 实现品种数据管理（CRUD）
  - [x] SubTask 10.3: 实现行情数据管理（录入、编辑）
  - [x] SubTask 10.4: 实现资讯内容管理（新增、编辑、发布、下架）
  - [x] SubTask 10.5: 实现供求信息审核（通过、拒绝）

- [x] Task 11: 响应式适配与优化
  - [x] SubTask 11.1: 全站移动端响应式适配
  - [x] SubTask 11.2: 验证所有页面在桌面端和移动端的显示效果

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 2]
- [Task 5] depends on [Task 2]
- [Task 6] depends on [Task 2]
- [Task 7] depends on [Task 2]
- [Task 8] depends on [Task 2]
- [Task 9] depends on [Task 2]
- [Task 10] depends on [Task 2]
- [Task 11] depends on [Task 3, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9, Task 10]
- [Task 4, Task 5, Task 6, Task 7, Task 8, Task 9] 可并行开发
