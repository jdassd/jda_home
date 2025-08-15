<template>
  <div class="share-page">
    <!-- 头部区域 -->
    <header class="share-header">
      <div class="header-content">
        <div class="user-info">
          <div class="avatar">
            <span>{{ username.charAt(0).toUpperCase() }}</span>
          </div>
          <div class="user-details">
            <h1 class="username">{{ username }} 的导航空间</h1>
            <p class="user-desc">{{ isOwner ? '这是您的个人导航主页' : '探索精选的网站收藏' }}</p>
          </div>
        </div>
        <div v-if="isOwner" class="owner-actions">
          <router-link to="/categories" class="manage-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
            管理我的导航
          </router-link>
          <button @click="copyShareLink" class="share-btn">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
            </svg>
            分享链接
          </button>
        </div>
        <div v-else-if="authStore.isAuthenticated" class="visitor-actions">
          <router-link :to="`/user/${authStore.user?.id}`" class="my-space-btn">
            访问我的空间
          </router-link>
        </div>
      </div>
    </header>

    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-container">
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
    </div>

    <!-- 主内容区 -->
    <main class="share-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>正在加载导航数据...</p>
      </div>

      <!-- 分类和链接 -->
      <div v-else-if="filteredCategories.length > 0" class="categories-grid">
        <div 
          v-for="category in filteredCategories" 
          :key="category.id"
          class="category-section"
        >
          <div class="category-header">
            <h2 class="category-title">{{ category.name }}</h2>
            <span class="link-count">{{ getFilteredCategoryLinks(category.id).length }} 个链接</span>
          </div>
          
          <div class="links-grid">
            <a
              v-for="link in getFilteredCategoryLinks(category.id)"
              :key="link.id"
              :href="formatLinkUrl(link.url)"
              target="_blank"
              rel="noopener noreferrer"
              class="link-card"
              :title="link.description || link.title"
            >
              <div class="link-icon">
                <span v-if="isEmoji(link.icon)">{{ link.icon }}</span>
                <img 
                  v-else-if="link.icon && link.icon.startsWith('http')" 
                  :src="link.icon" 
                  :alt="link.title"
                  @error="handleIconError($event, link.title)"
                />
                <span v-else class="icon-fallback">{{ getFirstLetter(link.title) }}</span>
              </div>
              <div class="link-info">
                <h3 class="link-title">{{ link.title }}</h3>
                <p v-if="link.description" class="link-desc">{{ link.description }}</p>
                <span class="link-url">{{ formatDisplayUrl(link.url) }}</span>
              </div>
              <div class="link-hover">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                </svg>
              </div>
            </a>
          </div>

          <div v-if="getFilteredCategoryLinks(category.id).length === 0" class="empty-category">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor" opacity="0.2">
              <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-2 30h4v-4h-4v4zm4.13-8.19l-1.36-1.36c-1.04-1.04-1.69-1.91-1.69-4.02 0-1.7 1.34-3.04 3.04-3.04s3.04 1.34 3.04 3.04h3.47c0-3.49-2.86-6.35-6.35-6.35s-6.35 2.86-6.35 6.35c0 2.78 1.08 4.04 2.47 5.43l1.91 1.91c.52.52.86 1.22.86 2.01V30h4v-2c0-1.7-.65-3.34-1.83-4.52l-.21-.21z"/>
            </svg>
            <p>该分类下暂无链接</p>
          </div>
        </div>
      </div>

      <!-- 搜索无结果 -->
      <div v-else-if="searchQuery && !loading" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor" opacity="0.2">
          <path d="M28 8a20 20 0 100 40 20 20 0 000-40zM8 28C8 17 17 8 28 8s20 9 20 20-9 20-20 20S8 39 8 28z"/>
          <path d="M43.2 43.2a2 2 0 012.8 0l12 12a2 2 0 01-2.8 2.8l-12-12a2 2 0 010-2.8z"/>
        </svg>
        <h3>未找到匹配的链接</h3>
        <p>请尝试其他关键词</p>
        <button @click="clearSearch" class="clear-search-btn">清除搜索</button>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!loading" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor" opacity="0.2">
          <path d="M32 6C17.64 6 6 17.64 6 32s11.64 26 26 26 26-11.64 26-26S46.36 6 32 6zm0 8c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm4 26H28v-2h4V28h-4v-2h6v12h2v2z"/>
        </svg>
        <h3>{{ isOwner ? '开始创建您的导航' : '暂无公开的导航内容' }}</h3>
        <p>{{ isOwner ? '添加分类和链接，打造您的个人导航空间' : '该用户尚未公开任何导航内容' }}</p>
        <router-link v-if="isOwner" to="/categories" class="action-btn">
          管理导航
        </router-link>
      </div>

      <!-- 错误状态 -->
      <div v-if="error" class="error-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor" opacity="0.2">
          <path d="M32 6C17.64 6 6 17.64 6 32s11.64 26 26 26 26-11.64 26-26S46.36 6 32 6zm-2 38h4v-4h-4v4zm0-8h4V18h-4v18z"/>
        </svg>
        <h3>加载失败</h3>
        <p>{{ error }}</p>
        <button @click="loadData" class="retry-btn">重试</button>
      </div>
    </main>

    <!-- 底部统计 -->
    <footer v-if="!loading && stats.totalCategories > 0" class="share-footer">
      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-value">{{ stats.totalCategories }}</span>
          <span class="stat-label">分类</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.totalLinks }}</span>
          <span class="stat-label">链接</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ stats.publicLinks }}</span>
          <span class="stat-label">公开链接</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore, type Category } from '../stores/categoryStore'
