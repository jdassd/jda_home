<template>
  <div class="category-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>分类管理</h2>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><Plus /></el-icon>
            添加分类
          </el-button>
        </div>
      </template>

      <!-- Loading state -->
      <div v-if="categoryStore.loading" class="loading-container">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- Categories list -->
      <div v-else-if="categoryStore.categories.length > 0" class="categories-list">
        <el-table
          :data="categoryStore.categories"
          style="width: 100%"
          row-key="id"
        >
          <el-table-column type="expand">
            <template #default="props">
              <div class="links-section">
                <div class="links-header">
                  <h4>链接列表</h4>
                  <el-button type="primary" size="small" @click="handleAddLink(props.row)">
                    <el-icon><Plus /></el-icon>
                    添加链接
                  </el-button>
                </div>
                <div v-if="getCategoryLinks(props.row.id).length > 0" class="links-list">
                  <el-table :data="getCategoryLinks(props.row.id)" size="small">
                    <el-table-column prop="title" label="标题" />
                    <el-table-column prop="url" label="链接地址">
                      <template #default="scope">
                        <el-link :href="scope.row.url" target="_blank" type="primary">
                          {{ scope.row.url }}
                        </el-link>
                      </template>
                    </el-table-column>
                    <el-table-column prop="description" label="描述" />
                    <el-table-column label="操作" width="150" align="center">
                      <template #default="scope">
                        <el-button
                          type="primary"
                          size="small"
                          text
                          @click="handleEditLink(scope.row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          type="danger"
                          size="small"
                          text
                          @click="handleDeleteLink(scope.row)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
                <div v-else class="no-links">
                  <el-empty description="暂无链接" :image-size="60" />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="分类名称" />
          <el-table-column prop="order" label="排序" width="100" align="center" />
          <el-table-column label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Reorder buttons -->
        <div class="reorder-section">
          <el-button @click="handleReorder" :disabled="!hasOrderChanges">
            保存排序
          </el-button>
          <el-button @click="resetOrder" :disabled="!hasOrderChanges">
            重置排序
          </el-button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-state">
        <el-empty description="暂无分类">
          <el-button type="primary" @click="showAddDialog = true">
            创建第一个分类
          </el-button>
        </el-empty>
      </div>
    </el-card>

    <!-- Add/Edit Dialog -->
    <el-dialog
      v-model="showAddDialog"
      :title="editingCategory ? '编辑分类' : '添加分类'"
      width="400px"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="categoryForm.name"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number
            v-model="categoryForm.order"
            :min="0"
            :max="9999"
            controls-position="right"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- Add/Edit Link Dialog -->
    <el-dialog
      v-model="showLinkDialog"
      :title="editingLink ? '编辑链接' : '添加链接'"
      width="500px"
    >
      <el-form
        ref="linkFormRef"
        :model="linkForm"
        :rules="linkFormRules"
        label-width="80px"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="linkForm.title"
            placeholder="请输入链接标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="链接地址" prop="url">
          <el-input
            v-model="linkForm.url"
            placeholder="请输入链接地址，如: https://example.com"
            maxlength="500"
          />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="linkForm.description"
            type="textarea"
            placeholder="请输入链接描述（选填）"
            maxlength="500"
            :rows="3"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input
            v-model="linkForm.icon"
            placeholder="图标URL或Base64（选填）"
            maxlength="1000"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleCloseLinkDialog">取消</el-button>
        <el-button type="primary" @click="handleSubmitLink" :loading="linkSubmitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useCategoryStore, type Category } from '../stores/categoryStore'
import { useLinkStore, type Link } from '../stores/linkStore'
import type { FormInstance, FormRules } from 'element-plus'

// Store
const categoryStore = useCategoryStore()
const linkStore = useLinkStore()

// Dialog state
const showAddDialog = ref(false)
const editingCategory = ref<Category | null>(null)
const submitting = ref(false)
const hasOrderChanges = ref(false)
const originalOrder = ref<number[]>([])

// Form
const categoryFormRef = ref<FormInstance>()
const categoryForm = ref({
  name: '',
  order: 0
})

// Link Dialog state
const showLinkDialog = ref(false)
const editingLink = ref<Link | null>(null)
const linkSubmitting = ref(false)
const currentCategoryId = ref<number | null>(null)

// Link Form
const linkFormRef = ref<FormInstance>()
const linkForm = ref({
  title: '',
  url: '',
  description: '',
  icon: ''
})

// Link Form validation rules
const linkFormRules: FormRules = {
  title: [
    { required: true, message: '请输入链接标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入链接地址', trigger: 'blur' },
    { type: 'url', message: '请输入有效的URL地址', trigger: 'blur' }
  ]
}

// Form validation rules
const formRules: FormRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  order: [
    { required: true, message: '请设置排序', trigger: 'blur' },
    { type: 'number', min: 0, max: 9999, message: '排序值在 0 到 9999 之间', trigger: 'blur' }
  ]
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Handle edit
const handleEdit = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    order: category.order
  }
  showAddDialog.value = true
}

