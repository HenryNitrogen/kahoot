/**
 * 支付状态存储
 * 提供统一的支付状态管理
 */

// 简单的内存存储，生产环境应该使用数据库
const paymentStatus = new Map<string, { status: string; data?: any }>();

export class PaymentStatusStore {
  static get(orderId: string) {
    const status = paymentStatus.get(orderId);
    console.log(`[PaymentStatusStore] 获取状态 - 订单: ${orderId}, 状态:`, status);
    console.log(`[PaymentStatusStore] 当前所有状态:`, Array.from(paymentStatus.entries()));
    return status;
  }

  static set(orderId: string, status: string, data?: any) {
    const statusData = { status, data };
    paymentStatus.set(orderId, statusData);
    console.log(`[PaymentStatusStore] 设置状态 - 订单: ${orderId}, 状态: ${status}`, data);
    console.log(`[PaymentStatusStore] 更新后所有状态:`, Array.from(paymentStatus.entries()));
    return statusData;
  }

  static has(orderId: string) {
    return paymentStatus.has(orderId);
  }

  static delete(orderId: string) {
    const result = paymentStatus.delete(orderId);
    console.log(`[PaymentStatusStore] 删除状态 - 订单: ${orderId}, 结果: ${result}`);
    return result;
  }

  static clear() {
    paymentStatus.clear();
    console.log(`[PaymentStatusStore] 清空所有状态`);
  }

  static size() {
    return paymentStatus.size;
  }

  static entries() {
    return Array.from(paymentStatus.entries());
  }
}
