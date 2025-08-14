<template>
  <div class="login-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
      <div class="shape shape-4"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-container">
      <div class="login-card glass">
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo-wrapper float-animation">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect width="64" height="64" rx="16" fill="url(#gradient-logo)"/>
              <path d="M32 16L40 24L32 32L24 24L32 16Z" fill="white"/>
              <path d="M32 32L40 40L32 48L24 40L32 32Z" fill="white" opacity="0.8"/>
              <defs>
                <linearGradient id="gradient-logo" x1="0" y1="0" x2="64" y2="64">
                  <stop stop-color="#667eea"/>
                  <stop offset="1" stop-color="#764ba2"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 class="brand-title">导航空间</h1>
          <p class="brand-subtitle">{{ isRegister ? '创建您的账户' : '欢迎回来' }}</p>
        </div>

        <!-- 表单区域 -->
        <div class="form-section">
          <transition name="form-switch" mode="out-in">
            <form v-if="!isRegister" key="login" @submit.prevent="handleSubmit" class="login-form">
              <!-- 邮箱输入 -->
              <div class="form-group">
                <label class="form-label">邮箱地址</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <input
                    type="email"
                    v-model="form.email"
                    class="form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </div>

              <!-- 密码输入 -->
              <div class="form-group">
                <label class="form-label">密码</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.password"
                    class="form-input"
                    placeholder="输入密码"
                    required
                  />
                  <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                  </button>
                </div>
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </div>

              <!-- 记住我 & 忘记密码 -->
              <div class="form-options">
                <label class="checkbox-wrapper">
                  <input type="checkbox" v-model="rememberMe" class="checkbox-input" />
                  <span class="checkbox-label">记住我</span>
                </label>
                <a href="#" class="forgot-link" @click.prevent="handleForgotPassword">忘记密码？</a>
              </div>

              <!-- 登录按钮 -->
              <button type="submit" class="submit-btn" :disabled="submitting">
                <span v-if="!submitting">登录</span>
                <span v-else class="loading-wrapper">
                  <span class="loading-spinner"></span>
                  登录中...
                </span>
              </button>
            </form>

            <form v-else key="register" @submit.prevent="handleSubmit" class="login-form">
              <!-- 用户名输入 -->
              <div class="form-group">
                <label class="form-label">用户名</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    type="text"
                    v-model="form.username"
                    class="form-input"
                    placeholder="输入用户名"
                    required
                  />
                </div>
                <span v-if="errors.username" class="error-message">{{ errors.username }}</span>
              </div>

              <!-- 邮箱输入 -->
              <div class="form-group">
                <label class="form-label">邮箱地址</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <input
                    type="email"
                    v-model="form.email"
                    class="form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </div>

              <!-- 密码输入 -->
              <div class="form-group">
                <label class="form-label">密码</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.password"
                    class="form-input"
                    placeholder="设置密码（至少6位）"
                    required
                  />
                  <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                    <svg v-if="!showPassword" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                  </button>
                </div>
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </div>

              <!-- 确认密码输入 -->
              <div class="form-group">
                <label class="form-label">确认密码</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="form.confirmPassword"
                    class="form-input"
                    placeholder="再次输入密码"
                    required
                  />
                  <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
                    <svg v-if="!showConfirmPassword" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                  </button>
                </div>
                <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
              </div>

              <!-- 注册按钮 -->
              <button type="submit" class="submit-btn" :disabled="submitting">
                <span v-if="!submitting">注册</span>
                <span v-else class="loading-wrapper">
                  <span class="loading-spinner"></span>
                  注册中...
                </span>
              </button>
            </form>
          </transition>

          <!-- 切换登录/注册 -->
          <div class="switch-mode">
            <span>{{ isRegister ? '已有账户？' : '还没有账户？' }}</span>
            <button type="button" @click="toggleForm" class="switch-btn">
              {{ isRegister ? '立即登录' : '立即注册' }}
            </button>
          </div>

          <!-- 社交登录 -->
          <div class="social-login">
            <div class="divider">
              <span>或使用以下方式登录</span>
            </div>
            <div class="social-buttons">
              <button type="button" class="social-btn" @click="handleSocialLogin('github')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clip-rule="evenodd"/>
                </svg>
                <span>GitHub</span>
              </button>
              <button type="button" class="social-btn" @click="handleSocialLogin('google')">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M19.8 10.2c0-.7-.1-1.4-.2-2H10v3.8h5.5c-.2 1.2-.9 2.3-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4"/>
                  <path d="M10 20c2.7 0 5-1 6.6-2.5l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H1.1v2.6C2.7 17.7 6.1 20 10 20z" fill="#34A853"/>
                  <path d="M4.4 12c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V5.4H1.1C.4 6.8 0 8.3 0 10s.4 3.2 1.1 4.6l3.3-2.6z" fill="#FBBC04"/>
                  <path d="M10 4c1.5 0 2.8.5 3.8 1.5l2.8-2.8C15 1.1 12.7 0 10 0 6.1 0 2.7 2.3 1.1 5.6l3.3 2.6C5.2 5.8 7.4 4 10 4z" fill="#EA4335"/>
                </svg>
                <span>Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()

// 表单状态
const isRegister = ref(false)
const submitting = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(false)

// 表单数据
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 错误信息
const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 切换登录/注册
const toggleForm = () => {
  isRegister.value = !isRegister.value
  // 清空表单和错误
  Object.keys(form).forEach(key => {
    form[key as keyof typeof form] = ''
  })
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
}

// 验证表单
const validateForm = () => {
  let isValid = true
  
  // 清空错误
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // 基本的邮箱格式验证（前端只做基础检查）
  if (!form.email) {
    errors.email = '请输入邮箱地址'
    isValid = false
  } else if (!form.email.includes('@')) {
    errors.email = '邮箱格式不正确'
    isValid = false
  }
  
  // 验证密码
  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度至少为6个字符'
    isValid = false
  }
  
  if (isRegister.value) {
    // 验证用户名
    if (!form.username) {
      errors.username = '请输入用户名'
      isValid = false
    } else if (form.username.length < 3 || form.username.length > 20) {
      errors.username = '用户名长度应在3-20个字符之间'
      isValid = false
    }
    
    // 验证确认密码
    if (!form.confirmPassword) {
      errors.confirmPassword = '请确认密码'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = '两次输入的密码不一致'
      isValid = false
    }
  }
  
  return isValid
}

