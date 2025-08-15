<template>
  <div class="forgot-password-page">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <!-- 忘记密码卡片 -->
    <div class="forgot-password-container">
      <div class="forgot-password-card glass">
        <!-- Logo区域 -->
        <div class="logo-section">
          <div class="logo-wrapper">
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
          <h1 class="brand-title">重置密码</h1>
          <p class="brand-subtitle">{{ getStepDescription() }}</p>
        </div>

        <!-- 步骤指示器 -->
        <div class="steps-indicator">
          <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <span class="step-number">1</span>
            <span class="step-label">输入邮箱</span>
          </div>
          <div class="step-line" :class="{ active: currentStep > 1 }"></div>
          <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <span class="step-number">2</span>
            <span class="step-label">回答问题</span>
          </div>
          <div class="step-line" :class="{ active: currentStep > 2 }"></div>
          <div class="step" :class="{ active: currentStep >= 3 }">
            <span class="step-number">3</span>
            <span class="step-label">设置新密码</span>
          </div>
        </div>

        <!-- 表单区域 -->
        <div class="form-section">
          <transition name="step-transition" mode="out-in">
            <!-- 步骤1：输入邮箱 -->
            <form v-if="currentStep === 1" key="step1" @submit.prevent="handleEmailSubmit" class="reset-form">
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
                    placeholder="请输入注册时使用的邮箱"
                    required
                    :disabled="loading"
                  />
                </div>
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </div>

              <button type="submit" class="submit-btn" :disabled="loading">
                <span v-if="!loading">下一步</span>
                <span v-else class="loading-wrapper">
                  <span class="loading-spinner"></span>
                  验证中...
                </span>
              </button>
            </form>

            <!-- 步骤2：回答安全问题 -->
            <form v-else-if="currentStep === 2" key="step2" @submit.prevent="handleSecurityAnswer" class="reset-form">
              <div class="form-group">
                <label class="form-label">安全问题</label>
                <div class="question-box">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2z" clip-rule="evenodd"/>
                  </svg>
                  <span>{{ securityQuestion }}</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">您的答案</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    type="text"
                    v-model="form.securityAnswer"
                    class="form-input"
                    placeholder="请输入安全问题的答案"
                    required
                    :disabled="loading"
                  />
                </div>
                <span v-if="errors.securityAnswer" class="error-message">{{ errors.securityAnswer }}</span>
                <p class="hint-text">提示：答案不区分大小写</p>
              </div>

              <div class="button-group">
                <button type="button" class="back-btn" @click="handleBackToStep1" :disabled="loading">
                  返回上一步
                </button>
                <button type="submit" class="submit-btn submit-btn-small" :disabled="loading">
                  <span v-if="!loading">验证答案</span>
                  <span v-else class="loading-wrapper">
                    <span class="loading-spinner"></span>
                    验证中...
                  </span>
                </button>
              </div>
            </form>

            <!-- 步骤3：设置新密码 -->
            <form v-else-if="currentStep === 3" key="step3" @submit.prevent="handlePasswordReset" class="reset-form">
              <!-- 倒计时进度条 -->
              <div class="countdown-section" :class="{ urgent: remainingTime <= 10 }" v-if="remainingTime > 0">
                <div class="countdown-header">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" class="countdown-icon">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                  </svg>
                  <span class="countdown-text">验证剩余时间：<strong>{{ remainingTime }}</strong> 秒</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
                </div>
                <p class="countdown-hint">请在倒计时结束前完成密码重置</p>
              </div>

              <!-- 倒计时已结束提示 -->
              <div class="timeout-section" v-else>
                <div class="timeout-icon">
                  <svg width="60" height="60" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <h3 class="timeout-title">验证已过期</h3>
                <p class="timeout-message">您的验证时间已超时，请重新验证安全问题</p>
                <button type="button" class="back-btn" @click="handleTimeoutBack">
                  重新验证
                </button>
              </div>

              <div class="form-group" v-if="remainingTime > 0">
                <label class="form-label">新密码</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    v-model="form.newPassword"
                    class="form-input"
                    placeholder="设置新密码（至少6位）"
                    required
                    :disabled="loading"
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
                <span v-if="errors.newPassword" class="error-message">{{ errors.newPassword }}</span>
              </div>

              <div class="form-group" v-if="remainingTime > 0">
                <label class="form-label">确认新密码</label>
                <div class="input-wrapper">
                  <svg class="input-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    v-model="form.confirmPassword"
                    class="form-input"
                    placeholder="再次输入新密码"
                    required
                    :disabled="loading"
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

              <button type="submit" class="submit-btn" :disabled="loading || remainingTime <= 0" v-if="remainingTime > 0">
                <span v-if="!loading">重置密码</span>
                <span v-else class="loading-wrapper">
                  <span class="loading-spinner"></span>
                  重置中...
                </span>
              </button>
            </form>

            <!-- 成功页面 -->
            <div v-else-if="currentStep === 4" key="step4" class="success-section">
              <div class="success-icon">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="url(#gradient-success)"/>
                  <path d="M56 28L32 52L24 44" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                  <defs>
                    <linearGradient id="gradient-success" x1="0" y1="0" x2="80" y2="80">
                      <stop stop-color="#10b981"/>
                      <stop offset="1" stop-color="#059669"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <h2 class="success-title">密码重置成功！</h2>
              <p class="success-message">您的密码已成功重置，请使用新密码登录</p>
              <button @click="goToLogin" class="submit-btn">
                前往登录
              </button>
            </div>
          </transition>

          <!-- 返回登录链接 -->
          <div class="back-to-login" v-if="currentStep < 4">
            <router-link to="/login" class="back-link">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"/>
              </svg>
              返回登录
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

