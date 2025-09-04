'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Chrome, AlertCircle, CheckCircle, Zap } from 'lucide-react';

export default function DownloadPage() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    // 创建下载链接
    const extensionFiles = {
      'manifest.json': {
        "manifest_version": 3,
        "name": "Kahoot Quiz Helper",
        "version": "1.0.0",
        "description": "AI-powered Kahoot quiz assistant",
        "permissions": ["activeTab", "storage"],
        "host_permissions": [
          "https://kahoot.it/*",
          "http://localhost:3001/*",
          "https://api.henryni.cn/*"
        ],
        "content_scripts": [{
          "matches": ["https://kahoot.it/*"],
          "js": ["content.js"],
          "world": "MAIN"
        }]
      },
      'content.js': `// Kahoot Quiz Helper Extension
// This file will be packaged with the extension
console.log('Kahoot Quiz Helper loaded!');

// Extension code will be automatically updated here
// Visit ${window.location.origin}/dashboard for the latest version
`
    };

    // 创建ZIP文件并下载
    // 注意：这里只是示例，实际应用中应该提供预构建的扩展包
    setDownloaded(true);
    
    // 模拟下载
    setTimeout(() => {
      alert('下载功能正在开发中，请稍后访问获取最新版本！');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">Kahoot助手</span>
            </Link>
            <nav className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
                登录
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                注册
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 主标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            下载Chrome扩展
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            安装Kahoot智能助手扩展，在游戏中获得AI驱动的答案推荐
          </p>
        </div>

        {/* 下载卡片 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <Chrome className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Kahoot Quiz Helper</h2>
                <p className="text-gray-600">Chrome浏览器扩展 v1.0.0</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">文件大小</div>
              <div className="text-lg font-semibold text-gray-900">~50KB</div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">功能特性:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">实时题目识别</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">AI智能答案推荐</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">可拖拽界面</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">自定义显示选项</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloaded}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>{downloaded ? '正在准备下载...' : '下载扩展'}</span>
            </button>
          </div>
        </div>

        {/* 安装说明 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">安装说明</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">下载扩展文件</h4>
                <p className="text-gray-600 text-sm">点击上方下载按钮获取扩展压缩包</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">解压文件</h4>
                <p className="text-gray-600 text-sm">将下载的ZIP文件解压到本地文件夹</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">打开Chrome扩展管理</h4>
                <p className="text-gray-600 text-sm">在Chrome浏览器地址栏输入 <code className="bg-gray-100 px-1 rounded">chrome://extensions/</code></p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">启用开发者模式</h4>
                <p className="text-gray-600 text-sm">在右上角开启&ldquo;开发者模式&rdquo;开关</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">加载扩展</h4>
                <p className="text-gray-600 text-sm">点击&ldquo;加载已解压的扩展程序&rdquo;，选择解压后的文件夹</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                ✓
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">开始使用</h4>
                <p className="text-gray-600 text-sm">访问 <a href="https://kahoot.it" className="text-indigo-600 hover:text-indigo-700">kahoot.it</a> 开始游戏，扩展将自动激活</p>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事项 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">重要提示</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• 使用AI功能需要先注册并登录账户</li>
                <li>• 免费用户每天有10次AI查询限制</li>
                <li>• 请在游戏开始前确保扩展已正确加载</li>
                <li>• 如遇到问题，请重新加载页面或重启扩展</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="text-center">
          <Link
            href="/register"
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            <span>还没有账户？立即注册</span>
          </Link>
          <div className="mt-4">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm">
              ← 返回首页
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
