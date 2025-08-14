<template>
  <div id="app">
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(() => {
  // 检查本地存储的token来初始化认证状态
  const token = localStorage.getItem('token')
  if (token) {
    // Token存在，用户已登录
    console.log('User authenticated')
  }
  
  // 设置主题
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark-theme')
  }
  
  // 添加加载完成动画
  document.body.classList.add('loaded')
})
</script>

<style>
/* 导入全局样式 */
@import './styles/global.css';

/* 应用基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-primary);
  color: var(--text-primary);
  background: var(--bg-color);
  min-height: 100vh;
  overflow-x: hidden;
  transition: background-color 0.3s ease;
}

body.loaded {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

#app {
  min-height: 100vh;
  position: relative;
}

/* 页面过渡动画 */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-color);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 5px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* 选中文本样式 */
::selection {
  background: var(--primary-light);
  color: white;
}

::-moz-selection {
  background: var(--primary-light);
  color: white;
}

/* 加载动画 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(94, 114, 228, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式字体大小 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 13px;
  }
}

/* 打印样式 */
@media print {
  body {
    background: white;
    color: black;
  }
  
  .navbar,
  .footer,
  .dialog-overlay {
    display: none !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  :root {
    --primary-color: #4c51bf;
    --text-primary: #000000;
    --text-secondary: #4a5568;
    --bg-color: #ffffff;
    --border-color: #cbd5e0;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 暗色主题覆盖 */
.dark-theme {
  --primary-color: #8b9af5;
  --primary-hover: #7c8ce6;
  --primary-light: #a3b0f7;
  --primary-bg: rgba(139, 154, 245, 0.1);
  
  --text-primary: #f0f0f0;
  --text-secondary: #b8b8b8;
  --text-muted: #8a8a8a;
  --border-color: #3a3a3a;
  --bg-color: #1a1a1a;
  --white: #2a2a2a;
  --dark: #f0f0f0;
}

.dark-theme body {
  background: #0f0f0f;
}

/* 确保Element Plus组件适配新主题 */
.el-button--primary {
  background: var(--gradient-primary) !important;
  border: none !important;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.el-message {
  border-radius: 12px !important;
  box-shadow: var(--shadow-lg) !important;
}

.el-dialog {
  border-radius: 16px !important;
}

.el-input__inner {
  border-radius: 10px !important;
}

.el-table {
  border-radius: 12px !important;
  overflow: hidden;
}

/* 优化移动端体验 */
@supports (-webkit-touch-callout: none) {
  /* iOS特定样式 */
  input, textarea {
    font-size: 16px; /* 防止iOS缩放 */
  }
}

/* 添加平滑的焦点指示器 */
:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  border-radius: 4px;
}

/* 隐藏默认焦点边框 */
:focus:not(:focus-visible) {
  outline: none;
}
</style>
