'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Zap, Shield, Clock, Star, ArrowRight, Sparkles, Target, Globe, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/useLanguage';

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
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
      name: t('freePlan'),
      price: language === 'zh' ? '免费' : 'Free',
      period: '',
      features: [
        t('freePlanDesc'),
        language === 'zh' ? '智能答案建议' : 'Smart answer suggestions',
        language === 'zh' ? '实时题目分析' : 'Real-time analysis',
        language === 'zh' ? '基础支持' : 'Basic support'
      ],
      popular: false,
      cta: language === 'zh' ? '开始使用' : 'Get Started'
    },
    {
      name: t('premiumPlan'),
      price: language === 'zh' ? '¥10' : '$2',
      period: language === 'zh' ? '/月' : '/month',
      features: [
        t('premiumPlanDesc'),
        language === 'zh' ? '高级智能分析' : 'Advanced analysis',
        language === 'zh' ? '优先技术支持' : 'Priority support',
        language === 'zh' ? '详细使用统计' : 'Detailed statistics'
      ],
      popular: true,
      cta: language === 'zh' ? '立即升级' : 'Upgrade Now'
    },
    {
      name: t('proPlan'),
      price: language === 'zh' ? '¥50' : '$10',
      period: language === 'zh' ? '/年' : '/year',
      originalPrice: language === 'zh' ? '¥120' : '$24',
      features: [
        t('proPlanDesc'),
        language === 'zh' ? '最高精度分析' : 'Highest accuracy',
        language === 'zh' ? '专属客服' : 'Dedicated support',
        language === 'zh' ? '新功能抢先体验' : 'Early access',
        language === 'zh' ? '无限使用历史' : 'Unlimited history'
      ],
      popular: false,
      cta: language === 'zh' ? '获取专业版' : 'Go Pro'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -top-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-2 group">
                <div className="relative">
                  <Zap className="h-8 w-8 text-purple-600 group-hover:text-purple-700 transition-all duration-300 group-hover:scale-110" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {t('appName')}
                </span>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    language === 'zh' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    language === 'en' 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  EN
                </button>
              </div>
              
              <Link href="/tutorial" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                {t('tutorial')}
              </Link>
              <Link href="/download" className="text-gray-700 hover:text-purple-600 transition-colors font-medium">
                {t('download')}
              </Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">
                    {language === 'zh' ? `欢迎, ${user.name || user.email}` : `Welcome, ${user.name || user.email}`}
                  </span>
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                  >
                    {t('dashboard')}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
                  >
                    {t('login')}
                  </Link>
                  <Link
                    href="/register"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105 font-medium"
                  >
                    {t('register')}
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full mb-8 shadow-lg">
              <Sparkles className="h-5 w-5 text-purple-600 animate-spin" />
              <span className="text-purple-800 font-semibold">
                {language === 'zh' ? '🎉 全新体验升级！' : '🎉 Experience the upgrade!'}
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                {language === 'zh' ? '让Kahoot' : 'Make Kahoot'}
              </span>
              <br />
              <span className="relative">
                {language === 'zh' ? '变得超简单' : 'Super Easy'}
                <div className="absolute -top-6 -right-6 animate-bounce">
                  <Star className="h-8 w-8 text-yellow-400 fill-current" />
                </div>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('appDescription')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              {!user && (
                <Link
                  href="/register"
                  className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <span>{language === 'zh' ? '免费开始使用' : 'Start Free'}</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link
                href="/download"
                className="border-2 border-purple-600 text-purple-600 px-10 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                {t('downloadExtension')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: '10K+', label: language === 'zh' ? '活跃用户' : 'Active Users', icon: Globe },
                { number: '500K+', label: language === 'zh' ? '答题次数' : 'Questions Answered', icon: Target },
                { number: '98%', label: language === 'zh' ? '准确率' : 'Accuracy Rate', icon: TrendingUp },
                { number: '< 1s', label: language === 'zh' ? '响应时间' : 'Response Time', icon: Zap },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <stat.icon className="h-8 w-8 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('features')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {language === 'zh' ? '强大的功能，简单的使用，让每次答题都充满自信' : 'Powerful features, simple usage, answer with confidence every time'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: t('intelligentAnswers'),
                desc: t('intelligentAnswersDesc'),
                color: 'from-red-500 to-pink-500'
              },
              {
                icon: Zap,
                title: t('realTimeAnalysis'),
                desc: t('realTimeAnalysisDesc'),
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Shield,
                title: t('confidenceScoring'),
                desc: t('confidenceScoringDesc'),
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: Clock,
                title: t('fastResponse'),
                desc: t('fastResponseDesc'),
                color: 'from-blue-500 to-purple-500'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                
                {/* Floating animation elements */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-200 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {language === 'zh' ? '选择适合你的套餐' : 'Choose Your Plan'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'zh' ? '灵活的定价，满足不同需求' : 'Flexible pricing for every need'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-3xl p-8 transition-all duration-500 hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl transform scale-105'
                    : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200 shadow-lg hover:shadow-2xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold flex items-center shadow-lg">
                      <Star className="h-4 w-4 mr-2 fill-current" />
                      {language === 'zh' ? '最受欢迎' : 'Most Popular'}
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className={`text-2xl font-bold mb-4 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                    <span className={`text-lg ml-1 ${plan.popular ? 'text-purple-200' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                  {plan.originalPrice && (
                    <p className="text-purple-200 line-through">
                      {language === 'zh' ? `原价 ${plan.originalPrice}` : `Was ${plan.originalPrice}`}
                    </p>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className={`h-5 w-5 mr-3 flex-shrink-0 ${plan.popular ? 'text-purple-200' : 'text-green-500'}`} />
                      <span className={`${plan.popular ? 'text-purple-100' : 'text-gray-700'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    plan.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-50'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-purple-500/25'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold">{t('appName')}</span>
              </div>
              <p className="text-gray-400 mb-4">
                {language === 'zh' ? '让每一次Kahoot游戏都更有趣、更成功' : 'Making every Kahoot game more fun and successful'}
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">{language === 'zh' ? '产品' : 'Product'}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/download" className="hover:text-white transition-colors hover:translate-x-1 inline-block">{t('download')}</Link></li>
                <li><Link href="/tutorial" className="hover:text-white transition-colors hover:translate-x-1 inline-block">{t('tutorial')}</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors hover:translate-x-1 inline-block">{t('dashboard')}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">{language === 'zh' ? '支持' : 'Support'}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="mailto:support@henryni.cn" className="hover:text-white transition-colors hover:translate-x-1 inline-block">{language === 'zh' ? '联系我们' : 'Contact Us'}</a></li>
                <li><Link href="/redeem" className="hover:text-white transition-colors hover:translate-x-1 inline-block">{language === 'zh' ? '兑换码' : 'Redeem Code'}</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-lg">{language === 'zh' ? '法律' : 'Legal'}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors hover:translate-x-1 inline-block">{language === 'zh' ? '隐私政策' : 'Privacy Policy'}</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors hover:translate-x-1 inline-block">{language === 'zh' ? '使用条款' : 'Terms of Service'}</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {t('appName')}. {language === 'zh' ? '保留所有权利。' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
