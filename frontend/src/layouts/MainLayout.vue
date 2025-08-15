<template>
  <div class="main-layout">
    <!-- 导航栏 -->
    <nav class="navbar glass">
      <div class="navbar-container">
        <div class="navbar-brand">
          <div class="brand-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M16 8L20 12L16 16L12 12L16 8Z" fill="white"/>
              <path d="M16 16L20 20L16 24L12 20L16 16Z" fill="white" opacity="0.8"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stop-color="#667eea"/>
                  <stop offset="1" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="brand-text">导航空间</span>
        </div>

        <div class="navbar-menu">
          <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span>首页</span>
          </router-link>
          
          <router-link v-if="authStore.isAuthenticated" to="/categories" class="nav-link" :class="{ active: $route.path === '/categories' }">
            <svg class="nav-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/>
            </svg>
            <span>分类管理</span>
          </router-link>
        </div>

        <div class="navbar-actions">
          <div v-if="authStore.isAuthenticated" class="user-menu">
            <div class="user-avatar" @click.stop="showUserDropdown = !showUserDropdown">
              <div class="avatar-circle">
                {{ authStore.user?.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <span class="user-name">{{ authStore.user?.username }}</span>
              <svg class="dropdown-icon" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.5 6L8 9.5L11.5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            
            <transition name="dropdown">
              <div v-if="showUserDropdown" class="dropdown-menu" @click.stop>
                <div class="dropdown-header">
                  <div class="user-info">
                    <div class="avatar-large">
                      {{ authStore.user?.username?.charAt(0)?.toUpperCase() || 'U' }}
                    </div>
                    <div>
                      <div class="user-name-large">{{ authStore.user?.username }}</div>
                      <div class="user-email">{{ authStore.user?.email }}</div>
                    </div>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" @click="handleProfile">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/>
                  </svg>
                  个人资料
                </a>
                <a class="dropdown-item" @click="handleSettings">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 4.754a3.246 3.246 0 100 6.492 3.246 3.246 0 000-6.492zM5.754 8a2.246 2.246 0 114.492 0 2.246 2.246 0 01-4.492 0z"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 01-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 01-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 01.52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 011.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 011.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 01.52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 01-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 01-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 002.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 001.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 00-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 00-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 00-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 001.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 003.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 002.692-1.115l.094-.319z"/>
                  </svg>
                  设置
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item text-danger" @click="handleLogout">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 12.5a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5v-9a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v2a.5.5 0 001 0v-2A1.5 1.5 0 009.5 2h-8A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h8a1.5 1.5 0 001.5-1.5v-2a.5.5 0 00-1 0v2z"/>
                    <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 000-.708l-3-3a.5.5 0 00-.708.708L14.293 7.5H5.5a.5.5 0 000 1h8.793l-2.147 2.146a.5.5 0 00.708.708l3-3z"/>
                  </svg>
                  退出登录
                </a>
              </div>
            </transition>
          </div>
          
          <router-link v-else to="/login" class="btn btn-primary">
            登录
          </router-link>

          <!-- 主题切换 -->
          <button class="theme-toggle" @click="toggleTheme">
            <svg v-if="!isDark" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <transition name="page" mode="out-in">
          <slot></slot>
        </transition>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 导航空间. Made by Jdassd.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const showUserDropdown = ref(false)
const isDark = ref(false)

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
  document.body.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// 计算属性，用于动态背景
const layoutBackground = computed(() => {
  return isDark.value
    ? 'linear-gradient(135deg, #1e1e2d 0%, #2a2c3e 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
})

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.body.classList.add('dark')
  }
  
  // 点击外部关闭下拉菜单
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// 处理点击外部
const handleClickOutside = () => {
  showUserDropdown.value = false
}

// 处理退出登录
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
  ElMessage.success('已退出登录')
  showUserDropdown.value = false
}

// 处理个人资料
const handleProfile = () => {
  ElMessage.info('个人资料功能开发中')
  showUserDropdown.value = false
}

// 处理设置
const handleSettings = () => {
  ElMessage.info('设置功能开发中')
  showUserDropdown.value = false
}
</script>

<style scoped>
@import '../styles/global.css';

.main-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: v-bind(layoutBackground);
  transition: background 0.3s ease;
}

/* 导航栏样式 - 确保全宽 */
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-sm);
}

.navbar-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 30px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .navbar-container {
    max-width: 1200px;
  }
}

@media (min-width: 1400px) {
  .navbar-container {
    max-width: 1400px;
  }
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: var(--transition-base);
}

.navbar-brand:hover {
  transform: scale(1.05);
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-menu {
  display: flex;
  gap: 12px;
  flex: 1;
  margin: 0 40px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 500;
  transition: var(--transition-base);
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(94, 114, 228, 0.1);
  color: var(--primary-color);
}

.nav-link.active {
  background: var(--gradient-primary);
  color: var(--white);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 用户菜单 */
.user-menu {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: var(--radius-full);
  background: rgba(94, 114, 228, 0.1);
  cursor: pointer;
  transition: var(--transition-base);
}

.user-avatar:hover {
  background: rgba(94, 114, 228, 0.2);
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.dropdown-icon {
  color: var(--text-secondary);
  transition: var(--transition-base);
}

.user-avatar:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 280px;
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  z-index: 1001;
}

.dropdown-header {
  padding: 16px;
  background: var(--gradient-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
}

.user-name-large {
  color: var(--white);
  font-weight: 600;
  font-size: 16px;
}

.user-email {
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  margin-top: 2px;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-primary);
  transition: var(--transition-base);
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--bg-color);
}

.dropdown-item.text-danger {
  color: var(--danger-color);
}

/* 主题切换按钮 */
.theme-toggle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(94, 114, 228, 0.1);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition-base);
  cursor: pointer;
}

.theme-toggle:hover {
  background: var(--primary-color);
  color: var(--white);
  transform: rotate(180deg);
}

/* 主内容区域 - 确保全宽 */
.main-content {
  flex: 1;
  width: 100%;
  padding: 40px 0;
}

.content-wrapper {
  width: 100%;
  min-height: calc(100vh - 64px - 80px - 120px);
}

/* 底部 */
.footer {
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 暗色主题下的特定样式 */
:global(body.dark) .navbar,
:global(body.dark) .footer {
  background: rgba(29, 29, 45, 0.8); /* 使用变量 --bg-color 稍微透明化 */
  border-color: var(--border-color);
}

:global(body.dark) .dropdown-menu {
  background: var(--primary-bg);
  border: 1px solid var(--border-color);
}

:global(body.dark) .brand-text {
  background: linear-gradient(135deg, #8b9af5 0%, #667eea 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

:global(body.dark) .nav-link:hover {
  background: rgba(102, 126, 234, 0.15);
  color: var(--primary-light);
}

:global(body.dark) .nav-link.active {
  background: var(--gradient-primary);
  color: #e9ecef;
}

:global(body.dark) .user-avatar {
  background: rgba(102, 126, 234, 0.15);
}

:global(body.dark) .user-avatar:hover {
  background: rgba(102, 126, 234, 0.25);
}

/* 响应式 - 平板和手机 */
@media (max-width: 991px) {
  .navbar-container {
    padding: 0 20px;
  }
  
  .navbar-menu {
    margin: 0 20px;
  }
}

@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }
  
  .navbar-container {
    padding: 0 15px;
  }
  
  .main-content {
    padding: 20px 0;
  }
  
  .user-name {
    display: none;
  }
}
</style>