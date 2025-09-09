'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Users,
  TrendingUp,
  CheckCircle,
  UserCheck,
  CreditCard,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalCodes: number;
  usedCodes: number;
  activeCodes: number;
  expiredCodes: number;
  totalRevenue: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  subscription?: {
    plan: string;
    status: string;
    expiresAt: string;
  };
}

interface Transaction {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  status: string;
  createdAt: string;
  user: {
    email: string;
    name: string;
  };
}

interface RedeemCode {
  id: string;
  code: string;
  planType: string;
  duration: number;
  isUsed: boolean;
  usedBy?: {
    email: string;
    name: string;
  };
  usedAt?: string;
  createdAt: string;
  expiresAt?: string;
}

export default function AdminPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'codes'>('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [redeemCodes, setRedeemCodes] = useState<RedeemCode[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [creatingCodes, setCreatingCodes] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin && activeTab === 'users') {
      console.log('Loading users for admin...');
      loadUsers();
    } else if (isAdmin && activeTab === 'transactions') {
      console.log('Loading transactions for admin...');
      loadTransactions();
    } else if (isAdmin && activeTab === 'codes') {
      console.log('Loading redeem codes for admin...');
      loadRedeemCodes();
    }
  }, [isAdmin, activeTab]);

  const checkAdminAccess = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsAdmin(true);
        setStats(data.stats);
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

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // 修复数据结构：API 返回 { success: true, data: { users: [...] } }
        if (data.success && data.data && data.data.users) {
          setUsers(data.data.users);
        } else if (data.users) {
          // 备用方案
          setUsers(data.users);
        } else {
          console.error('API 返回的用户数据格式错误:', data);
          setUsers([]);
        }
      } else {
        console.error('加载用户失败:', response.status, response.statusText);
        setUsers([]);
      }
    } catch (error) {
      console.error('Load users error:', error);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/transactions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.transactions) {
          setTransactions(data.transactions);
        } else {
          console.error('API 返回的交易数据格式错误:', data);
          setTransactions([]);
        }
      } else {
        console.error('加载交易记录失败:', response.status, response.statusText);
        setTransactions([]);
      }
    } catch (error) {
      console.error('Load transactions error:', error);
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const loadRedeemCodes = async () => {
    setLoadingCodes(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/codes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.codes) {
          setRedeemCodes(data.codes);
        } else {
          console.error('API 返回的兑换码数据格式错误:', data);
          setRedeemCodes([]);
        }
      } else {
        console.error('加载兑换码失败:', response.status, response.statusText);
        setRedeemCodes([]);
      }
    } catch (error) {
      console.error('Load redeem codes error:', error);
      setRedeemCodes([]);
    } finally {
      setLoadingCodes(false);
    }
  };

  const createRedeemCodes = async (planType: string, duration: number, quantity: number) => {
    setCreatingCodes(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planType, duration, quantity })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          alert(`成功创建 ${quantity} 个兑换码！`);
          loadRedeemCodes(); // 重新加载列表
        } else {
          alert('创建失败: ' + (data.error || '未知错误'));
        }
      } else {
        alert('创建失败: ' + response.statusText);
      }
    } catch (error) {
      console.error('Create redeem codes error:', error);
      alert('创建出错: ' + error);
    } finally {
      setCreatingCodes(false);
    }
  };

  const updateUserSubscription = async (userId: string, plan: string, status: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/user-subscription', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, plan, status })
      });
      
      if (response.ok) {
        alert('用户订阅已更新');
        loadUsers(); // 重新加载用户列表
      } else {
        alert('更新失败');
      }
    } catch (error) {
      console.error('Update subscription error:', error);
      alert('更新出错');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl p-12 shadow-2xl">
          <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Unauthorized</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access the admin panel</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Admin Panel
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-purple-600 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/50 rounded-lg p-1">
            {[
              { id: 'overview', label: '概览', icon: TrendingUp },
              { id: 'users', label: '用户管理', icon: Users },
              { id: 'transactions', label: '交易记录', icon: CreditCard },
              { id: 'codes', label: '兑换码', icon: CheckCircle }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
                { label: 'Active Users', value: stats?.activeUsers || 0, icon: UserCheck, color: 'from-green-500 to-teal-500' },
                { label: 'Total Codes', value: stats?.totalCodes || 0, icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
                { label: 'Total Revenue', value: `¥${stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'from-orange-500 to-red-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-900">用户管理</h3>
              <p className="text-sm text-gray-600">管理所有用户账户和订阅状态</p>
            </div>
            <div className="overflow-x-auto">
              {loadingUsers ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订阅状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">权限</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users && users.length > 0 ? users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.subscription?.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.subscription?.plan || 'free'} - {user.subscription?.status || 'inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select 
                            onChange={(e) => {
                              const [plan, status] = e.target.value.split('-');
                              if (plan && status) {
                                updateUserSubscription(user.id, plan, status);
                              }
                            }}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            defaultValue=""
                          >
                            <option value="">调整订阅</option>
                            <option value="free-inactive">免费版</option>
                            <option value="monthly-active">月度版</option>
                            <option value="yearly-active">年度版</option>
                            <option value="premium-active">高级版</option>
                          </select>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          {loadingUsers ? '加载中...' : '暂无用户数据'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-900">交易记录</h3>
              <p className="text-sm text-gray-600">查看所有支付交易记录</p>
            </div>
            <div className="overflow-x-auto">
              {loadingTransactions ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions && transactions.length > 0 ? transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                          {transaction.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{transaction.user.name}</div>
                          <div className="text-sm text-gray-500">{transaction.user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ¥{transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleString('zh-CN')}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                          {loadingTransactions ? '加载中...' : '暂无交易记录'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {activeTab === 'codes' && (
          <div className="space-y-6">
            {/* 创建兑换码表单 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">创建兑换码</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">套餐类型</label>
                  <select id="planType" className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="premium">高级版</option>
                    <option value="pro">专业版</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">持续天数</label>
                  <input 
                    type="number" 
                    id="duration"
                    defaultValue={30}
                    min={1}
                    max={365}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
                  <input 
                    type="number" 
                    id="quantity"
                    defaultValue={1}
                    min={1}
                    max={100}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      const planType = (document.getElementById('planType') as HTMLSelectElement).value;
                      const duration = parseInt((document.getElementById('duration') as HTMLInputElement).value);
                      const quantity = parseInt((document.getElementById('quantity') as HTMLInputElement).value);
                      createRedeemCodes(planType, duration, quantity);
                    }}
                    disabled={creatingCodes}
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {creatingCodes ? '创建中...' : '创建兑换码'}
                  </button>
                </div>
              </div>
            </div>

            {/* 兑换码列表 */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-900">兑换码管理</h3>
                <p className="text-sm text-gray-600">查看和管理所有兑换码</p>
              </div>
              <div className="overflow-x-auto">
                {loadingCodes ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">兑换码</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">套餐</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">持续时间</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">使用者</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {redeemCodes && redeemCodes.length > 0 ? redeemCodes.map((code) => (
                        <tr key={code.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              {code.code}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                              {code.planType}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {code.duration} 天
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              code.isUsed 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {code.isUsed ? '已使用' : '未使用'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {code.usedBy ? (
                              <div>
                                <div className="font-medium">{code.usedBy.name}</div>
                                <div className="text-gray-500">{code.usedBy.email}</div>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(code.createdAt).toLocaleString('zh-CN')}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            {loadingCodes ? '加载中...' : '暂无兑换码'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-cyan-500' },
                { label: 'Active Users', value: stats?.activeUsers || 0, icon: UserCheck, color: 'from-green-500 to-teal-500' },
                { label: 'Total Codes', value: stats?.totalCodes || 0, icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
                { label: 'Total Revenue', value: `¥${stats?.totalRevenue || 0}`, icon: TrendingUp, color: 'from-orange-500 to-red-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
