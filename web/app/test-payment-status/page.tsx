'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestPaymentStatusPage() {
  const [orderId, setOrderId] = useState('');
  const [openOrderId, setOpenOrderId] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [queryMethod, setQueryMethod] = useState<'internal' | 'hupijiao'>('hupijiao');

  // 使用内部状态存储查询
  const checkInternalStatus = async () => {
    if (!orderId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/payment/status?order_id=${orderId}`);
      setStatus({
        method: '内部状态存储',
        result: response.data
      });
      console.log('内部状态查询结果:', response.data);
    } catch (error) {
      console.error('内部查询失败:', error);
      setStatus({ 
        method: '内部状态存储',
        error: '查询失败' 
      });
    } finally {
      setLoading(false);
    }
  };

  // 使用虎皮椒官方查询接口
  const checkHupijiaoStatus = async () => {
    if (!orderId && !openOrderId) {
      alert('请至少输入一个订单号');
      return;
    }
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (orderId) params.append('out_trade_order', orderId);
      if (openOrderId) params.append('open_order_id', openOrderId);
      
      const response = await axios.get(`/api/payment/hupijiao/query?${params.toString()}`);
      setStatus({
        method: '虎皮椒官方查询',
        result: response.data
      });
      console.log('虎皮椒查询结果:', response.data);
    } catch (error) {
      console.error('虎皮椒查询失败:', error);
      setStatus({ 
        method: '虎皮椒官方查询',
        error: '查询失败',
        details: error instanceof Error ? error.message : '未知错误'
      });
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
      if (queryMethod === 'internal') {
        await checkInternalStatus();
      } else {
        await checkHupijiaoStatus();
      }
    } catch (error) {
      console.error('更新失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuery = () => {
    if (queryMethod === 'internal') {
      checkInternalStatus();
    } else {
      checkHupijiaoStatus();
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">支付状态调试工具</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 控制面板 */}
        <div className="space-y-6">
          {/* 查询方式选择 */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">查询方式</h2>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="hupijiao"
                  checked={queryMethod === 'hupijiao'}
                  onChange={(e) => setQueryMethod(e.target.value as 'internal' | 'hupijiao')}
                  className="mr-2"
                />
                <span>虎皮椒官方查询 (推荐)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="internal"
                  checked={queryMethod === 'internal'}
                  onChange={(e) => setQueryMethod(e.target.value as 'internal' | 'hupijiao')}
                  className="mr-2"
                />
                <span>内部状态存储</span>
              </label>
            </div>
          </div>

          {/* 订单号输入 */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">订单信息</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  商户订单号 (out_trade_order):
                </label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="例如: UPGRADE_1757314494799"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  虎皮椒订单号 (open_order_id):
                </label>
                <input
                  type="text"
                  value={openOrderId}
                  onChange={(e) => setOpenOrderId(e.target.value)}
                  placeholder="例如: 20286478156"
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">操作</h2>
            <div className="space-y-2">
              <button
                onClick={handleQuery}
                disabled={loading || (!orderId && !openOrderId)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
              >
                {loading ? '查询中...' : '查询状态'}
              </button>
              
              {queryMethod === 'internal' && (
                <button
                  onClick={updateStatus}
                  disabled={loading || !orderId}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-400"
                >
                  {loading ? '更新中...' : '模拟支付成功'}
                </button>
              )}
            </div>
          </div>

          {/* 说明 */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">使用说明:</h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li><strong>虎皮椒官方查询</strong>: 直接调用虎皮椒API查询订单状态</li>
              <li><strong>内部状态存储</strong>: 查询基于回调通知更新的内部状态</li>
              <li>推荐使用虎皮椒官方查询，更准确可靠</li>
              <li>商户订单号和虎皮椒订单号至少需要一个</li>
            </ul>
          </div>
        </div>
        
        {/* 结果面板 */}
        <div>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3 text-white">查询结果</h2>
            <div className="space-y-2 text-xs font-mono">
              {status ? (
                <div className="space-y-2">
                  <div className="text-cyan-400">
                    查询方式: {status.method}
                  </div>
                  {status.error ? (
                    <div className="text-red-400">
                      <div>错误: {status.error}</div>
                      {status.details && (
                        <div className="mt-1 text-red-300">
                          详情: {status.details}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-green-400">
                      <pre className="whitespace-pre-wrap break-all">
                        {JSON.stringify(status.result, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-500">暂无查询结果...</div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 配置信息 */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">当前配置:</h3>
        <div className="text-sm text-blue-700 grid grid-cols-1 md:grid-cols-2 gap-2">
          <p>生产域名: https://kahoot.henryni.cn</p>
          <p>回调地址: https://kahoot.henryni.cn/api/payment/hupijiao/notify</p>
          <p>虎皮椒查询: https://api.xunhupay.com/payment/query.html</p>
          <p>测试页面: <a href="/test-payment" className="underline">/test-payment</a></p>
        </div>
      </div>
    </div>
  );
}
