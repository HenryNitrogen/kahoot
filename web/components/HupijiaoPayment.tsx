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
  const [qrCode, setQrCode] = useState<string>('');
  const [redirectUrl, setRedirectUrl] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'checking' | 'success' | 'failed'>('pending');
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [paymentData, setPaymentData] = useState<PaymentResponse['data'] | null>(null);

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

  // 处理支付成功的业务逻辑
  const handlePaymentSuccessLogic = async (orderInfo: any) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      await axios.post('/api/payment/process-success', {
        orderInfo
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('支付成功处理完成');
    } catch (error) {
      console.error('处理支付成功失败:', error);
      // 不阻断正常的支付成功流程
    }
  };

  // 支付状态轮询 - 使用虎皮椒官方查询接口
  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    
    if (paymentStatus === 'checking' && currentOrderId) {
      pollInterval = setInterval(async () => {
        try {
          // 使用虎皮椒官方查询接口
          const response = await axios.get(`/api/payment/hupijiao/query?out_trade_order=${currentOrderId}`);
          console.log('虎皮椒轮询支付状态响应:', response.data);
          
          if (response.data.success && response.data.data) {
            const status = response.data.data.status;
            const orderInfo = response.data.data.order_info;
            
            if (status === 'success') {
              setPaymentStatus('success');
              clearInterval(pollInterval!);
              
              // 处理支付成功的业务逻辑
              await handlePaymentSuccessLogic(orderInfo);
              
              if (onPaymentSuccess && orderInfo) {
                onPaymentSuccess(orderInfo);
              }
            } else if (status === 'cancelled') {
              setPaymentStatus('failed');
              clearInterval(pollInterval!);
              if (onPaymentError) {
                onPaymentError('支付已取消');
              }
            }
            // 如果是 pending 状态，继续轮询
          }
        } catch (error) {
          console.error('虎皮椒轮询支付状态失败:', error);
        }
      }, 5000); // 每5秒查询一次，符合虎皮椒建议
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [paymentStatus, currentOrderId, onPaymentSuccess]);

  const handlePayment = async () => {
    setLoading(true);
    setPaymentStatus('pending');
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
        setCurrentOrderId(order_id); // 使用我们传入的订单号，而不是虎皮椒返回的openid
        
        // 根据设备类型决定处理方式
        if (isMobile && result.data.url) {
          // 手机端：直接跳转到支付链接
          window.location.href = result.data.url;
        } else if (!isMobile && result.data.url_qrcode) {
          // PC端：显示二维码，开始轮询支付状态
          setPaymentStatus('checking');
          console.log('PC端扫码支付，二维码链接:', result.data.url_qrcode);
        }
      } else {
        const errorMsg = result.message || '支付创建失败';
        console.error('支付创建失败:', errorMsg);
        setPaymentStatus('failed');
        if (onPaymentError) {
          onPaymentError(errorMsg);
        }
      }
    } catch (error) {
      console.error('支付请求错误:', error);
      const errorMsg = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message 
        : '支付请求失败';
      setPaymentStatus('failed');
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
          
          {paymentStatus === 'success' && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <h5 className="font-semibold">支付成功！</h5>
              <p>订单已完成，感谢您的购买。</p>
            </div>
          )}
          
          {paymentStatus === 'checking' && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              <h5 className="font-semibold">等待支付中...</h5>
              <p>正在检测支付状态，请完成支付。</p>
            </div>
          )}
          
          {paymentStatus === 'failed' && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <h5 className="font-semibold">支付失败</h5>
              <p>支付过程中出现错误，请重试。</p>
            </div>
          )}
          
          {!isMobile && paymentData.url_qrcode ? (
            // PC端显示二维码
            <div className="mt-4 text-center">
              <p className="mb-2 text-lg font-medium text-green-600">请使用支付宝扫码支付</p>
              <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                <img 
                  src={paymentData.url_qrcode} 
                  alt="支付宝支付二维码" 
                  className="max-w-xs max-h-64 mx-auto"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">二维码有效期5分钟</p>
              {paymentStatus === 'checking' && (
                <p className="mt-2 text-sm text-blue-600">扫码支付后将自动检测支付状态</p>
              )}
            </div>
          ) : isMobile && paymentData.url ? (
            // 手机端显示跳转信息
            <div className="mt-4 text-center">
              <p className="mb-2 text-lg font-medium text-blue-600">正在跳转到支付宝...</p>
              <p className="text-sm text-gray-500">如果没有自动跳转，请点击下方链接</p>
              <a 
                href={paymentData.url} 
                className="inline-block mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                前往支付宝支付
              </a>
            </div>
          ) : (
            // 兜底显示
            <div className="mt-4">
              {paymentData.url_qrcode && (
                <div className="mb-4">
                  <p className="mb-2">PC端扫码支付:</p>
                  <img 
                    src={paymentData.url_qrcode} 
                    alt="支付二维码" 
                    className="border max-w-xs"
                  />
                </div>
              )}
              {paymentData.url && (
                <div>
                  <p className="mb-2">手机端支付链接:</p>
                  <a 
                    href={paymentData.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline break-all"
                  >
                    点击前往支付
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