// Handle delete
const handleDelete = async (category: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${category.name}"吗？删除后该分类下的所有链接将失去分类。`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await categoryStore.deleteCategory(category.id)
    ElMessage.success('分类删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

// Handle close dialog
const handleCloseDialog = () => {
  showAddDialog.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    order: categoryStore.categories.length
  }
  categoryFormRef.value?.resetFields()
}

// Handle submit
const handleSubmit = async () => {
  if (!categoryFormRef.value) return

  await categoryFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      if (editingCategory.value) {
        // Update category
        await categoryStore.updateCategory(editingCategory.value.id, {
          name: categoryForm.value.name,
          order: categoryForm.value.order
        })
        ElMessage.success('分类更新成功')
      } else {
        // Create category
        await categoryStore.createCategory({
          name: categoryForm.value.name,
          order: categoryForm.value.order
        })
        ElMessage.success('分类创建成功')
      }
      handleCloseDialog()
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '操作失败')
    } finally {
      submitting.value = false
    }
  })
}

// Handle reorder
const handleReorder = async () => {
  try {
    const reorderData = {
      categories: categoryStore.categories.map((cat, index) => ({
        id: cat.id,
        order: index
      }))
    }
    await categoryStore.reorderCategories(reorderData)
    ElMessage.success('排序保存成功')
    hasOrderChanges.value = false
    originalOrder.value = categoryStore.categories.map(cat => cat.id)
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '保存排序失败')
  }
}

// Reset order
const resetOrder = () => {
  // Reset to original order
  categoryStore.categories.sort((a, b) => {
    const indexA = originalOrder.value.indexOf(a.id)
    const indexB = originalOrder.value.indexOf(b.id)
    return indexA - indexB
  })
  hasOrderChanges.value = false
}

// Get links for a category
const getCategoryLinks = (categoryId: number) => {
  return linkStore.getLinksByCategory(categoryId)
}

// Handle add link
const handleAddLink = (category: Category) => {
  currentCategoryId.value = category.id
  linkForm.value = {
    title: '',
    url: '',
    description: '',
    icon: ''
  }
  showLinkDialog.value = true
}

// Handle edit link
const handleEditLink = (link: Link) => {
  editingLink.value = link
  currentCategoryId.value = link.categoryId
  linkForm.value = {
    title: link.title,
    url: link.url,
    description: link.description || '',
    icon: link.icon || ''
  }
  showLinkDialog.value = true
}

// Handle delete link
const handleDeleteLink = async (link: Link) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除链接"${link.title}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await linkStore.deleteLink(link.id)
    ElMessage.success('链接删除成功')
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.response?.data?.message || '删除失败')
    }
  }
}

// Handle close link dialog
const handleCloseLinkDialog = () => {
  showLinkDialog.value = false
  editingLink.value = null
  currentCategoryId.value = null
  linkForm.value = {
    title: '',
    url: '',
    description: '',
    icon: ''
  }
  linkFormRef.value?.resetFields()
}

// Handle submit link
const handleSubmitLink = async () => {
  if (!linkFormRef.value) return

  await linkFormRef.value.validate(async (valid) => {
    if (!valid) return

    linkSubmitting.value = true
    try {
      if (editingLink.value) {
        // Update link
        await linkStore.updateLink(editingLink.value.id, {
          title: linkForm.value.title,
          url: linkForm.value.url,
          description: linkForm.value.description || undefined,
          icon: linkForm.value.icon || undefined
        })
        ElMessage.success('链接更新成功')
      } else {
        // Create link
        if (!currentCategoryId.value) {
          ElMessage.error('请选择分类')
          return
        }
        await linkStore.createLink({
          categoryId: currentCategoryId.value,
          title: linkForm.value.title,
          url: linkForm.value.url,
          description: linkForm.value.description || undefined,
          icon: linkForm.value.icon || undefined
        })
        ElMessage.success('链接创建成功')
      }
      handleCloseLinkDialog()
    } catch (error: any) {
      ElMessage.error(error.response?.data?.message || '操作失败')
    } finally {
      linkSubmitting.value = false
    }
  })
}

// Initialize
onMounted(async () => {
  try {
    await categoryStore.fetchCategories()
    await linkStore.fetchLinks()
    originalOrder.value = categoryStore.categories.map(cat => cat.id)
    // Set default order for new category
    categoryForm.value.order = categoryStore.categories.length
  } catch (error: any) {
    ElMessage.error('获取分类列表失败')
  }
})
</script>

<style scoped>
.category-manage {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
}

.loading-container {
  padding: 20px;
}

.categories-list {
  min-height: 400px;
}

.empty-state {
  padding: 40px;
  text-align: center;
}

.reorder-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

.links-section {
  padding: 20px;
}

.links-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.links-header h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.links-list {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
}

.no-links {
  padding: 20px;
  text-align: center;
  background: #f5f7fa;
  border-radius: 4px;
}
</style>