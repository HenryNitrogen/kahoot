import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export class UserService {
  // 创建新用户
  static async createUser(data: CreateUserData) {
    const { name, email, password } = data;

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('该邮箱已被注册');
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        subscription: {
          create: {
            plan: 'free',
            status: 'trial'
          }
        },
        usageRecords: {
          create: {
            requestsToday: 0,
            requestsThisMonth: 0,
            totalRequests: 0
          }
        }
      },
      include: {
        subscription: true,
        usageRecords: true
      }
    });

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 用户登录
  static async loginUser(credentials: LoginCredentials) {
    const { email, password } = credentials;

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subscription: true,
        usageRecords: true
      }
    });

    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('邮箱或密码错误');
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 根据ID获取用户信息
  static async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        usageRecords: true
      }
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 更新用户信息
  static async updateUser(userId: string, data: Partial<{ name: string; email: string }>) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      include: {
        subscription: true,
        usageRecords: true
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // 记录AI请求使用情况
  static async recordAIRequest(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // 更新使用记录
    await prisma.usageRecord.updateMany({
      where: { userId },
      data: {
        requestsToday: { increment: 1 },
        requestsThisMonth: { increment: 1 },
        totalRequests: { increment: 1 },
        lastRequestDate: new Date()
      }
    });
  }

  // 获取用户使用统计
  static async getUserUsageStats(userId: string) {
    const usageRecord = await prisma.usageRecord.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return usageRecord || {
      requestsToday: 0,
      requestsThisMonth: 0,
      totalRequests: 0
    };
  }
}
