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
  AlertCircle,
  Star
} from 'lucide-react';

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
  const router = useRouter();

  useEffect(() => {
    fetchUserData();
  }, []);

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
    } catch (error) {
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
    alert(`升级到${plan === 'premium' ? '高级版 (¥15/月)' : '专业版 (¥50/年)'}套餐功能待实现`);
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
      case 'active': return '活跃';
      case 'expired': return '已过期';
      case 'trial': return '试用中';
      default: return '未知';
    }
  };

  if (loading) {
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
          <p className="text-red-600 mb-4">{error || '用户数据加载失败'}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            返回登录
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
              <span className="text-2xl font-bold text-gray-900">控制台</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">欢迎, {user.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>退出</span>
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
                      {user.subscription.plan === 'free' ? '免费版' : 
                       user.subscription.plan === 'premium' ? '高级版' : '专业版'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 使用统计 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">使用统计</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {user.usageRecords.length > 0 ? user.usageRecords[0].requestsToday : 0}
                  </div>
                  <div className="text-sm text-gray-600">今日请求</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {user.usageRecords.length > 0 ? user.usageRecords[0].requestsThisMonth : 0}
                  </div>
                  <div className="text-sm text-gray-600">本月请求</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {user.usageRecords.length > 0 ? user.usageRecords[0].totalRequests : 0}
                  </div>
                  <div className="text-sm text-gray-600">总计请求</div>
                </div>
              </div>
            </div>

            {/* 下载扩展 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">下载扩展</h3>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Chrome扩展</h4>
                  <p className="text-sm text-gray-600">适用于Chrome浏览器的Kahoot助手扩展</p>
                </div>
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>下载</span>
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
                <h3 className="text-lg font-semibold text-gray-900">订阅信息</h3>
              </div>
              
              {user.subscription.plan === 'free' ? (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">您正在使用免费版本</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpgrade('premium')}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      升级到高级版 ¥15/月
                    </button>
                    <button
                      onClick={() => handleUpgrade('pro')}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center space-x-1"
                    >
                      <Star className="h-4 w-4" />
                      <span>升级到专业版 ¥50/年</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-900">
                      {user.subscription.plan === 'premium' ? '高级版' : '专业版'}
                    </span>
                  </div>
                  {user.subscription.expiresAt && (
                    <p className="text-sm text-gray-600">
                      到期时间: {formatDate(user.subscription.expiresAt)}
                    </p>
                  )}
                  <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    管理订阅
                  </button>
                </div>
              )}
            </div>

            {/* 快速操作 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Settings className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">账户设置</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">使用历史</span>
                </button>
                <button
                  onClick={() => router.push('/test')}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <AlertCircle className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-900">系统测试</span>
                </button>
              </div>
            </div>

            {/* 系统状态 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">系统状态</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API服务</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">正常</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">AI服务</span>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">正常</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">响应时间</span>
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