<template>
  <MainLayout>
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title fade-in">
            <span class="gradient-text">{{ authStore.isAuthenticated ? `欢迎回来，${authStore.user?.username}` : '导航空间' }}</span>
            <span class="hero-subtitle">您的个人网址收藏夹</span>
          </h1>
          <p class="hero-description fade-in" style="animation-delay: 0.2s">
            整理、分类、快速访问您的常用网站
          </p>
          
          <!-- 搜索框 -->
          <div class="search-container fade-in" style="animation-delay: 0.4s">
            <div class="search-box">
              <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/>
              </svg>
              <input 
                type="text" 
                v-model="searchQuery"
                class="search-input" 
                placeholder="搜索链接..."
                @input="handleSearch"
              />
              <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.646 4.646a.5.5 0 01.708 0L8 7.293l2.646-2.647a.5.5 0 01.708.708L8.707 8l2.647 2.646a.5.5 0 01-.708.708L8 8.707l-2.646 2.647a.5.5 0 01-.708-.708L7.293 8 4.646 5.354a.5.5 0 010-.708z"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- 快速操作 -->
          <div class="quick-actions fade-in" style="animation-delay: 0.6s" v-if="authStore.isAuthenticated">
            <router-link to="/categories" class="action-btn primary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"/>
              </svg>
              管理分类
            </router-link>
            <router-link :to="`/share/${authStore.user?.id}`" class="action-btn secondary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
              </svg>
              我的分享页
            </router-link>
            <button @click="handleAddQuickLink" class="action-btn tertiary">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
              </svg>
              快速添加
            </button>
          </div>
          <div v-else class="auth-prompt fade-in" style="animation-delay: 0.6s">
            <p>登录后即可管理您的个人导航</p>
            <router-link to="/login" class="action-btn primary">
              立即登录
            </router-link>
          </div>
        </div>

        <!-- 装饰元素 -->
        <div class="hero-decoration">
          <div class="floating-card card-1">
            <div class="card-icon">🌐</div>
          </div>
          <div class="floating-card card-2">
            <div class="card-icon">📱</div>
          </div>
          <div class="floating-card card-3">
            <div class="card-icon">💻</div>
          </div>
          <div class="floating-card card-4">
            <div class="card-icon">🎯</div>
          </div>
        </div>
      </section>

      <!-- 分类导航区 -->
      <section v-if="authStore.isAuthenticated && !loadingData" class="categories-section">
        <div class="section-header">
          <h2 class="section-title">我的导航</h2>
          <div class="view-toggle">
            <button 
              @click="viewMode = 'grid'" 
              :class="['view-btn', { active: viewMode === 'grid' }]"
              title="网格视图"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"/>
              </svg>
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="['view-btn', { active: viewMode === 'list' }]"
              title="列表视图"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 分类列表 -->
        <div v-if="filteredCategories.length > 0" :class="['categories-container', viewMode]">
          <div 
            v-for="category in filteredCategories" 
            :key="category.id"
            class="category-card"
            :style="{ animationDelay: `${category.order * 0.1}s` }"
          >
            <div class="category-header">
              <h3 class="category-name">{{ category.name }}</h3>
              <span class="category-count">{{ getCategoryLinks(category.id).length }} 个链接</span>
            </div>
            
            <!-- 链接列表 -->
            <div class="links-grid">
              <a
                v-for="link in getCategoryLinks(category.id).slice(0, viewMode === 'grid' ? 6 : undefined)"
                :key="link.id"
                :href="formatLinkUrl(link.url)"
                target="_blank"
                class="link-item"
                :title="link.description || link.title"
              >
                <div class="link-icon">
                  <img 
                    v-if="link.icon" 
                    :src="link.icon" 
                    :alt="link.title"
                    @error="handleIconError($event)"
                  />
                  <span v-else class="default-icon">{{ getFirstLetter(link.title) }}</span>
                </div>
                <div class="link-content">
                  <span class="link-title">{{ link.title }}</span>
                  <span v-if="viewMode === 'list'" class="link-url">{{ formatUrl(link.url) }}</span>
                </div>
              </a>
              
              <!-- 查看更多 -->
              <router-link 
                v-if="viewMode === 'grid' && getCategoryLinks(category.id).length > 6"
                to="/categories"
                class="link-item more-link"
              >
                <div class="link-icon">
                  <span class="default-icon">+</span>
                </div>
                <div class="link-content">
                  <span class="link-title">查看全部</span>
                </div>
              </router-link>
            </div>

            <!-- 空状态 -->
            <div v-if="getCategoryLinks(category.id).length === 0" class="empty-links">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor" opacity="0.2">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-2 30h4v-4h-4v4zm4.13-8.19l-1.36-1.36c-1.04-1.04-1.69-1.91-1.69-4.02 0-1.7 1.34-3.04 3.04-3.04s3.04 1.34 3.04 3.04h3.47c0-3.49-2.86-6.35-6.35-6.35s-6.35 2.86-6.35 6.35c0 2.78 1.08 4.04 2.47 5.43l1.91 1.91c.52.52.86 1.22.86 2.01V30h4v-2c0-1.7-.65-3.34-1.83-4.52l-.21-.21z"/>
              </svg>
              <p>暂无链接</p>
            </div>
          </div>
        </div>

        <!-- 搜索结果为空 -->
        <div v-else-if="searchQuery" class="empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor" opacity="0.2">
            <path d="M28 8a20 20 0 100 40 20 20 0 000-40zM8 28C8 17 17 8 28 8s20 9 20 20-9 20-20 20S8 39 8 28z"/>
            <path d="M43.2 43.2a2 2 0 012.8 0l12 12a2 2 0 01-2.8 2.8l-12-12a2 2 0 010-2.8z"/>
          </svg>
          <h3>未找到相关链接</h3>
          <p>试试其他关键词</p>
          <button @click="clearSearch" class="action-btn secondary">
            清除搜索
          </button>
        </div>

        <!-- 无分类 -->
        <div v-else class="empty-state">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor" opacity="0.2">
            <path d="M14 10a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-8a4 4 0 00-4-4h-8zM14 38a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-8a4 4 0 00-4-4h-8zM38 14a4 4 0 014-4h8a4 4 0 014 4v8a4 4 0 01-4 4h-8a4 4 0 01-4-4v-8zM42 38a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4v-8a4 4 0 00-4-4h-8z"/>
          </svg>
          <h3>开始创建您的导航</h3>
          <p>添加分类并整理您的常用网站</p>
          <router-link to="/categories" class="action-btn primary">
            创建第一个分类
          </router-link>
        </div>
      </section>

      <!-- 加载状态 -->
      <section v-if="authStore.isAuthenticated && loadingData" class="loading-section">
        <div class="loading-container">
          <div class="loading-spinner-large"></div>
          <p>加载中...</p>
        </div>
      </section>

      <!-- 统计信息 -->
      <section v-if="authStore.isAuthenticated && !loadingData && stats.totalCategories > 0" class="stats-section">
        <div class="stats-container">
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 3H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM20 3h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM10 13H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1zM17 13a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2h-2a1 1 0 110-2h2v-2a1 1 0 011-1z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalCategories }}</div>
              <div class="stat-label">分类</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.totalLinks }}</div>
              <div class="stat-label">链接</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.recentLinks }}</div>
              <div class="stat-label">今日访问</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useLinkStore } from '../stores/linkStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import MainLayout from '../layouts/MainLayout.vue'

