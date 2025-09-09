'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Chrome, AlertCircle, CheckCircle, Zap, Users, TrendingUp } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

export default function DownloadPage() {
  const [downloaded, setDownloaded] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStats, setDownloadStats] = useState<{
    totalDownloads: number;
    zipDownloads: number;
    todayDownloads: number;
  } | null>(null);
    const { translations, language, setLanguage, loading } = useTranslations();

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
      
      // 下载源码版本
      await downloadDeveloperVersion();
    } catch (error) {
      console.error('下载失败:', error);
      setDownloadProgress(0);
      alert('下载失败，请稍后重试或联系技术支持');
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadDeveloperVersion = async () => {
    try {
      setDownloadProgress(20);
      const response = await fetch('/api/download/extension?format=zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      setDownloadProgress(50);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '服务器下载失败');
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
        alert('扩展源码包已下载！\\n\\n安装步骤：\\n1. 解压下载的ZIP文件\\n2. 打开Chrome扩展管理页面\\n3. 开启&ldquo;开发者模式&rdquo;\\n4. 点击&ldquo;加载已解压的扩展程序&rdquo;\\n5. 选择解压后的文件夹');
      }, 500);
    } catch (error) {
      console.error('源码版本下载失败:', error);
      alert(error instanceof Error ? error.message : '下载失败，请稍后重试或联系技术支持');
      setDownloadProgress(0);
      setDownloaded(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">KQH</span>
            </Link>
            <nav className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('zh')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    language === 'zh' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                    language === 'en' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  EN
                </button>
              </div>
              <Link href="/tutorial" className="text-gray-700 hover:text-indigo-600 transition-colors">
                {translations.tutorialTitle}
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
                {translations.login}
              </Link>
              <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                {translations.register}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 主标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {translations.downloadTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {translations.downloadSubtitle}
          </p>
        </div>

        {/* 下载统计 */}
        {downloadStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{downloadStats.totalDownloads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{translations.totalDownloads}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Download className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{downloadStats.zipDownloads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{translations.sourceDownloads}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{downloadStats.todayDownloads.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{translations.todayDownloads}</div>
            </div>
          </div>
        )}

        {/* 下载卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Chrome Extension Store 版本 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <Chrome className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Chrome 网上应用店</h3>
                <p className="text-sm text-gray-600">官方商店版本（推荐）</p>
              </div>
            </div>
            
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">✅ 自动更新，安装简单，安全可靠</p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">一键安装</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">自动更新</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">官方认证</span>
              </div>
            </div>

            <a
              href="https://chromewebstore.google.com/detail/olpjppddeblaooabokoehcokjdjjghoh"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Chrome className="h-5 w-5" />
              <span>从 Chrome 网上应用店安装</span>
            </a>
          </div>

          {/* 源码版本 */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Download className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">源码版本</h3>
                <p className="text-sm text-gray-600">开发者版本，可自定义</p>
              </div>
            </div>

            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm">🔧 需要手动安装，支持自定义修改</p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">完整源代码</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">可自定义</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">学习用途</span>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 relative overflow-hidden"
            >
              {isDownloading && (
                <div 
                  className="absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-300 ease-out"
                  style={{ width: `${downloadProgress}%` }}
                />
              )}
              <Download className="h-5 w-5 relative z-10" />
              <span className="relative z-10">
                {isDownloading ? `${translations.downloading}... ${downloadProgress}%` : 
                 downloaded ? translations.downloadComplete : '下载源码版本'}
              </span>
            </button>
          </div>
        </div>

        {/* 安装说明 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{translations.installationGuide}</h3>
          
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-green-800 mb-2">🔧 {translations.developerInstall}</h4>
              <p className="text-green-700 text-sm">{translations.developerInstallDesc}</p>
            </div>
            <div className="grid gap-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{translations.downloadAndExtract}</h4>
                  <p className="text-gray-600 text-sm">{translations.downloadAndExtractDesc}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{translations.openExtensionsPage}</h4>
                  <p className="text-gray-600 text-sm">{translations.openExtensionsPageDesc} <code className="bg-gray-100 px-2 py-1 rounded font-mono">chrome://extensions/</code></p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{translations.enableDeveloperMode}</h4>
                  <p className="text-gray-600 text-sm">{translations.enableDeveloperModeDesc}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{translations.loadExtension}</h4>
                  <p className="text-gray-600 text-sm">{translations.loadExtensionDesc}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                  5
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{translations.verifyInstall}</h4>
                  <p className="text-gray-600 text-sm">{translations.verifyInstallDesc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">{translations.afterInstall}</h4>
                <p className="text-gray-600 text-sm">{translations.afterInstallDesc}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 注意事项 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800 mb-2">{translations.importantNotes}</h3>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• {translations.loginRequired}</li>
                <li>• {translations.freeLimit}</li>
                <li>• {translations.loadBeforeGame}</li>
                <li>• {translations.troubleshooting}</li>
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
              <span>{translations.signUpNow}</span>
            </Link>
            <Link
              href="/tutorial"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>📚 {translations.viewTutorial}</span>
            </Link>
          </div>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
              ← {translations.returnHome}
            </Link>
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700">
              {translations.dashboard}
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