import { useLinkStore, type Link } from '../stores/linkStore'
import { useAuthStore } from '../stores/authStore'
import { ElMessage } from 'element-plus'
import api from '../utils/api'

const route = useRoute()
const router = useRouter()
const categoryStore = useCategoryStore()
const linkStore = useLinkStore()
const authStore = useAuthStore()

// 状态
const loading = ref(true)
const error = ref('')
const categories = ref<Category[]>([])
const links = ref<Link[]>([])
const username = ref('')
const searchQuery = ref('')

// 获取用户ID
const userId = computed(() => {
  const id = route.params.userId || route.query.userId
  return id ? parseInt(id as string) : null
})

// 判断是否为当前用户
const isOwner = computed(() => {
  return authStore.user && userId.value === authStore.user.id
})

// 统计数据
const stats = computed(() => {
  const publicLinks = links.value.filter(link => link.isPublic).length
  return {
    totalCategories: categories.value.length,
    totalLinks: links.value.length,
    publicLinks: isOwner.value ? publicLinks : links.value.length
  }
})

// 过滤后的分类
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categories.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(category => {
    // 检查分类名称
    if (category.name.toLowerCase().includes(query)) {
      return true
    }
    // 检查该分类下的链接
    const categoryLinks = links.value.filter(link => link.categoryId === category.id)
    return categoryLinks.some(link => 
      link.title.toLowerCase().includes(query) ||
      link.url.toLowerCase().includes(query) ||
      (link.description && link.description.toLowerCase().includes(query))
    )
  })
})

// 获取过滤后的分类链接
const getFilteredCategoryLinks = (categoryId: number) => {
  const categoryLinks = links.value.filter(link => link.categoryId === categoryId)
  
  if (!searchQuery.value) {
    return categoryLinks
  }
  
  const query = searchQuery.value.toLowerCase()
  return categoryLinks.filter(link =>
    link.title.toLowerCase().includes(query) ||
    link.url.toLowerCase().includes(query) ||
    (link.description && link.description.toLowerCase().includes(query))
  )
}

// 判断是否为emoji
const isEmoji = (str: string | undefined) => {
  if (!str) return false
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F000}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/u
  return emojiRegex.test(str)
}

// 获取首字母
const getFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase()
}

// 格式化链接URL
const formatLinkUrl = (url: string) => {
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  return 'http://' + url
}

// 格式化显示URL
const formatDisplayUrl = (url: string) => {
  try {
    const formattedUrl = formatLinkUrl(url)
    const urlObj = new URL(formattedUrl)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

// 处理图标加载错误
const handleIconError = (event: Event, title: string) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    const span = document.createElement('span')
    span.className = 'icon-fallback'
    span.textContent = getFirstLetter(title)
    parent.appendChild(span)
  }
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已通过computed属性实现
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
}

