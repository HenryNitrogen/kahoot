// 语言检测和国际化工具

export interface Translations {
  // Dashboard
  dashboard: string;
  welcome: string;
  redeemCenter: string;
  logout: string;
  
  // User Info
  userInfo: string;
  active: string;
  expired: string;
  trial: string;
  freeVersion: string;
  premiumVersion: string;
  proVersion: string;
  
  // Usage Stats
  usageStats: string;
  todayRequests: string;
  monthRequests: string;
  totalRequests: string;
  
  // Extensions
  downloadExtension: string;
  chromeExtension: string;
  chromeExtensionDesc: string;
  download: string;
  
  // Subscription
  subscriptionInfo: string;
  usingFreeVersion: string;
  upgradeToPremium: string;
  upgradeToProAnnual: string;
  upgradeToProYearly: string;
  expiresAt: string;
  manageSubscription: string;
  
  // Quick Actions
  quickActions: string;
  accountSettings: string;
  usageHistory: string;
  
  // System Status
  systemStatus: string;
  apiService: string;
  aiService: string;
  responseTime: string;
  normal: string;
  
  // Admin Panel
  adminPanel: string;
  statistics: string;
  totalUsers: string;
  totalCodes: string;
  usedCodes: string;
  totalRevenue: string;
  generateCodes: string;
  quantity: string;
  planType: string;
  validFor: string;
  days: string;
  generate: string;
  generatingCodes: string;
  codesGenerated: string;
  codeManagement: string;
  code: string;
  type: string;
  expiresOn: string;
  status: string;
  used: string;
  unused: string;
  loadMore: string;
  
  // Redeem Page
  redeemCode: string;
  enterRedeemCode: string;
  redeeming: string;
  redeem: string;
  redeemSuccess: string;
  redeemHistory: string;
  noRedeemHistory: string;
  redeemInstructions: string;
  startTime: string;
  endTime: string;
  remainingDays: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  confirm: string;
  back: string;
  next: string;
  previous: string;

  // Tutorial page
  tutorialTitle: string;
  tutorialSubtitle: string;
  quickStartGuide: string;
  quickStartDesc: string;
  downloadNow: string;
  createAccount: string;
  step1Title: string;
  step1Desc: string;
  step1Detail1: string;
  step1Detail2: string;
  step1Detail3: string;
  step2Title: string;
  step2Desc: string;
  step2Detail1: string;
  step2Detail2: string;
  step2Detail3: string;
  step3Title: string;
  step3Desc: string;
  step3Detail1: string;
  step3Detail2: string;
  step3Detail3: string;
  step4Title: string;
  step4Desc: string;
  step4Detail1: string;
  step4Detail2: string;
  step4Detail3: string;
  step5Title: string;
  step5Desc: string;
  step5Detail1: string;
  step5Detail2: string;
  step5Detail3: string;
  prevStep: string;
  nextStep: string;
  commonIssues: string;
  extensionNotLoading: string;
  extensionNotLoadingDesc: string;
  aiNotAppearing: string;
  aiNotAppearingDesc: string;
  improveAccuracy: string;
  improveAccuracyDesc: string;
  upgradeAccount: string;
  upgradeAccountDesc: string;
  needHelp: string;
  needHelpDesc: string;
  getStartedWithExtension: string;
  enterDashboard: string;
  returnHome: string;
  testExtension: string;
  login: string;
  register: string;
  contactSupport: string;
  
  // Auth pages
  createNewAccount: string;
  getStarted: string;
  fullName: string;
  enterFullName: string;
  emailAddress: string;
  enterEmail: string;
  password: string;
  enterPassword: string;
  confirmPassword: string;
  enterConfirmPassword: string;
  agreeToTerms: string;
  termsAndConditions: string;
  and: string;
  privacyPolicy: string;
  registering: string;
  signUp: string;
  alreadyHaveAccount: string;
  signInInstead: string;
  passwordMismatch: string;
  passwordTooShort: string;
  registrationFailed: string;
  networkError: string;
  
  // Redeem page specific
  redeemInstructionsTitle: string;
  redeemInstruction1: string;
  redeemInstruction2: string;
  redeemInstruction3: string;
  redeemInstruction4: string;
  
