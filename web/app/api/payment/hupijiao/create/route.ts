/**
 * 虎皮椒支付 - 创建支付订单
 */
import { NextRequest, NextResponse } from 'next/server';
import { getHupijiaoPayment } from '../../../../../lib/hupijiaoPayment';
import { formatResponse } from '../../../../../lib/utils/tools';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order_id, money, title, return_url, attach } = body;

    // 验证必需参数
    if (!order_id || !money || !title) {
      return NextResponse.json(
        formatResponse(false, null, '缺少必需参数: order_id, money, title'),
        { status: 400 }
      );
    }

    // 获取后端域名
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host');
    const backendUrl = `${protocol}://${host}`;

    // 创建支付订单
    const hupijiaoPayment = getHupijiaoPayment();
    const paymentResult = await hupijiaoPayment.createPayment({
      order_id,
      money: Number(money),
      title,
      backendUrl,
      return_url,
      attach,
      plugins: 'kahoot-ai-helper',
    });

    if (paymentResult.success) {
      return NextResponse.json(
        formatResponse(true, paymentResult.data, '支付订单创建成功')
      );
    } else {
      return NextResponse.json(
        formatResponse(false, null, paymentResult.error),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('创建虎皮椒支付订单错误:', error);
    return NextResponse.json(
      formatResponse(false, null, '服务器内部错误'),
      { status: 500 }
    );
  }
}
