'use client';

import { useState, useEffect } from 'react';
import HupijiaoPayment from '../../../components/HupijiaoPayment';

export default function PaymentTestPage() {
  const [orderData, setOrderData] = useState({
    order_id: `TEST_${Date.now()}`,
    money: 0.01,
    title: '测试支付',
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile);
    };
    
    checkMobile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: name === 'money' ? Number(value) : value,
    }));
  };

  const generateNewOrderId = () => {
    setOrderData(prev => ({
      ...prev,
      order_id: `TEST_${Date.now()}`,
    }));
  };

  const handlePaymentSuccess = (data: any) => {
    console.log('支付成功:', data);
    alert('支付创建成功！请查看浏览器控制台了解详情。');
  };

  const handlePaymentError = (error: string) => {
    console.error('支付失败:', error);
    alert(`支付失败: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            虎皮椒支付宝支付测试
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            测试虎皮椒支付宝支付接口集成
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">支付参数设置</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                订单号
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="order_id"
                  value={orderData.order_id}
                  onChange={handleInputChange}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="订单号"
                />
                <button
                  onClick={generateNewOrderId}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm"
                >
                  重新生成
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                支付金额（元）
              </label>
              <input
                type="number"
                name="money"
                value={orderData.money}
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="支付金额"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                商品标题
              </label>
              <input
                type="text"
                name="title"
                value={orderData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="商品标题"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <HupijiaoPayment
            order_id={orderData.order_id}
            money={orderData.money}
            title={orderData.title}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">注意事项</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• 请确保已在 .env.local 中配置了正确的虎皮椒支付参数</li>
            <li>• 测试时建议使用小金额（如 0.01 元）</li>
            <li>• 当前设备类型：{isMobile ? '手机端（会自动跳转到支付页面）' : 'PC端（会显示二维码供扫描）'}</li>
            <li>• 支付成功后会跳转到支付成功页面</li>
            <li>• 回调通知会发送到 /api/payment/hupijiao/notify 接口</li>
          </ul>
        </div>

        <div className="mt-6 text-center">
          <a
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-500 text-sm"
          >
            ← 返回控制台
          </a>
        </div>
      </div>
    </div>
  );
}
