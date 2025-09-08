'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HupijiaoPayment from '../../components/HupijiaoPayment';

export default function PaymentTestPage() {
  const [testOrderId] = useState('TEST_' + Date.now());
  const [paymentAmount] = useState(0.01); // 1分钱测试
  const [paymentTitle] = useState('虎皮椒支付测试');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const router = useRouter();

  const handlePaymentSuccess = (data: any) => {
    console.log('支付成功回调:', data);
    setPaymentSuccess(true);
    setPaymentError('');
    
    // 3秒后跳转到控制台
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    console.error('支付失败:', error);
    setPaymentError(error);
    setPaymentSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            支付功能测试
          </h1>
          
          {/* 配置信息 */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">✨ 新版特性</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>✅ 使用虎皮椒官方查询接口</p>
              <p>✅ 实时状态检测，无需等待回调</p>
              <p>✅ 支持手机扫码支付自动检测</p>
              <p>✅ 测试金额: ¥0.01</p>
            </div>
          </div>

          {/* 支付状态 */}
          {paymentSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">🎉 支付成功！</h3>
              <p className="text-sm text-green-700">
                支付已完成，3秒后跳转到控制台...
              </p>
            </div>
          )}

          {paymentError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-800 mb-2">❌ 支付失败</h3>
              <p className="text-sm text-red-700">{paymentError}</p>
            </div>
          )}

          {/* 支付组件 */}
          <HupijiaoPayment
            order_id={testOrderId}
            money={paymentAmount}
            title={paymentTitle}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />

          {/* 说明 */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">📝 测试说明</h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>使用虎皮椒官方查询接口，支付状态更准确</li>
              <li>PC端扫码后会自动检测支付状态</li>
              <li>手机端跳转支付宝后返回会自动检测</li>
              <li>每5秒查询一次，最多查询10分钟</li>
              <li>测试金额仅0.01元，放心测试</li>
            </ul>
          </div>

          {/* 调试信息 */}
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">🔧 调试信息</h3>
            <div className="text-xs text-gray-600 space-y-1 font-mono">
              <p>订单号: {testOrderId}</p>
              <p>查询接口: /api/payment/hupijiao/query</p>
              <p>轮询间隔: 5秒</p>
            </div>
          </div>

          {/* 其他工具 */}
          <div className="mt-6 space-y-2">
            <button
              onClick={() => router.push('/test-payment-status')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              打开状态调试工具
            </button>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              返回控制台
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
