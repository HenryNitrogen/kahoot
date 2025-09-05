// popup.js - Chrome Extension Popup Script
(function() {
    'use strict';

    // Configuration
    const config = {
        apiUrl: 'https://kahoot.henryni.cn/api', // Development environment
        webUrl: 'https://kahoot.henryni.cn', // Web page URL
        // Production environment config:
        // apiUrl: 'https://your-domain.com/api',
        // webUrl: 'https://your-domain.com',
    };

    // DOM elements
    const elements = {
        statusIcon: document.getElementById('statusIcon'),
        statusText: document.getElementById('statusText'),
        usageInfo: document.getElementById('usageInfo'),
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        loggedInActions: document.getElementById('loggedInActions'),

        // Login form
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        loginBtn: document.getElementById('loginBtn'),
        loginError: document.getElementById('loginError'),

        // Register form
        regName: document.getElementById('regName'),
        regEmail: document.getElementById('regEmail'),
        regPassword: document.getElementById('regPassword'),
        registerBtn: document.getElementById('registerBtn'),
        registerError: document.getElementById('registerError'),

        // Buttons
        showRegisterBtn: document.getElementById('showRegisterBtn'),
        showLoginBtn: document.getElementById('showLoginBtn'),
        logoutBtn: document.getElementById('logoutBtn'),

        // Links
        upgradeLink: document.getElementById('upgradeLink'),
        redeemLink: document.getElementById('redeemLink'),
        dashboardLink: document.getElementById('dashboardLink'),
        supportLink: document.getElementById('supportLink')
    };

    let userAuth = {
        token: null,
        isLoggedIn: false,
        userInfo: null
    };

    // Initialize
    async function init() {
        await checkAuthStatus();
        bindEvents();
        setupLinks();
    }

    // Check authentication status
    async function checkAuthStatus() {
        try {
            // Use localStorage, consistent with content.js
            const authToken = localStorage.getItem('kahoot_smart_auth_token');
            const userInfo = localStorage.getItem('kahoot_smart_user_info');

            if (authToken && userInfo) {
                userAuth.token = authToken;
                userAuth.isLoggedIn = true;
                userAuth.userInfo = JSON.parse(userInfo);
                await updateUserStatus();
            } else {
                showLoginForm();
            }
        } catch (error) {
            console.error('Failed to check auth status:', error);
            showError(elements.loginError, 'Failed to check login status');
            showLoginForm();
        }
    }

    // Update user status display
    async function updateUserStatus() {
        if (!userAuth.isLoggedIn) {
            showLoginForm();
            return;
        }

        try {
            // Get latest user information and usage
            const response = await fetch(`${config.apiUrl}/ai/answer`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${userAuth.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                showLoggedInStatus(data);
            } else if (response.status === 401) {
                // Token invalid, clear auth info
                await clearAuth();
                showLoginForm();
            } else {
                throw new Error('Failed to get user information');
            }
        } catch (error) {
            console.error('Failed to update user status:', error);
            // Still show logged in status, but display error message
            showLoggedInStatus(null, error.message);
        }
    }

    // Show login form
    function showLoginForm() {
        elements.statusIcon.textContent = '🔒';
        elements.statusText.textContent = 'Not logged in';
        elements.usageInfo.style.display = 'none';
        elements.loginForm.classList.add('active');
        elements.registerForm.classList.remove('active');
        elements.loggedInActions.style.display = 'none';
    }

    // Show register form
    function showRegisterForm() {
        elements.loginForm.classList.remove('active');
        elements.registerForm.classList.add('active');
    }

    // Show logged in status
    function showLoggedInStatus(data, errorMsg = null) {
        elements.statusIcon.textContent = '✅';
        elements.loginForm.classList.remove('active');
        elements.registerForm.classList.remove('active');
        elements.loggedInActions.style.display = 'block';

        if (errorMsg) {
            elements.statusText.innerHTML = `
                Logged in: ${userAuth.userInfo.email}<br>
                <span style="color: #ff6b6b; font-size: 12px;">Error: ${errorMsg}</span>
            `;
            elements.usageInfo.style.display = 'none';
            return;
        }

        if (data) {
            const plan = data.userPlan.toUpperCase();
            const planClass = `plan-${data.userPlan}`;

            elements.statusText.innerHTML = `
                Logged in: ${userAuth.userInfo.email}<br>
                <span class="plan-badge ${planClass}">${plan}</span>
            `;

            // Show usage - based on new limit structure
            let usageHtml = '';
            if (data.userPlan === 'free') {
                const totalPercent = (data.usage.total / data.limits.total) * 100;
                usageHtml = `
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>Total Usage</span>
                            <span>${data.usage.total}/${data.limits.total}</span>
                        </div>
                        <div class="usage-bar">
                            <div class="usage-fill" style="width: ${Math.min(totalPercent, 100)}%;"></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">
                            Free users can use ${data.limits.total} questions total
                        </div>
                    </div>
                `;
            } else {
                const monthlyPercent = (data.usage.thisMonth / data.limits.monthly) * 100;
                const planName = data.userPlan === 'premium' ? 'Premium Member' : 'Annual Member';
                usageHtml = `
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>This Month</span>
                            <span>${data.usage.thisMonth}/${data.limits.monthly}</span>
                        </div>
                        <div class="usage-bar">
                            <div class="usage-fill" style="width: ${Math.min(monthlyPercent, 100)}%;"></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">
                            ${planName} - ${data.limits.monthly} questions per month<br>
                            Total used: ${data.usage.total} times
                        </div>
                    </div>
                `;
            }

            elements.usageInfo.innerHTML = usageHtml;
            elements.usageInfo.style.display = 'block';
        }
    }

    // Get plan color
    function getPlanColor(plan) {
        switch (plan) {
            case 'pro':
                return '#FFD700';
            case 'premium':
                return '#9C27B0';
            default:
                return '#4CAF50';
        }
    }

    // Login
    async function login() {
        const email = elements.email.value.trim();
        const password = elements.password.value;

        if (!email || !password) {
            showError(elements.loginError, 'Please fill in email and password');
            return;
        }

        setLoading(elements.loginBtn, true);
        hideError(elements.loginError);

        try {
            const response = await fetch(`${config.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save auth info - use localStorage consistent with content.js
                localStorage.setItem('kahoot_smart_auth_token', data.token);
                localStorage.setItem('kahoot_smart_user_info', JSON.stringify(data.user));

                userAuth.token = data.token;
                userAuth.isLoggedIn = true;
                userAuth.userInfo = data.user;

                // Notify content script
                try {
                    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'login',
                            token: data.token,
                            userInfo: data.user
                        });
                    }
                } catch (e) {
                    console.log('Unable to send message to content script:', e);
                }

                await updateUserStatus();
            } else {
                showError(elements.loginError, data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login failed:', error);
            showError(elements.loginError, 'Network error, please try again later');
        } finally {
            setLoading(elements.loginBtn, false);
        }
    }

    // Register
    async function register() {
        const name = elements.regName.value.trim();
        const email = elements.regEmail.value.trim();
        const password = elements.regPassword.value;

        if (!name || !email || !password) {
            showError(elements.registerError, 'Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            showError(elements.registerError, 'Password must be at least 6 characters');
            return;
        }

        setLoading(elements.registerBtn, true);
        hideError(elements.registerError);

        try {
            const response = await fetch(`${config.apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful, auto login - use localStorage consistent with content.js
                localStorage.setItem('kahoot_smart_auth_token', data.token);
                localStorage.setItem('kahoot_smart_user_info', JSON.stringify(data.user));

                userAuth.token = data.token;
                userAuth.isLoggedIn = true;
                userAuth.userInfo = data.user;

                // Notify content script
                try {
                    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: 'login',
                            token: data.token,
                            userInfo: data.user
                        });
                    }
                } catch (e) {
                    console.log('Unable to send message to content script:', e);
                }

                await updateUserStatus();
            } else {
                showError(elements.registerError, data.error || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration failed:', error);
            showError(elements.registerError, 'Network error, please try again later');
        } finally {
            setLoading(elements.registerBtn, false);
        }
    }

    // Logout
    async function logout() {
        await clearAuth();

        // Notify content script
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'logout' });
            }
        } catch (e) {
            console.log('Unable to send message to content script:', e);
        }

        showLoginForm();
    }

    // Clear auth info
    async function clearAuth() {
        // Use localStorage consistent with content.js
        localStorage.removeItem('kahoot_smart_auth_token');
        localStorage.removeItem('kahoot_smart_user_info');
        userAuth.token = null;
        userAuth.isLoggedIn = false;
        userAuth.userInfo = null;
    }

    // Bind events
    function bindEvents() {
        elements.loginBtn.addEventListener('click', login);
        elements.registerBtn.addEventListener('click', register);
        elements.logoutBtn.addEventListener('click', logout);

        elements.showRegisterBtn.addEventListener('click', showRegisterForm);
        elements.showLoginBtn.addEventListener('click', showLoginForm);

        // Enter key login
        elements.password.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });

        elements.regPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') register();
        });
    }

    // Setup links
    function setupLinks() {
        elements.upgradeLink.href = `${config.webUrl}/dashboard#upgrade`;
        elements.redeemLink.href = `${config.webUrl}/redeem`;
        elements.dashboardLink.href = `${config.webUrl}/dashboard`;
        elements.supportLink.href = `${config.webUrl}/support`;

        // Open links in new tab
        [elements.upgradeLink, elements.redeemLink, elements.dashboardLink, elements.supportLink]
        .forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                chrome.tabs.create({ url: link.href });
            });
        });
    }

    // Show error message
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    // Hide error message
    function hideError(element) {
        element.style.display = 'none';
    }

    // Set loading state
    function setLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // Initialize after page load
    document.addEventListener('DOMContentLoaded', init);

})();