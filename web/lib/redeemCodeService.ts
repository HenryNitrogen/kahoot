import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface CreateRedeemCodeData {
  planType: 'premium' | 'pro';
  duration: number; // 天数
  quantity: number;
  expiresAt?: Date;
}

export class RedeemCodeService {
  // 生成兑换码
  static generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // 批量创建兑换码
  static async createRedeemCodes(data: CreateRedeemCodeData) {
    const codes = [];
    
    for (let i = 0; i < data.quantity; i++) {
      const code = this.generateCode();
      codes.push({
        code,
        planType: data.planType,
        duration: data.duration,
        expiresAt: data.expiresAt
      });
    }

    const createdCodes = await prisma.redeemCode.createMany({
      data: codes
    });

    // 获取创建的兑换码详情
    const redeemCodes = await prisma.redeemCode.findMany({
      where: {
        code: {
          in: codes.map(c => c.code)
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return redeemCodes;
  }

  // 使用兑换码
  static async redeemCode(userId: string, code: string) {
    // 查找兑换码
    const redeemCode = await prisma.redeemCode.findUnique({
      where: { code: code.toUpperCase().replace(/\s/g, '') }
    });

    if (!redeemCode) {
      throw new Error('兑换码不存在');
    }

    if (redeemCode.isUsed) {
      throw new Error('兑换码已被使用');
    }

    if (redeemCode.expiresAt && new Date() > redeemCode.expiresAt) {
      throw new Error('兑换码已过期');
    }

    // 计算结束时间
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + redeemCode.duration);

    // 开始事务
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 标记兑换码为已使用
      await tx.redeemCode.update({
        where: { id: redeemCode.id },
        data: { isUsed: true }
      });

      // 创建兑换记录
      const redemption = await tx.redemption.create({
        data: {
          userId,
          codeId: redeemCode.id,
          planType: redeemCode.planType,
          startDate,
          endDate
        }
      });

      // 更新或创建用户订阅
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: { subscription: true }
      });

      if (user?.subscription) {
        // 更新现有订阅
        await tx.subscription.update({
          where: { userId },
          data: {
            plan: redeemCode.planType,
            status: 'active',
            expiresAt: endDate
          }
        });
      } else {
        // 创建新订阅
        await tx.subscription.create({
          data: {
            userId,
            plan: redeemCode.planType,
            status: 'active',
            expiresAt: endDate
          }
        });
      }

      return redemption;
    });

    return result;
  }

  // 获取兑换码列表
  static async getRedeemCodes(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const [codes, total] = await Promise.all([
      prisma.redeemCode.findMany({
        skip: offset,
        take: limit,
        include: {
          redemption: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.redeemCode.count()
    ]);

    return {
      codes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  // 获取兑换统计
  static async getRedemptionStats() {
    const [totalCodes, usedCodes, activeCodes, expiredCodes, totalRedemptions] = await Promise.all([
      prisma.redeemCode.count(),
      prisma.redeemCode.count({ where: { isUsed: true } }),
      prisma.redeemCode.count({ 
        where: { 
          isUsed: false,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        } 
      }),
      prisma.redeemCode.count({ 
        where: { 
          isUsed: false,
          expiresAt: { lte: new Date() }
        } 
      }),
      prisma.redemption.count()
    ]);

    return {
      totalCodes,
      usedCodes,
      activeCodes,
      expiredCodes,
      totalRedemptions
    };
  }

  // 获取用户的兑换记录
  static async getUserRedemptions(userId: string) {
    return await prisma.redemption.findMany({
      where: { userId },
      include: {
        redeemCode: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
