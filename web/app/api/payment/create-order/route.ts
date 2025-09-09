import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getHupijiaoPayment } from '../../../../lib/hupijiaoPayment';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

interface Order {
  id: string;
  userId: string;
  plan: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  paymentUrl: string;
}

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

    const { plan } = await request.json();

    // 验证套餐类型
    if (!['monthly', 'yearly'].includes(plan)) {
      return NextResponse.json(
        { error: '无效的套餐类型' },
        { status: 400 }
      );
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 创建订单（使用UPGRADE_前缀保持与前端一致）
    const orderId = `UPGRADE_${Date.now()}`;
    const amount = plan === 'monthly' ? 15 : 50; // 高级版15元，专业版50元
    
    // 先记录交易到数据库
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: decoded.userId,
        orderId: orderId,
        planType: plan,
        amount: amount,
        currency: 'CNY',
        status: 'pending',
        paymentMethod: 'alipay',
        paymentProvider: 'hupijiao'
      }
    });

    const order: Order = {
      id: orderId,
      userId: decoded.userId,
      plan: plan,
      amount: amount,
      currency: 'CNY',
      status: 'pending',
      createdAt: new Date().toISOString(),
      paymentUrl: '' // 初始化为空字符串
    };

    // 使用虎皮椒支付创建支付会话
    try {
      const paymentUrl = await createPaymentSession(order);
      order.paymentUrl = paymentUrl;
      
      // 更新交易记录，添加支付URL信息
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          providerData: { paymentUrl }
        }
      });
    } catch (paymentError) {
      console.error('支付创建失败:', paymentError);
      // 如果支付创建失败，将交易状态设为失败
      await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: { status: 'failed' }
      });
      return NextResponse.json(
        { error: '支付系统暂时不可用，请稍后重试' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      order: order,
      paymentUrl: order.paymentUrl,
      message: '订单创建成功'
    });

  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// 使用虎皮椒支付创建支付链接
async function createPaymentSession(order: Order): Promise<string> {
  try {
    // 获取后端域名
    const backendUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    // 使用虎皮椒支付创建订单
    const hupijiaoPayment = getHupijiaoPayment();
    const paymentResult = await hupijiaoPayment.createPayment({
      order_id: order.id,
      money: order.amount,
      title: `Kahoot助手 - ${order.plan === 'monthly' ? '高级版(15元)' : '专业版(50元)'}`,
      backendUrl: backendUrl,
      return_url: `${backendUrl}/payment/success`,
      plugins: 'kahoot-ai-helper',
      attach: JSON.stringify({ plan: order.plan, userId: order.userId })
    });

    if (paymentResult.success && paymentResult.data) {
      // 返回支付链接，优先使用手机端链接
      return paymentResult.data.url || paymentResult.data.url_qrcode;
    } else {
      console.error('虎皮椒支付创建失败:', paymentResult.error);
      throw new Error(paymentResult.error || '支付创建失败');
    }
  } catch (error) {
    console.error('创建支付会话错误:', error);
    // 如果虎皮椒支付失败，返回错误而不是模拟链接
    throw error;
  }
}

// GET方法用于获取用户的订单历史
export async function GET(request: NextRequest) {
  try {
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

    // TODO: 从数据库获取用户订单历史
    const orders: unknown[] = []; // 这里应该查询数据库

    return NextResponse.json({
      orders: orders
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
