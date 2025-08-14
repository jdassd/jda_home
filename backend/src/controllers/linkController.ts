import { Request, Response } from 'express';
import { Link } from '../models/Link';
import { Category } from '../models/Category';

// Get all links for the authenticated user
export const getUserLinks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    const links = await Link.findAll({
      where: { userId },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['categoryId', 'ASC'], ['order', 'ASC'], ['createdAt', 'ASC']]
    });
    
    res.json(links);
  } catch (error) {
    console.error('Error fetching user links:', error);
    res.status(500).json({ message: 'Failed to fetch links' });
  }
};

// Get links by category
export const getLinksByCategory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { categoryId } = req.params;
    
    // Verify category belongs to user
    const category = await Category.findOne({
      where: { 
        id: categoryId, 
        userId 
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    const links = await Link.findAll({
      where: { 
        userId,
        categoryId 
      },
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });
    
    res.json(links);
  } catch (error) {
    console.error('Error fetching links by category:', error);
    res.status(500).json({ message: 'Failed to fetch links' });
  }
};

// 默认图标数组
const defaultIcons = [
  '🔗', '🌐', '📚', '💼', '🎯', '🚀', '💡', '📝',
  '🔍', '📊', '🎨', '🛠️', '📱', '💻', '🎮', '🎬',
  '🎵', '📷', '✨', '⭐', '🔥', '⚡', '🌟', '🏆'
];

// 随机选择默认图标
const getRandomDefaultIcon = () => {
  return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
};

// Create a new link
export const createLink = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { categoryId, title, url, description, icon, isPublic } = req.body;
    
    // Validate required fields
    if (!categoryId || !title || !url) {
      return res.status(400).json({
        message: 'Category ID, title, and URL are required'
      });
    }
    
    // Verify category belongs to user
    const category = await Category.findOne({
      where: { 
        id: categoryId, 
        userId 
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Get the highest order value for links in this category
    const maxOrderLink = await Link.findOne({
      where: { 
        userId,
        categoryId 
      },
      order: [['order', 'DESC']]
    });
    
    const newOrder = maxOrderLink ? maxOrderLink.order + 1 : 0;
    
    // 如果没有提供图标，使用随机默认图标
    const finalIcon = icon || getRandomDefaultIcon();
    
    // Create the link
    const link = await Link.create({
      userId,
      categoryId,
      title,
      url,
      description,
      icon: finalIcon,
      order: newOrder,
      isPublic: isPublic || false
    });
    
    // Return the created link with category info
    const createdLink = await Link.findByPk(link.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });
    
    res.status(201).json(createdLink);
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ message: 'Failed to create link' });
  }
};

// Update a link
export const updateLink = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    const { title, url, description, icon, categoryId, order, isPublic } = req.body;
    
    // Find the link and verify ownership
    const link = await Link.findOne({
      where: { 
        id, 
        userId 
      }
    });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    // If changing category, verify new category belongs to user
    if (categoryId && categoryId !== link.categoryId) {
      const category = await Category.findOne({
        where: { 
          id: categoryId, 
          userId 
        }
      });
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
    }
    
    // Update the link
    await link.update({
      title: title !== undefined ? title : link.title,
      url: url !== undefined ? url : link.url,
      description: description !== undefined ? description : link.description,
      icon: icon !== undefined ? icon : link.icon,
      categoryId: categoryId !== undefined ? categoryId : link.categoryId,
      order: order !== undefined ? order : link.order,
      isPublic: isPublic !== undefined ? isPublic : link.isPublic
    });
    
    // Return updated link with category info
    const updatedLink = await Link.findByPk(link.id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });
    
    res.json(updatedLink);
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ message: 'Failed to update link' });
  }
};

// Delete a link
export const deleteLink = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { id } = req.params;
    
    // Find the link and verify ownership
    const link = await Link.findOne({
      where: { 
        id, 
        userId 
      }
    });
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    // Delete the link
    await link.destroy();
    
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ message: 'Failed to delete link' });
  }
};

// Reorder links within a category
export const reorderLinks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { categoryId } = req.params;
    const { linkIds } = req.body;
    
    if (!Array.isArray(linkIds)) {
      return res.status(400).json({ message: 'linkIds must be an array' });
    }
    
    // Verify category belongs to user
    const category = await Category.findOne({
      where: { 
        id: categoryId, 
        userId 
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Update order for each link
    const updatePromises = linkIds.map((linkId, index) => {
      return Link.update(
        { order: index },
        {
          where: {
            id: linkId,
            userId,
            categoryId
          }
        }
      );
    });
    
    await Promise.all(updatePromises);
    
    res.json({ message: 'Links reordered successfully' });
  } catch (error) {
    console.error('Error reordering links:', error);
    res.status(500).json({ message: 'Failed to reorder links' });
  }
};

// Get public links for a specific user (no authentication required)
export const getPublicLinks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        message: '用户ID不能为空',
      });
    }
    
    const links = await Link.findAll({
      where: {
        userId: parseInt(userId),
        isPublic: true,
      },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name', 'isPublic']
      }],
      order: [['categoryId', 'ASC'], ['order', 'ASC'], ['createdAt', 'ASC']]
    });
    
    // 只返回属于公开分类的链接
    const publicLinks = links.filter(link => {
      const category = (link as any).category;
      return category && category.isPublic;
    });
    
    res.json(publicLinks);
  } catch (error) {
    console.error('Error fetching public links:', error);
    res.status(500).json({ message: '获取公开链接失败' });
  }
};

// Get public links by category (no authentication required)
export const getPublicLinksByCategory = async (req: Request, res: Response) => {
  try {
    const { userId, categoryId } = req.params;
    
    if (!userId || !categoryId) {
      return res.status(400).json({
        message: '用户ID和分类ID不能为空',
      });
    }
    
    // 验证分类是公开的
    const category = await Category.findOne({
      where: {
        id: parseInt(categoryId),
        userId: parseInt(userId),
        isPublic: true
      }
    });
    
    if (!category) {
      return res.status(404).json({ message: '分类不存在或不是公开的' });
    }
    
    const links = await Link.findAll({
      where: {
        userId: parseInt(userId),
        categoryId: parseInt(categoryId),
        isPublic: true
      },
      order: [['order', 'ASC'], ['createdAt', 'ASC']]
    });
    
    res.json(links);
  } catch (error) {
    console.error('Error fetching public links by category:', error);
    res.status(500).json({ message: '获取公开链接失败' });
  }
};