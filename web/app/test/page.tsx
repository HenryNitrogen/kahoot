'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Database, Server, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  details?: any;
  timestamp?: string;
}

export default function TestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [serverUrl, setServerUrl] = useState('http://localhost:932');

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, {
      ...result,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // 测试服务器健康状态
  const testServerHealth = async () => {
    addTestResult({
      name: '服务器健康检查',
      status: 'loading',
      message: '正在检查服务器状态...'
    });

    try {
      const response = await fetch(`${serverUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        addTestResult({
          name: '服务器健康检查',
          status: 'success',
          message: '服务器运行正常',
          details: data
        });
        return true;
      } else {
        addTestResult({
          name: '服务器健康检查',
          status: 'error',
          message: `服务器响应错误: ${response.status} ${response.statusText}`,
          details: { status: response.status, statusText: response.statusText }
        });
        return false;
      }
    } catch (error) {
      addTestResult({
        name: '服务器健康检查',
        status: 'error',
        message: '无法连接到服务器',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      return false;
    }
  };

  // 测试数据库连接
  const testDatabaseConnection = async () => {
    addTestResult({
      name: '数据库连接测试',
      status: 'loading',
      message: '正在测试数据库连接...'
    });

    try {
      const response = await fetch(`${serverUrl}/api/test/database`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        addTestResult({
          name: '数据库连接测试',
          status: 'success',
          message: '数据库连接正常',
          details: data
        });
        return true;
      } else {
        addTestResult({
          name: '数据库连接测试',
          status: 'error',
          message: data.error || '数据库连接失败',
          details: data
        });
        return false;
      }
    } catch (error) {
      addTestResult({
        name: '数据库连接测试',
        status: 'error',
        message: '测试请求失败',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      return false;
    }
  };

  // 测试用户注册功能
  const testUserRegistration = async () => {
    addTestResult({
      name: '用户注册测试',
      status: 'loading',
      message: '正在测试用户注册...'
    });

    const testUser = {
      email: `test${Date.now()}@test.com`,
      password: 'testpassword123',
      name: 'Test User'
    };

    try {
      const response = await fetch(`${serverUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        addTestResult({
          name: '用户注册测试',
          status: 'success',
          message: '用户注册功能正常',
          details: { 
            userId: data.user?.id, 
            email: data.user?.email,
            hasToken: !!data.token 
          }
        });
        return data.token;
      } else {
        addTestResult({
          name: '用户注册测试',
          status: 'error',
          message: data.error || '用户注册失败',
          details: data
        });
        return null;
      }
    } catch (error) {
      addTestResult({
        name: '用户注册测试',
        status: 'error',
        message: '注册请求失败',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
      return null;
    }
  };

  // 测试AI接口
  const testAIInterface = async (token: string | null) => {
    if (!token) {
      addTestResult({
        name: 'AI接口测试',
        status: 'error',
        message: '跳过AI测试 - 需要有效的用户token'
      });
      return;
    }

    addTestResult({
      name: 'AI接口测试',
      status: 'loading',
      message: '正在测试AI接口...'
    });

    const testQuestion = {
      question: "What is the capital of France?",
      choices: ["London", "Berlin", "Paris", "Madrid"],
      answersAllowed: 1
    };

    try {
      const response = await fetch(`${serverUrl}/api/ai/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(testQuestion)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        addTestResult({
          name: 'AI接口测试',
          status: 'success',
          message: 'AI接口响应正常',
          details: { 
            answer: data.answer, 
            usage: data.usage 
          }
        });
      } else {
        addTestResult({
          name: 'AI接口测试',
          status: 'error',
          message: data.error || 'AI接口测试失败',
          details: data
        });
      }
    } catch (error) {
      addTestResult({
        name: 'AI接口测试',
        status: 'error',
        message: 'AI请求失败',
        details: { error: error instanceof Error ? error.message : String(error) }
      });
    }
  };

  // 运行所有测试
  const runAllTests = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    clearResults();

    addTestResult({
      name: '测试开始',
      status: 'warning',
      message: `开始测试服务器: ${serverUrl}`
    });

    // 1. 测试服务器健康状态
    const serverHealthy = await testServerHealth();
    
    if (serverHealthy) {
      // 2. 测试数据库连接
      await testDatabaseConnection();
      
      // 3. 测试用户注册
      const token = await testUserRegistration();
      
      // 4. 测试AI接口
      await testAIInterface(token);
    }

    addTestResult({
      name: '测试完成',
      status: 'warning',
      message: '所有测试已完成'
    });

    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'loading':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'loading':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                Kahoot Helper
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-semibold text-gray-900">系统测试</h1>
            </div>
            <Link 
              href="/dashboard" 
              className="text-indigo-600 hover:text-indigo-500"
            >
              返回仪表板
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 配置区域 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">测试配置</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                服务器URL
              </label>
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="http://localhost:932"
              />
            </div>
            <div className="flex space-x-3 pt-7">
              <button
                onClick={runAllTests}
                disabled={isRunning}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Server className="w-4 h-4 mr-2" />
                )}
                {isRunning ? '测试中...' : '开始测试'}
              </button>
              <button
                onClick={clearResults}
                disabled={isRunning}
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                清空结果
              </button>
            </div>
          </div>
        </div>

        {/* 测试结果 */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">测试结果</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Database className="w-4 h-4 mr-1" />
              共 {testResults.length} 条记录
            </div>
          </div>

          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Server className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>点击"开始测试"来检查系统状态</p>
            </div>
          ) : (
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusBg(result.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium text-gray-900">
                          {result.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {result.message}
                        </div>
                        {result.details && (
                          <details className="mt-2">
                            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                              查看详情
                            </summary>
                            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                    {result.timestamp && (
                      <div className="text-xs text-gray-400">
                        {result.timestamp}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 说明信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">测试说明</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>服务器健康检查</strong>：测试后端服务是否正常运行</li>
            <li>• <strong>数据库连接测试</strong>：验证数据库连接和表结构</li>
            <li>• <strong>用户注册测试</strong>：测试用户系统功能</li>
            <li>• <strong>AI接口测试</strong>：验证AI问答功能</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
