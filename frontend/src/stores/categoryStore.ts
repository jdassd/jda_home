import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/api'

// Category interface
export interface Category {
  id: number
  userId: number
  name: string
  order: number
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Create category input
export interface CreateCategoryInput {
  name: string
  order?: number
  isPublic?: boolean
}

// Update category input
export interface UpdateCategoryInput {
  name?: string
  order?: number
  isPublic?: boolean
}

// Reorder categories input
export interface ReorderCategoriesInput {
  categories: Array<{
    id: number
    order: number
  }>
}

export const useCategoryStore = defineStore('category', () => {
  // State
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  // Fetch all categories
  const fetchCategories = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/categories')
      categories.value = response.data.categories
      return response.data.categories
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取分类失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Create a new category
  const createCategory = async (data: CreateCategoryInput) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/categories', data)
      categories.value.push(response.data.category)
      // Re-sort categories by order
      categories.value.sort((a, b) => a.order - b.order)
      return response.data.category
    } catch (err: any) {
      error.value = err.response?.data?.message || '创建分类失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update a category
  const updateCategory = async (id: number, data: UpdateCategoryInput) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/categories/${id}`, data)
      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1) {
        categories.value[index] = response.data.category
        // Re-sort categories by order
        categories.value.sort((a, b) => a.order - b.order)
      }
      return response.data.category
    } catch (err: any) {
      error.value = err.response?.data?.message || '更新分类失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete a category
  const deleteCategory = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/categories/${id}`)
      categories.value = categories.value.filter(cat => cat.id !== id)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || '删除分类失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Reorder categories
  const reorderCategories = async (data: ReorderCategoriesInput) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/categories/reorder', data)
      categories.value = response.data.categories
      return response.data.categories
    } catch (err: any) {
      error.value = err.response?.data?.message || '更新分类顺序失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Clear store
  const clearCategories = () => {
    categories.value = []
    error.value = null
    loading.value = false
  }

  // Get category by id
  const getCategoryById = (id: number) => {
    return categories.value.find(cat => cat.id === id)
  }

  // Fetch public categories for a specific user
  const fetchPublicCategories = async (userId: number) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get(`/categories/public/${userId}`)
      return response.data.categories
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取公开分类失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    categories,
    loading,
    error,
    
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    clearCategories,
    fetchPublicCategories,
    
    // Getters
    getCategoryById
  }
})