// 处理提交
const handleSubmit = async () => {
  if (!validateForm()) return
  
  submitting.value = true
  
  try {
    if (isRegister.value) {
      // 注册
      const response = await axios.post('http://localhost:3000/api/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password
      })
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      ElMessage.success('注册成功！')
      
      // 切换到登录
      setTimeout(() => {
        isRegister.value = false
        Object.keys(form).forEach(key => {
          form[key as keyof typeof form] = ''
        })
      }, 1500)
      
    } else {
      // 登录
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: form.email,
        password: form.password
      })
      
      // 保存token
      localStorage.setItem('token', response.data.token)
      
      // 如果选择记住我，保存邮箱
      if (rememberMe.value) {
        localStorage.setItem('rememberedEmail', form.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }
      
      ElMessage.success('登录成功！')
      
      // 跳转到首页
      setTimeout(() => {
        router.push('/')
        window.location.reload()
      }, 1000)
    }
  } catch (error: any) {
    const errorData = error.response?.data
    
    // 处理后端返回的验证错误
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      // 清空所有错误信息
      Object.keys(errors).forEach(key => {
        errors[key as keyof typeof errors] = ''
      })
      
      // 设置每个字段的错误信息
      errorData.errors.forEach((err: any) => {
        if (err.field && errors.hasOwnProperty(err.field)) {
          errors[err.field as keyof typeof errors] = err.message
        }
      })
      
      // 显示主要错误消息
      ElMessage.error({
        message: errorData.message || '请检查输入信息',
        duration: 5000,
        showClose: true
      })
    } else if (errorData?.field && errors.hasOwnProperty(errorData.field)) {
      // 处理单个字段错误（如唯一性约束）
      errors[errorData.field as keyof typeof errors] = errorData.message
      ElMessage.error({
        message: errorData.message || '操作失败',
        duration: 5000,
        showClose: true
      })
    } else {
      // 显示通用错误消息
      ElMessage.error({
        message: errorData?.message || '操作失败，请重试',
        duration: 5000,
        showClose: true
      })
    }
  } finally {
    submitting.value = false
  }
}

