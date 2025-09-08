/**
 * 虎皮椒支付服务
 */
import { formatResponse, nowDate, generateNonceStr } from './utils/tools';
import axios from 'axios';
import md5 from 'md5';

// 虎皮椒支付配置接口
export interface HupijiaoConfig {
  appid: string;
  appSecret: string;
  gatewayUrl: string;
}

// 支付参数接口
export interface PaymentOptions {
  order_id: string;
  money: number;
  title: string;
  backendUrl: string;
  return_url?: string;
  callback_url?: string;
  attach?: string;
  plugins?: string;
}

// 支付请求参数接口
interface PaymentParams {
  version: string;
  appid: string;
  trade_order_id: string;
  total_fee: number;
  title: string;
  time: number;
  notify_url: string;
  return_url?: string;
  callback_url?: string;
  plugins?: string;
  attach?: string;
  nonce_str: string;
  type: string;
  wap_url: string;
  wap_name: string;
}

// 支付响应接口
export interface PaymentResponse {
  success: boolean;
  data?: {
    openid: string;
    url_qrcode: string;
    url: string;
    errcode: number;
    errmsg: string;
    hash: string;
  };
  error?: string;
}

// 回调通知数据接口
export interface NotifyData {
  trade_order_id: string;
  total_fee: number;
  transaction_id: string;
  open_order_id: string;
  order_title: string;
  status: 'OD' | 'CD' | 'RD' | 'UD'; // OD已支付，CD已退款，RD退款中，UD退款失败
  plugins?: string;
  attach?: string;
  appid: string;
  time: string;
  nonce_str: string;
  hash: string;
}

// 订单查询参数接口
export interface QueryOrderOptions {
  out_trade_order?: string;  // 商户订单号
  open_order_id?: string;    // 虎皮椒内部订单号
}

// 订单查询响应接口
export interface QueryOrderResponse {
  success: boolean;
  data?: {
    status: 'OD' | 'WP' | 'CD' | 'RD' | 'UD'; // OD已支付，WP待支付，CD已取消，RD退款中，UD退款失败
    open_order_id: string;
    trade_order_id?: string;
    total_fee?: number;
    transaction_id?: string;
    order_title?: string;
    [key: string]: any;
  };
  error?: string;
}

/**
 * 生成签名哈希
 */
function getHash(params: Record<string, any>, appSecret: string): string {
  const sortedParams = Object.keys(params)
    .filter(key => params[key] && params[key] !== '' && key !== 'hash') // 过滤掉空值和hash本身
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  const stringSignTemp = sortedParams + appSecret;
  const hash = md5(stringSignTemp);
  return hash;
}

/**
 * 虎皮椒支付类
 */
export class HupijiaoPayment {
  private config: HupijiaoConfig;

  constructor(config: HupijiaoConfig) {
    this.config = config;
  }

  /**
   * 发起支付宝支付
   */
  async createPayment(options: PaymentOptions): Promise<PaymentResponse> {
    try {
      // 支付宝支付不需要 type, wap_url, wap_name 参数
      const params: Omit<PaymentParams, 'type' | 'wap_url' | 'wap_name'> = {
        version: '1.1',
        appid: this.config.appid,
        trade_order_id: options.order_id,
        total_fee: options.money,
        title: options.title,
        time: nowDate(),
        notify_url: `${options.backendUrl}/api/payment/hupijiao/notify`,
        nonce_str: generateNonceStr(),
      };

      // 添加可选参数
      if (options.return_url) {
        (params as any).return_url = options.return_url;
      }
      if (options.callback_url) {
        (params as any).callback_url = options.callback_url;
      }
      if (options.plugins) {
        (params as any).plugins = options.plugins;
      }
      if (options.attach) {
        (params as any).attach = options.attach;
      }

      const hash = getHash(params, this.config.appSecret);

      // 发送 POST 请求
      const requestParams = new URLSearchParams({
        ...params,
        hash,
      } as any);

      const response = await axios.post(this.config.gatewayUrl, requestParams, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('虎皮椒支付宝支付响应:', response.data);

      if (response.data.errcode === 0) {
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error: response.data.errmsg || '支付宝支付请求失败',
        };
      }
    } catch (error) {
      console.error('虎皮椒支付宝支付错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '支付宝支付请求异常',
      };
    }
  }

  /**
   * 验证回调通知签名
   */
  verifyNotify(data: NotifyData): boolean {
    const receivedHash = data.hash;
    const calculatedHash = getHash(data, this.config.appSecret);
    return receivedHash === calculatedHash;
  }

  /**
   * 处理支付回调通知
   */
  handleNotify(data: NotifyData): { success: boolean; message: string } {
    try {
      // 验证签名
      if (!this.verifyNotify(data)) {
        console.log('虎皮椒支付回调验签失败');
        return { success: false, message: '验签失败' };
      }

      if (data.status === 'OD') {
        console.log('虎皮椒支付成功', data);
        return { success: true, message: '支付成功' };
      } else {
        console.log('虎皮椒支付状态异常', data);
        return { success: false, message: `支付状态异常: ${data.status}` };
      }
    } catch (error) {
      console.error('处理虎皮椒支付回调错误:', error);
      return { success: false, message: '处理回调异常' };
    }
  }

  /**
   * 查询订单状态
   */
  async queryOrder(options: QueryOrderOptions): Promise<QueryOrderResponse> {
    try {
      // 检查参数，out_trade_order 和 open_order_id 二选一
      if (!options.out_trade_order && !options.open_order_id) {
        return {
          success: false,
          error: '必须提供 out_trade_order 或 open_order_id 其中一个参数'
        };
      }

      // 构建查询参数
      const params: any = {
        appid: this.config.appid,
        time: nowDate(),
        nonce_str: generateNonceStr(),
      };

      // 添加订单标识参数
      if (options.out_trade_order) {
        params.out_trade_order = options.out_trade_order;
      }
      if (options.open_order_id) {
        params.open_order_id = options.open_order_id;
      }

      // 生成签名
      const hash = getHash(params, this.config.appSecret);
      params.hash = hash;

      // 发送查询请求
      const response = await axios.post(
        process.env.HUPIJIAO_QUERY_URL || 'https://api.xunhupay.com/payment/query.html',
        new URLSearchParams(params),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      console.log('虎皮椒订单查询响应:', response.data);

      if (response.data.errcode === 0) {
        return {
          success: true,
          data: response.data.data,
        };
      } else {
        return {
          success: false,
          error: response.data.errmsg || '查询失败',
        };
      }
    } catch (error) {
      console.error('虎皮椒订单查询错误:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '订单查询请求异常',
      };
    }
  }
}

/**
 * 获取虎皮椒支付实例
 */
export function getHupijiaoPayment(): HupijiaoPayment {
  const config: HupijiaoConfig = {
    appid: process.env.HUPIJIAO_APPID || '',
    appSecret: process.env.HUPIJIAO_APP_SECRET || '',
    gatewayUrl: process.env.HUPIJIAO_GATEWAY_URL || 'https://api.xunhupay.com/payment/do.html',
  };

  if (!config.appid || !config.appSecret) {
    throw new Error('虎皮椒支付配置不完整，请检查环境变量');
  }

  return new HupijiaoPayment(config);
}
