// content-bridge.js - 用于桥接popup和主内容脚本的通信
// 这个脚本运行在ISOLATED世界中，可以访问Chrome API

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Bridge收到消息:', request);

    if (request.action === 'login' || request.action === 'logout') {
        // 将消息转发给主内容脚本
        window.postMessage({
            type: 'FROM_EXTENSION',
            action: request.action,
            token: request.token,
            userInfo: request.userInfo
        }, '*');

        sendResponse({ success: true });
    }

    return true;
});

// 监听来自主内容脚本的消息
window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'TO_EXTENSION') {
        // 将消息转发给popup或background
        chrome.runtime.sendMessage(event.data);
    }
});

console.log('🌉 Kahoot AI 桥接脚本已加载');