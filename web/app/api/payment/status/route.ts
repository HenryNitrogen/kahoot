/**
 * 支付状态查询 API
 */
import { NextRequest, NextResponse } from 'next/server';
import { formatResponse } from '../../../../lib/utils/tools';
import { PaymentStatusStore } from '../../../../lib/paymentStatusStore';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const order_id = searchParams.get('order_id');

    if (!order_id) {
      return NextResponse.json(
        formatResponse(false, null, '缺少订单号参数'),
        { status: 400 }
      );
    }

    // 检查支付状态
    const status = PaymentStatusStore.get(order_id);
    
    if (status) {
      return NextResponse.json(
        formatResponse(true, status, '查询成功')
      );
    } else {
      return NextResponse.json(
        formatResponse(true, { status: 'pending' }, '支付中')
      );
    }
  } catch (error) {
    console.error('查询支付状态错误:', error);
    return NextResponse.json(
      formatResponse(false, null, '查询失败'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { order_id, status, data } = await request.json();
    
    if (!order_id || !status) {
      return NextResponse.json(
        formatResponse(false, null, '缺少必需参数'),
        { status: 400 }
      );
    }

    // 更新支付状态
    PaymentStatusStore.set(order_id, status, data);
    
    return NextResponse.json(
      formatResponse(true, null, '状态更新成功')
    );
  } catch (error) {
    console.error('更新支付状态错误:', error);
    return NextResponse.json(
      formatResponse(false, null, '更新失败'),
      { status: 500 }
    );
  }
}
