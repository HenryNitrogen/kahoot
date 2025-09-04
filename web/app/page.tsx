'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Zap, Shield, Clock, Star, ArrowRight } from 'lucide-react';

export default function Home() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    // 检查用户登录状态
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserInfo(token);
    }
  }, []);

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const plans = [
    {
      name: '月付套餐',
      price: '¥10',
      period: '/月',
      features: [
        '无限制AI问答',
        '实时题目识别',
        '智能答案推荐',
        '7x24小时支持'
      ],
      popular: false
    },
    {
      name: '年付套餐',
      price: '¥30',
      period: '/年',
      originalPrice: '¥120',
      features: [
        '无限制AI问答',
        '实时题目识别',
        '智能答案推荐',
        '优先技术支持',
        '新功能抢先体验',
        '数据统计分析'
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold text-gray-900">Kahoot助手</span>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/tutorial" className="text-gray-700 hover:text-indigo-600 transition-colors">
                使用教程
              </Link>
              <Link href="/download" className="text-gray-700 hover:text-indigo-600 transition-colors">
                下载扩展
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">欢迎, {user.email}</span>
                  <Link
                    href="/test"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    系统测试
                  </Link>
                  <Link
                    href="/dashboard"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    控制台
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                  >
                    登录
                  </Link>
                  <Link
                    href="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    注册
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            让Kahoot变得更简单
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            AI驱动的Kahoot智能助手，实时识别题目，智能推荐答案，让你在游戏中脱颖而出
          </p>
          <div className="flex justify-center space-x-4">
            {!user && (
              <Link
                href="/register"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center"
              >
                免费开始使用 <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            )}
            <Link
              href="/download"
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              下载扩展
            </Link>
            <Link
              href="/tutorial"
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
            >
              查看教程 <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">为什么选择我们？</h2>
            <p className="text-xl text-gray-600">强大的功能，简单的使用</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">实时识别</h3>
              <p className="text-gray-600">自动识别Kahoot题目和选项，无需手动输入</p>
            </div>
            <div className="text-center p-6">
              <Shield className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI智能</h3>
              <p className="text-gray-600">基于先进AI模型，提供准确的答案推荐</p>
            </div>
            <div className="text-center p-6">
              <Clock className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">极速响应</h3>
              <p className="text-gray-600">10秒内获得答案，不错过任何题目</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">选择适合你的套餐</h2>
            <p className="text-xl text-gray-600">灵活的定价，满足不同需求</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-indigo-600 text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-gray-200 shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-yellow-800 px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="h-4 w-4 mr-1" /> 推荐
                    </span>
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center">
                    <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ${plan.popular ? 'text-indigo-200' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <p className="text-indigo-200 line-through mt-1">原价 {plan.originalPrice}</p>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className={`h-5 w-5 mr-3 ${plan.popular ? 'text-indigo-200' : 'text-green-500'}`} />
                      <span className={plan.popular ? 'text-indigo-100' : 'text-gray-700'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.popular
                      ? 'bg-white text-indigo-600 hover:bg-gray-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {user ? '立即购买' : '注册并购买'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="h-6 w-6" />
                <span className="text-lg font-semibold">Kahoot助手</span>
              </div>
              <p className="text-gray-400">让每一次Kahoot游戏都更有趣</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/download" className="hover:text-white transition-colors">下载扩展</Link></li>
                <li><Link href="/tutorial" className="hover:text-white transition-colors">使用教程</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">控制面板</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">支持</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/test-extension" className="hover:text-white transition-colors">测试扩展</Link></li>
                <li><a href="mailto:support@henryni.cn" className="hover:text-white transition-colors">联系我们</a></li>
                <li><Link href="/redeem" className="hover:text-white transition-colors">兑换码</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">法律</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">使用条款</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kahoot助手. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
