'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Plus, 
  Copy, 
  RefreshCw, 
  Calendar,
  Users,
  Gift,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

interface AdminStats {
  totalCodes: number;
  usedCodes: number;
  activeCodes: number;
  expiredCodes: number;
  totalRedemptions: number;
}

interface RedeemCode {
  id: string;
  code: string;
  planType: string;
  duration: number;
  isUsed: boolean;
  createdAt: string;
  expiresAt: string | null;
  redemption?: {
    user: {
      id: string;
      name: string;
      email: string;
    };
    startDate: string;
    endDate: string;
  };
}

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [codes, setCodes] = useState<RedeemCode[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    planType: 'premium',
    duration: 30,
    quantity: 1,
    expiresAt: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { translations, loading: i18nLoading } = useTranslations();
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      // 检查管理员权限
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(true);
        setStats(data.stats);
        loadCodes();
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Admin check error:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCodes = async (page: number = 1) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/codes?page=${page}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCodes(data.codes);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Load codes error:', error);
    }
  };

  const handleCreateCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...createForm,
          expiresAt: createForm.expiresAt || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`成功创建 ${createForm.quantity} 个兑换码！`);
        setShowCreateForm(false);
        setCreateForm({
          planType: 'premium',
          duration: 30,
          quantity: 1,
          expiresAt: ''
        });
        checkAdminAccess(); // 刷新统计数据
        loadCodes(); // 刷新兑换码列表
      } else {
        alert(`创建失败: ${data.error}`);
      }
    } catch (error) {
      alert('创建失败，请重试');
      console.error('Create codes error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('兑换码已复制到剪贴板');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getStatusBadge = (code: RedeemCode) => {
    if (code.isUsed) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">已使用</span>;
    }
    if (code.expiresAt && new Date() > new Date(code.expiresAt)) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">已过期</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">可用</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">访问被拒绝</h1>
          <p className="text-gray-600 mb-4">您没有访问管理面板的权限</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            返回控制台
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
              <Shield className="h-8 w-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">管理面板</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                返回控制台
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Gift className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">总兑换码</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalCodes || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">已使用</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.usedCodes || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">可用</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeCodes || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">已过期</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.expiredCodes || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">兑换次数</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalRedemptions || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 操作区域 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">兑换码管理</h2>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>创建兑换码</span>
            </button>
          </div>

          {/* 创建表单 */}
          {showCreateForm && (
            <form onSubmit={handleCreateCodes} className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">套餐类型</label>
                  <select
                    value={createForm.planType}
                    onChange={(e) => setCreateForm({...createForm, planType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="premium">高级版</option>
                    <option value="pro">专业版</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">有效天数</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={createForm.duration}
                    onChange={(e) => setCreateForm({...createForm, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">生成数量</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={createForm.quantity}
                    onChange={(e) => setCreateForm({...createForm, quantity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">过期时间（可选）</label>
                  <input
                    type="datetime-local"
                    value={createForm.expiresAt}
                    onChange={(e) => setCreateForm({...createForm, expiresAt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {isCreating ? '创建中...' : '创建兑换码'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          )}

          {/* 兑换码列表 */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    兑换码
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    天数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    创建时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    使用信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {codes.map((code) => (
                  <tr key={code.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm">{code.code}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        code.planType === 'pro' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {code.planType === 'pro' ? '专业版' : '高级版'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {code.duration} 天
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(code)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(code.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {code.redemption ? (
                        <div>
                          <p>{code.redemption.user.name}</p>
                          <p className="text-xs text-gray-500">{code.redemption.user.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">未使用</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => copyToClipboard(code.code)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center space-x-1"
                      >
                        <Copy className="h-4 w-4" />
                        <span>复制</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                第 {currentPage} 页，共 {totalPages} 页
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => loadCodes(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  上一页
                </button>
                <button
                  onClick={() => loadCodes(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
