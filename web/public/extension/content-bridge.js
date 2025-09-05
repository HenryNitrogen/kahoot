// content-bridge.js - Bridge for communication between popup and main content script
// This script runs in ISOLATED world and can access Chrome APIs

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Bridge received message:', request);

    if (request.action === 'login' || request.action === 'logout') {
        // Forward message to main content script
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

// Listen for messages from main content script
window.addEventListener('message', (event) => {
    if (event.source !== window) return;

    if (event.data.type === 'TO_EXTENSION') {
        // Forward message to popup or background
        chrome.runtime.sendMessage(event.data);
    }
});

console.log('🌉 KQH Bridge script loaded');