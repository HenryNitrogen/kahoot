// background.js - Chrome扩展后台脚本（可选）
// 这个文件用于处理扩展的生命周期事件和后台任务

// 扩展安装时
chrome.runtime.onInstalled.addListener((details) => {
    console.log('Kahoot AI助手已安装');

    if (details.reason === 'install') {
        // 首次安装
        console.log('首次安装扩展');

        // 可以在这里设置默认配置
        chrome.storage.local.set({
            firstInstall: true,
            installDate: new Date().toISOString()
        });

        // 可选：打开欢迎页面
        // chrome.tabs.create({ url: 'http://localhost:3001/welcome' });
    }
});

// 处理来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('收到消息:', request);

    if (request.action === 'getApiUrl') {
        // 返回API URL配置
        sendResponse({
            apiUrl: 'http://localhost:3001/api',
            webUrl: 'http://localhost:3001'
        });
    }

    return true; // 保持消息通道开放
});

// 监听标签页更新
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 当标签页加载完成且是Kahoot页面时
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('kahoot.it')) {
        console.log('Kahoot页面已加载');

        // 可以在这里执行一些初始化操作
        // 比如检查用户登录状态
    }
});

// 处理扩展图标点击（如果不使用popup）
chrome.action.onClicked.addListener((tab) => {
    // 如果没有popup.html，可以在这里处理点击事件
    console.log('扩展图标被点击');
});

// 定期清理过期数据
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanup') {
        cleanupExpiredData();
    }
});

// 创建定期清理任务
chrome.alarms.create('cleanup', {
    delayInMinutes: 60, // 1小时后开始
    periodInMinutes: 24 * 60 // 每24小时执行一次
});

// 清理过期数据
async function cleanupExpiredData() {
    try {
        const data = await chrome.storage.local.get(null);
        const keysToRemove = [];

        for (const [key, value] of Object.entries(data)) {
            // 清理过期的缓存数据
            if (key.startsWith('cache_') && value.expires && new Date() > new Date(value.expires)) {
                keysToRemove.push(key);
            }
        }

        if (keysToRemove.length > 0) {
            await chrome.storage.local.remove(keysToRemove);
            console.log(`清理了 ${keysToRemove.length} 个过期缓存项`);
        }
    } catch (error) {
        console.error('清理缓存失败:', error);
    }
}