  // Download page specific
  downloadTitle: string;
  downloadSubtitle: string;
  totalDownloads: string;
  sourceDownloads: string;
  todayDownloads: string;
  sourceVersion: string;
  sourceVersionDesc: string;
  features: string;
  realtimeRecognition: string;
  aiRecommendations: string;
  draggableInterface: string;
  customDisplay: string;
  fullSourceCode: string;
  customizable: string;
  downloading: string;
  downloadComplete: string;
  downloadSourceCode: string;
  installationGuide: string;
  developerInstall: string;
  developerInstallDesc: string;
  downloadAndExtract: string;
  downloadAndExtractDesc: string;
  openExtensionsPage: string;
  openExtensionsPageDesc: string;
  enableDeveloperMode: string;
  enableDeveloperModeDesc: string;
  loadExtension: string;
  loadExtensionDesc: string;
  verifyInstall: string;
  verifyInstallDesc: string;
  afterInstall: string;
  afterInstallDesc: string;
  importantNotes: string;
  loginRequired: string;
  freeLimit: string;
  loadBeforeGame: string;
  troubleshooting: string;
  signUpNow: string;
  viewTutorial: string;
  
  // Login page specific
  welcomeBack: string;
  loginToAccount: string;
  forgotPassword: string;
  loggingIn: string;
  loginButton: string;
  loginFailed: string;
  noAccount: string;
}

