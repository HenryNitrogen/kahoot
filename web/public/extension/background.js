// background.js - Chrome Extension Background Script (optional)
// This file handles extension lifecycle events and background tasks

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log('KQH - Kahoot Quiz Helper installed');

    if (details.reason === 'install') {
        // First time installation
        console.log('First time extension installation');

        // Set default configuration here
        chrome.storage.local.set({
            firstInstall: true,
            installDate: new Date().toISOString()
        });

        chrome.tabs.create({ url: 'https://kahoot.henryni.cn' });
    }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request);

    if (request.action === 'getApiUrl') {
        // Return API URL configuration
        sendResponse({
            apiUrl: 'https://kahoot.henryni.cn/api',
            webUrl: 'https://kahoot.henryni.cn'
        });
    }

    return true; // Keep message channel open
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // When tab is loaded and it's a Kahoot page
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes('kahoot.it')) {
        console.log('Kahoot page loaded');

        // Can perform initialization here
        // Such as checking user login status
    }
});

// Handle extension icon click (if not using popup)
chrome.action.onClicked.addListener((tab) => {
    // If no popup.html, handle click event here
    console.log('Extension icon clicked');
});

// Regular cleanup of expired data
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanup') {
        cleanupExpiredData();
    }
});

// Create periodic cleanup task
chrome.alarms.create('cleanup', {
    delayInMinutes: 60, // Start after 1 hour
    periodInMinutes: 24 * 60 // Execute every 24 hours
});

// Clean up expired data
async function cleanupExpiredData() {
    try {
        const data = await chrome.storage.local.get(null);
        const keysToRemove = [];

        for (const [key, value] of Object.entries(data)) {
            // Clean expired cache data
            if (key.startsWith('cache_') && value.expires && new Date() > new Date(value.expires)) {
                keysToRemove.push(key);
            }
        }

        if (keysToRemove.length > 0) {
            await chrome.storage.local.remove(keysToRemove);
            console.log(`Cleaned ${keysToRemove.length} expired cache items`);
        }
    } catch (error) {
        console.error('Failed to clean cache:', error);
    }
}