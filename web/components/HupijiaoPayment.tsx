'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface PaymentProps {
  order_id: string;
  money: number;
  title: string;
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: string) => void;
}

interface PaymentResponse {
  success: boolean;
  data?: {
    openid: string;
    url_qrcode: string;
    url: string;
    errcode: number;
    errmsg: string;
    hash: string;
  };
  message?: string;
}

export default function HupijiaoPayment({ 
  order_id, 
  money, 
  title, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentProps) {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentResponse['data'] | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 检测设备类型
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/payment/hupijiao/create', {
        order_id,
        money,
        title,
        return_url: `${window.location.origin}/payment/success`,
      });

      const result: PaymentResponse = response.data;
      
      if (result.success && result.data) {
        setPaymentData(result.data);
        
        // 自动跳转到支付页面
        if (result.data.url) {
          window.location.href = result.data.url;
        }
        
        if (onPaymentSuccess) {
          onPaymentSuccess(result.data);
        }
      } else {
        const errorMsg = result.message || '支付创建失败';
        console.error('支付创建失败:', errorMsg);
        if (onPaymentError) {
          onPaymentError(errorMsg);
        }
      }
    } catch (error) {
      console.error('支付请求错误:', error);
      const errorMsg = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : '支付请求失败';
      if (onPaymentError) {
        onPaymentError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hupijiao-payment">
      <div className="payment-info mb-4">
        <h3 className="text-lg font-semibold mb-2">支付信息</h3>
        <p>订单号：{order_id}</p>
        <p>金额：¥{money}</p>
        <p>商品：{title}</p>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {loading ? '创建支付中...' : '支付宝支付'}
      </button>

      {paymentData && (
        <div className="payment-result mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-semibold mb-2">支付信息</h4>
          <p>订单ID: {paymentData.openid}</p>
          {paymentData.url_qrcode && (
            <div className="mt-2">
              <p>PC端扫码支付:</p>
              <img 
                src={paymentData.url_qrcode} 
                alt="支付二维码" 
                className="mt-1 border"
              />
            </div>
          )}
          {paymentData.url && (
            <div className="mt-2">
              <p>手机端支付链接:</p>
              <a 
                href={paymentData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline break-all"
              >
                {paymentData.url}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
