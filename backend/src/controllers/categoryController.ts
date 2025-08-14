import { Request, Response } from 'express';
import { Category } from '../models/Category';
import sequelize from '../config/database';
import { Op } from 'sequelize';

// Get all categories for the authenticated user
export const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const categories = await Category.findAll({
      where: { userId },
      order: [['order', 'ASC'], ['createdAt', 'ASC']],
    });
    
    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      message: '获取分类失败',
    });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, order, isPublic } = req.body;
    
    // Validate input
    if (!name || name.trim() === '') {
      return res.status(400).json({
        message: '分类名称不能为空',
      });
    }
    
    // Check if category name already exists for this user
    const existingCategory = await Category.findOne({
      where: {
        userId,
        name: name.trim(),
      },
    });
    
    if (existingCategory) {
      return res.status(400).json({
        message: '分类名称已存在',
      });
    }
    
    // Get the maximum order value if order is not provided
    let categoryOrder = order;
    if (categoryOrder === undefined || categoryOrder === null) {
      const maxOrderCategory = await Category.findOne({
        where: { userId },
        order: [['order', 'DESC']],
      });
      categoryOrder = maxOrderCategory ? maxOrderCategory.order + 1 : 0;
    }
    
    // Create the category
    const category = await Category.create({
      userId,
      name: name.trim(),
      order: categoryOrder,
      isPublic: isPublic || false,
    });
    
    return res.status(201).json({
      message: '分类创建成功',
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    return res.status(500).json({
      message: '创建分类失败',
    });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const categoryId = parseInt(req.params.id);
    const { name, order, isPublic } = req.body;
    
    // Find the category
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId,
      },
    });
    
    if (!category) {
      return res.status(404).json({
        message: '分类不存在',
      });
    }
    
    // Validate name if provided
    if (name !== undefined) {
      if (!name || name.trim() === '') {
        return res.status(400).json({
          message: '分类名称不能为空',
        });
      }
      
      // Check if new name already exists for this user
      const existingCategory = await Category.findOne({
        where: {
          userId,
          name: name.trim(),
          id: { [Op.ne]: categoryId },
        },
      });
      
      if (existingCategory) {
        return res.status(400).json({
          message: '分类名称已存在',
        });
      }
      
      category.name = name.trim();
    }
    
    // Update order if provided
    if (order !== undefined && order !== null) {
      category.order = order;
    }
    
    // Update isPublic if provided
    if (isPublic !== undefined) {
      category.isPublic = isPublic;
    }
    
    // Save the changes
    await category.save();
    
    return res.status(200).json({
      message: '分类更新成功',
      category,
    });
  } catch (error) {
    console.error('Update category error:', error);
    return res.status(500).json({
      message: '更新分类失败',
    });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const categoryId = parseInt(req.params.id);
    
    // Find the category
    const category = await Category.findOne({
      where: {
        id: categoryId,
        userId,
      },
    });
    
    if (!category) {
      return res.status(404).json({
        message: '分类不存在',
      });
    }
    
    // Delete the category
    await category.destroy();
    
    return res.status(200).json({
      message: '分类删除成功',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    return res.status(500).json({
      message: '删除分类失败',
    });
  }
};

// Reorder categories
export const reorderCategories = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { categories } = req.body;
    
    // Validate input
    if (!Array.isArray(categories)) {
      return res.status(400).json({
        message: '无效的分类顺序数据',
      });
    }
    
    // Use transaction to update all categories
    await sequelize.transaction(async (transaction) => {
      for (const categoryData of categories) {
        const { id, order } = categoryData;
        
        // Update each category's order
        await Category.update(
          { order },
          {
            where: {
              id,
              userId,
            },
            transaction,
          }
        );
      }
    });
    
    // Get updated categories
    const updatedCategories = await Category.findAll({
      where: { userId },
      order: [['order', 'ASC'], ['createdAt', 'ASC']],
    });
    
    return res.status(200).json({
      message: '分类顺序更新成功',
      categories: updatedCategories,
    });
  } catch (error) {
    console.error('Reorder categories error:', error);
    return res.status(500).json({
      message: '更新分类顺序失败',
    });
  }
};

// Get public categories for a specific user (no authentication required)
export const getPublicCategories = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        message: '用户ID不能为空',
      });
    }
    
    const categories = await Category.findAll({
      where: {
        userId: parseInt(userId),
        isPublic: true,
      },
      order: [['order', 'ASC'], ['createdAt', 'ASC']],
    });
    
    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error('Get public categories error:', error);
    return res.status(500).json({
      message: '获取公开分类失败',
    });
  }
};