// 复制分享链接
const copyShareLink = async () => {
  const shareUrl = `${window.location.origin}/share/${userId.value}`
  try {
    await navigator.clipboard.writeText(shareUrl)
    ElMessage.success('分享链接已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 加载数据
const loadData = async () => {
  if (!userId.value) {
    error.value = '无效的用户ID'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    // 如果是当前用户，加载所有数据；否则只加载公开数据
    if (isOwner.value) {
      // 加载自己的所有分类和链接
      await Promise.all([
        categoryStore.fetchCategories(),
        linkStore.fetchLinks()
      ])
      categories.value = categoryStore.categories
      links.value = linkStore.links
      username.value = authStore.user?.username || ''
    } else {
      // 加载其他用户的公开分类和链接
      const [categoriesData, linksData, userInfo] = await Promise.all([
        categoryStore.fetchPublicCategories(userId.value),
        linkStore.fetchPublicLinks(userId.value),
        api.get(`/auth/users/${userId.value}/info`)
      ])
      categories.value = categoriesData
      links.value = linksData
      username.value = userInfo.data.username || `用户${userId.value}`
    }
  } catch (err: any) {
    console.error('加载数据失败:', err)
    error.value = err.response?.data?.message || '加载数据失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
@import '../styles/global.css';

.share-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
}

/* 头部区域 */
.share-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  color: white;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.user-details {
  flex: 1;
}

.username {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.user-desc {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.owner-actions,
.visitor-actions {
  display: flex;
  gap: 12px;
}

.manage-btn,
.share-btn,
.my-space-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.manage-btn:hover,
.share-btn:hover,
.my-space-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 搜索栏 */
.search-section {
  background: white;
  padding: 30px 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.search-box:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  left: 20px;
  color: #8492a6;
}

.search-input {
  width: 100%;
  padding: 16px 50px;
  font-size: 16px;
  border: none;
  background: transparent;
  color: #273444;
}

.search-input:focus {
  outline: none;
}

.clear-btn {
  position: absolute;
  right: 20px;
  padding: 4px;
  color: #8492a6;
  cursor: pointer;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: #273444;
}

/* 主内容区 */
.share-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 400px;
}

/* 分类网格 */
.categories-grid {
  display: grid;
  gap: 40px;
}

.category-section {
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.category-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e8ecf1;
}

.category-title {
  font-size: 24px;
  font-weight: 600;
  color: #273444;
  margin: 0;
}

.link-count {
  padding: 4px 12px;
  background: #f5f7fa;
  border-radius: 20px;
  font-size: 14px;
  color: #8492a6;
}

/* 链接网格 */
.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.link-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.link-card:hover .link-hover {
  opacity: 1;
  transform: translate(0, 0);
}

.link-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
}

.link-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.icon-fallback {
  font-size: 20px;
  font-weight: 600;
  color: #667eea;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 16px;
  font-weight: 600;
  color: #273444;
  margin: 0 0 4px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-desc {
  font-size: 14px;
  color: #8492a6;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-url {
  font-size: 12px;
  color: #a0aec0;
}

.link-hover {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #667eea;
  opacity: 0;
  transform: translate(10px, 0);
  transition: all 0.3s ease;
}

/* 空状态 */
.empty-category,
.empty-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #8492a6;
}

.empty-category {
  background: #f5f7fa;
  border-radius: 16px;
  padding: 40px 20px;
}

.empty-state h3,
.error-state h3 {
  font-size: 24px;
  color: #273444;
  margin: 16px 0 8px 0;
}

.empty-state p,
.error-state p {
  font-size: 16px;
  color: #8492a6;
  margin: 0 0 24px 0;
}

.action-btn,
.clear-search-btn,
.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.action-btn:hover,
.clear-search-btn:hover,
.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e8ecf1;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-container p {
  margin-top: 16px;
  color: #8492a6;
  font-size: 16px;
}

/* 底部统计 */
.share-footer {
  background: white;
  border-top: 1px solid #e8ecf1;
  padding: 30px 20px;
}

.stats-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #273444;
  line-height: 1;
}

.stat-label {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  color: #8492a6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
  }

  .username {
    font-size: 24px;
  }

  .owner-actions,
  .visitor-actions {
    flex-direction: column;
    width: 100%;
  }

  .manage-btn,
  .share-btn,
  .my-space-btn {
    width: 100%;
    justify-content: center;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  .category-title {
    font-size: 20px;
  }
}
</style>