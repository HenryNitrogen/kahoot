/**
 * 虎皮椒支付 - 查询支付状态接口
 */
import { NextRequest, NextResponse } from 'next/server';
import { getHupijiaoPayment } from '../../../../../lib/hupijiaoPayment';
import { formatResponse } from '../../../../../lib/utils/tools';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const out_trade_order = searchParams.get('out_trade_order') || searchParams.get('trade_order_id');
    const open_order_id = searchParams.get('open_order_id');

    // 检查参数
    if (!out_trade_order && !open_order_id) {
      return NextResponse.json(
        formatResponse(false, null, '必须提供 out_trade_order 或 open_order_id 参数'),
        { status: 400 }
      );
    }

    console.log(`[虎皮椒查询] 查询订单 - out_trade_order: ${out_trade_order}, open_order_id: ${open_order_id}`);

    // 调用虎皮椒查询接口
    const hupijiaoPayment = getHupijiaoPayment();
    const queryResult = await hupijiaoPayment.queryOrder({
      out_trade_order: out_trade_order || undefined,
      open_order_id: open_order_id || undefined,
    });

    if (queryResult.success && queryResult.data) {
      console.log(`[虎皮椒查询] 查询成功 - 状态: ${queryResult.data.status}`);
      
      // 将状态映射为更易理解的格式
      const statusMap: { [key: string]: string } = {
        'OD': 'success',   // 已支付
        'WP': 'pending',   // 待支付
        'CD': 'cancelled', // 已取消
        'RD': 'refunding', // 退款中
        'UD': 'refund_failed', // 退款失败
      };
      
      return NextResponse.json(
        formatResponse(true, {
          status: statusMap[queryResult.data.status] || queryResult.data.status,
          raw_status: queryResult.data.status,
          order_info: queryResult.data
        }, '查询成功')
      );
    } else {
      console.log(`[虎皮椒查询] 查询失败 - ${queryResult.error}`);
      
      return NextResponse.json(
        formatResponse(false, null, queryResult.error || '查询失败'),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[虎皮椒查询] 查询订单错误:', error);
    return NextResponse.json(
      formatResponse(false, null, '服务器内部错误'),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { out_trade_order, open_order_id, trade_order_id } = await request.json();
    
    // 兼容旧的参数名
    const orderNo = out_trade_order || trade_order_id;

    // 检查参数
    if (!orderNo && !open_order_id) {
      return NextResponse.json(
        formatResponse(false, null, '必须提供 out_trade_order 或 open_order_id 参数'),
        { status: 400 }
      );
    }

    console.log(`[虎皮椒查询] POST查询订单 - out_trade_order: ${orderNo}, open_order_id: ${open_order_id}`);

    // 调用虎皮椒查询接口
    const hupijiaoPayment = getHupijiaoPayment();
    const queryResult = await hupijiaoPayment.queryOrder({
      out_trade_order: orderNo || undefined,
      open_order_id: open_order_id || undefined,
    });

    if (queryResult.success && queryResult.data) {
      console.log(`[虎皮椒查询] POST查询成功 - 状态: ${queryResult.data.status}`);
      
      // 将状态映射为更易理解的格式
      const statusMap: { [key: string]: string } = {
        'OD': 'success',   // 已支付
        'WP': 'pending',   // 待支付
        'CD': 'cancelled', // 已取消
        'RD': 'refunding', // 退款中
        'UD': 'refund_failed', // 退款失败
      };
      
      return NextResponse.json(
        formatResponse(true, {
          status: statusMap[queryResult.data.status] || queryResult.data.status,
          raw_status: queryResult.data.status,
          order_info: queryResult.data
        }, '查询成功')
      );
    } else {
      console.log(`[虎皮椒查询] POST查询失败 - ${queryResult.error}`);
      
      return NextResponse.json(
        formatResponse(false, null, queryResult.error || '查询失败'),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[虎皮椒查询] POST查询订单错误:', error);
    return NextResponse.json(
      formatResponse(false, null, '服务器内部错误'),
      { status: 500 }
    );
  }
}