// Store
const authStore = useAuthStore()
const categoryStore = useCategoryStore()
const linkStore = useLinkStore()
const router = useRouter()

// 状态
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const loadingData = ref(false)

// 统计信息
const stats = computed(() => ({
  totalCategories: categoryStore.categories.length,
  totalLinks: linkStore.links.length,
  recentLinks: Math.floor(Math.random() * 10) + 5 // 模拟数据
}))

// 过滤后的分类
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categoryStore.categories
  }
  
  const query = searchQuery.value.toLowerCase()
  return categoryStore.categories.filter(category => {
    // 检查分类名称
    if (category.name.toLowerCase().includes(query)) {
      return true
    }
    // 检查该分类下的链接
    const categoryLinks = linkStore.getLinksByCategory(category.id)
    return categoryLinks.some(link => 
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query) ||
      (link.description && link.description.toLowerCase().includes(query))
    )
  })
})

// 获取分类下的链接
const getCategoryLinks = (categoryId: number) => {
  const links = linkStore.getLinksByCategory(categoryId)
  
  if (!searchQuery.value) {
    return links
  }
  
  const query = searchQuery.value.toLowerCase()
  return links.filter(link =>
    link.title.toLowerCase().includes(query) ||
    link.url.toLowerCase().includes(query) ||
    (link.description && link.description.toLowerCase().includes(query))
  )
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已通过computed属性实现
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
}

// 快速添加链接
const handleAddQuickLink = () => {
  ElMessage.info('快速添加功能开发中')
}

// 获取首字母
const getFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase()
}

// 格式化链接URL，确保有协议前缀
const formatLinkUrl = (url: string) => {
  // 如果URL已经包含协议，直接返回
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  // 如果URL不包含协议，添加 http://
  return 'http://' + url
}

// 格式化URL显示
const formatUrl = (url: string) => {
  try {
    // 先确保URL有协议
    const formattedUrl = formatLinkUrl(url)
    const urlObj = new URL(formattedUrl)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

// 处理图标加载错误
const handleIconError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    const span = document.createElement('span')
    span.className = 'default-icon'
    span.textContent = getFirstLetter(img.alt || 'L')
    parent.appendChild(span)
  }
}

