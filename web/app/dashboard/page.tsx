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
  Shield
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

export default function Dashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { translations, loading: i18nLoading } = useTranslations();
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/');
  };

  const handleUpgrade = (plan: 'premium' | 'pro') => {
    // TODO: 集成支付系统
    const message = plan === 'premium' 
      ? `${translations.upgradeToPremium}` 
      : `${translations.upgradeToProYearly}`;
    alert(`${message} - Feature coming soon`);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || translations.error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            {translations.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">{translations.dashboard}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{translations.welcome}, {user.name}</span>
              {user.email === 'henryni710@gmail.com' && (
                <button
                  onClick={() => router.push('/admin')}
                  className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  <span>{translations.adminPanel}</span>
                </button>
              )}
              <button
                onClick={() => router.push('/redeem')}
                className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Gift className="h-4 w-4" />
                <span>{translations.redeemCenter}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{translations.logout}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 用户信息卡片 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.subscription.status)}`}>
                      {getStatusText(user.subscription.status)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {user.subscription.plan === 'free' ? translations.freeVersion : 
                       user.subscription.plan === 'premium' ? translations.premiumVersion : translations.proVersion}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 使用统计 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{translations.usageStats}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.usageRecords.length > 0 ? user.usageRecords[0].requestsToday : 0}
                  </div>
                  <div className="text-sm text-gray-600">{translations.todayRequests}</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user.usageRecords.length > 0 ? user.usageRecords[0].requestsThisMonth : 0}
                  </div>
                  <div className="text-sm text-gray-600">{translations.monthRequests}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.usageRecords.length > 0 ? user.usageRecords[0].totalRequests : 0}
                  </div>
                  <div className="text-sm text-gray-600">{translations.totalRequests}</div>
                </div>
              </div>
            </div>

            {/* 下载扩展 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{translations.downloadExtension}</h3>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{translations.chromeExtension}</h4>
                  <p className="text-sm text-gray-600">{translations.chromeExtensionDesc}</p>
                </div>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>{translations.download}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 订阅信息 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <h3 className="text-lg font-semibold text-gray-900">{translations.subscriptionInfo}</h3>
              </div>
              
              {user.subscription.plan === 'free' ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">{translations.usingFreeVersion}</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpgrade('premium')}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      {translations.upgradeToPremium}
                    </button>
                    <button
                      onClick={() => handleUpgrade('pro')}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Star className="h-4 w-4" />
                      <span>{translations.upgradeToProYearly}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-900">
                      {user.subscription.plan === 'premium' ? translations.premiumVersion : translations.proVersion}
                    </span>
                  </div>
                  {user.subscription.expiresAt && (
                    <p className="text-sm text-gray-600">
                      {translations.expiresAt}: {formatDate(user.subscription.expiresAt)}
                    </p>
                  )}
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    {translations.manageSubscription}
                  </button>
                </div>
              )}
            </div>

            {/* 快速操作 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{translations.quickActions}</h3>
              <div className="space-y-2">
                <button 
                  onClick={() => router.push('/redeem')}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Gift className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">{translations.redeemCenter}</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">{translations.accountSettings}</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">{translations.usageHistory}</span>
                </button>
              </div>
            </div>

            {/* 系统状态 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{translations.systemStatus}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{translations.apiService}</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">{translations.normal}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{translations.aiService}</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">{translations.normal}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{translations.responseTime}</span>
                  <span className="text-xs text-gray-600">~2.3s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};