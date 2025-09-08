/**
 * 处理支付成功的接口
 * 用于前端检测到支付成功时调用，确保订阅状态同步
 */
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    // 验证用户身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供授权令牌' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: { userId: string; email: string };

    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch (error) {
      console.warn('JWT verification failed:', error);
      return NextResponse.json(
        { error: '无效的授权令牌' },
        { status: 401 }
      );
    }

    const { orderInfo } = await request.json();
    
    if (!orderInfo || !orderInfo.out_trade_order) {
      return NextResponse.json(
        { error: '缺少订单信息' },
        { status: 400 }
      );
    }

    console.log('前端报告支付成功:', {
      userId: decoded.userId,
      orderInfo
    });

    // 检查是否是升级订单
    const orderId = orderInfo.out_trade_order;
    if (orderId.startsWith('UPGRADE_')) {
      // 从订单标题中提取套餐信息
      const title = orderInfo.title || '';
      let plan = '';
      
      if (title.includes('高级版') || title.includes('15元')) {
        plan = 'monthly';
      } else if (title.includes('专业版') || title.includes('50元')) {
        plan = 'yearly';
      }
      
      if (plan) {
        await processSubscriptionUpgrade(decoded.userId, plan, orderInfo);
      }
    }

    return NextResponse.json({
      success: true,
      message: '支付成功处理完成'
    });

  } catch (error) {
    console.error('处理支付成功错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * 处理订阅升级
 */
async function processSubscriptionUpgrade(userId: string, plan: string, orderInfo: any) {
  try {
    // 确定订阅类型和期限
    const subscriptionPlan = plan === 'monthly' ? 'premium' : 'pro';
    const duration = plan === 'monthly' ? 30 : 365; // 月度30天，年度365天
    
    // 计算到期时间
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);
    
    console.log(`[前端订阅更新] 订阅详情`, {
      userId,
      subscriptionPlan,
      duration: `${duration}天`,
      expiresAt: expiresAt.toISOString(),
      orderId: orderInfo.out_trade_order,
      amount: orderInfo.total_amount,
      transactionId: orderInfo.transaction_id
    });
    
    // TODO: 实际的数据库更新操作
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: {
    //     subscription: {
    //       upsert: {
    //         create: {
    //           plan: subscriptionPlan,
    //           status: 'active',
    //           expiresAt: expiresAt,
    //           paymentId: orderInfo.transaction_id,
    //           amount: parseFloat(orderInfo.total_amount)
    //         },
    //         update: {
    //           plan: subscriptionPlan,
    //           status: 'active',
    //           expiresAt: expiresAt,
    //           paymentId: orderInfo.transaction_id,
    //           amount: parseFloat(orderInfo.total_amount),
    //           updatedAt: new Date()
    //         }
    //       }
    //     }
    //   }
    // });
    
    console.log(`✅ [前端订阅更新] 用户 ${userId} 成功升级到 ${subscriptionPlan} 计划，有效期至 ${expiresAt.toLocaleDateString()}`);
    
  } catch (error) {
    console.error(`❌ [前端订阅更新] 更新用户 ${userId} 订阅失败:`, error);
    throw error;
  }
}