// 初始化数据
onMounted(async () => {
  if (authStore.isAuthenticated) {
    loadingData.value = true
    try {
      await Promise.all([
        categoryStore.fetchCategories(),
        linkStore.fetchLinks()
      ])
    } catch (error) {
      ElMessage.error('加载数据失败')
    } finally {
      loadingData.value = false
    }
  }
})
</script>

<style scoped>
@import '../styles/global.css';

.home-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  margin-bottom: 16px;
}

.gradient-text {
  font-size: 48px;
  font-weight: 700;
  color: white;
  display: block;
  margin-bottom: 8px;
}

.hero-subtitle {
  font-size: 24px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  display: block;
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

/* 搜索框 */
.search-container {
  max-width: 500px;
  margin: 0 auto 32px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: var(--transition-base);
}

.search-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.25);
}

.search-icon {
  position: absolute;
  left: 20px;
  color: var(--text-secondary);
}

.search-input {
  width: 100%;
  padding: 16px 50px;
  font-size: 16px;
  border: none;
  background: transparent;
  color: var(--text-primary);
}

.search-input:focus {
  outline: none;
}

.clear-btn {
  position: absolute;
  right: 20px;
  padding: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
}

.clear-btn:hover {
  color: var(--text-primary);
}

/* 快速操作 */
.quick-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 12px;
  text-decoration: none;
  transition: var(--transition-base);
  cursor: pointer;
}

.action-btn.primary {
  background: rgba(255, 255, 255, 0.95);
  color: var(--primary-color);
}

.action-btn.primary:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
  transform: translateY(-2px);
}

.action-btn.tertiary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.action-btn.tertiary:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.auth-prompt {
  text-align: center;
}

.auth-prompt p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  margin-bottom: 16px;
}

/* 装饰元素 */
.hero-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-card {
  position: absolute;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 20s infinite ease-in-out;
}

.card-icon {
  font-size: 32px;
}

.card-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 20%;
  right: 15%;
  animation-delay: 5s;
}

.card-3 {
  bottom: 20%;
  left: 15%;
  animation-delay: 10s;
}

.card-4 {
  bottom: 10%;
  right: 10%;
  animation-delay: 15s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(5deg);
  }
  66% {
    transform: translateY(30px) rotate(-5deg);
  }
}

/* 分类导航区 */
.categories-section {
  padding: 60px 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
}

.view-toggle {
  display: flex;
  gap: 8px;
  background: var(--bg-color);
  padding: 4px;
  border-radius: 10px;
}

.view-btn {
  padding: 8px;
  border-radius: 8px;
  color: var(--text-secondary);
  transition: var(--transition-base);
  cursor: pointer;
}

.view-btn:hover {
  background: white;
  color: var(--primary-color);
}

.view-btn.active {
  background: white;
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

/* 分类容器 */
.categories-container {
  display: grid;
  gap: 24px;
}

.categories-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
}

.categories-container.list {
  grid-template-columns: 1fr;
}

.category-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  animation: slideUp 0.5s ease forwards;
  opacity: 0;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
}

.category-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.category-count {
  font-size: 14px;
  color: var(--text-secondary);
  background: var(--bg-color);
  padding: 4px 12px;
  border-radius: 20px;
}

/* 链接网格 */
.links-grid {
  display: grid;
  gap: 12px;
}

.categories-container.grid .links-grid {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.categories-container.list .links-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.link-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 12px;
  text-decoration: none;
  transition: var(--transition-base);
}

.categories-container.grid .link-item {
  flex-direction: column;
  text-align: center;
  gap: 8px;
}

.link-item:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.link-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.link-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.default-icon {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary-color);
}

.link-content {
  flex: 1;
  min-width: 0;
}

.categories-container.list .link-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.link-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-url {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-link {
  background: transparent;
  border: 2px dashed var(--border-color);
}

.more-link:hover {
  border-color: var(--primary-color);
  background: var(--primary-bg);
}

.more-link .default-icon {
  font-size: 24px;
}

/* 空状态 */
.empty-links {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary);
}

.empty-links p {
  margin-top: 12px;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-state svg {
  margin-bottom: 24px;
}

.empty-state h3 {
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.empty-state p {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

/* 加载状态 */
.loading-section {
  padding: 100px 20px;
  text-align: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(94, 114, 228, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* 统计信息 */
.stats-section {
  padding: 60px 20px;
  background: var(--bg-color);
}

.stats-container {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gradient-text {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 20px;
  }
  
  .categories-container.grid {
    grid-template-columns: 1fr;
  }
  
  .floating-card {
    display: none;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>