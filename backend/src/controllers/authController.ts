import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import sequelize from '../config/database';
import { Op } from 'sequelize';

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: '用户名或邮箱已被注册',
      });
    }

    // Create new user
    const user = User.build({
      username,
      email,
    });
    await user.setPassword(password);

    // Save user to database
    await sequelize.transaction(async (t) => {
      await user.save({ transaction: t });
    });

    // Generate JWT token
    const token = generateToken(user.id);

    // Return success response
    return res.status(201).json({
      message: '用户注册成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // 处理 Sequelize 验证错误
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((err: any) => {
        let friendlyMessage = err.message;
        
        // 为特定字段提供更友好的错误提示
        if (err.path === 'email') {
          if (err.validatorKey === 'isEmail') {
            friendlyMessage = '邮箱格式不正确，请输入有效的邮箱地址（例如：user@example.com）。注意：顶级域名需要至少2个字符（如 .com, .cn）';
          }
        }
        
        return {
          field: err.path,
          message: friendlyMessage,
          type: err.type
        };
      });
      
      // 构建更详细的错误响应
      const errorMessage = validationErrors.length === 1
        ? validationErrors[0].message
        : '输入验证失败，请检查以下字段';
      
      return res.status(400).json({
        success: false,
        message: errorMessage,
        errors: validationErrors
      });
    }
    
    // 处理 Sequelize 唯一性约束错误
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path;
      let message = '用户名或邮箱已被注册';
      
      if (field === 'email') {
        message = '该邮箱已被注册，请使用其他邮箱或直接登录';
      } else if (field === 'username') {
        message = '该用户名已被占用，请选择其他用户名';
      }
      
      return res.status(400).json({
        success: false,
        message: message,
        field: field
      });
    }
    
    return res.status(500).json({
      success: false,
      message: '服务器内部错误，请稍后重试',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({
      where: { email },
    });

    // Check if user exists and password is correct
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({
        message: '邮箱或密码错误',
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Return success response
    return res.status(200).json({
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: '服务器内部错误',
    });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // The user is attached to the request object by the auth middleware
    const user = (req as any).user;
    
    return res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      message: '服务器内部错误',
    });
  }
};