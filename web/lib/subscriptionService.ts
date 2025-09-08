import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SubscriptionData {
  plan: string;
  status: string;
  expiresAt: Date;
  paymentId?: string;
  amount?: number;
}

/**
 * 更新用户订阅状态
 */
export async function updateUserSubscription(userId: string, subscriptionData: SubscriptionData) {
  try {
    console.log(`[订阅服务] 开始更新用户 ${userId} 的订阅`, subscriptionData);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: {
          upsert: {
            create: {
              plan: subscriptionData.plan,
              status: subscriptionData.status,
              expiresAt: subscriptionData.expiresAt,
            },
            update: {
              plan: subscriptionData.plan,
              status: subscriptionData.status,
              expiresAt: subscriptionData.expiresAt,
              updatedAt: new Date()
            }
          }
        }
      },
      include: {
        subscription: true
      }
    });

    console.log(`✅ [订阅服务] 用户 ${userId} 订阅更新成功`, {
      plan: updatedUser.subscription?.plan,
      status: updatedUser.subscription?.status,
      expiresAt: updatedUser.subscription?.expiresAt
    });

    return updatedUser.subscription;
  } catch (error) {
    console.error(`❌ [订阅服务] 更新用户 ${userId} 订阅失败:`, error);
    throw error;
  }
}

/**
 * 获取用户订阅信息
 */
export async function getUserSubscription(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    });

    return user?.subscription || null;
  } catch (error) {
    console.error(`获取用户 ${userId} 订阅信息失败:`, error);
    throw error;
  }
}

/**
 * 检查用户订阅是否有效
 */
export async function isSubscriptionActive(userId: string): Promise<boolean> {
  try {
    const subscription = await getUserSubscription(userId);
    
    if (!subscription || subscription.status !== 'active') {
      return false;
    }

    // 检查是否过期
    if (subscription.expiresAt && subscription.expiresAt < new Date()) {
      // 如果过期，更新状态
      await prisma.subscription.update({
        where: { userId },
        data: { status: 'expired' }
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error(`检查用户 ${userId} 订阅状态失败:`, error);
    return false;
  }
}

/**
 * 根据套餐类型获取订阅计划名称
 */
export function getPlanName(planType: string): string {
  switch (planType) {
    case 'monthly':
      return 'premium';
    case 'yearly':
      return 'pro';
    default:
      return 'free';
  }
}

/**
 * 根据套餐类型获取有效期天数
 */
export function getPlanDuration(planType: string): number {
  switch (planType) {
    case 'monthly':
      return 30;
    case 'yearly':
      return 365;
    default:
      return 0;
  }
}