// 创建独立的 axios 实例，不使用全局拦截器
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api'
})

const router = useRouter()

// 当前步骤
const currentStep = ref(1)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const securityQuestion = ref('')
const resetToken = ref('') // 存储重置令牌
const remainingTime = ref(60) // 剩余时间（秒）
const progressPercentage = ref(100) // 进度条百分比
let countdownInterval: number | null = null // 倒计时定时器

// 表单数据
const form = reactive({
  email: '',
  securityAnswer: '',
  newPassword: '',
  confirmPassword: ''
})

// 错误信息
const errors = reactive({
  email: '',
  securityAnswer: '',
  newPassword: '',
  confirmPassword: ''
})

// 获取步骤描述
const getStepDescription = () => {
  switch (currentStep.value) {
    case 1:
      return '请输入您的邮箱地址'
    case 2:
      return '请回答安全问题验证身份'
    case 3:
      return '请设置新的密码'
    case 4:
      return '密码重置完成'
    default:
      return ''
  }
}

// 步骤1：提交邮箱
const handleEmailSubmit = async () => {
  errors.email = ''
  
  if (!form.email) {
    errors.email = '请输入邮箱地址'
    return
  }
  
  loading.value = true
  
  try {
    const response = await apiClient.post('/auth/security-question', {
      email: form.email
    })
    
    securityQuestion.value = response.data.securityQuestion
    currentStep.value = 2
    
  } catch (error: any) {
    errors.email = error.response?.data?.message || '获取安全问题失败'
  } finally {
    loading.value = false
  }
}

// 步骤2：验证安全问题答案
const handleSecurityAnswer = async () => {
  errors.securityAnswer = ''
  
  if (!form.securityAnswer) {
    errors.securityAnswer = '请输入安全问题的答案'
    return
  }
  
  loading.value = true
  
  try {
    // 验证安全问题答案
    const response = await apiClient.post('/auth/verify-security-answer', {
      email: form.email,
      securityAnswer: form.securityAnswer
    })
    
    // 保存重置令牌
    resetToken.value = response.data.resetToken
    
    // 验证成功，进入下一步
    currentStep.value = 3
    ElMessage.success('验证成功，请在60秒内设置新密码')
    
    // 启动倒计时
    startCountdown()
    
  } catch (error: any) {
    const message = error.response?.data?.message || '验证失败'
    errors.securityAnswer = message
    ElMessage.error(message)
    // 不跳转页面，保持在当前步骤，让用户重新输入
    // 清空答案输入框，让用户重新输入
    form.securityAnswer = ''
  } finally {
    loading.value = false
  }
}

