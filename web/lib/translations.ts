export type Language = 'en' | 'zh';

export const translations = {
  en: {
    // Common
    appName: 'KQH - Kahoot Quiz Helper',
    appDescription: 'The ultimate quiz companion for Kahoot! Boost your performance with intelligent answer suggestions.',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    back: 'Back',
    next: 'Next',
    
    // Navigation
    dashboard: 'Dashboard',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    extension: 'Extension',
    tutorial: 'Tutorial',
    download: 'Download',
    admin: 'Admin',
    
    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Name',
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to your KQH account',
    registerTitle: 'Join KQH',
    registerSubtitle: 'Create your account and start boosting your quiz performance',
    forgotPassword: 'Forgot Password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    signUp: 'Sign Up',
    signIn: 'Sign In',
    
    // Plans
    freePlan: 'Free',
    premiumPlan: 'Premium',
    proPlan: 'Pro',
    freePlanDesc: '4 questions per day',
    premiumPlanDesc: '200 questions per month',
    proPlanDesc: '2000 questions per year',
    upgrade: 'Upgrade',
    currentPlan: 'Current Plan',
    
    // Usage
    usageToday: 'Today',
    usageThisMonth: 'This Month',
    usageTotal: 'Total',
    remainingQuestions: 'Remaining Questions',
    usageHistory: 'Usage History',
    
    // Features
    features: 'Features',
    intelligentAnswers: 'Intelligent Answer Suggestions',
    intelligentAnswersDesc: 'Get smart answer recommendations based on advanced analysis',
    realTimeAnalysis: 'Real-time Question Analysis',
    realTimeAnalysisDesc: 'Instant processing of questions and answer options',
    confidenceScoring: 'Confidence Scoring',
    confidenceScoringDesc: 'See how confident our system is about each suggestion',
    fastResponse: 'Lightning Fast Response',
    fastResponseDesc: 'Get answers in milliseconds, never miss a question',
    
    // Extension
    extensionTitle: 'Install KQH Extension',
    extensionDesc: 'Add the KQH extension to your browser and start improving your quiz performance',
    downloadExtension: 'Download Extension',
    installInstructions: 'Installation Instructions',
    
    // Error messages
    invalidCredentials: 'Invalid email or password',
    userExists: 'User already exists',
    userNotFound: 'User not found',
    unauthorized: 'Unauthorized access',
    usageLimitReached: 'Usage limit reached',
    serverError: 'Server error occurred',
    
    // Success messages
    loginSuccess: 'Successfully logged in',
    registerSuccess: 'Account created successfully',
    questionAnswered: 'Question answered successfully',
    
    // Admin
    adminPanel: 'Admin Panel',
    userManagement: 'User Management',
    generateCodes: 'Generate Redemption Codes',
    codeType: 'Code Type',
    codeQuantity: 'Quantity',
    generate: 'Generate',
    
    // Metadata
    metaTitle: 'KQH - Kahoot Quiz Helper | Boost Your Quiz Performance',
    metaDescription: 'The ultimate companion for Kahoot quizzes. Get intelligent answer suggestions, real-time analysis, and boost your performance with KQH.',
    metaKeywords: 'Kahoot, quiz, helper, assistant, education, learning, performance, answers',
  },
  zh: {
    // Common
    appName: 'KQH - Kahoot答题助手',
    appDescription: '终极Kahoot答题伴侣！通过智能答案建议提升您的答题表现。',
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    back: '返回',
    next: '下一步',
    
    // Navigation
    dashboard: '控制台',
    login: '登录',
    register: '注册',
    logout: '退出',
    extension: '扩展程序',
    tutorial: '教程',
    download: '下载',
    admin: '管理员',
    
    // Auth
    email: '邮箱',
    password: '密码',
    name: '姓名',
    loginTitle: '欢迎回来',
    loginSubtitle: '登录您的KQH账户',
    registerTitle: '加入KQH',
    registerSubtitle: '创建您的账户，开始提升答题表现',
    forgotPassword: '忘记密码？',
    noAccount: '还没有账户？',
    hasAccount: '已有账户？',
    signUp: '注册',
    signIn: '登录',
    
    // Plans
    freePlan: '免费版',
    premiumPlan: '高级版',
    proPlan: '专业版',
    freePlanDesc: '每日4次答题',
    premiumPlanDesc: '每月200次答题',
    proPlanDesc: '每年2000次答题',
    upgrade: '升级',
    currentPlan: '当前套餐',
    
    // Usage
    usageToday: '今日',
    usageThisMonth: '本月',
    usageTotal: '总计',
    remainingQuestions: '剩余次数',
    usageHistory: '使用历史',
    
    // Features
    features: '功能特色',
    intelligentAnswers: '智能答案建议',
    intelligentAnswersDesc: '基于先进分析获得智能答案推荐',
    realTimeAnalysis: '实时题目分析',
    realTimeAnalysisDesc: '即时处理题目和答案选项',
    confidenceScoring: '置信度评分',
    confidenceScoringDesc: '查看系统对每个建议的置信程度',
    fastResponse: '闪电般响应',
    fastResponseDesc: '毫秒级获得答案，绝不错过任何题目',
    
    // Extension
    extensionTitle: '安装KQH扩展',
    extensionDesc: '将KQH扩展添加到您的浏览器，开始提升答题表现',
    downloadExtension: '下载扩展',
    installInstructions: '安装说明',
    
    // Error messages
    invalidCredentials: '邮箱或密码错误',
    userExists: '用户已存在',
    userNotFound: '用户不存在',
    unauthorized: '未授权访问',
    usageLimitReached: '已达到使用限制',
    serverError: '服务器错误',
    
    // Success messages
    loginSuccess: '登录成功',
    registerSuccess: '账户创建成功',
    questionAnswered: '题目回答成功',
    
    // Admin
    adminPanel: '管理面板',
    userManagement: '用户管理',
    generateCodes: '生成兑换码',
    codeType: '代码类型',
    codeQuantity: '数量',
    generate: '生成',
    
    // Metadata
    metaTitle: 'KQH - Kahoot答题助手 | 提升您的答题表现',
    metaDescription: 'Kahoot终极答题伴侣。获得智能答案建议、实时分析，用KQH提升您的答题表现。',
    metaKeywords: 'Kahoot, 答题, 助手, 教育, 学习, 表现, 答案',
  }
};

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: Record<string, unknown> | string = translations[lang];
  
  for (const k of keys) {
    if (typeof value === 'object' && value !== null) {
      value = (value as Record<string, unknown>)[k] as Record<string, unknown> | string;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export async function detectLanguageByIP(): Promise<Language> {
  try {
    // 使用免费的IP地理位置API
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code || 'US';
      
      // 只有中国大陆和台湾显示中文，香港澳门等显示英文
      return (countryCode === 'CN' || countryCode === 'TW') ? 'zh' : 'en';
    }
  } catch (error) {
    console.warn('Failed to detect location:', error);
  }
  
  // 备用方案：使用浏览器语言
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en-US';
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  }
  
  return 'en';
}

export function detectLanguage(): Language {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'zh'].includes(savedLang)) {
      return savedLang;
    }
    
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('zh')) {
      return 'zh';
    }
  }
  
  return 'en';
}

export function setLanguage(lang: Language) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}