const zhTranslations: Translations = {
  // Dashboard
  dashboard: '控制台',
  welcome: '欢迎',
  redeemCenter: '兑换中心',
  logout: '退出',
  
  // User Info
  userInfo: '用户信息',
  active: '活跃',
  expired: '已过期',
  trial: '试用中',
  freeVersion: '免费版',
  premiumVersion: '高级版',
  proVersion: '专业版',
  
  // Usage Stats
  usageStats: '使用统计',
  todayRequests: '今日请求',
  monthRequests: '本月请求',
  totalRequests: '总计请求',
  
  // Extensions
  downloadExtension: '下载扩展',
  chromeExtension: 'Chrome扩展',
  chromeExtensionDesc: '适用于Chrome浏览器的Kahoot助手扩展',
  download: '下载',
  
  // Subscription
  subscriptionInfo: '订阅信息',
  usingFreeVersion: '您正在使用免费版本',
  upgradeToPremium: '升级到高级版 ¥15/月',
  upgradeToProAnnual: '升级到专业版 ¥50/年',
  upgradeToProYearly: '升级到专业版 ¥50/年',
  expiresAt: '到期时间',
  manageSubscription: '管理订阅',
  
  // Quick Actions
  quickActions: '快速操作',
  accountSettings: '账户设置',
  usageHistory: '使用历史',
  
  // System Status
  systemStatus: '系统状态',
  apiService: 'API服务',
  aiService: 'AI服务',
  responseTime: '响应时间',
  normal: '正常',
  
  // Admin Panel
  adminPanel: '管理面板',
  statistics: '统计信息',
  totalUsers: '总用户数',
  totalCodes: '总兑换码',
  usedCodes: '已使用',
  totalRevenue: '总收入',
  generateCodes: '生成兑换码',
  quantity: '数量',
  planType: '套餐类型',
  validFor: '有效期',
  days: '天',
  generate: '生成',
  generatingCodes: '生成中...',
  codesGenerated: '个兑换码已生成',
  codeManagement: '兑换码管理',
  code: '兑换码',
  type: '类型',
  expiresOn: '过期时间',
  status: '状态',
  used: '已使用',
  unused: '未使用',
  loadMore: '加载更多',
  
  // Redeem Page
  redeemCode: '兑换码',
  enterRedeemCode: '请输入兑换码，例如：ABCD-1234-EFGH',
  redeeming: '兑换中...',
  redeem: '兑换',
  redeemSuccess: '兑换成功！',
  redeemHistory: '我的兑换记录',
  noRedeemHistory: '还没有兑换记录',
  redeemInstructions: '兑换说明',
  startTime: '开始时间',
  endTime: '结束时间',
  remainingDays: '剩余天数',
  
  // Common
  loading: '加载中...',
  error: '错误',
  success: '成功',
  cancel: '取消',
  confirm: '确认',
  back: '返回',
  next: '下一页',
  previous: '上一页',

  // Tutorial page
  tutorialTitle: '使用教程',
  tutorialSubtitle: '按照以下步骤快速开始使用Kahoot智能助手',
  quickStartGuide: '快速开始指南',
  quickStartDesc: '只需几分钟即可设置完成，开始享受AI辅助答题体验',
  downloadNow: '立即下载',
  createAccount: '创建账户',
  step1Title: '第一步：下载安装扩展',
  step1Desc: '首先下载并安装Kahoot智能助手Chrome扩展',
  step1Detail1: '访问下载页面获取扩展文件',
  step1Detail2: '安装到Chrome浏览器',
  step1Detail3: '确认扩展已正确加载',
  step2Title: '第二步：注册账户',
  step2Desc: '创建账户以使用AI智能答题功能',
  step2Detail1: '填写用户信息进行注册',
  step2Detail2: '验证邮箱地址',
  step2Detail3: '完成账户激活',
  step3Title: '第三步：加入Kahoot游戏',
  step3Desc: '访问Kahoot.it并加入游戏房间',
  step3Detail1: '打开Kahoot.it网站',
  step3Detail2: '输入游戏PIN码',
  step3Detail3: '输入昵称并加入游戏',
  step4Title: '第四步：使用AI助手',
  step4Desc: '在游戏中使用AI智能答题功能',
  step4Detail1: '等待题目出现',
  step4Detail2: '查看AI推荐答案',
  step4Detail3: '根据置信度选择答案',
  step5Title: '第五步：自定义设置',
  step5Desc: '调整扩展设置以获得最佳体验',
  step5Detail1: '打开扩展设置面板',
  step5Detail2: '调整显示偏好',
  step5Detail3: '保存配置设置',
  prevStep: '上一步',
  nextStep: '下一步',
  commonIssues: '常见问题与解决方案',
  extensionNotLoading: '扩展无法加载',
  extensionNotLoadingDesc: '检查浏览器是否启用了开发者模式，确保扩展正确安装',
  aiNotAppearing: 'AI助手未出现',
  aiNotAppearingDesc: '确保已登录账户，且当前页面为Kahoot游戏页面',
  improveAccuracy: '提高答题准确率',
  improveAccuracyDesc: '升级到高级版获得更强的AI模型和更高的答题准确率',
  upgradeAccount: '升级账户',
  upgradeAccountDesc: '升级到专业版享受无限制答题和优先技术支持',
  needHelp: '需要帮助？',
  needHelpDesc: '如果遇到问题，请联系我们的技术支持',
  getStartedWithExtension: '开始使用扩展',
  enterDashboard: '进入控制面板',
  returnHome: '返回首页',
  testExtension: '测试扩展',
  login: '登录',
  register: '注册',
  contactSupport: '联系支持',
  
  // Auth pages
  createNewAccount: '创建新账户',
  getStarted: '开始使用我们的智能助手',
  fullName: '全名',
  enterFullName: '请输入您的全名',
  emailAddress: '邮箱地址',
  enterEmail: '请输入邮箱地址',
  password: '密码',
  enterPassword: '请输入密码',
  confirmPassword: '确认密码',
  enterConfirmPassword: '请再次输入密码',
  agreeToTerms: '注册即表示您同意我们的',
  termsAndConditions: '服务条款',
  and: '和',
  privacyPolicy: '隐私政策',
  registering: '注册中...',
  signUp: '注册',
  alreadyHaveAccount: '已有账户？',
  signInInstead: '立即登录',
  passwordMismatch: '密码不匹配',
  passwordTooShort: '密码至少需要6个字符',
  registrationFailed: '注册失败',
  networkError: '网络错误，请稍后重试',
  
  // Redeem page specific
  redeemInstructionsTitle: '兑换说明',
  redeemInstruction1: '每个兑换码只能使用一次',
  redeemInstruction2: '兑换后立即生效，时长从兑换时开始计算',
  redeemInstruction3: '兑换码区分大小写，请准确输入',
  redeemInstruction4: '如有问题请联系客服支持',
  
  // Download page specific
  downloadTitle: '下载Kahoot智能助手',
  downloadSubtitle: '获取我们的Chrome扩展，享受AI辅助答题体验',
  totalDownloads: '总下载量',
  sourceDownloads: '源码下载',
  todayDownloads: '今日下载',
  sourceVersion: '源码版本',
  sourceVersionDesc: '适合开发者的未打包版本，可以自由修改和定制',
  features: '功能特色',
  realtimeRecognition: '实时题目识别',
  aiRecommendations: 'AI智能推荐',
  draggableInterface: '可拖拽界面',
  customDisplay: '自定义显示',
  fullSourceCode: '完整源代码',
  customizable: '完全可定制',
  downloading: '下载中',
  downloadComplete: '下载完成',
  downloadSourceCode: '下载源码包',
  installationGuide: '安装指南',
  developerInstall: '开发者安装',
  developerInstallDesc: '适合开发者和高级用户的安装方式',
  downloadAndExtract: '下载并解压ZIP文件',
  downloadAndExtractDesc: '下载扩展源码包并解压到本地文件夹',
  openExtensionsPage: '打开Chrome扩展管理页面',
  openExtensionsPageDesc: '在Chrome地址栏输入',
  enableDeveloperMode: '开启开发者模式',
  enableDeveloperModeDesc: '在扩展管理页面右上角开启"开发者模式"开关',
  loadExtension: '加载已解压的扩展程序',
  loadExtensionDesc: '点击"加载已解压的扩展程序"按钮，选择解压后的文件夹',
  verifyInstall: '验证安装是否成功',
  verifyInstallDesc: '确认扩展已出现在扩展列表中且状态为"已启用"',
  afterInstall: '安装完成后',
  afterInstallDesc: '扩展安装成功后，请注册账户并访问Kahoot.it开始使用',
  importantNotes: '重要提醒',
  loginRequired: '使用AI功能需要登录账户',
  freeLimit: '免费版本每日有使用次数限制',
  loadBeforeGame: '请在加入游戏前确保扩展已正确加载',
  troubleshooting: '如遇问题请查看教程或联系技术支持',
  signUpNow: '立即注册',
  viewTutorial: '查看教程',
  
  // Login page specific
  welcomeBack: '欢迎回来',
  loginToAccount: '登录您的账户以继续使用',
  forgotPassword: '忘记密码？',
  loggingIn: '登录中...',
  loginButton: '登录',
  loginFailed: '登录失败',
  noAccount: '还没有账户？',
};

