'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CallbackTestPage() {
  const [orderId, setOrderId] = useState('test_callback_' + Date.now());
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 模拟虎皮椒回调通知
  const simulateCallback = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      // 构造虎皮椒回调数据
      const callbackData = new FormData();
      callbackData.append('trade_order_id', orderId);
      callbackData.append('total_fee', '15.00');
      callbackData.append('transaction_id', 'txn_' + Date.now());
      callbackData.append('open_order_id', 'open_' + Date.now());
      callbackData.append('order_title', '会员升级');
      callbackData.append('status', 'OD'); // OD = 已支付
      callbackData.append('plugins', 'kahoot-ai-helper');
      callbackData.append('attach', 'test_attach');
      callbackData.append('appid', '201906173992');
      callbackData.append('time', Math.floor(Date.now() / 1000).toString());
      callbackData.append('nonce_str', Math.random().toString(36).substring(2, 15));
      callbackData.append('hash', 'test_hash_' + Date.now());

      console.log('模拟回调数据:', Object.fromEntries(callbackData.entries()));

      // 发送回调通知
      const response = await fetch('/api/payment/hupijiao/notify', {
        method: 'POST',
        body: callbackData
      });

      const responseText = await response.text();
      console.log('回调响应:', responseText);

      setResult({
        success: response.ok,
        status: response.status,
        response: responseText,
        timestamp: new Date().toISOString()
      });

      // 延迟1秒后查询支付状态
      setTimeout(async () => {
        try {
          const statusResponse = await axios.get(`/api/payment/status?order_id=${orderId}`);
          console.log('回调后状态查询:', statusResponse.data);
          setResult((prev: any) => ({
            ...prev,
            statusAfterCallback: statusResponse.data
          }));
        } catch (error) {
          console.error('状态查询失败:', error);
        }
      }, 1000);

    } catch (error) {
      console.error('模拟回调失败:', error);
      setResult({
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // 查询支付状态
  const checkStatus = async () => {
    if (!orderId) return;
    
    try {
      const response = await axios.get(`/api/payment/status?order_id=${orderId}`);
      console.log('状态查询结果:', response.data);
      setResult((prev: any) => ({
        ...prev,
        currentStatus: response.data,
        lastChecked: new Date().toISOString()
      }));
    } catch (error) {
      console.error('查询失败:', error);
    }
  };

  // 生成新订单号
  const generateOrderId = () => {
    const newOrderId = 'test_callback_' + Date.now();
    setOrderId(newOrderId);
    setResult(null);
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">虎皮椒回调测试</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 控制面板 */}
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">回调测试</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">测试订单号:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={generateOrderId}
                    className="px-3 py-2 bg-gray-500 text-white rounded text-sm"
                  >
                    新建
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={simulateCallback}
                  disabled={loading || !orderId}
                  className="px-4 py-2 bg-orange-500 text-white rounded text-sm disabled:bg-gray-400"
                >
                  {loading ? '回调中...' : '模拟回调'}
                </button>
                
                <button
                  onClick={checkStatus}
                  disabled={!orderId}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
                >
                  查询状态
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">测试步骤:</h3>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. 点击"模拟回调"发送虚假的支付成功通知</li>
              <li>2. 观察回调是否被正确处理</li>
              <li>3. 检查支付状态是否更新为成功</li>
              <li>4. 验证前端轮询能否检测到状态变化</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">当前配置:</h3>
            <div className="text-sm text-green-700 space-y-1">
              <div>回调地址: https://kahoot.henryni.cn/api/payment/hupijiao/notify</div>
              <div>环境: {process.env.NODE_ENV}</div>
            </div>
          </div>
        </div>
        
        {/* 结果面板 */}
        <div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-white">测试结果</h2>
            <div className="text-xs font-mono">
              {result ? (
                <pre className="whitespace-pre-wrap break-all">
                  {JSON.stringify(result, null, 2)}
                </pre>
              ) : (
                <div className="text-gray-500">点击"模拟回调"开始测试...</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">说明:</h3>
        <p className="text-sm text-yellow-700">
          这个工具模拟虎皮椒服务器发送支付成功回调通知，帮助你测试回调处理逻辑是否正常工作。
          在真实环境中，当用户完成支付后，虎皮椒会自动发送类似的回调通知到你配置的 notify_url。
        </p>
      </div>
    </div>
  );
}
