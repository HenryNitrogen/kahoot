'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Chrome, AlertCircle, CheckCircle, Zap, Users, TrendingUp } from 'lucide-react';

export default function DownloadPage() {
  const [downloaded, setDownloaded] = useState(false);
  const [downloadType, setDownloadType] = useState<'crx' | 'zip'>('crx');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStats, setDownloadStats] = useState<{
    totalDownloads: number;
    crxDownloads: number;
    zipDownloads: number;
    todayDownloads: number;
  } | null>(null);

  // 获取下载统计
  useEffect(() => {
    fetch('/api/download/stats')
      .then(res => res.json())
      .then(data => setDownloadStats(data))
      .catch(err => console.error('获取统计失败:', err));
  }, []);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      
      if (downloadType === 'crx') {
        // 下载预构建的CRX文件
        setDownloadProgress(30);
        const response = await fetch('/extension.crx');
        
        setDownloadProgress(60);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = 'kahoot-ai-helper.crx';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          // 记录下载统计
          fetch('/api/download/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ downloadType: 'crx' })
          }).catch(err => console.error('记录统计失败:', err));
          
          setDownloadProgress(100);
          setDownloaded(true);
          
          setTimeout(() => {
            alert('扩展已下载！\\n\\n安装方法：\\n1. 将文件拖拽到Chrome扩展页面\\n2. 或在扩展页面点击"加载已解压的扩展程序"');
          }, 500);
        } else {
          throw new Error('CRX文件下载失败');
        }
      } else {
        // 下载开发者版本
        await downloadDeveloperVersion();
      }
    } catch (error) {
      console.error('下载失败:', error);
      setDownloadProgress(0);
      alert('CRX文件下载失败，正在尝试开发者版本...');
      await downloadDeveloperVersion();
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadDeveloperVersion = async () => {
    try {
      setDownloadProgress(20);
      const response = await fetch('/api/download/extension?format=zip');
      
      setDownloadProgress(50);
      if (!response.ok) {
        throw new Error('服务器下载失败');
      }

      const blob = await response.blob();
      setDownloadProgress(80);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'kahoot-ai-helper-extension.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // 记录下载统计
      fetch('/api/download/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ downloadType: 'zip' })
      }).catch(err => console.error('记录统计失败:', err));

      setDownloadProgress(100);
      setDownloaded(true);

      setTimeout(() => {
        alert('扩展包已下载！\\n\\n安装步骤：\\n1. 解压下载的ZIP文件\\n2. 打开Chrome扩展管理页面\\n3. 开启&ldquo;开发者模式&rdquo;\\n4. 点击&ldquo;加载已解压的扩展程序&rdquo;\\n5. 选择解压后的文件夹');
      }, 500);
    } catch (error) {
      console.error('开发者版本下载失败:', error);
      alert('下载失败，请稍后重试或联系技术支持');
      setDownloadProgress(0);
      setDownloaded(false);
    }
  };  return (
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
              <Link href="/tutorial" className="text-gray-700 hover:text-indigo-600 transition-colors">
                使用教程
              </Link>
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

        {/* 下载统计 */}
        {downloadStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{downloadStats.totalDownloads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">总下载量</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Chrome className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{downloadStats.crxDownloads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">CRX下载</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{downloadStats.zipDownloads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">ZIP下载</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{downloadStats.todayDownloads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">今日下载</div>
            </div>
          </div>
        )}

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

          {/* 下载类型选择 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">选择下载版本:</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="downloadType"
                  value="crx"
                  checked={downloadType === 'crx'}
                  onChange={(e) => setDownloadType(e.target.value as 'crx' | 'zip')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-medium text-gray-900">CRX文件 (推荐)</div>
                  <div className="text-sm text-gray-600">预构建版本，直接拖拽安装</div>
                </div>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="downloadType"
                  value="zip"
                  checked={downloadType === 'zip'}
                  onChange={(e) => setDownloadType(e.target.value as 'crx' | 'zip')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="font-medium text-gray-900">开发者版本 (ZIP)</div>
                  <div className="text-sm text-gray-600">源码版本，需要开发者模式安装</div>
                </div>
              </label>
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
              disabled={isDownloading}
              className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 relative overflow-hidden"
            >
              {isDownloading && (
                <div 
                  className="absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-300 ease-out"
                  style={{ width: `${downloadProgress}%` }}
                />
              )}
              <Download className="h-5 w-5 relative z-10" />
              <span className="relative z-10">
                {isDownloading ? `下载中... ${downloadProgress}%` : 
                 downloaded ? '下载完成' : 
                 `下载${downloadType === 'crx' ? 'CRX' : 'ZIP'}文件`}
              </span>
            </button>
          </div>
        </div>

        {/* 安装说明 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">详细安装指南</h3>
          
          {/* CRX安装说明 */}
          {downloadType === 'crx' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 推荐方法 (适用于CRX文件)</h4>
                <p className="text-blue-700 text-sm">由于Chrome安全限制，推荐使用开发者模式安装</p>
              </div>
              <div className="grid gap-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">下载文件</h4>
                    <p className="text-gray-600 text-sm">点击上方下载按钮获取CRX扩展文件</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">打开Chrome扩展管理</h4>
                    <p className="text-gray-600 text-sm">
                      在Chrome浏览器地址栏输入 
                      <code className="bg-gray-100 px-2 py-1 rounded mx-1 font-mono">chrome://extensions/</code>
                      或菜单 → 更多工具 → 扩展程序
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">启用开发者模式</h4>
                    <p className="text-gray-600 text-sm">在扩展页面右上角开启&ldquo;开发者模式&rdquo;开关</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">拖拽安装</h4>
                    <p className="text-gray-600 text-sm">将下载的CRX文件直接拖拽到扩展页面即可完成安装</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* ZIP安装说明 */}
          {downloadType === 'zip' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-2">🔧 开发者版本安装</h4>
                <p className="text-green-700 text-sm">适合开发者或需要自定义修改的用户</p>
              </div>
              <div className="grid gap-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">下载并解压</h4>
                    <p className="text-gray-600 text-sm">下载ZIP文件并解压到本地文件夹</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">进入扩展管理页面</h4>
                    <p className="text-gray-600 text-sm">访问 <code className="bg-gray-100 px-2 py-1 rounded font-mono">chrome://extensions/</code></p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">开启开发者模式</h4>
                    <p className="text-gray-600 text-sm">点击页面右上角的&ldquo;开发者模式&rdquo;开关</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">加载扩展</h4>
                    <p className="text-gray-600 text-sm">点击&ldquo;加载已解压的扩展程序&rdquo;，选择解压后的文件夹</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">验证安装</h4>
                    <p className="text-gray-600 text-sm">扩展应该出现在列表中，确认已启用</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">安装成功后</h4>
                <p className="text-gray-600 text-sm">访问 <a href="https://kahoot.it" className="text-indigo-600 hover:text-indigo-700 underline">kahoot.it</a> 开始游戏，扩展将自动激活并在右上角显示AI助手面板</p>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <span>还没有账户？立即注册</span>
            </Link>
            <Link
              href="/tutorial"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>📚 查看使用教程</span>
            </Link>
          </div>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
              ← 返回首页
            </Link>
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700">
              控制面板
            </Link>
            <Link href="/test-extension" className="text-indigo-600 hover:text-indigo-700">
              测试扩展
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
