/**
 * 虎皮椒支付相关类型定义
 */

// 导出所有支付相关的类型
export type {
  HupijiaoConfig,
  PaymentOptions,
  PaymentResponse,
  NotifyData,
} from '../hupijiaoPayment';

// 导出支付类
export { HupijiaoPayment, getHupijiaoPayment } from '../hupijiaoPayment';

// 工具函数类型
export interface ToolsExport {
  formatResponse: (success: boolean, data?: any, message?: string) => any;
  nowDate: () => number;
  generateNonceStr: (length?: number) => string;
  uuid: () => string;
}

// 导出工具函数
export {
  formatResponse,
  nowDate,
  generateNonceStr,
  uuid
} from '../utils/tools';
