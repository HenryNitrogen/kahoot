// popup.js - Chrome扩展弹出窗口脚本
(function() {
    'use strict';

    // 配置信息
    const config = {
        apiUrl: 'http://localhost:3001/api', // 开发环境
        webUrl: 'http://localhost:3001', // Web页面URL
        // 生产环境配置：
        // apiUrl: 'https://your-domain.com/api',
        // webUrl: 'https://your-domain.com',
    };

    // DOM元素
    const elements = {
        statusIcon: document.getElementById('statusIcon'),
        statusText: document.getElementById('statusText'),
        usageInfo: document.getElementById('usageInfo'),
        loginForm: document.getElementById('loginForm'),
        registerForm: document.getElementById('registerForm'),
        loggedInActions: document.getElementById('loggedInActions'),

        // 登录表单
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        loginBtn: document.getElementById('loginBtn'),
        loginError: document.getElementById('loginError'),

        // 注册表单
        regName: document.getElementById('regName'),
        regEmail: document.getElementById('regEmail'),
        regPassword: document.getElementById('regPassword'),
        registerBtn: document.getElementById('registerBtn'),
        registerError: document.getElementById('registerError'),

        // 按钮
        showRegisterBtn: document.getElementById('showRegisterBtn'),
        showLoginBtn: document.getElementById('showLoginBtn'),
        logoutBtn: document.getElementById('logoutBtn'),

        // 链接
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

    // 初始化
    async function init() {
        await checkAuthStatus();
        bindEvents();
        setupLinks();
    }

    // 检查认证状态
    async function checkAuthStatus() {
        try {
            // 使用localStorage，与content.js保持一致
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
            console.error('检查认证状态失败:', error);
            showError(elements.loginError, '检查登录状态失败');
            showLoginForm();
        }
    }

    // 更新用户状态显示
    async function updateUserStatus() {
        if (!userAuth.isLoggedIn) {
            showLoginForm();
            return;
        }

        try {
            // 获取最新的用户信息和使用情况
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
                // 令牌无效，清除认证信息
                await clearAuth();
                showLoginForm();
            } else {
                throw new Error('获取用户信息失败');
            }
        } catch (error) {
            console.error('更新用户状态失败:', error);
            // 仍然显示已登录状态，但显示错误信息
            showLoggedInStatus(null, error.message);
        }
    }

    // 显示登录表单
    function showLoginForm() {
        elements.statusIcon.textContent = '🔒';
        elements.statusText.textContent = '未登录';
        elements.usageInfo.style.display = 'none';
        elements.loginForm.classList.add('active');
        elements.registerForm.classList.remove('active');
        elements.loggedInActions.style.display = 'none';
    }

    // 显示注册表单
    function showRegisterForm() {
        elements.loginForm.classList.remove('active');
        elements.registerForm.classList.add('active');
    }

    // 显示已登录状态
    function showLoggedInStatus(data, errorMsg = null) {
        elements.statusIcon.textContent = '✅';
        elements.loginForm.classList.remove('active');
        elements.registerForm.classList.remove('active');
        elements.loggedInActions.style.display = 'block';

        if (errorMsg) {
            elements.statusText.innerHTML = `
                已登录: ${userAuth.userInfo.email}<br>
                <span style="color: #ff6b6b; font-size: 12px;">错误: ${errorMsg}</span>
            `;
            elements.usageInfo.style.display = 'none';
            return;
        }

        if (data) {
            const plan = data.userPlan.toUpperCase();
            const planClass = `plan-${data.userPlan}`;

            elements.statusText.innerHTML = `
                已登录: ${userAuth.userInfo.email}<br>
                <span class="plan-badge ${planClass}">${plan}</span>
            `;

            // 显示使用情况 - 根据新的限制结构
            let usageHtml = '';
            if (data.userPlan === 'free') {
                const totalPercent = (data.usage.total / data.limits.total) * 100;
                usageHtml = `
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>累计使用</span>
                            <span>${data.usage.total}/${data.limits.total}</span>
                        </div>
                        <div class="usage-bar">
                            <div class="usage-fill" style="width: ${Math.min(totalPercent, 100)}%;"></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">
                            免费用户总计可用 ${data.limits.total} 次问题
                        </div>
                    </div>
                `;
            } else {
                const monthlyPercent = (data.usage.thisMonth / data.limits.monthly) * 100;
                const planName = data.userPlan === 'premium' ? 'Premium会员' : '年费会员';
                usageHtml = `
                    <div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span>本月使用</span>
                            <span>${data.usage.thisMonth}/${data.limits.monthly}</span>
                        </div>
                        <div class="usage-bar">
                            <div class="usage-fill" style="width: ${Math.min(monthlyPercent, 100)}%;"></div>
                        </div>
                        <div style="margin-top: 8px; font-size: 11px; opacity: 0.8;">
                            ${planName} - 每月可用 ${data.limits.monthly} 次问题<br>
                            累计使用: ${data.usage.total} 次
                        </div>
                    </div>
                `;
            }

            elements.usageInfo.innerHTML = usageHtml;
            elements.usageInfo.style.display = 'block';
        }
    }

    // 获取计划颜色
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

    // 登录
    async function login() {
        const email = elements.email.value.trim();
        const password = elements.password.value;

        if (!email || !password) {
            showError(elements.loginError, '请填写邮箱和密码');
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
                // 保存认证信息 - 使用localStorage与content.js保持一致
                localStorage.setItem('kahoot_smart_auth_token', data.token);
                localStorage.setItem('kahoot_smart_user_info', JSON.stringify(data.user));

                userAuth.token = data.token;
                userAuth.isLoggedIn = true;
                userAuth.userInfo = data.user;

                // 通知content script
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
                    console.log('无法发送消息到content script:', e);
                }

                await updateUserStatus();
            } else {
                showError(elements.loginError, data.error || '登录失败');
            }
        } catch (error) {
            console.error('登录失败:', error);
            showError(elements.loginError, '网络错误，请稍后重试');
        } finally {
            setLoading(elements.loginBtn, false);
        }
    }

    // 注册
    async function register() {
        const name = elements.regName.value.trim();
        const email = elements.regEmail.value.trim();
        const password = elements.regPassword.value;

        if (!name || !email || !password) {
            showError(elements.registerError, '请填写所有字段');
            return;
        }

        if (password.length < 6) {
            showError(elements.registerError, '密码至少需要6位');
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
                // 注册成功，自动登录 - 使用localStorage与content.js保持一致
                localStorage.setItem('kahoot_smart_auth_token', data.token);
                localStorage.setItem('kahoot_smart_user_info', JSON.stringify(data.user));

                userAuth.token = data.token;
                userAuth.isLoggedIn = true;
                userAuth.userInfo = data.user;

                // 通知content script
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
                    console.log('无法发送消息到content script:', e);
                }

                await updateUserStatus();
            } else {
                showError(elements.registerError, data.error || '注册失败');
            }
        } catch (error) {
            console.error('注册失败:', error);
            showError(elements.registerError, '网络错误，请稍后重试');
        } finally {
            setLoading(elements.registerBtn, false);
        }
    }

    // 退出登录
    async function logout() {
        await clearAuth();

        // 通知content script
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'logout' });
            }
        } catch (e) {
            console.log('无法发送消息到content script:', e);
        }

        showLoginForm();
    }

    // 清除认证信息
    async function clearAuth() {
        // 使用localStorage与content.js保持一致
        localStorage.removeItem('kahoot_smart_auth_token');
        localStorage.removeItem('kahoot_smart_user_info');
        userAuth.token = null;
        userAuth.isLoggedIn = false;
        userAuth.userInfo = null;
    }

    // 绑定事件
    function bindEvents() {
        elements.loginBtn.addEventListener('click', login);
        elements.registerBtn.addEventListener('click', register);
        elements.logoutBtn.addEventListener('click', logout);

        elements.showRegisterBtn.addEventListener('click', showRegisterForm);
        elements.showLoginBtn.addEventListener('click', showLoginForm);

        // 回车键登录
        elements.password.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') login();
        });

        elements.regPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') register();
        });
    }

    // 设置链接
    function setupLinks() {
        elements.upgradeLink.href = `${config.webUrl}/dashboard#upgrade`;
        elements.redeemLink.href = `${config.webUrl}/redeem`;
        elements.dashboardLink.href = `${config.webUrl}/dashboard`;
        elements.supportLink.href = `${config.webUrl}/support`;

        // 在新标签页中打开链接
        [elements.upgradeLink, elements.redeemLink, elements.dashboardLink, elements.supportLink]
        .forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                chrome.tabs.create({ url: link.href });
            });
        });
    }

    // 显示错误信息
    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    // 隐藏错误信息
    function hideError(element) {
        element.style.display = 'none';
    }

    // 设置加载状态
    function setLoading(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    // 页面加载完成后初始化
    document.addEventListener('DOMContentLoaded', init);

})();