// 处理忘记密码
const handleForgotPassword = () => {
  ElMessage.info('忘记密码功能开发中')
}

// 处理社交登录
const handleSocialLogin = (provider: string) => {
  ElMessage.info(`${provider} 登录功能开发中`)
}

// 初始化
const init = () => {
  // 检查是否有记住的邮箱
  const rememberedEmail = localStorage.getItem('rememberedEmail')
  if (rememberedEmail) {
    form.email = rememberedEmail
    rememberMe.value = true
  }
}

init()
</script>

<style scoped>
@import '../styles/global.css';

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.background-decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -100px;
  animation-delay: 5s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  bottom: -75px;
  left: 30%;
  animation-delay: 10s;
}

.shape-4 {
  width: 250px;
  height: 250px;
  top: 20%;
  right: 20%;
  animation-delay: 15s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.1;
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
    opacity: 0.15;
  }
  66% {
    transform: translateY(30px) rotate(240deg);
    opacity: 0.1;
  }
}

/* 登录容器 */
.login-container {
  width: 100%;
  max-width: 460px;
  padding: 20px;
  z-index: 1;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Logo区域 */
.logo-section {
  text-align: center;
  padding: 40px 40px 30px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
}

.logo-wrapper {
  display: inline-block;
  margin-bottom: 20px;
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px;
}

.brand-subtitle {
  color: var(--text-secondary);
  font-size: 16px;
  margin: 0;
}

/* 表单区域 */
.form-section {
  padding: 30px 40px 40px;
}

.login-form {
  width: 100%;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--text-secondary);
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  font-size: 15px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  background: var(--white);
  transition: var(--transition-base);
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.toggle-password {
  position: absolute;
  right: 16px;
  padding: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
}

.toggle-password:hover {
  color: var(--primary-color);
}

.error-message {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--danger-color);
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: var(--text-secondary);
  user-select: none;
}

.forgot-link {
  font-size: 14px;
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition-base);
}

.forgot-link:hover {
  color: var(--primary-hover);
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--white);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: var(--transition-base);
  margin-bottom: 24px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--white);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 切换模式 */
.switch-mode {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.switch-mode span {
  color: var(--text-secondary);
  font-size: 14px;
}

.switch-btn {
  color: var(--primary-color);
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 4px;
  transition: var(--transition-base);
}

.switch-btn:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

/* 社交登录 */
.social-login {
  margin-top: 24px;
}

.divider {
  text-align: center;
  position: relative;
  margin: 24px 0;
}

.divider span {
  background: white;
  padding: 0 16px;
  color: var(--text-secondary);
  font-size: 13px;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--border-color);
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--white);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition-base);
}

.social-btn:hover {
  background: var(--bg-color);
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 表单切换动画 */
.form-switch-enter-active,
.form-switch-leave-active {
  transition: all 0.3s ease;
}

.form-switch-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.form-switch-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .logo-section {
    padding: 30px 20px 20px;
  }
  
  .form-section {
    padding: 20px;
  }
  
  .brand-title {
    font-size: 24px;
  }
  
  .social-buttons {
    flex-direction: column;
  }
}
</style>