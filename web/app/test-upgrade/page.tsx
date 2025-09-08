'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HupijiaoPayment from '../../components/HupijiaoPayment';

export default function TestUpgradePage() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const router = useRouter();

  const planData = {
    monthly: {
      name: '高级版',
      price: 15,
      description: '月度付费，适合短期使用',
      features: ['无限制AI问答', '高级题目解析', '优先客服支持']
    },
    yearly: {
      name: '专业版', 
      price: 50,
      description: '年度付费，最优性价比',
      features: ['所有高级版功能', '专业级AI模型', '批量题目处理', '24/7专属客服']
    }
  };

  const currentPlan = planData[selectedPlan];

  const handlePaymentSuccess = (data: any) => {
    console.log('升级支付成功:', data);
    alert(`🎉 升级成功！您已成功升级到 ${currentPlan.name}！`);
    
    // 跳转到控制台并显示升级成功提示
    setTimeout(() => {
      router.push('/dashboard?upgraded=true');
    }, 1500);
  };

  const handlePaymentError = (error: string) => {
    console.error('升级支付失败:', error);
    alert(`❌ 升级失败: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回控制台</span>
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">
            测试升级功能
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            完整测试虎皮椒支付升级流程
          </p>
        </div>

        {/* 套餐选择 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">选择套餐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(planData) as Array<'monthly' | 'yearly'>).map((planKey) => {
              const plan = planData[planKey];
              return (
                <div
                  key={planKey}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPlan === planKey
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedPlan(planKey)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <span className="text-2xl font-bold text-indigo-600">¥{plan.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 支付组件 */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">确认升级</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">{currentPlan.name}</h4>
                  <p className="text-blue-700 text-sm">{currentPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">¥{currentPlan.price}</div>
                  <div className="text-sm text-blue-600">一次性付费</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">✨ 新版特性</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>✅ 使用虎皮椒官方查询接口</li>
                <li>✅ 实时支付状态检测</li>
                <li>✅ 支付成功自动更新订阅</li>
                <li>✅ 手机扫码支付无缝体验</li>
              </ul>
            </div>
          </div>

          <HupijiaoPayment
            order_id={`UPGRADE_${Date.now()}`}
            money={currentPlan.price}
            title={`Kahoot助手升级 - ${currentPlan.name}`}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        </div>

        {/* 调试信息 */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-2">🔧 调试信息</h4>
          <div className="text-xs text-gray-600 space-y-1 font-mono">
            <p>套餐: {selectedPlan} → {currentPlan.name}</p>
            <p>金额: ¥{currentPlan.price}</p>
            <p>订阅类型: {selectedPlan === 'monthly' ? 'premium' : 'pro'}</p>
            <p>有效期: {selectedPlan === 'monthly' ? '30天' : '365天'}</p>
            <p>查询接口: /api/payment/hupijiao/query</p>
            <p>处理接口: /api/payment/process-success</p>
          </div>
        </div>
      </div>
    </div>
  );
}
