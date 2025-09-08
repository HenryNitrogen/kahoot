/**
 * 虎皮椒支付 - 支付回调通知接口
 */
import { NextRequest, NextResponse } from 'next/server';
import { getHupijiaoPayment, type NotifyData } from '../../../../../lib/hupijiaoPayment';

export async function POST(request: NextRequest) {
  try {
    // 获取表单数据
    const formData = await request.formData();
    
    // 将表单数据转换为对象
    const data: NotifyData = {
      trade_order_id: formData.get('trade_order_id') as string,
      total_fee: Number(formData.get('total_fee')),
      transaction_id: formData.get('transaction_id') as string,
      open_order_id: formData.get('open_order_id') as string,
      order_title: formData.get('order_title') as string,
      status: formData.get('status') as 'OD' | 'CD' | 'RD' | 'UD',
      plugins: formData.get('plugins') as string || undefined,
      attach: formData.get('attach') as string || undefined,
      appid: formData.get('appid') as string,
      time: formData.get('time') as string,
      nonce_str: formData.get('nonce_str') as string,
      hash: formData.get('hash') as string,
    };

    console.log('收到虎皮椒支付回调通知:', data);

    // 处理支付回调
    const hupijiaoPayment = getHupijiaoPayment();
    const result = hupijiaoPayment.handleNotify(data);

    if (result.success && data.status === 'OD') {
      // 这里可以添加业务逻辑处理
      // 例如：更新订单状态、增加用户余额等
      console.log(`订单 ${data.trade_order_id} 支付成功，金额：${data.total_fee}元`);
      
      // TODO: 根据实际业务需求处理支付成功逻辑
      // 例如：
      // - 更新数据库中的订单状态
      // - 给用户增加积分或会员时长
      // - 发送支付成功通知等
      
      // 示例：处理订单
      await handlePaymentSuccess(data);
    }

    // 虎皮椒要求返回 "success" 表示回调已收到
    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('处理虎皮椒支付回调错误:', error);
    // 即使出错也要返回success，避免虎皮椒重复回调
    return new NextResponse('success', { status: 200 });
  }
}

/**
 * 处理支付成功的业务逻辑
 */
async function handlePaymentSuccess(data: NotifyData) {
  try {
    // TODO: 根据实际业务需求实现
    // 这里可以添加具体的业务处理逻辑
    
    console.log('处理支付成功业务逻辑:', {
      orderId: data.trade_order_id,
      amount: data.total_fee,
      transactionId: data.transaction_id,
      attach: data.attach,
    });
    
    // 示例业务逻辑：
    // 1. 更新订单状态
    // 2. 增加用户积分/会员时长
    // 3. 记录支付日志
    // 4. 发送通知等
    
  } catch (error) {
    console.error('处理支付成功业务逻辑错误:', error);
    // 这里的错误不应该影响回调响应
  }
}