// 步骤3：重置密码
const handlePasswordReset = async () => {
  // 清空错误
  errors.newPassword = ''
  errors.confirmPassword = ''
  
  // 验证新密码
  if (!form.newPassword) {
    errors.newPassword = '请输入新密码'
    return
  }
  
  if (form.newPassword.length < 6) {
    errors.newPassword = '密码长度至少为6个字符'
    return
  }
  
  if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    return
  }
  
  loading.value = true
  
  try {
    // 使用重置令牌重置密码
    await apiClient.post('/auth/reset-password', {
      resetToken: resetToken.value,
      newPassword: form.newPassword
    })
    
    currentStep.value = 4
    ElMessage.success('密码重置成功！')
    
    // 清除敏感数据
    resetToken.value = ''
    form.securityAnswer = ''
    form.newPassword = ''
    form.confirmPassword = ''
    
  } catch (error: any) {
    const message = error.response?.data?.message || '密码重置失败'
    
    if (message.includes('令牌')) {
      // 令牌无效或过期，需要重新验证
      ElMessage.error('验证已过期，请重新验证安全问题')
      currentStep.value = 2
      resetToken.value = ''
    } else {
      ElMessage.error(message)
    }
  } finally {
    loading.value = false
  }
}

// 返回登录页
const goToLogin = () => {
  // 清理倒计时
  stopCountdown()
  router.push('/login')
}

// 返回步骤1
const handleBackToStep1 = () => {
  currentStep.value = 1
  // 清除敏感数据
  form.securityAnswer = ''
  resetToken.value = ''
  errors.securityAnswer = ''
  // 清理倒计时
  stopCountdown()
}

// 处理超时返回
const handleTimeoutBack = () => {
  currentStep.value = 2
  resetToken.value = ''
  form.newPassword = ''
  form.confirmPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
  remainingTime.value = 60
  progressPercentage.value = 100
}

