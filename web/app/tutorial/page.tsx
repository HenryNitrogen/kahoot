'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Download, 
  Settings, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Monitor,
  Users,
  Trophy,
  BookOpen,
  ExternalLink
} from 'lucide-react';

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'download',
      title: '步骤1：下载并安装扩展',
      icon: <Download className="h-6 w-6" />,
      content: {
        description: '首先需要下载并安装Kahoot智能助手Chrome扩展',
        details: [
          '访问下载页面获取扩展文件',
          '安装到Chrome浏览器',
          '确认扩展已正确加载'
        ]
      }
    },
    {
      id: 'register',
      title: '步骤2：注册账户',
      icon: <Users className="h-6 w-6" />,
      content: {
        description: '创建账户以使用AI智能答题功能',
        details: [
          '注册新账户或登录现有账户',
          '验证邮箱地址',
          '选择合适的订阅计划'
        ]
      }
    },
    {
      id: 'join-game',
      title: '步骤3：加入Kahoot游戏',
      icon: <Play className="h-6 w-6" />,
      content: {
        description: '访问Kahoot.it并加入游戏房间',
        details: [
          '打开kahoot.it网站',
          '输入游戏PIN码',
          '输入昵称并加入游戏'
        ]
      }
    },
    {
      id: 'use-ai',
      title: '步骤4：使用AI助手',
      icon: <Zap className="h-6 w-6" />,
      content: {
        description: '在游戏中使用AI智能答题功能',
        details: [
          '等待题目出现',
          'AI将自动分析题目并推荐答案',
          '查看置信度评分选择最佳答案'
        ]
      }
    },
    {
      id: 'settings',
      title: '步骤5：自定义设置',
      icon: <Settings className="h-6 w-6" />,
      content: {
        description: '调整扩展设置以获得最佳体验',
        details: [
          '调整助手面板位置',
          '设置显示偏好',
          '管理通知设置'
        ]
      }
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
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
              <Link href="/download" className="text-gray-700 hover:text-indigo-600 transition-colors">
                下载扩展
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 主标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            使用教程
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            跟随这个详细的教程，学会如何使用Kahoot智能助手在游戏中获得AI驱动的答案推荐
          </p>
        </div>

        {/* 快速开始卡片 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">快速开始指南</h2>
              <p className="text-indigo-100 mb-6">
                只需5分钟，即可完成设置并开始使用AI助手
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/download"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>立即下载</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-300 transition-colors flex items-center space-x-2"
                >
                  <Users className="h-5 w-5" />
                  <span>创建账户</span>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <BookOpen className="h-16 w-16" />
              </div>
            </div>
          </div>
        </div>

        {/* 进度指示器 */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(index)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    index === currentStep
                      ? 'bg-indigo-600 text-white'
                      : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </button>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-1 mx-2 rounded ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 当前步骤内容 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              {steps[currentStep].icon}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {steps[currentStep].content.description}
              </p>
              
              {/* 步骤详情 */}
              <div className="space-y-4">
                {steps[currentStep].content.details.map((detail, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{detail}</span>
                  </div>
                ))}
              </div>

              {/* 详细内容 */}
              <div className="mt-8">
                {currentStep === 0 && <DownloadStepContent />}
                {currentStep === 1 && <RegisterStepContent />}
                {currentStep === 2 && <JoinGameStepContent />}
                {currentStep === 3 && <UseAIStepContent />}
                {currentStep === 4 && <SettingsStepContent />}
              </div>
            </div>
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between mt-8 pt-8 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>上一步</span>
            </button>
            
            <div className="text-center">
              <span className="text-sm text-gray-500">
                {currentStep + 1} / {steps.length}
              </span>
            </div>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span>下一步</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 常见问题与解决方案 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">常见问题与解决方案</h3>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">扩展无法加载或显示错误？</h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>解决方案：</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>确保已开启Chrome的&ldquo;开发者模式&rdquo;</li>
                      <li>检查扩展是否已启用（在扩展管理页面）</li>
                      <li>尝试重新加载扩展或重启浏览器</li>
                      <li>确认下载的是最新版本的扩展文件</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">AI助手没有出现？</h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>可能原因和解决方案：</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>确保已登录账户（点击扩展图标登录）</li>
                      <li>确认在kahoot.it页面上（只在游戏页面激活）</li>
                      <li>检查网络连接是否正常</li>
                      <li>尝试刷新页面重新进入游戏</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-blue-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">AI答案准确度如何提高？</h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>优化建议：</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>参考AI给出的置信度评分，选择高分答案</li>
                      <li>对于复杂题目，结合自己的判断</li>
                      <li>升级到高级账户获得更准确的AI模型</li>
                      <li>确保题目和选项完全加载后再看推荐</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <Settings className="h-6 w-6 text-green-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">如何升级账户或使用兑换码？</h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>升级方法：</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>访问<Link href="/dashboard" className="text-indigo-600 underline">控制面板</Link>进行账户升级</li>
                      <li>使用<Link href="/redeem" className="text-indigo-600 underline">兑换码页面</Link>输入兑换码</li>
                      <li>联系客服获得优惠码或技术支持</li>
                      <li>查看当前订阅状态和使用情况</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">还需要帮助？</h4>
                <p className="text-blue-700 text-sm">
                  如果以上解决方案都无法解决您的问题，请联系我们的技术支持：
                  <a href="mailto:support@henryni.cn" className="text-blue-600 underline ml-1">
                    support@henryni.cn
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/download"
              className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>下载扩展开始使用</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span>进入控制面板</span>
            </Link>
          </div>
          
          <div className="mt-6 flex justify-center space-x-6 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
              返回首页
            </Link>
            <Link href="/test-extension" className="text-indigo-600 hover:text-indigo-700">
              测试扩展
            </Link>
            <a href="mailto:support@henryni.cn" className="text-indigo-600 hover:text-indigo-700">
              联系支持
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 下载步骤详细内容
function DownloadStepContent() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">详细安装步骤：</h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <div>
            <p className="font-medium text-gray-900">访问下载页面</p>
            <p className="text-sm text-gray-600">
              <Link href="/download" className="text-indigo-600 hover:text-indigo-700 underline">
                点击这里下载扩展文件
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <div>
            <p className="font-medium text-gray-900">打开Chrome扩展管理</p>
            <p className="text-sm text-gray-600">
              在浏览器地址栏输入：
              <code className="bg-gray-200 px-2 py-1 rounded mx-1">chrome://extensions/</code>
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <div>
            <p className="font-medium text-gray-900">启用开发者模式</p>
            <p className="text-sm text-gray-600">在页面右上角开启&ldquo;开发者模式&rdquo;开关</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
            4
          </div>
          <div>
            <p className="font-medium text-gray-900">加载扩展</p>
            <p className="text-sm text-gray-600">使用&ldquo;加载已解压的扩展程序&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 注册步骤详细内容
function RegisterStepContent() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">账户注册指南：</h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">创建新账户</p>
            <p className="text-sm text-gray-600">
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 underline">
                点击注册新账户
              </Link>，填写邮箱、用户名和密码
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">免费试用</p>
            <p className="text-sm text-gray-600">新用户可免费使用，每天10次AI查询机会</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Trophy className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">升级选项</p>
            <p className="text-sm text-gray-600">可选择高级或专业版，获得更多功能和查询次数</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 加入游戏步骤详细内容
function JoinGameStepContent() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">加入Kahoot游戏：</h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Monitor className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">访问Kahoot官网</p>
            <p className="text-sm text-gray-600">
              打开浏览器访问 
              <a href="https://kahoot.it" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline mx-1">
                kahoot.it
                <ExternalLink className="h-3 w-3 inline ml-1" />
              </a>
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Play className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">输入游戏PIN</p>
            <p className="text-sm text-gray-600">从主持人那里获得游戏PIN码，输入并点击进入</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">设置昵称</p>
            <p className="text-sm text-gray-600">输入你的昵称，等待游戏开始</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 使用AI步骤详细内容
function UseAIStepContent() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">AI助手使用方法：</h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">自动激活</p>
            <p className="text-sm text-gray-600">当题目出现时，AI助手会自动在页面右上角显示</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">查看推荐答案</p>
            <p className="text-sm text-gray-600">AI会分析题目并推荐最可能的答案，带有置信度评分</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Trophy className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">选择答案</p>
            <p className="text-sm text-gray-600">根据AI推荐和置信度，选择你认为最正确的答案</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 设置步骤详细内容
function SettingsStepContent() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">个性化设置：</h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Settings className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">助手面板位置</p>
            <p className="text-sm text-gray-600">可以拖拽移动AI助手面板到任何位置</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Monitor className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">显示偏好</p>
            <p className="text-sm text-gray-600">在扩展弹窗中调整显示设置和通知偏好</p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">账户管理</p>
            <p className="text-sm text-gray-600">
              在
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 underline mx-1">
                控制面板
              </Link>
              中查看使用情况和管理订阅
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
