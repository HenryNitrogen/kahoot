// Chrome扩展认证管理器
class AuthManager {
    constructor() {
        this.serverUrl = 'http://localhost:932';
        this.token = null;
        this.user = null;
        this.subscription = null;
    }

    // 初始化认证状态
    async init() {
        try {
            const stored = await this.getStoredAuth();
            if (stored.token) {
                this.token = stored.token;
                const isValid = await this.validateToken();
                if (isValid) {
                    await this.loadUserInfo();
                    return true;
                }
            }
        } catch (error) {
            console.error('Auth init error:', error);
        }
        return false;
    }

    // 获取存储的认证信息
    async getStoredAuth() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['authToken', 'user'], (result) => {
                resolve({
                    token: result.authToken,
                    user: result.user
                });
            });
        });
    }

    // 保存认证信息
    async saveAuth(token, user) {
        return new Promise((resolve) => {
            chrome.storage.local.set({
                authToken: token,
                user: user
            }, () => {
                this.token = token;
                this.user = user;
                resolve();
            });
        });
    }

    // 清除认证信息
    async clearAuth() {
        return new Promise((resolve) => {
            chrome.storage.local.remove(['authToken', 'user'], () => {
                this.token = null;
                this.user = null;
                this.subscription = null;
                resolve();
            });
        });
    }

    // 验证token有效性
    async validateToken() {
        if (!this.token) return false;

        try {
            const response = await fetch(`${this.serverUrl}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            return response.ok;
        } catch (error) {
            console.error('Token validation error:', error);
            return false;
        }
    }

    // 加载用户信息
    async loadUserInfo() {
        if (!this.token) return null;

        try {
            const response = await fetch(`${this.serverUrl}/api/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                this.user = userData;
                this.subscription = userData.subscription;
                return userData;
            }
        } catch (error) {
            console.error('Load user info error:', error);
        }
        return null;
    }

    // 登录
    async login(email, password) {
        try {
            const response = await fetch(`${this.serverUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                await this.saveAuth(data.token, data.user);
                await this.loadUserInfo();
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // 注册
    async register(email, name, password) {
        try {
            const response = await fetch(`${this.serverUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name, password })
            });

            const data = await response.json();

            if (response.ok) {
                await this.saveAuth(data.token, data.user);
                await this.loadUserInfo();
                return { success: true, user: data.user };
            } else {
                return { success: false, error: data.error };
            }
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // 登出
    async logout() {
        await this.clearAuth();
        return { success: true };
    }

    // 检查订阅状态
    checkSubscription() {
        if (!this.subscription) return { valid: false, plan: 'free' };

        const now = new Date();
        const expiresAt = this.subscription.expiresAt ? new Date(this.subscription.expiresAt) : null;

        if (this.subscription.status === 'active' && (!expiresAt || now < expiresAt)) {
            return {
                valid: true,
                plan: this.subscription.plan,
                expiresAt: expiresAt
            };
        }

        return {
            valid: false,
            plan: this.subscription.plan || 'free',
            expired: true
        };
    }

    // 检查使用限制
    getUsageLimit() {
        const subscriptionStatus = this.checkSubscription();

        switch (subscriptionStatus.plan) {
            case 'pro':
                return 1000;
            case 'premium':
                return 100;
            default:
                return 10;
        }
    }

    // 是否已认证
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // 是否有有效订阅
    hasValidSubscription() {
        return this.checkSubscription().valid;
    }
}

// 导出给content script使用
if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;
}