import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../utils/api';

export interface Link {
  id: number;
  userId: number;
  categoryId: number;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: number;
    name: string;
  };
}

export const useLinkStore = defineStore('link', () => {
  const links = ref<Link[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // 获取所有链接
  const fetchLinks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get('/links');
      links.value = response.data;
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取链接列表失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 获取指定分类的链接
  const fetchLinksByCategory = async (categoryId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/links/category/${categoryId}`);
      return response.data;
    } catch (err: any) {
      error.value = err.response?.data?.message || '获取分类链接失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 创建新链接
  const createLink = async (linkData: {
    categoryId: number;
    title: string;
    url: string;
    description?: string;
    icon?: string;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/links', linkData);
      const newLink = response.data;
      
      // 添加到本地列表
      links.value.push(newLink);
      
      return newLink;
    } catch (err: any) {
      error.value = err.response?.data?.message || '创建链接失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 更新链接
  const updateLink = async (id: number, linkData: {
    title?: string;
    url?: string;
    description?: string;
    icon?: string;
    categoryId?: number;
    order?: number;
  }) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.put(`/links/${id}`, linkData);
      const updatedLink = response.data;
      
      // 更新本地列表
      const index = links.value.findIndex(link => link.id === id);
      if (index !== -1) {
        links.value[index] = updatedLink;
      }
      
      return updatedLink;
    } catch (err: any) {
      error.value = err.response?.data?.message || '更新链接失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 删除链接
  const deleteLink = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/links/${id}`);
      
      // 从本地列表删除
      links.value = links.value.filter(link => link.id !== id);
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || '删除链接失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 重新排序链接
  const reorderLinks = async (categoryId: number, linkIds: number[]) => {
    loading.value = true;
    error.value = null;
    try {
      await api.put(`/links/category/${categoryId}/reorder`, { linkIds });
      
      // 更新本地链接的顺序
      linkIds.forEach((linkId, index) => {
        const link = links.value.find(l => l.id === linkId);
        if (link) {
          link.order = index;
        }
      });
      
      // 按新顺序排序
      links.value.sort((a, b) => {
        if (a.categoryId === b.categoryId) {
          return a.order - b.order;
        }
        return a.categoryId - b.categoryId;
      });
      
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || '重新排序失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // 根据分类ID获取链接
  const getLinksByCategory = (categoryId: number) => {
    return links.value.filter(link => link.categoryId === categoryId);
  };

  // 清空store
  const clearLinks = () => {
    links.value = [];
    error.value = null;
  };

  return {
    links,
    loading,
    error,
    fetchLinks,
    fetchLinksByCategory,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    getLinksByCategory,
    clearLinks
  };
});