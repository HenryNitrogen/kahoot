// 检测设备类型的工具函数
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // 检测移动设备的用户代理字符串
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  // 检测屏幕尺寸
  const isSmallScreen = window.innerWidth <= 768;
  
  // 检测触摸设备
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  return mobileRegex.test(userAgent) || (isSmallScreen && isTouchDevice);
}

// 获取设备信息
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      screenWidth: 0,
      screenHeight: 0,
      userAgent: 'server'
    };
  }
  
  return {
    isMobile: isMobileDevice(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    userAgent: navigator.userAgent,
    platform: navigator.platform
  };
}

// 显示移动端不支持支付的提示
export function showMobilePaymentBlockedMessage() {
  if (typeof window === 'undefined') return;
  
  const message = `
抱歉，为了保证支付安全和最佳体验，
移动端暂不支持支付功能。

请使用电脑访问以完成支付。

如有疑问，请联系技术支持：
henryni710@gmail.com
  `.trim();
  
  alert(message);
}
