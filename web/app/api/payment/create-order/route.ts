import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// TODO: 替换为实际的数据库操作
let users: any[] = [];
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
    } catch (jwtError) {
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

    // 查找用户
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 创建订单
    const order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      plan: plan,
      amount: plan === 'monthly' ? 10 : 30,
      currency: 'CNY',
      status: 'pending',
      createdAt: new Date().toISOString(),
      // TODO: 集成支付服务提供商
      paymentUrl: '' // 初始化为空字符串
    };

    // TODO: 集成支付服务提供商
    // 例如：微信支付、支付宝、Stripe等
    const paymentUrl = await createPaymentSession(order);
    order.paymentUrl = paymentUrl;

    return NextResponse.json({
      success: true,
      order: order,
      paymentUrl: paymentUrl,
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

// TODO: 实现实际的支付集成
async function createPaymentSession(order: any): Promise<string> {
  // 这里应该集成实际的支付服务提供商
  // 例如：
  
  /*
  // 微信支付示例
  const wechatPay = new WeChatPay({
    appId: process.env.WECHAT_APP_ID,
    mchId: process.env.WECHAT_MCH_ID,
    key: process.env.WECHAT_PAY_KEY,
  });
  
  const paymentResult = await wechatPay.createOrder({
    out_trade_no: order.id,
    body: `Kahoot助手 - ${order.plan === 'monthly' ? '月付套餐' : '年付套餐'}`,
    total_fee: order.amount * 100, // 转换为分
    trade_type: 'JSAPI',
    notify_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`
  });
  
  return paymentResult.code_url;
  */
  
  /*
  // Stripe示例
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'cny',
        product_data: {
          name: `Kahoot助手 - ${order.plan === 'monthly' ? '月付套餐' : '年付套餐'}`,
        },
        unit_amount: order.amount * 100, // 转换为分
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
    metadata: {
      orderId: order.id,
      userId: order.userId,
      plan: order.plan
    }
  });
  
  return session.url;
  */

  // 临时返回模拟支付链接
  return `https://example-payment-gateway.com/pay/${order.id}`;
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
    } catch (jwtError) {
      return NextResponse.json(
        { error: '无效的授权令牌' },
        { status: 401 }
      );
    }

    // TODO: 从数据库获取用户订单历史
    const orders: any[] = []; // 这里应该查询数据库

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
