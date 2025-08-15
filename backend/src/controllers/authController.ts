import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import sequelize from '../config/database';
import { Op } from 'sequelize';
import crypto from 'crypto';

// 存储临时重置令牌（在生产环境中应该使用 Redis 或数据库）
const resetTokens = new Map<string, { email: string; expires: Date; createdAt: Date }>();

// Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, securityQuestion, securityAnswer } = req.body;

    // 验证必填字段
    if (!username || !email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({
        message: '请填写所有必填字段',
      });
    }

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
      securityQuestion,
    });
    await user.setPassword(password);
    await user.setSecurityAnswer(securityAnswer);

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

// 验证安全问题 - 获取安全问题
export const getSecurityQuestion = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: '请提供邮箱地址',
      });
    }

    // 查找用户
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: '该邮箱未注册',
      });
    }

    return res.status(200).json({
      securityQuestion: user.securityQuestion,
    });
  } catch (error) {
    console.error('Get security question error:', error);
    return res.status(500).json({
      message: '服务器内部错误',
    });
  }
};

// 验证安全问题答案
export const verifySecurityAnswer = async (req: Request, res: Response) => {
  try {
    const { email, securityAnswer } = req.body;

    if (!email || !securityAnswer) {
      return res.status(400).json({
        message: '请提供邮箱和安全问题答案',
      });
    }

    // 查找用户
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: '该邮箱未注册',
      });
    }

    // 验证安全问题答案
    const isAnswerValid = await user.validateSecurityAnswer(securityAnswer);
    if (!isAnswerValid) {
      return res.status(401).json({
        message: '安全问题答案错误',
      });
    }

    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex');
    const createdAt = new Date();
    const expires = new Date(Date.now() + 60 * 1000); // 60秒有效期

    // 存储令牌
    resetTokens.set(resetToken, { email, expires, createdAt });

    // 定时清理过期令牌
    setTimeout(() => {
      resetTokens.delete(resetToken);
    }, 60 * 1000);

    return res.status(200).json({
      message: '验证成功',
      resetToken,
    });
  } catch (error) {
    console.error('Verify security answer error:', error);
    return res.status(500).json({
      message: '服务器内部错误',
    });
  }
};

// 重置密码
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        message: '请提供重置令牌和新密码',
      });
    }

    // 验证新密码长度
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: '新密码长度至少为6个字符',
      });
    }

    // 验证重置令牌
    const tokenData = resetTokens.get(resetToken);
    if (!tokenData) {
      return res.status(401).json({
        message: '无效的重置令牌',
      });
    }

    // 检查令牌是否过期
    if (tokenData.expires < new Date()) {
      resetTokens.delete(resetToken);
      return res.status(401).json({
        message: '重置令牌已过期，请重新验证',
      });
    }

    // 查找用户
    const user = await User.findOne({
      where: { email: tokenData.email },
    });

    if (!user) {
      return res.status(404).json({
        message: '用户不存在',
      });
    }

    // 更新密码
    await user.setPassword(newPassword);
    await user.save();

    // 删除已使用的令牌
    resetTokens.delete(resetToken);

    return res.status(200).json({
      message: '密码重置成功，请使用新密码登录',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      message: '服务器内部错误',
    });
  }
};

// Get current user
// 获取令牌剩余时间
export const getTokenRemainingTime = async (req: Request, res: Response) => {
  try {
    const { resetToken } = req.body;

    if (!resetToken) {
      return res.status(400).json({
        message: '请提供重置令牌',
      });
    }

    // 获取令牌数据
    const tokenData = resetTokens.get(resetToken);
    if (!tokenData) {
      return res.status(404).json({
        message: '令牌不存在或已过期',
        remainingTime: 0,
      });
    }

    // 计算剩余时间（秒）
    const now = new Date();
    const remainingTime = Math.max(0, Math.floor((tokenData.expires.getTime() - now.getTime()) / 1000));

    if (remainingTime === 0) {
      // 令牌已过期，删除它
      resetTokens.delete(resetToken);
      return res.status(410).json({
        message: '令牌已过期',
        remainingTime: 0,
      });
    }

    return res.status(200).json({
      remainingTime,
      expires: tokenData.expires,
    });
  } catch (error) {
    console.error('Get token remaining time error:', error);
    return res.status(500).json({
      message: '服务器内部错误',
    });
  }
};

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