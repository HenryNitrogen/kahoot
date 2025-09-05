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
import { useTranslations } from '@/lib/i18n';

export default function TutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const { translations, language, setLanguage, loading } = useTranslations();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const steps = [
    {
      id: 'download',
      title: translations.step1Title,
      icon: <Download className="h-6 w-6" />,
      content: {
        description: translations.step1Desc,
        details: [
          translations.step1Detail1,
          translations.step1Detail2,
          translations.step1Detail3
        ]
      }
    },
    {
      id: 'register',
      title: translations.step2Title,
      icon: <Users className="h-6 w-6" />,
      content: {
        description: translations.step2Desc,
        details: [
          translations.step2Detail1,
          translations.step2Detail2,
          translations.step2Detail3
        ]
      }
    },
    {
      id: 'join-game',
      title: translations.step3Title,
      icon: <Play className="h-6 w-6" />,
      content: {
        description: translations.step3Desc,
        details: [
          translations.step3Detail1,
          translations.step3Detail2,
          translations.step3Detail3
        ]
      }
    },
    {
      id: 'use-ai',
      title: translations.step4Title,
      icon: <Zap className="h-6 w-6" />,
      content: {
        description: translations.step4Desc,
        details: [
          translations.step4Detail1,
          translations.step4Detail2,
          translations.step4Detail3
        ]
      }
    },
    {
      id: 'settings',
      title: translations.step5Title,
      icon: <Settings className="h-6 w-6" />,
      content: {
        description: translations.step5Desc,
        details: [
          translations.step5Detail1,
          translations.step5Detail2,
          translations.step5Detail3
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
              <Link href="/download" className="text-gray-700 hover:text-indigo-600 transition-colors">
                {translations.downloadExtension}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 主标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {translations.tutorialTitle}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {translations.tutorialSubtitle}
          </p>
        </div>

        {/* 快速开始卡片 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">{translations.quickStartGuide}</h2>
              <p className="text-indigo-100 mb-6">
                {translations.quickStartDesc}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/download"
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>{translations.downloadNow}</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-300 transition-colors flex items-center space-x-2"
                >
                  <Users className="h-5 w-5" />
                  <span>{translations.createAccount}</span>
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
              <span>{translations.prevStep}</span>
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
              <span>{translations.nextStep}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 常见问题与解决方案 */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">{translations.commonIssues}</h3>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-red-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{translations.extensionNotLoading}</h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>{translations.extensionNotLoadingDesc}</strong></p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <AlertCircle className="h-6 w-6 text-yellow-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{translations.aiNotAppearing}</h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>{translations.aiNotAppearingDesc}</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-blue-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{translations.improveAccuracy}</h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>{translations.improveAccuracyDesc}</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <Settings className="h-6 w-6 text-green-500 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{translations.upgradeAccount}</h4>
                  <div className="text-gray-600 text-sm space-y-2">
                    <p><strong>{translations.upgradeAccountDesc}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">{translations.needHelp}</h4>
                <p className="text-blue-700 text-sm">
                  {translations.needHelpDesc}:
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
              <span>{translations.getStartedWithExtension}</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Trophy className="h-5 w-5" />
              <span>{translations.enterDashboard}</span>
            </Link>
          </div>
          
          <div className="mt-6 flex justify-center space-x-6 text-sm">
            <Link href="/" className="text-indigo-600 hover:text-indigo-700">
              {translations.returnHome}
            </Link>
            <Link href="/test-extension" className="text-indigo-600 hover:text-indigo-700">
              {translations.testExtension}
            </Link>
            <a href="mailto:support@henryni.cn" className="text-indigo-600 hover:text-indigo-700">
              {translations.contactSupport}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// 下载步骤详细内容
function DownloadStepContent() {
  const { translations, language } = useTranslations();
  
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'Detailed Installation Steps:' : '详细安装步骤：'}
      </h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Visit Download Page' : '访问下载页面'}
            </p>
            <p className="text-sm text-gray-600">
              <Link href="/download" className="text-indigo-600 hover:text-indigo-700 underline">
                {language === 'en' ? 'Click here to download extension file' : '点击这里下载扩展文件'}
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Open Chrome Extension Management' : '打开Chrome扩展管理'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Enter in browser address bar' : '在浏览器地址栏输入'}:
              <code className="bg-gray-200 px-2 py-1 rounded mx-1">chrome://extensions/</code>
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Enable Developer Mode' : '启用开发者模式'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Turn on "Developer mode" switch in the upper right corner' 
                : '在页面右上角开启"开发者模式"开关'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
            4
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Load Extension' : '加载扩展'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Use "Load unpacked extension"' 
                : '使用"加载已解压的扩展程序"'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 注册步骤详细内容
function RegisterStepContent() {
  const { translations, language } = useTranslations();
  
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'Account Registration Guide:' : '账户注册指南：'}
      </h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Create New Account' : '创建新账户'}
            </p>
            <p className="text-sm text-gray-600">
              <Link href="/register" className="text-indigo-600 hover:text-indigo-700 underline">
                {language === 'en' ? 'Click to register new account' : '点击注册新账户'}
              </Link>
              {language === 'en' ? ', fill in email, username and password' : '，填写邮箱、用户名和密码'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Free Trial' : '免费试用'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'New users can use for free, 10 AI query opportunities per day' : '新用户可免费使用，每天10次AI查询机会'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Trophy className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Upgrade Options' : '升级选项'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Choose advanced or professional version to get more features and query times' : '可选择高级或专业版，获得更多功能和查询次数'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 加入游戏步骤详细内容
function JoinGameStepContent() {
  const { translations, language } = useTranslations();
  
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'Join Kahoot Game:' : '加入Kahoot游戏：'}
      </h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Monitor className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Visit Kahoot Official Website' : '访问Kahoot官网'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Open browser and visit ' : '打开浏览器访问 '}
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
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Enter Game PIN' : '输入游戏PIN'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Get the game PIN from the host, enter it and click to join' : '从主持人那里获得游戏PIN码，输入并点击进入'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-purple-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Set Nickname' : '设置昵称'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'Enter your nickname and wait for the game to start' : '输入你的昵称，等待游戏开始'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 使用AI步骤详细内容
function UseAIStepContent() {
  const { translations, language } = useTranslations();
  
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'AI Assistant Usage:' : 'AI助手使用方法：'}
      </h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Automatic Activation' : '自动激活'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'When questions appear, the AI assistant will automatically display in the upper right corner of the page' 
                : '当题目出现时，AI助手会自动在页面右上角显示'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'View Recommended Answers' : '查看推荐答案'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'AI will analyze questions and recommend the most likely answers with confidence scores' 
                : 'AI会分析题目并推荐最可能的答案，带有置信度评分'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Trophy className="h-5 w-5 text-indigo-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Choose Answers' : '选择答案'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Based on AI recommendations and confidence levels, choose the answer you think is most correct' 
                : '根据AI推荐和置信度，选择你认为最正确的答案'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 设置步骤详细内容
function SettingsStepContent() {
  const { translations, language } = useTranslations();
  
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h4 className="font-semibold text-gray-900 mb-4">
        {language === 'en' ? 'Personalized Settings:' : '个性化设置：'}
      </h4>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Settings className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Assistant Panel Position' : '助手面板位置'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'You can drag and move the AI assistant panel to any position' 
                : '可以拖拽移动AI助手面板到任何位置'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Monitor className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Display Preferences' : '显示偏好'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' 
                ? 'Adjust display settings and notification preferences in the extension popup' 
                : '在扩展弹窗中调整显示设置和通知偏好'}
            </p>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <Users className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-gray-900">
              {language === 'en' ? 'Account Management' : '账户管理'}
            </p>
            <p className="text-sm text-gray-600">
              {language === 'en' ? 'View usage and manage subscriptions in the ' : '在'}
              <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-700 underline mx-1">
                {language === 'en' ? 'dashboard' : '控制面板'}
              </Link>
              {language === 'en' ? '' : '中查看使用情况和管理订阅'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
