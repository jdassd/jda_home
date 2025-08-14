<template>
  <div class="login">
    <h1>{{ isRegister ? '用户注册' : '用户登录' }}</h1>
    <el-form class="login-form" :model="form" :rules="rules" ref="formRef">
      <el-form-item label="用户名" prop="username" v-if="isRegister">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword" v-if="isRegister">
        <el-input type="password" v-model="form.confirmPassword" placeholder="请确认密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">{{ isRegister ? '注册' : '登录' }}</el-button>
        <el-button @click="toggleForm">{{ isRegister ? '已有账户？去登录' : '没有账户？去注册' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import axios from 'axios';

// Router
const router = useRouter();

// Form reference
const formRef = ref<FormInstance>();

// Form state
const isRegister = ref(false);
const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Validation rules
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (isRegister.value && value !== form.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
});

// Toggle between login and register forms
const toggleForm = () => {
  isRegister.value = !isRegister.value;
};

// Handle form submission
const handleSubmit = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        if (isRegister.value) {
          // Register user
          const response = await axios.post('http://localhost:3000/api/auth/register', {
            username: form.username,
            email: form.email,
            password: form.password
          });
          
          ElMessage.success(response.data.message);
          // Switch to login form after successful registration
          isRegister.value = false;
        } else {
          // Login user
          const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: form.email,
            password: form.password
          });
          
          // Store token in localStorage
          localStorage.setItem('token', response.data.token);
          
          ElMessage.success(response.data.message);
          // Redirect to home page after successful login
          router.push('/home');
        }
      } catch (error: any) {
        ElMessage.error(error.response?.data?.message || '操作失败');
      }
    }
  });
};
</script>

<style scoped>
.login {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.login-form {
  margin-top: 20px;
}
</style>