'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import HupijiaoPayment from '../../components/HupijiaoPayment';
import { CreditCard, Shield, Star, Check, ArrowLeft } from 'lucide-react';

interface PlanOption {
  id: 'monthly' | 'yearly';
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: PlanOption[] = [
  {
    id: 'monthly',
    name: '高级版',
    price: 15,
    description: '适合个人用户',
    features: [
      '无限制AI问答',
      '高级题目解析',
      '优先客服支持',
      '月度更新'
    ]
  },
  {
    id: 'yearly',
    name: '专业版',
    price: 50,
    description: '最优性价比选择',
    features: [
      '所有高级版功能',
      '专业级AI模型',
      '批量题目处理',
      '24/7专属客服',
      '年度大版本更新',
      '数据分析报告'
    ],
    popular: true
  }
];

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    // 从URL参数获取预选的套餐
    const planParam = searchParams.get('plan');
    if (planParam === 'monthly' || planParam === 'yearly') {
      setSelectedPlan(planParam);
    }

    // 检测设备类型
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile);
    };
    
    checkMobile();
  }, [searchParams]);

  // 防止用户在支付处理过程中离开页面
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isProcessingPayment) {
        e.preventDefault();
        e.returnValue = '您的支付正在处理中，离开页面可能导致订阅升级失败。确定要离开吗？';
        return e.returnValue;
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (isProcessingPayment) {
        const confirmed = window.confirm('您的支付正在处理中，离开页面可能导致订阅升级失败。确定要离开吗？');
        if (!confirmed) {
          // 阻止导航
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    if (isProcessingPayment) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);
      // 添加一个历史记录条目，以便检测后退操作
      window.history.pushState(null, '', window.location.href);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isProcessingPayment]);

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)!;

  const handleContinuePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: selectedPlan })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.paymentUrl) {
          // 在当前页面显示支付组件
          setShowPayment(true);
          // 注意：不在这里设置 isProcessingPayment，而是等待支付组件的状态回调
        } else {
          alert('支付系统暂时不可用，请稍后重试');
        }
      } else {
        const error = await response.json();
        alert(`支付失败: ${error.error || '未知错误'}`);
      }
    } catch (error) {
      console.error('支付错误:', error);
      alert('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (data: any) => {
    console.log('支付成功:', data);
    setIsProcessingPayment(false); // 取消处理状态
    
    // 显示支付成功消息（订阅处理已在支付组件中完成）
    alert(`🎉 支付成功！您已成功升级到 ${selectedPlanData.name}，正在跳转到控制台...`);
    
    // 立即跳转到控制台，支付组件已处理完订阅更新
    router.push('/dashboard?upgraded=true');
  };

  const handlePaymentError = (error: string) => {
    console.error('支付失败:', error);
    setIsProcessingPayment(false); // 取消处理状态
    alert(`支付失败: ${error}`);
    setShowPayment(false);
  };

  // 处理支付状态变化
  const handlePaymentStatusChange = (status: string) => {
    // 当支付状态变为 processing 或 success 时，设置处理状态
    if (status === 'processing' || status === 'success') {
      setIsProcessingPayment(true);
    } else if (status === 'failed' || status === 'completed') {
      setIsProcessingPayment(false);
    }
  };

  if (showPayment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <button
              onClick={() => {
                if (isProcessingPayment) {
                  const confirmed = window.confirm('您的支付正在处理中，确定要返回吗？这可能导致订阅升级失败。');
                  if (!confirmed) return;
                  setIsProcessingPayment(false);
                }
                setShowPayment(false);
              }}
              disabled={isProcessingPayment && loading}
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{isProcessingPayment ? '处理中，请勿离开...' : '返回选择套餐'}</span>
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900">
              完成支付
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              {selectedPlanData.name} - ¥{selectedPlanData.price}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPlanData.name}</h3>
                  <p className="text-gray-600">{selectedPlanData.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">¥{selectedPlanData.price}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              {isProcessingPayment && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div>
                    <p className="text-sm text-red-800 font-medium">
                      ⚠️ 正在处理支付和订阅升级，请勿关闭或离开此页面，否则可能导致升级失败！
                    </p>
                  </div>
                </div>
              )}
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>支付说明：</strong>
                  {isMobile 
                    ? ' 手机端将自动跳转到支付宝完成支付' 
                    : ' PC端将显示支付宝二维码，请使用手机扫码支付'
                  }
                </p>
              </div>
            </div>

            <HupijiaoPayment
              order_id={`UPGRADE_${Date.now()}`}
              money={selectedPlanData.price}
              title={`Kahoot助手升级 - ${selectedPlanData.name}`}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              onStatusChange={handlePaymentStatusChange}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>返回控制台</span>
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900">
            选择升级套餐
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            选择最适合您的套餐，立即开始使用高级功能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border-2 cursor-pointer transition-all hover:shadow-xl ${
                selectedPlan === plan.id
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-white/20 hover:border-indigo-300'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="h-4 w-4" />
                    <span>推荐</span>
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600">¥{plan.price}</div>
                  <div className="text-sm text-gray-500">一次性付费</div>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center">
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedPlan === plan.id
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'border-gray-300'
                }`}>
                  {selectedPlan === plan.id && (
                    <Check className="h-3 w-3 text-white m-0.5" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                已选择：{selectedPlanData.name}
              </h3>
              <p className="text-gray-600">
                支付金额：¥{selectedPlanData.price}
              </p>
            </div>
            <button
              onClick={handleContinuePayment}
              disabled={loading}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <CreditCard className="h-5 w-5" />
              <span>{loading ? '处理中...' : '继续支付 (支付宝)'}</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-medium">安全保障</span>
            </div>
            <p className="text-blue-700 text-sm">
              支付由虎皮椒提供安全保障，支持支付宝付款，100%资金安全
            </p>
            <p className="text-blue-600 text-xs mt-1">
              设备类型：{isMobile ? '手机端 (将跳转到支付宝)' : 'PC端 (将显示二维码扫码支付)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
