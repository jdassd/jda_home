<template>
  <div class="user-home-container">
    <!-- 用户信息头部 -->
    <div class="user-header">
      <h1>{{ username }} 的导航主页</h1>
      <div v-if="isOwner" class="owner-actions">
        <el-button type="primary" @click="goToManage">管理我的导航</el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 分类和链接展示 -->
    <div v-else-if="categories.length > 0" class="categories-container">
      <el-collapse v-model="activeCategories">
        <el-collapse-item
          v-for="category in categories"
          :key="category.id"
          :title="category.name"
          :name="category.id"
        >
          <div class="links-grid">
            <div
              v-for="link in getCategoryLinks(category.id)"
              :key="link.id"
              class="link-card"
              @click="openLink(link.url)"
            >
              <div class="link-icon">
                <span v-if="isEmoji(link.icon)">{{ link.icon }}</span>
                <img v-else-if="link.icon && link.icon.startsWith('http')" :src="link.icon" alt="">
                <span v-else class="default-icon">{{ link.title.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="link-info">
                <div class="link-title">{{ link.title }}</div>
                <div v-if="link.description" class="link-description">{{ link.description }}</div>
              </div>
            </div>
          </div>
          <div v-if="getCategoryLinks(category.id).length === 0" class="empty-category">
            该分类下暂无链接
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-container">
      <el-empty description="该用户暂未公开任何导航内容" />
    </div>

    <!-- 未授权提示 -->
    <div v-if="!isOwner && !loading && categories.length === 0 && !error" class="unauthorized-tip">
      <el-alert
        title="提示"
        type="info"
        :closable="false"
        description="您正在查看其他用户的公开导航。只有公开的分类和链接才会显示在这里。"
      />
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-container">
      <el-alert
        :title="error"
        type="error"
        :closable="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoryStore, type Category } from '../stores/categoryStore'
import { useLinkStore, type Link } from '../stores/linkStore'
import { useAuthStore } from '../stores/authStore'
import { ElMessage } from 'element-plus'

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
const activeCategories = ref<number[]>([])
const username = ref('')

// 获取用户ID
const userId = computed(() => {
  const id = route.params.userId || route.query.userId
  return id ? parseInt(id as string) : null
})

// 判断是否为当前用户的主页
const isOwner = computed(() => {
  return authStore.user && userId.value === authStore.user.id
})

// 判断是否为emoji
const isEmoji = (str: string | undefined) => {
  if (!str) return false
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27BF}]|[\u{1F000}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]/u
  return emojiRegex.test(str)
}

// 获取分类下的链接
const getCategoryLinks = (categoryId: number) => {
  return links.value.filter(link => link.categoryId === categoryId)
}

// 打开链接
const openLink = (url: string) => {
  // 确保URL有协议前缀
  const formattedUrl = /^https?:\/\//i.test(url) ? url : 'http://' + url
  window.open(formattedUrl, '_blank')
}

// 跳转到管理页面
const goToManage = () => {
  router.push('/categories')
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
      const [categoriesData, linksData] = await Promise.all([
        categoryStore.fetchCategories(),
        linkStore.fetchLinks()
      ])
      categories.value = categoriesData
      links.value = linksData
      username.value = authStore.user?.username || ''
    } else {
      // 加载其他用户的公开分类和链接
      const [categoriesData, linksData] = await Promise.all([
        categoryStore.fetchPublicCategories(userId.value),
        linkStore.fetchPublicLinks(userId.value)
      ])
      categories.value = categoriesData
      links.value = linksData
      
      // 这里需要从后端获取用户名，暂时使用用户ID
      username.value = `用户${userId.value}`
    }

    // 默认展开所有分类
    activeCategories.value = categories.value.map(c => c.id)
  } catch (err: any) {
    console.error('加载数据失败:', err)
    error.value = err.response?.data?.message || '加载数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.user-home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.user-header h1 {
  font-size: 24px;
  margin: 0;
}

.loading-container,
.empty-container,
.error-container {
  margin-top: 50px;
}

.categories-container {
  margin-top: 20px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 10px 0;
}

.link-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.link-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--el-color-primary);
}

.link-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 24px;
  flex-shrink: 0;
}

.link-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.default-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  border-radius: 50%;
  font-weight: bold;
  font-size: 18px;
}

.link-info {
  flex: 1;
  overflow: hidden;
}

.link-title {
  font-weight: 500;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-description {
  font-size: 12px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-category {
  padding: 20px;
  text-align: center;
  color: var(--el-text-color-regular);
}

.unauthorized-tip {
  margin-top: 20px;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-collapse-item__content) {
  padding: 10px 20px;
}
</style>