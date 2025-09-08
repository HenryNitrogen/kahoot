/**
 * 虎皮椒支付 - 支付回调通知接口
 */
import { NextRequest, NextResponse } from 'next/server';
import { getHupijiaoPayment, type NotifyData } from '../../../../../lib/hupijiaoPayment';
import { PaymentStatusStore } from '../../../../../lib/paymentStatusStore';

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
      console.log(`[虎皮椒回调] 订单 ${data.trade_order_id} 支付成功，金额：${data.total_fee}元`);
      
      // 直接更新支付状态存储，不通过HTTP请求
      try {
        PaymentStatusStore.set(data.trade_order_id, 'success', {
          trade_order_id: data.trade_order_id,
          total_fee: data.total_fee,
          transaction_id: data.transaction_id,
          timestamp: new Date().toISOString()
        });
        
        console.log(`[虎皮椒回调] 支付状态更新成功 - 订单: ${data.trade_order_id}`);
      } catch (statusError) {
        console.error('[虎皮椒回调] 更新支付状态失败:', statusError);
      }
      
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
    console.log('处理支付成功业务逻辑:', {
      orderId: data.trade_order_id,
      amount: data.total_fee,
      transactionId: data.transaction_id,
      attach: data.attach,
    });
    
    // 解析订单附加信息
    let orderInfo: { plan?: string; userId?: string } = {};
    try {
      if (data.attach) {
        orderInfo = JSON.parse(data.attach);
      }
    } catch (parseError) {
      console.warn('解析订单附加信息失败:', parseError);
    }
    
    // 如果是升级订单，更新用户订阅状态
    if (orderInfo.plan && orderInfo.userId && data.trade_order_id.startsWith('UPGRADE_')) {
      await updateUserSubscription(orderInfo.userId, orderInfo.plan, data);
    }
    
    console.log(`[支付成功] 订单 ${data.trade_order_id} 处理完成`);
    
  } catch (error) {
    console.error('处理支付成功业务逻辑错误:', error);
    // 这里的错误不应该影响回调响应
  }
}

/**
 * 更新用户订阅状态
 */
async function updateUserSubscription(userId: string, plan: string, paymentData: NotifyData) {
  try {
    // TODO: 这里应该连接到实际的数据库
    // 现在先打印日志，实际项目中需要实现数据库操作
    
    console.log(`[订阅更新] 开始更新用户订阅`, {
      userId,
      plan,
      orderId: paymentData.trade_order_id,
      amount: paymentData.total_fee,
      transactionId: paymentData.transaction_id
    });
    
    // 确定订阅类型和期限
    const subscriptionPlan = plan === 'monthly' ? 'premium' : 'pro';
    const duration = plan === 'monthly' ? 30 : 365; // 月度30天，年度365天
    
    // 计算到期时间
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + duration);
    
    console.log(`[订阅更新] 订阅详情`, {
      userId,
      subscriptionPlan,
      duration: `${duration}天`,
      expiresAt: expiresAt.toISOString(),
      amount: paymentData.total_fee
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
    //           paymentId: paymentData.transaction_id,
    //           amount: paymentData.total_fee
    //         },
    //         update: {
    //           plan: subscriptionPlan,
    //           status: 'active',
    //           expiresAt: expiresAt,
    //           paymentId: paymentData.transaction_id,
    //           amount: paymentData.total_fee,
    //           updatedAt: new Date()
    //         }
    //       }
    //     }
    //   }
    // });
    
    console.log(`✅ [订阅更新] 用户 ${userId} 成功升级到 ${subscriptionPlan} 计划，有效期至 ${expiresAt.toLocaleDateString()}`);
    
  } catch (error) {
    console.error(`❌ [订阅更新] 更新用户 ${userId} 订阅失败:`, error);
    throw error;
  }
}
