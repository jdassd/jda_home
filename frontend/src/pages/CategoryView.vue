<template>
  <MainLayout>
    <div class="category-page">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-title">
            <h1>分类管理</h1>
            <p>管理您的导航分类和链接</p>
          </div>
          <div class="header-actions">
            <button @click="showAddCategoryDialog = true" class="btn-add-category">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
              </svg>
              新建分类
            </button>
          </div>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-cards">
        <div class="stat-card gradient-primary">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
              <path d="M14 6H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2zM26 6h-8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2zM14 18H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2zM26 18h-8a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-8a2 2 0 00-2-2z"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ categoryStore.categories.length }}</div>
            <div class="stat-label">总分类数</div>
          </div>
        </div>
        
        <div class="stat-card gradient-success">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm6.036 11.464l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L13 19.014l7.036-7.036a1 1 0 011.414 1.414z"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ linkStore.links.length }}</div>
            <div class="stat-label">总链接数</div>
          </div>
        </div>
        
        <div class="stat-card gradient-info">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm-1 21h-2v-2h2v2zm4 0h-2v-2h2v2zm-4-4h-2v-8h2v8zm4 0h-2v-8h2v8z"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ publicLinksCount }}</div>
            <div class="stat-label">公开链接数</div>
          </div>
        </div>
        
        <div class="stat-card gradient-warning">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
              <path d="M18 6v2h8v2h-2v18a2 2 0 01-2 2H10a2 2 0 01-2-2V10H6V8h8V6a2 2 0 012-2h2a2 2 0 012 2zm-2 0h-2v2h2V6zm-6 4v18h10V10H10zm2 4h2v10h-2V14zm4 0h2v10h-2V14z"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ privateLinksCount }}</div>
            <div class="stat-label">私有链接数</div>
          </div>
        </div>
      </div>

      <!-- 分类列表 -->
      <div class="categories-container">
        <!-- 加载状态 -->
        <div v-if="categoryStore.loading" class="loading-state">
          <div class="loading-spinner-large"></div>
          <p>加载中...</p>
        </div>

        <!-- 分类卡片 -->
        <div v-else-if="categoryStore.categories.length > 0" class="categories-grid">
          <TransitionGroup name="list">
            <div
              v-for="category in categoryStore.categories"
              :key="category.id"
              class="category-item"
              :class="{ expanded: expandedCategory === category.id }"
            >
              <!-- 分类头部 -->
              <div class="category-header" @click="toggleCategory(category.id)">
                <div class="category-info">
                  <h3 class="category-title">
                    {{ category.name }}
                    <span v-if="category.isPublic" class="public-badge" title="公开分类">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </span>
                  </h3>
                  <span class="category-meta">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 018 14.58a31.481 31.481 0 01-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0110 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 002 6c0 4.314 6 10 6 10z"/>
                      <path d="M8 8a2 2 0 110-4 2 2 0 010 4zm0 1a3 3 0 100-6 3 3 0 000 6z"/>
                    </svg>
                    {{ getCategoryLinks(category.id).length }} 个链接
                  </span>
                </div>
                <div class="category-actions">
                  <button
                    @click.stop="handleEditCategory(category)"
                    class="btn-icon"
                    title="编辑分类"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.146.146a.5.5 0 01.708 0l3 3a.5.5 0 010 .708l-10 10a.5.5 0 01-.168.11l-5 2a.5.5 0 01-.65-.65l2-5a.5.5 0 01.11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 01.5.5v.5h.5a.5.5 0 01.5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 015 12.5V12h-.5a.5.5 0 01-.5-.5V11h-.5a.5.5 0 01-.468-.325z"/>
                    </svg>
                  </button>
                  <button
                    @click.stop="handleDeleteCategory(category)"
                    class="btn-icon danger"
                    title="删除分类"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z"/>
                      <path fill-rule="evenodd" d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>
                  </button>
                  <button
                    class="btn-icon expand-icon"
                    :class="{ rotated: expandedCategory === category.id }"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 01.708 0L8 10.293l5.646-5.647a.5.5 0 01.708.708l-6 6a.5.5 0 01-.708 0l-6-6a.5.5 0 010-.708z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- 分类内容（展开时显示） -->
              <div v-if="expandedCategory === category.id" class="category-content">
                <!-- 添加链接按钮 -->
                <div class="content-header">
                  <h4>链接列表</h4>
                  <button @click="handleAddLink(category)" class="btn-add-link">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/>
                    </svg>
                    添加链接
                  </button>
                </div>

                <!-- 链接列表（支持拖拽排序） -->
                <div v-if="getCategoryLinks(category.id).length > 0" class="links-list">
                  <draggable
                    v-model="categoryLinksMap[category.id]"
                    :group="`links-${category.id}`"
                    item-key="id"
                    @end="handleDragEnd(category.id)"
                    handle=".drag-handle"
                    animation="200"
                  >
                    <template #item="{ element: link }">
                      <div class="link-card">
                        <div class="drag-handle" title="拖拽排序">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 2a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0zM7 18a2 2 0 11-4 0 2 2 0 014 0zM17 2a2 2 0 11-4 0 2 2 0 014 0zM17 10a2 2 0 11-4 0 2 2 0 014 0zM17 18a2 2 0 11-4 0 2 2 0 014 0z"/>
                          </svg>
                        </div>
                        <div class="link-icon">
                          <img
                            v-if="link.icon && !isEmoji(link.icon)"
                            :src="link.icon"
                            :alt="link.title"
                            @error="handleIconError($event, link.title)"
                          />
                          <span v-else-if="link.icon && isEmoji(link.icon)" class="icon-emoji">
                            {{ link.icon }}
                          </span>
                          <span v-else class="icon-placeholder">
                            {{ link.title.charAt(0).toUpperCase() }}
                          </span>
                        </div>
                        <div class="link-info">
                          <a :href="formatLinkUrl(link.url)" target="_blank" class="link-title">
                            {{ link.title }}
                            <span v-if="link.isPublic" class="public-badge small" title="公开链接">
                              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                              </svg>
                            </span>
                          </a>
                          <div class="link-url">{{ formatUrl(link.url) }}</div>
                          <div v-if="link.description" class="link-description">
                            {{ link.description }}
                          </div>
                        </div>
                        <div class="link-actions">
                          <button
                            @click="handleEditLink(link)"
                            class="btn-icon small"
                            title="编辑"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                              <path d="M10.646.146a.5.5 0 01.708 0l2.5 2.5a.5.5 0 010 .708l-8 8a.5.5 0 01-.168.11l-3 1a.5.5 0 01-.65-.65l1-3a.5.5 0 01.11-.168l8-8zM11.207 2L2 11.207V11.5h.293a.5.5 0 01.5.5v.293L12 3.207 11.207 2z"/>
                            </svg>
                          </button>
                          <button
                            @click="handleDeleteLink(link)"
                            class="btn-icon small danger"
                            title="删除"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                              <path d="M4.646 4.646a.5.5 0 01.708 0L7 6.293l1.646-1.647a.5.5 0 01.708.708L7.707 7l1.647 1.646a.5.5 0 01-.708.708L7 7.707 5.354 9.354a.5.5 0 01-.708-.708L6.293 7 4.646 5.354a.5.5 0 010-.708z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </div>

                <!-- 空状态 -->
                <div v-else class="empty-links">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="currentColor" opacity="0.1">
                    <path d="M38 8H10c-1.1 0-2 .9-2 2v28c0 1.1.9 2 2 2h28c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM24 12c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 24c-5.52 0-10-4.48-10-10s4.48-10 10-10 10 4.48 10 10-4.48 10-10 10z"/>
                  </svg>
                  <p>该分类下暂无链接</p>
                  <button @click="handleAddLink(category)" class="btn-text">
                    添加第一个链接
                  </button>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-illustration">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
              <circle cx="60" cy="60" r="50" stroke="currentColor" stroke-width="2" opacity="0.1"/>
              <rect x="35" y="35" width="20" height="20" rx="4" fill="currentColor" opacity="0.2"/>
              <rect x="65" y="35" width="20" height="20" rx="4" fill="currentColor" opacity="0.2"/>
              <rect x="35" y="65" width="20" height="20" rx="4" fill="currentColor" opacity="0.2"/>
              <rect x="65" y="65" width="20" height="20" rx="4" fill="currentColor" opacity="0.2"/>
              <path d="M60 50v20M50 60h20" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
            </svg>
          </div>
          <h3>开始创建您的第一个分类</h3>
          <p>分类可以帮助您更好地组织和管理导航链接</p>
          <button @click="showAddCategoryDialog = true" class="btn-primary">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/>
            </svg>
            创建分类
          </button>
        </div>
      </div>

      <!-- 添加/编辑分类对话框 -->
      <Teleport to="body">
        <div v-if="showAddCategoryDialog" class="dialog-overlay" @click.self="closeCategoryDialog">
          <div class="dialog">
            <div class="dialog-header">
              <h3>{{ editingCategory ? '编辑分类' : '新建分类' }}</h3>
              <button @click="closeCategoryDialog" class="dialog-close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                </svg>
              </button>
            </div>
            
            <form @submit.prevent="handleSaveCategory" class="dialog-body">
              <div class="form-group">
                <label class="form-label">分类名称</label>
                <input
                  v-model="categoryForm.name"
                  type="text"
                  class="form-input"
                  placeholder="输入分类名称"
                  required
                  maxlength="50"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">排序值</label>
                <input
                  v-model.number="categoryForm.order"
                  type="number"
                  class="form-input"
                  placeholder="输入排序值（数字越小越靠前）"
                  min="0"
                  max="9999"
                />
                <span class="form-hint">数字越小，显示越靠前</span>
              </div>
              
              <div class="form-group">
                <label class="form-label">
                  <input
                    v-model="categoryForm.isPublic"
                    type="checkbox"
                    style="margin-right: 8px;"
                  />
                  设为公开分类
                </label>
                <span class="form-hint">公开分类可以被其他用户查看</span>
              </div>
            </form>
            
            <div class="dialog-footer">
              <button @click="closeCategoryDialog" class="btn-secondary">
                取消
              </button>
              <button @click="handleSaveCategory" class="btn-primary" :disabled="submitting">
                {{ submitting ? '保存中...' : '保存' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- 添加/编辑链接对话框 -->
      <Teleport to="body">
        <div v-if="showAddLinkDialog" class="dialog-overlay" @click.self="closeLinkDialog">
          <div class="dialog">
            <div class="dialog-header">
              <h3>{{ editingLink ? '编辑链接' : '添加链接' }}</h3>
              <button @click="closeLinkDialog" class="dialog-close">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                </svg>
              </button>
            </div>
            
            <form @submit.prevent="handleSaveLink" class="dialog-body">
              <div class="form-group">
                <label class="form-label">链接标题</label>
                <input
                  v-model="linkForm.title"
                  type="text"
                  class="form-input"
                  placeholder="输入链接标题"
                  required
                  maxlength="100"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">链接地址</label>
                <input
                  v-model="linkForm.url"
                  type="url"
                  class="form-input"
                  placeholder="https://example.com"
                  required
                  maxlength="500"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">描述（选填）</label>
                <textarea
                  v-model="linkForm.description"
                  class="form-textarea"
                  placeholder="输入链接描述"
                  rows="3"
                  maxlength="500"
                ></textarea>
              </div>
              
              <div class="form-group">
                <label class="form-label">图标URL（选填）</label>
                <input
                  v-model="linkForm.icon"
                  type="text"
                  class="form-input"
                  placeholder="图标URL或Base64"
                  maxlength="1000"
                />
                <span class="form-hint">可以是图标URL或Base64编码的图片</span>
              </div>
              
              <div class="form-group">
                <label class="form-label">
                  <input
                    v-model="linkForm.isPublic"
                    type="checkbox"
                    style="margin-right: 8px;"
                  />
                  设为公开链接
                </label>
                <span class="form-hint">公开链接可以被其他用户查看（需要分类也是公开的）</span>
              </div>
            </form>
            
            <div class="dialog-footer">
              <button @click="closeLinkDialog" class="btn-secondary">
                取消
              </button>
              <button @click="handleSaveLink" class="btn-primary" :disabled="linkSubmitting">
                {{ linkSubmitting ? '保存中...' : '保存' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCategoryStore, type Category } from '../stores/categoryStore'
import { useLinkStore, type Link } from '../stores/linkStore'
import MainLayout from '../layouts/MainLayout.vue'
import draggable from 'vuedraggable'

// Store
const categoryStore = useCategoryStore()
const linkStore = useLinkStore()

// 状态
const expandedCategory = ref<number | null>(null)
const showAddCategoryDialog = ref(false)
const showAddLinkDialog = ref(false)
const editingCategory = ref<Category | null>(null)
const editingLink = ref<Link | null>(null)
const currentCategoryId = ref<number | null>(null)
const submitting = ref(false)
const linkSubmitting = ref(false)
const categoryLinksMap = ref<Record<number, Link[]>>({})

// 表单数据
const categoryForm = ref({
  name: '',
  order: 0,
  isPublic: false
})

const linkForm = ref({
  title: '',
  url: '',
  description: '',
  icon: '',
  isPublic: false
})

// 计算属性
const publicLinksCount = computed(() => {
  return linkStore.links.filter(link => link.isPublic).length
})

const privateLinksCount = computed(() => {
  return linkStore.links.filter(link => !link.isPublic).length
})

// 检查是否为emoji
const isEmoji = (str: string) => {
  const emojiRegex = /^[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]$/u;
  return emojiRegex.test(str);
}

// 获取分类下的链接
const getCategoryLinks = (categoryId: number) => {
  return categoryLinksMap.value[categoryId] || []
}

// 监听链接变化，更新本地映射
watch(() => linkStore.links, () => {
  updateCategoryLinksMap()
}, { deep: true })

// 更新分类链接映射
const updateCategoryLinksMap = () => {
  const map: Record<number, Link[]> = {}
  categoryStore.categories.forEach(category => {
    map[category.id] = linkStore.getLinksByCategory(category.id)
  })
  categoryLinksMap.value = map
}

// 处理拖拽结束
const handleDragEnd = async (categoryId: number) => {
  try {
    const links = categoryLinksMap.value[categoryId] || []
    const linkIds = links.map(link => link.id)
    await linkStore.reorderLinks(categoryId, linkIds)
    ElMessage.success('排序已保存')
  } catch (error) {
    ElMessage.error('保存排序失败')
    // 重新加载链接以恢复原始顺序
    await linkStore.fetchLinks()
    updateCategoryLinksMap()
  }
}

// 切换分类展开/折叠
const toggleCategory = (categoryId: number) => {
  expandedCategory.value = expandedCategory.value === categoryId ? null : categoryId
}

// 格式化链接URL，确保有协议前缀
const formatLinkUrl = (url: string) => {
  // 如果URL已经包含协议，直接返回
  if (/^https?:\/\//i.test(url)) {
    return url
  }
  // 如果URL不包含协议，添加 http://
  return 'http://' + url
}

// 格式化URL显示
const formatUrl = (url: string) => {
  try {
    // 先确保URL有协议
    const formattedUrl = formatLinkUrl(url)
    const urlObj = new URL(formattedUrl)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

// 处理图标加载错误
const handleIconError = (event: Event, title: string) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  const parent = img.parentElement
  if (parent) {
    const span = document.createElement('span')
    span.className = 'icon-placeholder'
    span.textContent = title.charAt(0).toUpperCase()
    parent.appendChild(span)
  }
}

// 分类相关操作
const handleEditCategory = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    order: category.order,
    isPublic: category.isPublic || false
  }
  showAddCategoryDialog.value = true
}

const handleDeleteCategory = async (category: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${category.name}"吗？删除后该分类下的所有链接也将被删除。`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
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

const handleSaveCategory = async () => {
  if (!categoryForm.value.name.trim()) {
    ElMessage.warning('请输入分类名称')
    return
  }

  submitting.value = true
  try {
    if (editingCategory.value) {
      // 更新分类
      await categoryStore.updateCategory(editingCategory.value.id, {
        name: categoryForm.value.name,
        order: categoryForm.value.order,
        isPublic: categoryForm.value.isPublic
      })
      ElMessage.success('分类更新成功')
    } else {
      // 创建分类
      await categoryStore.createCategory({
        name: categoryForm.value.name,
        order: categoryForm.value.order,
        isPublic: categoryForm.value.isPublic
      })
      ElMessage.success('分类创建成功')
    }
    closeCategoryDialog()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

const closeCategoryDialog = () => {
  showAddCategoryDialog.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    order: categoryStore.categories.length,
    isPublic: false
  }
}

// 链接相关操作
const handleAddLink = (category: Category) => {
  currentCategoryId.value = category.id
  linkForm.value = {
    title: '',
    url: '',
    description: '',
    icon: '',
    isPublic: false
  }
  showAddLinkDialog.value = true
}

const handleEditLink = (link: Link) => {
  editingLink.value = link
  currentCategoryId.value = link.categoryId
  linkForm.value = {
    title: link.title,
    url: link.url,
    description: link.description || '',
    icon: link.icon || '',
    isPublic: link.isPublic || false
  }
  showAddLinkDialog.value = true
}

const handleDeleteLink = async (link: Link) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除链接"${link.title}"吗？`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
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

const handleSaveLink = async () => {
  if (!linkForm.value.title.trim() || !linkForm.value.url.trim()) {
    ElMessage.warning('请填写必填字段')
    return
  }

  linkSubmitting.value = true
  try {
    if (editingLink.value) {
      // 更新链接
      await linkStore.updateLink(editingLink.value.id, {
        title: linkForm.value.title,
        url: linkForm.value.url,
        description: linkForm.value.description || undefined,
        icon: linkForm.value.icon || undefined,
        isPublic: linkForm.value.isPublic
      })
      ElMessage.success('链接更新成功')
    } else {
      // 创建链接
      if (!currentCategoryId.value) {
        ElMessage.error('请选择分类')
        return
      }
      await linkStore.createLink({
        categoryId: currentCategoryId.value,
        title: linkForm.value.title,
        url: linkForm.value.url,
        description: linkForm.value.description || undefined,
        icon: linkForm.value.icon || undefined,
        isPublic: linkForm.value.isPublic
      })
      ElMessage.success('链接创建成功')
    }
    closeLinkDialog()
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  } finally {
    linkSubmitting.value = false
  }
}

const closeLinkDialog = () => {
  showAddLinkDialog.value = false
  editingLink.value = null
  currentCategoryId.value = null
  linkForm.value = {
    title: '',
    url: '',
    description: '',
    icon: '',
    isPublic: false
  }
}

// 初始化
onMounted(async () => {
  try {
    await Promise.all([
      categoryStore.fetchCategories(),
      linkStore.fetchLinks()
    ])
    // 设置默认排序值
    categoryForm.value.order = categoryStore.categories.length
    // 初始化分类链接映射
    updateCategoryLinksMap()
  } catch (error: any) {
    ElMessage.error('获取数据失败')
  }
})
</script>

<style scoped>
@import '../styles/global.css';

.category-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid var(--border-color);
  padding: 24px 0;
  margin-bottom: 32px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.header-title p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0;
}

.btn-add-category {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-add-category:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

/* 统计卡片 */
.stats-cards {
  max-width: 1200px;
  margin: 0 auto 32px;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-card.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-card.gradient-success {
  background: linear-gradient(135deg, #11cdef 0%, #2dce89 100%);
  color: white;
}

.stat-card.gradient-info {
  background: linear-gradient(135deg, #11cdef 0%, #1171ef 100%);
  color: white;
}

.stat-card.gradient-warning {
  background: linear-gradient(135deg, #fb6340 0%, #f5365c 100%);
  color: white;
}

.stat-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  margin-top: 4px;
  opacity: 0.9;
}

/* 分类容器 */
.categories-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.categories-grid {
  display: grid;
  gap: 20px;
}

.category-item {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: var(--transition-base);
}

.category-item:hover {
  box-shadow: var(--shadow-lg);
}

.category-item.expanded {
  box-shadow: var(--shadow-xl);
}

/* 分类头部 */
.category-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-base);
}

.category-header:hover {
  background: var(--bg-color);
}

.category-info {
  flex: 1;
}

.category-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--text-secondary);
}

.category-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: var(--bg-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-icon:hover {
  background: var(--primary-bg);
  color: var(--primary-color);
}

.btn-icon.danger:hover {
  background: rgba(245, 54, 92, 0.1);
  color: var(--danger-color);
}

.btn-icon.small {
  width: 28px;
  height: 28px;
}

.expand-icon {
  transition: transform 0.3s ease;
}

.expand-icon.rotated {
  transform: rotate(180deg);
}

/* 分类内容 */
.category-content {
  padding: 0 24px 24px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 1000px;
  }
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.content-header h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0;
}

.btn-add-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--primary-bg);
  color: var(--primary-color);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-add-link:hover {
  background: var(--primary-color);
  color: white;
}

/* 链接列表 */
.links-list {
  display: grid;
  gap: 12px;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--bg-color);
  border-radius: 12px;
  transition: var(--transition-base);
  cursor: move;
}

.link-card:hover {
  background: white;
  box-shadow: var(--shadow-sm);
  transform: translateX(4px);
}

.link-card.sortable-ghost {
  opacity: 0.4;
  background: var(--primary-bg);
}

.link-card.sortable-drag {
  opacity: 0;
}

/* 拖拽手柄 */
.drag-handle {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: grab;
  flex-shrink: 0;
  transition: var(--transition-base);
}

.drag-handle:hover {
  color: var(--primary-color);
}

.drag-handle:active {
  cursor: grabbing;
}

.link-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.link-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.icon-placeholder {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary-color);
}

.icon-emoji {
  font-size: 24px;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  text-decoration: none;
  display: block;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-title:hover {
  color: var(--primary-color);
}

.link-url {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.link-description {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-actions {
  display: flex;
  gap: 8px;
}

/* 空状态 */
.empty-links {
  text-align: center;
  padding: 40px;
  background: var(--bg-color);
  border-radius: 12px;
}

.empty-links p {
  margin: 16px 0;
  color: var(--text-secondary);
}

.btn-text {
  color: var(--primary-color);
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
}

.btn-text:hover {
  color: var(--primary-hover);
}

.empty-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
}

.empty-illustration {
  margin-bottom: 32px;
  color: var(--primary-color);
}

.empty-state h3 {
  font-size: 24px;
  color: var(--text-primary);
  margin: 0 0 12px;
}

.empty-state p {
  font-size: 16px;
  color: var(--text-secondary);
  margin: 0 0 32px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 加载状态 */
.loading-state {
  text-align: center;
  padding: 100px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
}

.loading-spinner-large {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  border: 4px solid rgba(94, 114, 228, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 对话框 */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dialog {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-header {
  padding: 24px 24px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.dialog-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: var(--bg-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-base);
}

.dialog-close:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

.dialog-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
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

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  font-size: 15px;
  border: 2px solid var(--border-color);
  border-radius: 10px;
  background: white;
  color: var(--text-primary);
  transition: var(--transition-base);
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.dialog-footer {
  padding: 20px 24px;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-secondary {
  padding: 10px 20px;
  background: var(--bg-color);
  color: var(--text-primary);
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn-secondary:hover {
  background: var(--border-color);
}

/* 公开标记样式 */
.public-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: var(--primary-bg);
  color: var(--primary-color);
  border-radius: 12px;
  font-size: 12px;
  font-weight: normal;
  margin-left: 8px;
}

.public-badge.small {
  padding: 1px 6px;
  margin-left: 4px;
}

.public-badge svg {
  opacity: 0.8;
}

.category-title {
  display: flex;
  align-items: center;
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dialog {
    width: 95%;
    margin: 20px;
  }
  
  .link-card {
    flex-direction: column;
    text-align: center;
  }
  
  .link-actions {
    width: 100%;
    justify-content: center;
  }
}
</style>