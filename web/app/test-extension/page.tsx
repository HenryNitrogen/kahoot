'use client';

import { useState, useEffect } from 'react';

export default function TestExtension() {
  const [extensionStatus, setExtensionStatus] = useState('checking');
  const [serverStatus, setServerStatus] = useState('checking');
  const [authResult, setAuthResult] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [storageResult, setStorageResult] = useState('');

  // 检查服务端连接
  const testServerConnection = async () => {
    setServerStatus('checking');
    try {
      const response = await fetch('/api/auth/me');
      if (response.status === 401) {
        setServerStatus('success');
      } else if (response.ok) {
        setServerStatus('success');
      } else {
        setServerStatus('error');
      }
    } catch (error) {
      setServerStatus('error');
    }
  };

  // 测试认证API
  const testAuth = async () => {
    setAuthResult('测试认证API...\n');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '', password: '' })
      });
      
      const data = await response.json();
      let result = `登录API状态: ${response.status}\n`;
      result += `响应: ${JSON.stringify(data, null, 2)}\n`;
      
      if (response.status === 400 && data.error) {
        result += '✅ 认证API工作正常\n';
      } else {
        result += '⚠️ 认证API响应异常\n';
      }
      setAuthResult(result);
    } catch (error) {
      setAuthResult(`❌ 认证API测试失败: ${error}\n`);
    }
  };

  // 测试AI API
  const testAI = async () => {
    setAiResult('测试AI API...\n');
    try {
      const response = await fetch('/api/ai/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: '测试题目',
          choices: ['选项1', '选项2'],
          answersAllowed: 1
        })
      });
      
      const data = await response.json();
      let result = `AI API状态: ${response.status}\n`;
      result += `响应: ${JSON.stringify(data, null, 2)}\n`;
      
      if (response.status === 401) {
        result += '✅ AI API工作正常 (需要认证)\n';
      } else if (response.ok) {
        result += '✅ AI API工作正常\n';
      } else {
        result += '⚠️ AI API响应异常\n';
      }
      setAiResult(result);
    } catch (error) {
      setAiResult(`❌ AI API测试失败: ${error}\n`);
    }
  };

  // 测试本地存储
  const testStorage = () => {
    try {
      const testKey = 'kahoot_ai_test';
      const testValue = 'test_data_' + Date.now();
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      
      let result = `本地存储测试:\n`;
      result += `存储值: ${testValue}\n`;
      result += `检索值: ${retrieved}\n`;
      
      if (retrieved === testValue) {
        result += '✅ 本地存储工作正常\n';
      } else {
        result += '❌ 本地存储异常\n';
      }
      setStorageResult(result);
    } catch (error) {
      setStorageResult(`❌ 本地存储测试失败: ${error}\n`);
    }
  };

  useEffect(() => {
    // 检查扩展状态
    if (typeof window !== 'undefined') {
      if ((window as any).chrome && (window as any).chrome.runtime) {
        setExtensionStatus('success');
      } else {
        setExtensionStatus('error');
      }
    }
    
    testServerConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">🤖 Kahoot AI助手 - 扩展测试</h1>
        
        {/* 安装状态检查 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">🔧 安装状态检查</h2>
          <div className={`p-4 rounded-lg mb-4 ${
            extensionStatus === 'success' ? 'bg-green-600' :
            extensionStatus === 'error' ? 'bg-red-600' : 'bg-yellow-600'
          }`}>
            {extensionStatus === 'success' && '✅ Chrome扩展API可用'}
            {extensionStatus === 'error' && '❌ Chrome扩展API不可用 - 请确保在Chrome中打开此页面'}
            {extensionStatus === 'checking' && '⏳ 正在检查扩展状态...'}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">安装步骤：</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>打开Chrome浏览器</li>
            <li>在地址栏输入: <code className="bg-gray-700 px-2 py-1 rounded">chrome://extensions/</code></li>
            <li>开启"开发者模式"</li>
            <li>点击"加载已解压的扩展程序"</li>
            <li>选择路径: <code className="bg-gray-700 px-2 py-1 rounded text-sm">/Users/henrynitrogen/hi/projects/kahoot/web/public/extension</code></li>
          </ol>
        </div>

        {/* 服务端连接测试 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">📡 服务端连接测试</h2>
          <div className={`p-4 rounded-lg mb-4 ${
            serverStatus === 'success' ? 'bg-green-600' :
            serverStatus === 'error' ? 'bg-red-600' : 'bg-yellow-600'
          }`}>
            {serverStatus === 'success' && '✅ 服务端运行正常'}
            {serverStatus === 'error' && '❌ 无法连接到服务端'}
            {serverStatus === 'checking' && '⏳ 正在测试服务端连接...'}
          </div>
          <button 
            onClick={testServerConnection}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            重新测试连接
          </button>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">服务端信息：</h3>
          <div className="bg-gray-700 p-4 rounded-lg font-mono text-sm">
            URL: http://localhost:3000/api<br />
            状态: {serverStatus === 'success' ? '正常运行' : serverStatus === 'error' ? '连接失败' : '检测中...'}
          </div>
        </div>

        {/* 功能测试 */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">🧪 功能测试</h2>
          
          {/* 认证测试 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">1. 用户认证测试</h3>
            <button 
              onClick={testAuth}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg mb-3"
            >
              测试认证API
            </button>
            {authResult && (
              <pre className="bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                {authResult}
              </pre>
            )}
          </div>
          
          {/* AI测试 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">2. AI答题测试</h3>
            <button 
              onClick={testAI}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg mb-3"
            >
              测试AI API
            </button>
            {aiResult && (
              <pre className="bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                {aiResult}
              </pre>
            )}
          </div>
          
          {/* 存储测试 */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">3. 本地存储测试</h3>
            <button 
              onClick={testStorage}
              className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg mb-3"
            >
              测试本地存储
            </button>
            {storageResult && (
              <pre className="bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                {storageResult}
              </pre>
            )}
          </div>
        </div>

        {/* Kahoot测试 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">🎮 Kahoot测试</h2>
          <p className="mb-4">要测试完整功能，请：</p>
          <ol className="list-decimal list-inside space-y-2 text-gray-300 mb-6">
            <li>确保扩展已安装并启用</li>
            <li>访问 <a href="https://kahoot.it" target="_blank" className="text-blue-400 hover:underline">https://kahoot.it</a></li>
            <li>加入任何Kahoot游戏</li>
            <li>查看扩展是否在页面上显示UI</li>
          </ol>
          
          <div className="bg-yellow-600 p-4 rounded-lg">
            <strong>注意：</strong> 确保在Kahoot页面上看到两个窗口：
            <ul className="mt-2 space-y-1">
              <li>🤖 Kahoot AI助手 - 显示题目和AI答案</li>
              <li>🛠️ Kahoot助手设置 - 用户登录和显示设置</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
