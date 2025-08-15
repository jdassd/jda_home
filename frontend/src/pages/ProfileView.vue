<template>
  <MainLayout>
    <div class="profile-page">
      <div class="profile-container">
        <!-- 页面标题 -->
        <div class="page-header">
          <h1 class="page-title">个人资料</h1>
          <p class="page-desc">管理您的账户信息和安全设置</p>
        </div>

        <!-- 个人信息卡片 -->
        <div class="profile-section">
          <div class="section-header">
            <h2 class="section-title">基本信息</h2>
          </div>

          <div class="info-grid">
            <!-- 头像 -->
            <div class="info-item avatar-item">
              <label class="info-label">头像</label>
              <div class="avatar-display">
                <div class="avatar">
                  <span>{{ userInfo.username.charAt(0).toUpperCase() }}</span>
                </div>
                <p class="avatar-tip">暂不支持自定义头像</p>
              </div>
            </div>

            <!-- 用户名 -->
            <div class="info-item">
              <label class="info-label">用户名</label>
              <div class="info-value">{{ userInfo.username }}</div>
            </div>

            <!-- 邮箱 -->
            <div class="info-item">
              <label class="info-label">邮箱</label>
              <div class="info-value">{{ userInfo.email }}</div>
            </div>

            <!-- 注册时间 -->
            <div class="info-item">
              <label class="info-label">注册时间</label>
              <div class="info-value">{{ formatDate(userInfo.createdAt) }}</div>
            </div>

            <!-- 最后更新 -->
            <div class="info-item">
              <label class="info-label">最后更新</label>
              <div class="info-value">{{ formatDate(userInfo.updatedAt) }}</div>
            </div>
          </div>
        </div>

        <!-- 安全设置卡片 -->
        <div class="profile-section">
          <div class="section-header">
            <h2 class="section-title">安全设置</h2>
          </div>

          <div class="security-grid">
            <!-- 修改密码 -->
            <div class="security-item">
              <div class="security-info">
                <h3 class="security-title">密码</h3>
                <p class="security-desc">定期更新密码有助于保护账户安全</p>
              </div>
              <el-button @click="handleChangePassword">修改密码</el-button>
            </div>
          </div>
        </div>

        <!-- 统计信息卡片 -->
        <div class="profile-section">
          <div class="section-header">
            <h2 class="section-title">使用统计</h2>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 3H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM20 3h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM10 13H4a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1v-6a1 1 0 00-1-1zM17 13a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2h-2a1 1 0 110-2h2v-2a1 1 0 011-1z"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.categories }}</div>
                <div class="stat-label">分类总数</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.links }}</div>
                <div class="stat-label">链接总数</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.publicLinks }}</div>
                <div class="stat-label">公开链接</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                </svg>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stats.days }}</div>
                <div class="stat-label">使用天数</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useLinkStore } from '../stores/linkStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import MainLayout from '../layouts/MainLayout.vue'
import api from '../utils/api'

// Router
const router = useRouter()

// Store
const authStore = useAuthStore()
const categoryStore = useCategoryStore()
const linkStore = useLinkStore()

// 用户信息
const userInfo = computed(() => authStore.user || {
  id: 0,
  username: '',
  email: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

// 统计信息
const stats = computed(() => {
  const createdAt = new Date(userInfo.value.createdAt || Date.now())
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - createdAt.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  const publicLinks = linkStore.links.filter(link => link.isPublic).length
  
  return {
    categories: categoryStore.categories.length,
    links: linkStore.links.length,
    publicLinks,
    days: diffDays
  }
})

// 格式化日期
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 修改密码 - 跳转到忘记密码页面
const handleChangePassword = () => {
  // 跳转到忘记密码页面
  router.push('/forgot-password')
}

// 初始化
onMounted(async () => {
  // 加载用户数据
  if (authStore.isAuthenticated) {
    await Promise.all([
      categoryStore.fetchCategories(),
      linkStore.fetchLinks()
    ])
  }
})
</script>

<style scoped>
@import '../styles/global.css';

.profile-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 40px 20px;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
}

/* 页面标题 */
.page-header {
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #273444;
  margin: 0 0 8px 0;
}

.page-desc {
  font-size: 16px;
  color: #8492a6;
  margin: 0;
}

/* 卡片样式 */
.profile-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8ecf1;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #273444;
  margin: 0;
}

/* 信息网格 */
.info-grid {
  display: grid;
  gap: 24px;
}

.info-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 16px;
}

.avatar-item {
  align-items: start;
}

.info-label {
  font-size: 14px;
  color: #8492a6;
}

.info-value {
  font-size: 16px;
  color: #273444;
}

.avatar-display {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
}

.avatar-tip {
  font-size: 14px;
  color: #8492a6;
  margin: 0;
}

/* 安全设置 */
.security-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
}

.security-info {
  flex: 1;
}

.security-title {
  font-size: 16px;
  font-weight: 600;
  color: #273444;
  margin: 0 0 4px 0;
}

.security-desc {
  font-size: 14px;
  color: #8492a6;
  margin: 0;
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #273444;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #8492a6;
  margin-top: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    padding: 0;
  }

  .profile-section {
    padding: 20px;
    border-radius: 0;
  }

  .info-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>