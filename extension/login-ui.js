// 扩展登录界面管理器
class LoginUI {
    constructor(authManager) {
        this.authManager = authManager;
        this.isVisible = false;
        this.container = null;
    }

    // 创建登录界面
    createLoginModal() {
        const modalHTML = `
            <div id="kahoot-login-modal" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(20px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                animation: fadeIn 0.3s ease-out;
            ">
                <div style="
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 24px;
                    padding: 40px;
                    width: 420px;
                    max-width: 90vw;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);
                    position: relative;
                    color: white;
                    animation: slideUp 0.4s ease-out;
                ">
                    <!-- Close Button -->
                    <button id="kahoot-login-close" style="
                        position: absolute;
                        top: 20px;
                        right: 20px;
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: rgba(255, 255, 255, 0.8);
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        cursor: pointer;
                        font-size: 18px;
                        font-weight: 300;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    " onmouseover="
                        this.style.background='rgba(255, 255, 255, 0.2)';
                        this.style.transform='scale(1.1)';
                    " onmouseout="
                        this.style.background='rgba(255, 255, 255, 0.1)';
                        this.style.transform='scale(1)';
                    ">×</button>

                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="
                            width: 64px;
                            height: 64px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            border-radius: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 20px auto;
                            color: white;
                            font-size: 28px;
                            font-weight: bold;
                            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
                            position: relative;
                        ">
                            <div style="
                                position: absolute;
                                inset: 0;
                                background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
                                border-radius: 20px;
                                pointer-events: none;
                            "></div>
                            🎯
                        </div>
                        <h2 style="
                            margin: 0 0 8px 0; 
                            font-size: 28px; 
                            font-weight: 700;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                            letter-spacing: -0.5px;
                        ">Kahoot Helper</h2>
                        <p style="
                            margin: 0; 
                            color: rgba(255, 255, 255, 0.7); 
                            font-size: 16px;
                            font-weight: 500;
                        ">登录以使用AI助手功能</p>
                    </div>

                    <!-- Login Form -->
                    <form id="kahoot-login-form" style="margin-bottom: 24px;">
                        <div style="margin-bottom: 20px;">
                            <input type="email" id="kahoot-email" placeholder="邮箱地址" required style="
                                width: 100%;
                                padding: 16px 20px;
                                background: rgba(255, 255, 255, 0.1);
                                backdrop-filter: blur(10px);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                border-radius: 16px;
                                font-size: 16px;
                                color: white;
                                outline: none;
                                transition: all 0.3s ease;
                                box-sizing: border-box;
                                font-weight: 500;
                            " onfocus="
                                this.style.background='rgba(255, 255, 255, 0.15)';
                                this.style.borderColor='#667eea';
                                this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';
                            " onblur="
                                this.style.background='rgba(255, 255, 255, 0.1)';
                                this.style.borderColor='rgba(255, 255, 255, 0.2)';
                                this.style.boxShadow='none';
                            ">
                        </div>

                        <div style="margin-bottom: 28px;">
                            <input type="password" id="kahoot-password" placeholder="密码" required style="
                                width: 100%;
                                padding: 16px 20px;
                                background: rgba(255, 255, 255, 0.1);
                                backdrop-filter: blur(10px);
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                border-radius: 16px;
                                font-size: 16px;
                                color: white;
                                outline: none;
                                transition: all 0.3s ease;
                                box-sizing: border-box;
                                font-weight: 500;
                            " onfocus="
                                this.style.background='rgba(255, 255, 255, 0.15)';
                                this.style.borderColor='#667eea';
                                this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';
                            " onblur="
                                this.style.background='rgba(255, 255, 255, 0.1)';
                                this.style.borderColor='rgba(255, 255, 255, 0.2)';
                                this.style.boxShadow='none';
                            ">
                        </div>

                        <button type="submit" id="kahoot-login-btn" style="
                            width: 100%;
                            padding: 16px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 16px;
                            font-size: 16px;
                            font-weight: 700;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
                            position: relative;
                            overflow: hidden;
                            letter-spacing: 0.5px;
                        " onmouseover="
                            this.style.transform='translateY(-2px)'; 
                            this.style.boxShadow='0 12px 40px rgba(102, 126, 234, 0.5)';
                        " onmouseout="
                            this.style.transform='translateY(0)'; 
                            this.style.boxShadow='0 8px 32px rgba(102, 126, 234, 0.4)';
                        ">
                            <div style="
                                position: absolute;
                                inset: 0;
                                background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
                                border-radius: 16px;
                                pointer-events: none;
                            "></div>
                            <span style="position: relative;">立即登录</span>
                        </button>
                    </form>

                    <!-- Register Link -->
                    <div style="text-align: center; margin-bottom: 24px;">
                        <p style="margin: 0; color: rgba(255, 255, 255, 0.6); font-size: 14px; font-weight: 500;">
                            还没有账号？ 
                            <a href="https://kahoot.henryni.cn/register" target="_blank" id="kahoot-register-link" style="
                                color: #667eea; 
                                text-decoration: none; 
                                font-weight: 600;
                                transition: color 0.3s ease;
                            " onmouseover="this.style.color='#764ba2'" onmouseout="this.style.color='#667eea'">
                                前往注册 →
                            </a>
                        </p>
                    </div>

                    <!-- Error Message -->
                    <div id="kahoot-error-message" style="
                        display: none;
                        background: linear-gradient(135deg, rgba(255, 107, 107, 0.2) 0%, rgba(255, 107, 107, 0.1) 100%);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 107, 107, 0.3);
                        color: #ff6b6b;
                        padding: 16px;
                        border-radius: 12px;
                        margin-bottom: 20px;
                        text-align: center;
                        font-size: 14px;
                        font-weight: 500;
                    "></div>

                    <!-- Loading State -->
                    <div id="kahoot-loading" style="
                        display: none;
                        text-align: center;
                        padding: 32px 20px;
                        color: rgba(255, 255, 255, 0.8);
                    ">
                        <div style="
                            width: 32px;
                            height: 32px;
                            border: 3px solid rgba(255, 255, 255, 0.2);
                            border-top: 3px solid #667eea;
                            border-radius: 50%;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 16px auto;
                        "></div>
                        <div style="font-weight: 500; font-size: 16px;">正在处理中...</div>
                    </div>

                    <!-- Web Access Link -->
                    <div style="
                        margin-top: 24px; 
                        padding-top: 24px; 
                        border-top: 1px solid rgba(255, 255, 255, 0.1); 
                        text-align: center;
                    ">
                        <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 13px; font-weight: 500;">
                            访问 
                            <a href="https://kahoot.henryni.cn" target="_blank" style="
                                color: #667eea; 
                                text-decoration: none;
                                font-weight: 600;
                                transition: color 0.3s ease;
                            " onmouseover="this.style.color='#764ba2'" onmouseout="this.style.color='#667eea'">
                                Web控制台
                            </a> 
                            管理订阅和兑换码
                        </p>
                    </div>
                </div>
            </div>

            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                @keyframes slideUp {
                    0% { 
                        opacity: 0; 
                        transform: translateY(30px) scale(0.95); 
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                    }
                }
                #kahoot-email::placeholder,
                #kahoot-password::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 500;
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.container = document.getElementById('kahoot-login-modal');
        this.bindEvents();
    }

    // 绑定事件
    bindEvents() {
        // 关闭按钮
        document.getElementById('kahoot-login-close').onclick = () => {
            this.hide();
        };

        // 点击背景关闭
        this.container.onclick = (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        };

        // 切换到注册 - 直接跳转到外部网站
        document.getElementById('kahoot-register-link').onclick = (e) => {
            // 让浏览器处理链接跳转
            return true;
        };

        // 登录表单提交
        document.getElementById('kahoot-login-form').onsubmit = (e) => {
            e.preventDefault();
            this.handleLogin();
        };

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    // 显示加载状态
    showLoading() {
        document.getElementById('kahoot-loading').style.display = 'block';
        document.getElementById('kahoot-login-form').style.display = 'none';
    }

    // 隐藏加载状态
    hideLoading() {
        document.getElementById('kahoot-loading').style.display = 'none';
        document.getElementById('kahoot-login-form').style.display = 'block';
    }

    // 显示错误信息
    showError(message) {
        const errorEl = document.getElementById('kahoot-error-message');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }

    // 清除错误信息
    clearError() {
        document.getElementById('kahoot-error-message').style.display = 'none';
    }

    // 处理登录
    async handleLogin() {
        const email = document.getElementById('kahoot-email').value;
        const password = document.getElementById('kahoot-password').value;

        if (!email || !password) {
            this.showError('请填写邮箱和密码');
            return;
        }

        this.showLoading();
        this.clearError();

        const result = await this.authManager.login(email, password);

        if (result.success) {
            this.hide();
            // 通知主应用登录成功
            window.dispatchEvent(new CustomEvent('kahoot-auth-success', {
                detail: { user: result.user }
            }));
        } else {
            this.hideLoading();
            this.showError(result.error || '登录失败，请重试');
        }
    }

    // 显示登录界面
    show() {
        if (!this.container) {
            this.createLoginModal();
        }
        this.container.style.display = 'flex';
        this.isVisible = true;

        // 聚焦第一个输入框
        setTimeout(() => {
            document.getElementById('kahoot-email').focus();
        }, 100);
    }

    // 隐藏登录界面
    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        this.isVisible = false;
    }

    // 销毁登录界面
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        this.isVisible = false;
    }
}

// 导出给content script使用
if (typeof window !== 'undefined') {
    window.LoginUI = LoginUI;
}