// 启动倒计时
const startCountdown = () => {
  remainingTime.value = 60
  progressPercentage.value = 100
  
  // 清除之前的定时器
  stopCountdown()
  
  // 每秒更新一次
  countdownInterval = setInterval(async () => {
    try {
      // 调用后端接口获取实时剩余时间
      const response = await apiClient.post('/auth/token-remaining-time', {
        resetToken: resetToken.value
      })
      
      remainingTime.value = response.data.remainingTime
      progressPercentage.value = (remainingTime.value / 60) * 100
      
      if (remainingTime.value <= 0) {
        stopCountdown()
        ElMessage.warning('验证已过期，请重新验证')
      }
    } catch (error) {
      // 如果接口调用失败，停止倒计时
      remainingTime.value = 0
      progressPercentage.value = 0
      stopCountdown()
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  stopCountdown()
})
</script>

<style scoped>
@import '../styles/global.css';

.forgot-password-page {
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

/* 容器 */
.forgot-password-container {
  width: 100%;
  max-width: 520px;
  padding: 20px;
  z-index: 1;
}

.forgot-password-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  padding: 40px 40px 20px;
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

/* 步骤指示器 */
.steps-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 40px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.step-line {
  flex: 1;
  height: 2px;
  background: var(--border-color);
  margin: 0 12px;
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.step-line.active {
  background: #10b981;
}

/* 表单区域 */
.form-section {
  padding: 20px 40px 40px;
}

.reset-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
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
  background: var(--white) !important;
  color: var(--text-primary) !important;
  transition: var(--transition-base);
  font-family: inherit;
  -webkit-text-fill-color: var(--text-primary) !important; /* 修复 WebKit 浏览器的文字颜色问题 */
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  background: var(--white) !important;
  color: var(--text-primary) !important;
  -webkit-text-fill-color: var(--text-primary) !important;
}

.form-input:disabled {
  background: var(--bg-color) !important;
  cursor: not-allowed;
  color: var(--text-secondary) !important;
  -webkit-text-fill-color: var(--text-secondary) !important;
}

/* 修复自动填充时的样式 */
.form-input:-webkit-autofill,
.form-input:-webkit-autofill:hover,
.form-input:-webkit-autofill:focus,
.form-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px var(--white) inset !important;
  -webkit-text-fill-color: var(--text-primary) !important;
  box-shadow: 0 0 0 30px var(--white) inset !important;
  background-color: var(--white) !important;
  color: var(--text-primary) !important;
}

/* 修复占位符文字颜色 */
.form-input::placeholder {
  color: var(--text-muted) !important;
  opacity: 0.7;
}

.form-input::-webkit-input-placeholder {
  color: var(--text-muted) !important;
  opacity: 0.7;
}

.form-input::-moz-placeholder {
  color: var(--text-muted) !important;
  opacity: 0.7;
}

.form-input:-ms-input-placeholder {
  color: var(--text-muted) !important;
  opacity: 0.7;
}

.toggle-password {
  position: absolute;
  right: 16px;
  padding: 4px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-base);
  background: none;
  border: none;
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

.hint-text {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* 安全问题框 */
.question-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 15px;
}

.question-box svg {
  color: var(--primary-color);
  flex-shrink: 0;
}

/* 按钮 */
.submit-btn {
  width: 100%;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  color: var(--white);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition-base);
}

/* 步骤2中的验证答案按钮较小 */
.submit-btn-small {
  padding: 10px 20px;
  font-size: 14px;
  width: auto;
  min-width: 120px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.back-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  background: var(--white);
  border: 2px solid var(--border-color);
  border-radius: 10px;
  cursor: pointer;
  transition: var(--transition-base);
  min-width: 100px;
}

.back-btn:hover:not(:disabled) {
  background: var(--bg-color);
  border-color: var(--primary-color);
}

.back-btn:disabled {
  opacity: 0.5;
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

/* 成功页面 */
.success-section {
  text-align: center;
  padding: 40px 0;
}

.success-icon {
  display: inline-block;
  margin-bottom: 24px;
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px;
}

.success-message {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 32px;
}

/* 返回登录 */
.back-to-login {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: var(--transition-base);
}

.back-link:hover {
  color: var(--primary-hover);
  transform: translateX(-4px);
}

/* 步骤切换动画 */
.step-transition-enter-active,
.step-transition-leave-active {
  transition: all 0.3s ease;
}

.step-transition-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.step-transition-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 响应式设计 */
@media (max-width: 480px) {
  .forgot-password-container {
    padding: 10px;
  }
  
  .logo-section {
    padding: 30px 20px 15px;
  }
  
  .form-section {
    padding: 15px 20px 30px;
  }
  
  .steps-indicator {
    padding: 15px 20px;
  }
  
  .step-label {
    font-size: 11px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .button-group .back-btn,
  .button-group .submit-btn-small {
    width: 100%;
  }
}

/* 倒计时区域样式 */
.countdown-section {
  margin-bottom: 24px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 2px solid var(--border-color);
  border-radius: 12px;
}

.countdown-section.urgent {
  border-color: var(--danger-color);
  animation: urgentPulse 1s ease-in-out infinite;
}

@keyframes urgentPulse {
  0%, 100% {
    border-color: var(--danger-color);
  }
  50% {
    border-color: rgba(239, 68, 68, 0.5);
  }
}

.countdown-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.countdown-icon {
  color: var(--primary-color);
}

.countdown-text {
  font-size: 15px;
  color: var(--text-primary);
}

.countdown-text strong {
  font-size: 18px;
  color: var(--primary-color);
  font-weight: 700;
}

.countdown-section.urgent .countdown-text strong {
  color: var(--danger-color);
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.progress-bar-container {
  width: 100%;
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 1s linear;
  animation: pulse 2s ease-in-out infinite;
}

.countdown-section.urgent .progress-bar {
  background: linear-gradient(90deg, #f87171 0%, #dc2626 100%);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.countdown-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

/* 超时提示样式 */
.timeout-section {
  text-align: center;
  padding: 40px 20px;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: 12px;
}

.timeout-icon {
  display: inline-block;
  margin-bottom: 16px;
  color: var(--danger-color);
}

.timeout-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.timeout-message {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0 0 24px;
}
</style>