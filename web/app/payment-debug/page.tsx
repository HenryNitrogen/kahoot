'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PaymentDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [testOrderId, setTestOrderId] = useState('test_' + Date.now());
  const [isPolling, setIsPolling] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[PaymentDebug] ${message}`);
  };

  // 模拟支付创建
  const createTestPayment = async () => {
    addLog('开始创建测试支付...');
    try {
      const response = await axios.post('/api/payment/hupijiao/create', {
        order_id: testOrderId,
        money: 0.01,
        title: '测试支付',
        return_url: window.location.origin + '/payment/success',
      });
      
      addLog(`支付创建响应: ${JSON.stringify(response.data)}`);
      
      if (response.data.success) {
        addLog(`支付创建成功，订单号: ${testOrderId}`);
        addLog(`虎皮椒返回的openid: ${response.data.data?.openid}`);
        return response.data.data;
      } else {
        addLog(`支付创建失败: ${response.data.message}`);
      }
    } catch (error) {
      addLog(`支付创建错误: ${error}`);
    }
  };

  // 查询支付状态
  const checkPaymentStatus = async () => {
    addLog(`查询支付状态，订单号: ${testOrderId}`);
    try {
      const response = await axios.get(`/api/payment/status?order_id=${testOrderId}`);
      addLog(`状态查询响应: ${JSON.stringify(response.data)}`);
    } catch (error) {
      addLog(`状态查询错误: ${error}`);
    }
  };

  // 模拟支付成功回调
  const simulatePaymentSuccess = async () => {
    addLog('模拟支付成功...');
    try {
      const response = await axios.post('/api/payment/status', {
        order_id: testOrderId,
        status: 'success',
        data: {
          trade_order_id: testOrderId,
          total_fee: 0.01,
          transaction_id: 'test_' + Date.now(),
          timestamp: new Date().toISOString()
        }
      });
      addLog(`模拟支付成功响应: ${JSON.stringify(response.data)}`);
    } catch (error) {
      addLog(`模拟支付成功错误: ${error}`);
    }
  };

  // 开始轮询
  const startPolling = () => {
    if (isPolling) return;
    
    setIsPolling(true);
    addLog('开始轮询支付状态...');
    
    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/payment/status?order_id=${testOrderId}`);
        addLog(`轮询结果: ${JSON.stringify(response.data)}`);
        
        if (response.data.success && response.data.data && response.data.data.status === 'success') {
          addLog('检测到支付成功，停止轮询');
          setIsPolling(false);
          clearInterval(interval);
          setPollInterval(null);
        }
      } catch (error) {
        addLog(`轮询错误: ${error}`);
      }
    }, 2000);
    
    setPollInterval(interval);
  };

  // 停止轮询
  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      setPollInterval(null);
    }
    setIsPolling(false);
    addLog('停止轮询');
  };

  // 清空日志
  const clearLogs = () => {
    setLogs([]);
  };

  // 生成新的测试订单号
  const generateNewOrderId = () => {
    const newOrderId = 'test_' + Date.now();
    setTestOrderId(newOrderId);
    addLog(`生成新订单号: ${newOrderId}`);
  };

  // 组件卸载时清理轮询
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">支付状态调试工具</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 控制面板 */}
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">控制面板</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">测试订单号:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testOrderId}
                    onChange={(e) => setTestOrderId(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded text-sm"
                  />
                  <button
                    onClick={generateNewOrderId}
                    className="px-3 py-2 bg-gray-500 text-white rounded text-sm"
                  >
                    新建
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={createTestPayment}
                  className="px-4 py-2 bg-blue-500 text-white rounded text-sm"
                >
                  创建支付
                </button>
                
                <button
                  onClick={checkPaymentStatus}
                  className="px-4 py-2 bg-green-500 text-white rounded text-sm"
                >
                  查询状态
                </button>
                
                <button
                  onClick={simulatePaymentSuccess}
                  className="px-4 py-2 bg-orange-500 text-white rounded text-sm"
                >
                  模拟成功
                </button>
                
                <button
                  onClick={isPolling ? stopPolling : startPolling}
                  className={`px-4 py-2 text-white rounded text-sm ${
                    isPolling ? 'bg-red-500' : 'bg-purple-500'
                  }`}
                >
                  {isPolling ? '停止轮询' : '开始轮询'}
                </button>
              </div>
              
              <button
                onClick={clearLogs}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded text-sm"
              >
                清空日志
              </button>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">测试步骤:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. 点击"创建支付"创建测试订单</li>
              <li>2. 点击"开始轮询"模拟前端轮询</li>
              <li>3. 点击"模拟成功"模拟支付回调</li>
              <li>4. 观察轮询是否检测到成功状态</li>
            </ol>
          </div>
        </div>
        
        {/* 日志面板 */}
        <div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-white">调试日志</h2>
            <div className="space-y-1 text-xs font-mono">
              {logs.length === 0 ? (
                <div className="text-gray-500">暂无日志...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="break-all">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">说明:</h3>
        <p className="text-sm text-blue-700">
          这个工具可以帮助你调试支付状态流程。通过模拟支付创建、状态查询、轮询和回调，
          你可以看到数据在各个环节的流转情况，从而找出问题所在。
        </p>
      </div>
    </div>
  );
}
