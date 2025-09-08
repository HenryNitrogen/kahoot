'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestPaymentStatusPage() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkStatus = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/payment/status?order_id=${orderId}`);
      setStatus(response.data);
      console.log('支付状态查询结果:', response.data);
    } catch (error) {
      console.error('查询失败:', error);
      setStatus({ error: '查询失败' });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      await axios.post('/api/payment/status', {
        order_id: orderId,
        status: 'success',
        data: {
          trade_order_id: orderId,
          total_fee: 0.01,
          transaction_id: 'test_' + Date.now(),
          timestamp: new Date().toISOString()
        }
      });
      console.log('状态更新成功');
      // 更新后立即查询
      await checkStatus();
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">支付状态测试</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">订单号:</label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="输入订单号"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div className="space-x-4">
          <button
            onClick={checkStatus}
            disabled={loading || !orderId}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          >
            {loading ? '查询中...' : '查询状态'}
          </button>
          
          <button
            onClick={updateStatus}
            disabled={loading || !orderId}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
          >
            {loading ? '更新中...' : '模拟支付成功'}
          </button>
        </div>
        
        {status && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-bold mb-2">查询结果:</h3>
            <pre className="text-sm">{JSON.stringify(status, null, 2)}</pre>
          </div>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold text-blue-800 mb-2">配置信息:</h4>
          <div className="text-sm text-blue-700">
            <p>生产域名: https://kahoot.henryni.cn</p>
            <p>回调地址: https://kahoot.henryni.cn/api/payment/hupijiao/notify</p>
            <p>测试页面: <a href="/test-callback" className="underline">/test-callback</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