const enTranslations: Translations = {
  // Dashboard
  dashboard: 'Dashboard',
  welcome: 'Welcome',
  redeemCenter: 'Redeem Center',
  logout: 'Logout',
  
  // User Info
  userInfo: 'User Info',
  active: 'Active',
  expired: 'Expired',
  trial: 'Trial',
  freeVersion: 'Free',
  premiumVersion: 'Premium',
  proVersion: 'Pro',
  
  // Usage Stats
  usageStats: 'Usage Statistics',
  todayRequests: 'Today',
  monthRequests: 'This Month',
  totalRequests: 'Total',
  
  // Extensions
  downloadExtension: 'Download Extension',
  chromeExtension: 'Chrome Extension',
  chromeExtensionDesc: 'Kahoot Assistant Extension for Chrome Browser',
  download: 'Download',
  
  // Subscription
  subscriptionInfo: 'Subscription',
  usingFreeVersion: 'You are using the free version',
  upgradeToPremium: 'Upgrade to Premium $2.1/month',
  upgradeToProAnnual: 'Upgrade to Pro $7/year',
  upgradeToProYearly: 'Upgrade to Pro $7/year',
  expiresAt: 'Expires',
  manageSubscription: 'Manage Subscription',
  
  // Quick Actions
  quickActions: 'Quick Actions',
  accountSettings: 'Account Settings',
  usageHistory: 'Usage History',
  
  // System Status
  systemStatus: 'System Status',
  apiService: 'API Service',
  aiService: 'AI Service',
  responseTime: 'Response Time',
  normal: 'Normal',
  
  // Admin Panel
  adminPanel: 'Admin Panel',
  statistics: 'Statistics',
  totalUsers: 'Total Users',
  totalCodes: 'Total Codes',
  usedCodes: 'Used Codes',
  totalRevenue: 'Total Revenue',
  generateCodes: 'Generate Codes',
  quantity: 'Quantity',
  planType: 'Plan Type',
  validFor: 'Valid For',
  days: 'days',
  generate: 'Generate',
  generatingCodes: 'Generating...',
  codesGenerated: 'codes generated',
  codeManagement: 'Code Management',
  code: 'Code',
  type: 'Type',
  expiresOn: 'Expires On',
  status: 'Status',
  used: 'Used',
  unused: 'Unused',
  loadMore: 'Load More',
  
  // Redeem Page
  redeemCode: 'Redeem Code',
  enterRedeemCode: 'Enter redeem code, e.g.: ABCD-1234-EFGH',
  redeeming: 'Redeeming...',
  redeem: 'Redeem',
  redeemSuccess: 'Redeemed Successfully!',
  redeemHistory: 'My Redemptions',
  noRedeemHistory: 'No redemption history',
  redeemInstructions: 'Instructions',
  startTime: 'Start Time',
  endTime: 'End Time',
  remainingDays: 'Remaining Days',
  
  // Common
  loading: 'Loading...',
  error: 'Error',
  success: 'Success',
  cancel: 'Cancel',
  confirm: 'Confirm',
  back: 'Back',
  next: 'Next',
  previous: 'Previous',

  // Tutorial page
  tutorialTitle: 'Tutorial',
  tutorialSubtitle: 'Follow these steps to quickly start using Kahoot Smart Assistant',
  quickStartGuide: 'Quick Start Guide',
  quickStartDesc: 'Setup takes just a few minutes to start enjoying AI-assisted quiz experience',
  downloadNow: 'Download Now',
  createAccount: 'Create Account',
  step1Title: 'Step 1: Download and Install Extension',
  step1Desc: 'First download and install the Kahoot Smart Assistant Chrome extension',
  step1Detail1: 'Visit download page to get extension file',
  step1Detail2: 'Install to Chrome browser',
  step1Detail3: 'Confirm extension is properly loaded',
  step2Title: 'Step 2: Register Account',
  step2Desc: 'Create an account to use AI smart answering features',
  step2Detail1: 'Fill in user information for registration',
  step2Detail2: 'Verify email address',
  step2Detail3: 'Complete account activation',
  step3Title: 'Step 3: Join Kahoot Game',
  step3Desc: 'Visit Kahoot.it and join a game room',
  step3Detail1: 'Open Kahoot.it website',
  step3Detail2: 'Enter game PIN code',
  step3Detail3: 'Enter nickname and join game',
  step4Title: 'Step 4: Use AI Assistant',
  step4Desc: 'Use AI smart answering features during games',
  step4Detail1: 'Wait for questions to appear',
  step4Detail2: 'View AI recommended answers',
  step4Detail3: 'Choose answers based on confidence scores',
  step5Title: 'Step 5: Custom Settings',
  step5Desc: 'Adjust extension settings for the best experience',
  step5Detail1: 'Open extension settings panel',
  step5Detail2: 'Adjust display preferences',
  step5Detail3: 'Save configuration settings',
  prevStep: 'Previous Step',
  nextStep: 'Next Step',
  commonIssues: 'Common Issues & Solutions',
  extensionNotLoading: 'Extension Not Loading',
  extensionNotLoadingDesc: 'Check if developer mode is enabled in browser, ensure extension is properly installed',
  aiNotAppearing: 'AI Assistant Not Appearing',
  aiNotAppearingDesc: 'Make sure you are logged in and currently on a Kahoot game page',
  improveAccuracy: 'Improve Answer Accuracy',
  improveAccuracyDesc: 'Upgrade to premium for stronger AI models and higher accuracy rates',
  upgradeAccount: 'Upgrade Account',
  upgradeAccountDesc: 'Upgrade to professional version for unlimited answers and priority support',
  needHelp: 'Need Help?',
  needHelpDesc: 'If you encounter problems, please contact our technical support',
  getStartedWithExtension: 'Get Started with Extension',
  enterDashboard: 'Enter Dashboard',
  returnHome: 'Return Home',
  testExtension: 'Test Extension',
  login: 'Login',
  register: 'Register',
  contactSupport: 'Contact Support',
  
  // Auth pages
  createNewAccount: 'Create New Account',
  getStarted: 'Get started with our smart assistant',
  fullName: 'Full Name',
  enterFullName: 'Enter your full name',
  emailAddress: 'Email Address',
  enterEmail: 'Enter email address',
  password: 'Password',
  enterPassword: 'Enter password',
  confirmPassword: 'Confirm Password',
  enterConfirmPassword: 'Enter password again',
  agreeToTerms: 'By registering, you agree to our ',
  termsAndConditions: 'Terms and Conditions',
  and: ' and ',
  privacyPolicy: 'Privacy Policy',
  registering: 'Registering...',
  signUp: 'Sign Up',
  alreadyHaveAccount: 'Already have an account?',
  signInInstead: 'Sign in instead',
  passwordMismatch: 'Passwords do not match',
  passwordTooShort: 'Password must be at least 6 characters',
  registrationFailed: 'Registration failed',
  networkError: 'Network error, please try again later',
  
  // Redeem page specific
  redeemInstructionsTitle: 'Redemption Instructions',
  redeemInstruction1: 'Each redeem code can only be used once',
  redeemInstruction2: 'Takes effect immediately after redemption, duration starts from redemption time',
  redeemInstruction3: 'Redeem codes are case-sensitive, please enter accurately',
  redeemInstruction4: 'Contact customer support if you have any issues',
  
  // Download page specific
  downloadTitle: 'Download Kahoot Smart Assistant',
  downloadSubtitle: 'Get our Chrome extension and enjoy AI-assisted quiz experience',
  totalDownloads: 'Total Downloads',
  sourceDownloads: 'Source Downloads',
  todayDownloads: 'Today Downloads',
  sourceVersion: 'Source Version',
  sourceVersionDesc: 'Unpacked version for developers, freely modifiable and customizable',
  features: 'Features',
  realtimeRecognition: 'Real-time Question Recognition',
  aiRecommendations: 'AI Smart Recommendations',
  draggableInterface: 'Draggable Interface',
  customDisplay: 'Custom Display',
  fullSourceCode: 'Full Source Code',
  customizable: 'Fully Customizable',
  downloading: 'Downloading',
  downloadComplete: 'Download Complete',
  downloadSourceCode: 'Download Source Code',
  installationGuide: 'Installation Guide',
  developerInstall: 'Developer Installation',
  developerInstallDesc: 'Installation method for developers and advanced users',
  downloadAndExtract: 'Download and extract ZIP file',
  downloadAndExtractDesc: 'Download the extension source package and extract to local folder',
  openExtensionsPage: 'Open Chrome Extensions Management Page',
  openExtensionsPageDesc: 'Enter in Chrome address bar',
  enableDeveloperMode: 'Enable Developer Mode',
  enableDeveloperModeDesc: 'Turn on the "Developer mode" switch in the top right corner of the extensions page',
  loadExtension: 'Load Unpacked Extension',
  loadExtensionDesc: 'Click "Load unpacked" button and select the extracted folder',
  verifyInstall: 'Verify Installation Success',
  verifyInstallDesc: 'Confirm the extension appears in the extensions list and is "Enabled"',
  afterInstall: 'After Installation',
  afterInstallDesc: 'After successful installation, please register an account and visit Kahoot.it to start using',
  importantNotes: 'Important Notes',
  loginRequired: 'AI features require account login',
  freeLimit: 'Free version has daily usage limits',
  loadBeforeGame: 'Please ensure extension is properly loaded before joining games',
  troubleshooting: 'Check tutorial or contact support if you encounter issues',
  signUpNow: 'Sign Up Now',
  viewTutorial: 'View Tutorial',
  
  // Login page specific
  welcomeBack: 'Welcome Back',
  loginToAccount: 'Sign in to your account to continue',
  forgotPassword: 'Forgot password?',
  loggingIn: 'Signing in...',
  loginButton: 'Sign In',
  loginFailed: 'Login failed',
  noAccount: "Don't have an account?",
};

