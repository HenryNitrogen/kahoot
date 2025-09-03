'use client';

import { useState, useEffect } from 'react';
import { Download, Chrome, Shield, Zap, Users, Star, ArrowRight, ExternalLink } from 'lucide-react';

export default function ExtensionPage() {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalQuestions: 15683,
    accuracy: 94.2
  });

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: '🤖 AI智能答题',
      description: '基于先进AI模型，实时分析题目并提供准确答案建议'
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: '🔐 安全可靠',
      description: '端到端加密，保护用户隐私，不会影响Kahoot正常运行'
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: '👥 多用户支持',
      description: '支持免费用户和高级会员，不同等级享受不同服务'
    },
    {
      icon: <Star className="w-6 h-6 text-purple-500" />,
      title: '✨ 界面友好',
      description: '可拖拽、可最小化的界面，不干扰游戏体验'
    }
  ];

  const steps = [
    {
      step: '1',
      title: '下载扩展',
      description: '点击下载按钮获取扩展文件'
    },
    {
      step: '2',
      title: '安装扩展',
      description: '在Chrome中加载解压的扩展程序'
    },
    {
      step: '3',
      title: '登录账户',
      description: '使用你的账户登录以获得AI功能'
    },
    {
      step: '4',
      title: '开始使用',
      description: '访问Kahoot.it并享受AI助手'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Chrome className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Kahoot AI助手
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              让AI帮你在Kahoot游戏中获得更好的成绩！智能分析题目，提供准确答案建议。
            </p>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-gray-400">活跃用户</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.totalQuestions.toLocaleString()}</div>
                <div className="text-gray-400">已解答题目</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.accuracy}%</div>
                <div className="text-gray-400">准确率</div>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  // 触发下载扩展zip文件
                  const link = document.createElement('a');
                  link.href = '/extension.zip';
                  link.download = 'kahoot-ai-helper.zip';
                  link.click();
                }}
                className="group flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
              >
                <Download className="w-5 h-5" />
                下载Chrome扩展
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="/register"
                className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                注册免费账户
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              强大的功能特性
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              我们的AI助手提供多种实用功能，帮助你在Kahoot游戏中取得更好成绩
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Installation Steps */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              简单安装，快速上手
            </h2>
            <p className="text-gray-300 text-lg">
              只需要4个简单步骤，即可开始使用AI助手
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto text-white font-bold text-xl">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Detailed Installation Instructions */}
          <div className="mt-16 bg-white/5 rounded-xl p-8 backdrop-blur-sm border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">详细安装教程</h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p><strong className="text-white">下载扩展：</strong>点击上方的"下载Chrome扩展"按钮，保存zip文件到电脑</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p><strong className="text-white">解压文件：</strong>解压下载的zip文件到任意文件夹</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p><strong className="text-white">打开Chrome：</strong>在地址栏输入 <code className="bg-black/30 px-2 py-1 rounded">chrome://extensions/</code></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p><strong className="text-white">开启开发者模式：</strong>在页面右上角打开"开发者模式"开关</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                <div>
                  <p><strong className="text-white">加载扩展：</strong>点击"加载已解压的扩展程序"，选择解压后的文件夹</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
                <div>
                  <p><strong className="text-white">完成安装：</strong>扩展会出现在Chrome工具栏中，点击图标进行登录</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              选择适合你的计划
            </h2>
            <p className="text-gray-300 text-lg">
              我们提供灵活的定价方案，满足不同用户的需求
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-4">免费版</h3>
              <div className="text-4xl font-bold text-white mb-4">¥0<span className="text-lg text-gray-400">/月</span></div>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  每日10次AI答题
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  每月100次AI答题
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  基础功能支持
                </li>
              </ul>
              <a href="/register" className="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors">
                开始使用
              </a>
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-b from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-8 border-2 border-purple-500 relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  推荐
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">高级版</h3>
              <div className="text-4xl font-bold text-white mb-4">¥19<span className="text-lg text-gray-400">/月</span></div>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  每日100次AI答题
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  每月1000次AI答题
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  优先AI响应
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  邮件支持
                </li>
              </ul>
              <a href="/register" className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all">
                立即升级
              </a>
            </div>

            {/* Pro Plan */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-yellow-500/50">
              <h3 className="text-2xl font-bold text-white mb-4">专业版</h3>
              <div className="text-4xl font-bold text-white mb-4">¥39<span className="text-lg text-gray-400">/月</span></div>
              <ul className="space-y-3 text-gray-300 mb-8">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  每日500次AI答题
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  每月5000次AI答题
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  最高优先级
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  专属客服支持
                </li>
              </ul>
              <a href="/register" className="block w-full text-center bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-3 rounded-lg font-semibold transition-all">
                联系我们
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              常见问题
            </h2>
          </div>

          <div className="space-y-6">
            <details className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                这个扩展安全吗？会不会被Kahoot发现？
              </summary>
              <div className="mt-4 text-gray-300">
                <p>我们的扩展只是读取页面上的题目信息，不会修改游戏数据或发送任何作弊信号。它就像一个阅读助手，帮你分析题目。使用时请遵守相关规定，负责任地使用。</p>
              </div>
            </details>

            <details className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                AI答案的准确率如何？
              </summary>
              <div className="mt-4 text-gray-300">
                <p>根据我们的测试数据，AI答案的准确率约为94.2%。准确率会根据题目类型、语言和复杂度有所差异。我们持续优化AI模型以提供更准确的答案。</p>
              </div>
            </details>

            <details className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                免费版的限制是什么？
              </summary>
              <div className="mt-4 text-gray-300">
                <p>免费版用户每天可以使用10次AI答题功能，每月最多100次。如果需要更多使用次数，可以升级到高级版或专业版。</p>
              </div>
            </details>

            <details className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                如何升级到付费版本？
              </summary>
              <div className="mt-4 text-gray-300">
                <p>注册账户后，在控制面板中可以选择升级计划。我们支持多种支付方式，包括支付宝、微信支付等。升级后立即生效。</p>
              </div>
            </details>

            <details className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                扩展支持哪些浏览器？
              </summary>
              <div className="mt-4 text-gray-300">
                <p>目前我们只支持Chrome浏览器和基于Chromium的浏览器（如Edge、Opera等）。我们正在计划支持Firefox和Safari。</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            准备好提升你的Kahoot成绩了吗？
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            立即下载扩展，开始享受AI助手带来的智能答题体验！
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/extension.zip';
                link.download = 'kahoot-ai-helper.zip';
                link.click();
              }}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              <Download className="w-5 h-5" />
              下载扩展
            </button>
            
            <a
              href="/register"
              className="flex items-center justify-center gap-3 bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
            >
              免费注册
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}