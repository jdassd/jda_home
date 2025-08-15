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
            <button v-if="!editingProfile" @click="startEditProfile" class="edit-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
              编辑
            </button>
          </div>

          <div class="info-grid">
            <!-- 头像 -->
            <div class="info-item avatar-item">
              <label class="info-label">头像</label>
              <div class="avatar-display">
                <div class="avatar">
                  <span>{{ profileForm.username.charAt(0).toUpperCase() }}</span>
                </div>
                <p class="avatar-tip">暂不支持自定义头像</p>
              </div>
            </div>

            <!-- 用户名 -->
            <div class="info-item">
              <label class="info-label">用户名</label>
              <div v-if="!editingProfile" class="info-value">{{ profileForm.username }}</div>
              <el-input 
                v-else 
                v-model="profileForm.username" 
                placeholder="请输入用户名"
                :disabled="loading"
              />
            </div>

            <!-- 邮箱 -->
            <div class="info-item">
              <label class="info-label">邮箱</label>
              <div v-if="!editingProfile" class="info-value">{{ profileForm.email }}</div>
              <el-input 
                v-else 
                v-model="profileForm.email" 
                placeholder="请输入邮箱"
                :disabled="loading"
              />
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

          <!-- 编辑操作按钮 -->
          <div v-if="editingProfile" class="edit-actions">
            <el-button @click="cancelEditProfile" :disabled="loading">取消</el-button>
            <el-button type="primary" @click="saveProfile" :loading="loading">保存修改</el-button>
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
              <el-button @click="showPasswordDialog = true">修改密码</el-button>
            </div>

            <!-- 安全问题 -->
            <div class="security-item">
              <div class="security-info">
                <h3 class="security-title">安全问题</h3>
                <p class="security-desc">用于找回密码时验证身份</p>
              </div>
              <el-button @click="showSecurityDialog = true">修改安全问题</el-button>
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

        <!-- 危险操作 -->
        <div class="profile-section danger-section">
          <div class="section-header">
            <h2 class="section-title">危险操作</h2>
          </div>
          <div class="danger-warning">
            <p>以下操作不可恢复，请谨慎操作</p>
            <el-button type="danger" plain @click="handleDeleteAccount">删除账户</el-button>
          </div>
        </div>
      </div>

      <!-- 修改密码对话框 -->
      <el-dialog
        v-model="showPasswordDialog"
        title="修改密码"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" label-width="100px">
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input
              v-model="passwordForm.currentPassword"
              type="password"
              placeholder="请输入当前密码"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码（至少6位）"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请再次输入新密码"
              show-password
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">
            确认修改
          </el-button>
        </template>
      </el-dialog>

      <!-- 修改安全问题对话框 -->
      <el-dialog
        v-model="showSecurityDialog"
        title="修改安全问题"
        width="500px"
        :close-on-click-modal="false"
      >
        <el-form ref="securityFormRef" :model="securityForm" :rules="securityRules" label-width="100px">
          <el-form-item label="当前密码" prop="password">
            <el-input
              v-model="securityForm.password"
              type="password"
              placeholder="请输入密码验证身份"
              show-password
            />
          </el-form-item>
          <el-form-item label="安全问题" prop="question">
            <el-select v-model="securityForm.question" placeholder="请选择安全问题">
              <el-option label="您的第一个宠物叫什么？" value="您的第一个宠物叫什么？" />
              <el-option label="您母亲的娘家姓氏是什么？" value="您母亲的娘家姓氏是什么？" />
              <el-option label="您最喜欢的老师叫什么？" value="您最喜欢的老师叫什么？" />
              <el-option label="您的出生地是哪里？" value="您的出生地是哪里？" />
              <el-option label="您最喜欢的电影是什么？" value="您最喜欢的电影是什么？" />
            </el-select>
          </el-form-item>
          <el-form-item label="答案" prop="answer">
            <el-input
              v-model="securityForm.answer"
              placeholder="请输入安全问题答案"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showSecurityDialog = false">取消</el-button>
          <el-button type="primary" @click="handleChangeSecurity" :loading="securityLoading">
            确认修改
          </el-button>
        </template>
      </el-dialog>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useCategoryStore } from '../stores/categoryStore'
