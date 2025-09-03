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
