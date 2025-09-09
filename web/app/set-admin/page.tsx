'use client';

import { useState, useEffect } from 'react';
import { Shield, User, Check, X } from 'lucide-react';

export default function SetAdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/set-admin');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('加载用户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (email: string, currentStatus: boolean) => {
    setActionLoading(email);
    try {
      const response = await fetch('/api/admin/set-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          setAdmin: !currentStatus
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        loadUsers(); // 重新加载用户列表
      } else {
        const error = await response.json();
        alert(`操作失败: ${error.error}`);
      }
    } catch (error) {
      console.error('设置管理员权限失败:', error);
      alert('操作失败');
    } finally {
      setActionLoading(null);
    }
  };

  const setHenryAsAdmin = async () => {
    await toggleAdmin('henryni710@gmail.com', false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">管理员权限设置</h1>
          </div>

          {/* Quick Action */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">快速操作</h2>
            <p className="text-blue-700 mb-4">
              设置 henryni710@gmail.com 为管理员
            </p>
            <button
              onClick={setHenryAsAdmin}
              disabled={actionLoading === 'henryni710@gmail.com'}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>
                {actionLoading === 'henryni710@gmail.com' ? '处理中...' : '设为管理员'}
              </span>
            </button>
          </div>

          {/* Users List */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">所有用户</h2>
            
            {users.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                暂无用户，请先注册账户
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        邮箱
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        管理员状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isAdmin
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {user.isAdmin ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                管理员
                              </>
                            ) : (
                              <>
                                <X className="h-3 w-3 mr-1" />
                                普通用户
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleAdmin(user.email, user.isAdmin)}
                            disabled={actionLoading === user.email}
                            className={`px-3 py-1 rounded text-white text-xs font-medium disabled:opacity-50 ${
                              user.isAdmin
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                          >
                            {actionLoading === user.email ? '处理中...' : 
                             user.isAdmin ? '取消管理员' : '设为管理员'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