// 检测用户地理位置的API
export async function detectUserLocation(): Promise<string> {
  try {
    // 使用免费的IP地理位置API
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return data.country_code || 'US';
    }
  } catch (error) {
    console.warn('Failed to detect location:', error);
  }
  
  // 备用方案：使用浏览器语言
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
    return browserLang.startsWith('zh') ? 'CN' : 'US';
  }
  
  return 'US';
}

// 根据国家代码获取语言
export function getLanguageByCountry(countryCode: string): 'zh' | 'en' {
  return countryCode === 'CN' || countryCode === 'HK' || countryCode === 'TW' || countryCode === 'MO' ? 'zh' : 'en';
}

// 获取翻译文本
export function getTranslations(language: 'zh' | 'en'): Translations {
  return language === 'zh' ? zhTranslations : enTranslations;
}

// React Hook for translations
import { useState, useEffect } from 'react';

export function useTranslations() {
  const [language, setLanguage] = useState<'zh' | 'en'>('en');
  const [translations, setTranslations] = useState<Translations>(enTranslations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initLanguage() {
      try {
        const countryCode = await detectUserLocation();
        const detectedLanguage = getLanguageByCountry(countryCode);
        setLanguage(detectedLanguage);
        setTranslations(getTranslations(detectedLanguage));
      } catch (error) {
        console.warn('Language detection failed, using English');
        setLanguage('en');
        setTranslations(enTranslations);
      } finally {
        setLoading(false);
      }
    }

    initLanguage();
  }, []);

  return {
    language,
    translations,
    loading,
    setLanguage: (lang: 'zh' | 'en') => {
      setLanguage(lang);
      setTranslations(getTranslations(lang));
    }
  };
}
