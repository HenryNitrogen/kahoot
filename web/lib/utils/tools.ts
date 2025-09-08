/**
 * 工具函数集合
 */

/**
 * 格式化响应数据
 */
export function formatResponse(success: boolean, data?: any, message?: string) {
  return {
    success,
    data,
    message,
    timestamp: Date.now()
  };
}

/**
 * 获取当前时间戳（秒）
 */
export function nowDate(): number {
  return Math.floor(new Date().valueOf() / 1000);
}

/**
 * 生成UUID
 */
export function uuid(): string {
  return Date.now().toString(16).slice(0, 6) + '-' + Math.random().toString(16).slice(2, 8);
}

/**
 * 生成随机字符串
 */
export function generateNonceStr(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
