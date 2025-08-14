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
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: '服务器内部错误',
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