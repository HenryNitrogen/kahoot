'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  CreditCard, 
  Clock, 
  Download, 
  Settings, 
  LogOut, 
  Zap,
  CheckCircle,
  Star,
  Gift,
  Shield,
  Activity,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  BarChart3,
  History,
  BookOpen
} from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface UserData {
  id: string;
  name: string;
  email: string;
  subscription: {
    id: string;
    plan: 'free' | 'premium' | 'pro';
    expiresAt: string | null;
    status: 'active' | 'expired' | 'trial';
  };
  usageRecords: {
    id: string;
    requestsToday: number;
    requestsThisMonth: number;
    totalRequests: number;
    lastRequestDate: string;
  }[];
}

interface UsageHistoryItem {
  id: string;
  timestamp: string;
  question: string;
  answer: string;
  type: string;
}

interface UsageRecord {
  id: string;
  timestamp: string;
  question: string;
  answer: string;
  type: string;
  success?: boolean;
  response_time?: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [usageHistory, setUsageHistory] = useState<UsageRecord[]>([]);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showHistory, setShowHistory] = useState(false);
  const router = useRouter();
  const { translations, loading: i18nLoading, language, setLanguage } = useTranslations();

  // 检测升级成功
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upgraded') === 'true') {
      setShowUpgradeSuccess(true);
      // 清理URL参数
      const url = new URL(window.location.href);
      url.searchParams.delete('upgraded');
      window.history.replaceState({}, '', url.pathname);
      
      // 3秒后隐藏提示
      setTimeout(() => {
        setShowUpgradeSuccess(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('authToken');
        router.push('/login');
      }
    } catch (err) {
      setError('获取用户数据失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageHistory = async () => {
    if (!user) return;
    
    setHistoryLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/usage/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const historyData = await response.json();
        setUsageHistory(historyData.history || []);
      }
    } catch (err) {
      console.error('获取使用历史失败:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory && usageHistory.length === 0) {
      fetchUsageHistory();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleUpgrade = async (plan: 'premium' | 'pro') => {
    // 直接跳转到收银台页面选择套餐
    const planParam = plan === 'premium' ? 'monthly' : 'yearly';
    router.push(`/checkout?plan=${planParam}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'trial': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return translations.active;
      case 'expired': return translations.expired;
      case 'trial': return translations.trial;
      default: return translations.normal;
    }
  };

  if (loading || i18nLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
          <div className="absolute inset-0 animate-pulse">
            <div className="rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent opacity-30"></div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-600 animate-bounce">{translations.loading || 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg animate-fadeIn">
          <div className="mb-6">
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
              <User className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <p className="text-red-600 mb-6 text-lg">{error || translations.error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            {translations.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Zap className="h-10 w-10 text-indigo-600 animate-pulse" />
                <div className="absolute inset-0 animate-ping">
                  <Zap className="h-10 w-10 text-indigo-400 opacity-20" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {translations.dashboard}
                </span>
                <div className="text-sm text-gray-500 mt-1">KQH - Kahoot Quiz Helper</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Language Switcher */}
              <div className="flex items-center space-x-2 bg-white/50 rounded-lg p-1">
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
              <div className="text-right">
                <div className="text-gray-700 font-medium">{translations.welcome}, {user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              {user.email === 'henryni710@gmail.com' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Shield className="h-4 w-4" />
                  <span>{translations.adminPanel}</span>
                </button>
              )}
              <button
                onClick={() => router.push('/redeem')}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-2 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <Gift className="h-4 w-4" />
                <span>{translations.redeemCenter}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-all transform hover:scale-105 px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>{translations.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-md p-1 rounded-xl shadow-lg border border-white/20">
          {[
            { id: 'overview', label: translations.dashboard || 'Overview', icon: BarChart3 },
            { id: 'history', label: translations.usageHistory || 'Usage History', icon: History },
            { id: 'settings', label: translations.accountSettings || 'Settings', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all transform ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* 升级成功提示 */}
        {showUpgradeSuccess && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 animate-slideDown">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-12 w-12 text-green-600 animate-bounce" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🎉 升级成功！
                </h3>
                <p className="text-green-700">
                  恭喜您！订阅已成功升级。现在您可以享受所有高级功能了。
                  如果订阅状态未及时更新，请稍等几秒钟后刷新页面。
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeSuccess(false)}
                className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* 主要信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 用户信息卡片 */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all transform hover:scale-[1.02]">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-20 w-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center animate-pulse">
                      <User className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full border-2 border-white animate-bounce">
                      <div className="h-full w-full bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{user.name}</h2>
                    <p className="text-gray-600 text-lg">{user.email}</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.subscription.status)} animate-pulse`}>
                        {getStatusText(user.subscription.status)}
                      </span>
                      <span className="text-gray-500">
                        {user.subscription.plan === 'free' ? translations.freeVersion : 
                         user.subscription.plan === 'premium' ? translations.premiumVersion : translations.proVersion}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 使用统计 */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all">
                <div className="flex items-center space-x-2 mb-6">
                  <Activity className="h-6 w-6 text-indigo-600 animate-bounce" />
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{translations.usageStats}</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all transform hover:scale-105 shadow-md">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                      {user.usageRecords.length > 0 ? user.usageRecords[0].requestsToday : 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">{translations.todayRequests}</div>
                    <div className="mt-2 h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"
                        style={{ 
                          width: `${Math.min((user.usageRecords.length > 0 ? user.usageRecords[0].requestsToday : 0) / 4 * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all transform hover:scale-105 shadow-md">
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
                      {user.usageRecords.length > 0 ? user.usageRecords[0].requestsThisMonth : 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">{translations.monthRequests}</div>
                    <div className="mt-2 h-2 bg-green-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"
                        style={{ 
                          width: `${Math.min((user.usageRecords.length > 0 ? user.usageRecords[0].requestsThisMonth : 0) / 200 * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all transform hover:scale-105 shadow-md">
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                      {user.usageRecords.length > 0 ? user.usageRecords[0].totalRequests : 0}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">{translations.totalRequests}</div>
                    <TrendingUp className="h-4 w-4 text-purple-600 mx-auto mt-2 animate-bounce" />
                  </div>
                </div>
              </div>

              {/* 下载扩展 */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all">
                <div className="flex items-center space-x-2 mb-6">
                  <Download className="h-6 w-6 text-indigo-600 animate-bounce" />
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{translations.downloadExtension}</h3>
                </div>
                <div className="flex items-center justify-between p-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-300 transition-all bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{translations.chromeExtension}</h4>
                    <p className="text-gray-600 mt-1">{translations.chromeExtensionDesc}</p>
                  </div>
                  <button 
                    onClick={() => router.push('/download')}
                    className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Download className="h-5 w-5" />
                    <span className="font-medium">{translations.download}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              {/* 订阅信息 */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all">
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="h-6 w-6 text-indigo-600 animate-pulse" />
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{translations.subscriptionInfo}</h3>
                </div>
                
                {user.subscription.plan === 'free' ? (
                  <div className="space-y-4">
                    <p className="text-gray-600">{translations.usingFreeVersion}</p>
                    <div className="space-y-3">
                      <button
                        onClick={() => handleUpgrade('premium')}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg font-medium"
                      >
                        {translations.upgradeToPremium}
                      </button>
                      <button
                        onClick={() => handleUpgrade('pro')}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 font-medium"
                      >
                        <Star className="h-5 w-5 animate-pulse" />
                        <span>{translations.upgradeToProYearly}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-6 w-6 text-green-600 animate-pulse" />
                      <span className="text-gray-900 font-medium">
                        {user.subscription.plan === 'premium' ? translations.premiumVersion : translations.proVersion}
                      </span>
                    </div>
                    {user.subscription.expiresAt && (
                      <p className="text-gray-600">
                        {translations.expiresAt}: {formatDate(user.subscription.expiresAt)}
                      </p>
                    )}
                    <button className="w-full border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all transform hover:scale-105 font-medium">
                      {translations.manageSubscription}
                    </button>
                  </div>
                )}
              </div>

              {/* 快速操作 */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">{translations.quickActions}</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => router.push('/redeem')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all transform hover:scale-105"
                  >
                    <Gift className="h-5 w-5 text-green-600" />
                    <span className="text-gray-900 font-medium">{translations.redeemCenter}</span>
                  </button>
                  <button 
                    onClick={() => router.push('/payment/test')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all transform hover:scale-105"
                  >
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">虎皮椒支付宝测试</span>
                  </button>
                  <button 
                    onClick={() => router.push('/tutorial')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 rounded-xl transition-all transform hover:scale-105"
                  >
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    <span className="text-gray-900 font-medium">{translations.tutorialTitle || 'Tutorial'}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-xl transition-all transform hover:scale-105"
                  >
                    <Settings className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">{translations.accountSettings}</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('history')}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl transition-all transform hover:scale-105"
                  >
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-gray-900 font-medium">{translations.usageHistory}</span>
                  </button>
                </div>
              </div>

              {/* 系统状态 */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20 hover:shadow-xl transition-all">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">{translations.systemStatus}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{translations.apiService}</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">{translations.normal}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{translations.aiService}</span>
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">{translations.normal}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{translations.responseTime}</span>
                    <span className="text-sm text-gray-600 font-medium">~2.3s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <History className="h-6 w-6 text-indigo-600 animate-bounce" />
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{translations.usageHistory}</h3>
                </div>
                <button
                  onClick={fetchUsageHistory}
                  disabled={historyLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {historyLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {historyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : usageHistory.length > 0 ? (
                <div className="space-y-4">
                  {usageHistory.slice(0, 10).map((item, index) => (
                    <div 
                      key={item.id} 
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all animate-fadeIn"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`h-2 w-2 rounded-full ${item.success ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                            <span className="text-sm text-gray-500">
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">
                              Response: {item.response_time}ms
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 mb-1">
                            <strong>Q:</strong> {item.question.length > 100 ? `${item.question.substring(0, 100)}...` : item.question}
                          </div>
                          <div className="text-sm text-gray-600">
                            <strong>A:</strong> {item.answer.length > 150 ? `${item.answer.substring(0, 150)}...` : item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No usage history found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fadeIn">
            <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center space-x-2 mb-6">
                <Settings className="h-6 w-6 text-indigo-600 animate-bounce" />
                <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{translations.accountSettings}</h3>
              </div>
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-500">Settings panel coming soon...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};