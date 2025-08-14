<template>
  <div class="home">
    <h1>私人导航主页</h1>
    <p>欢迎来到您的私人导航网站！</p>
    <div v-if="authStore.isAuthenticated">
      <p>您好，{{ authStore.user?.username }}!</p>
      <div class="actions">
        <el-button type="primary" @click="$router.push('/categories')">
          分类管理
        </el-button>
        <el-button @click="handleLogout">退出登录</el-button>
      </div>
    </div>
    <div v-else>
      <p>请登录以访问您的个性化导航页面。</p>
      <el-button @click="$router.push('/login')">登录</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

// Router
const router = useRouter();

// Auth store
const authStore = useAuthStore();

// Handle logout
const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.home {
  padding: 20px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>