import { useLinkStore } from '../stores/linkStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import MainLayout from '../layouts/MainLayout.vue'
import api from '../utils/api'

// Store
const authStore = useAuthStore()
const categoryStore = useCategoryStore()
const linkStore = useLinkStore()

// 状态
const loading = ref(false)
const editingProfile = ref(false)
const showPasswordDialog = ref(false)
const showSecurityDialog = ref(false)
const passwordLoading = ref(false)
const securityLoading = ref(false)

// 表单引用
const passwordFormRef = ref<FormInstance>()
const securityFormRef = ref<FormInstance>()

// 用户信息
const userInfo = computed(() => authStore.user || {
  id: 0,
  username: '',
  email: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

// 个人资料表单
const profileForm = reactive({
  username: userInfo.value.username,
  email: userInfo.value.email
})

// 修改密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 修改安全问题表单
const securityForm = reactive({
  password: '',
  question: '',
  answer: ''
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

// 验证规则
const passwordRules: FormRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const securityRules: FormRules = {
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  question: [
    { required: true, message: '请选择安全问题', trigger: 'change' }
  ],
  answer: [
    { required: true, message: '请输入答案', trigger: 'blur' }
  ]
}

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

// 开始编辑个人资料
const startEditProfile = () => {
  profileForm.username = userInfo.value.username
  profileForm.email = userInfo.value.email
  editingProfile.value = true
}

// 取消编辑
const cancelEditProfile = () => {
  profileForm.username = userInfo.value.username
  profileForm.email = userInfo.value.email
  editingProfile.value = false
}

// 保存个人资料
const saveProfile = async () => {
  if (!profileForm.username || !profileForm.email) {
    ElMessage.warning('请填写完整信息')
    return
  }

  loading.value = true
  try {
    // TODO: 调用后端API更新用户信息
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    ElMessage.success('个人资料更新成功')
    editingProfile.value = false
    
    // 更新store中的用户信息
    await authStore.checkAuthStatus()
  } catch (error) {
    ElMessage.error('更新失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 修改密码
const handleChangePassword = async () => {
  const valid = await passwordFormRef.value?.validate()
  if (!valid) return

  passwordLoading.value = true
  try {
    // TODO: 调用后端API修改密码
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    ElMessage.success('密码修改成功，请重新登录')
    showPasswordDialog.value = false
    
    // 清空表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // 退出登录
    authStore.logout()
    window.location.href = '/login'
  } catch (error) {
    ElMessage.error('修改失败，请检查当前密码是否正确')
  } finally {
    passwordLoading.value = false
  }
}

// 修改安全问题
const handleChangeSecurity = async () => {
  const valid = await securityFormRef.value?.validate()
  if (!valid) return

  securityLoading.value = true
  try {
    // TODO: 调用后端API修改安全问题
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟API调用
    
    ElMessage.success('安全问题修改成功')
    showSecurityDialog.value = false
    
    // 清空表单
    securityForm.password = ''
    securityForm.question = ''
    securityForm.answer = ''
  } catch (error) {
    ElMessage.error('修改失败，请检查密码是否正确')
  } finally {
    securityLoading.value = false
  }
}

// 删除账户
const handleDeleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      '删除账户后，您的所有数据将被永久删除且无法恢复。确定要继续吗？',
      '危险操作',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        confirmButtonClass: 'el-button--danger'
      }
    )
    
    // 二次确认
    await ElMessageBox.prompt(
      '请输入您的用户名以确认删除操作',
      '二次确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: new RegExp(`^${userInfo.value.username}$`),
        inputErrorMessage: '用户名不正确'
      }
    )
    
    // TODO: 调用后端API删除账户
    ElMessage.success('账户已删除')
    authStore.logout()
    window.location.href = '/login'
  } catch {
    // 用户取消
  }
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

.edit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f5f7fa;
  border: none;
  border-radius: 8px;
  color: #667eea;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #667eea;
  color: white;
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

/* 编辑操作 */
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e8ecf1;
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

/* 危险操作 */
.danger-section {
  border: 1px solid #fde2e2;
  background: #fef5f5;
}

.danger-warning {
  text-align: center;
  padding: 20px;
}

.danger-warning p {
  font-size: 14px;
  color: #f56c6c;
  margin: 0 0 16px 0;
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