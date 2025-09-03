(function() {
        'use strict';

        // 全局变量
        let quizData = {
            currentQuestion: '',
            currentChoices: [],
            imageUrl: '',
            imageMetadata: { id: '', contentType: '', width: 0, height: 0 },
            videoUrl: '',
            videoService: '',
            layout: '',
            questionIndex: 0,
            totalQuestions: 0,
            timeAvailable: 0,
            numberOfAnswersAllowed: 0,
            numberOfChoices: 0,
            pointsMultiplier: 1,
            getReadyTime: 0
        };

        let lastQuestion = '';
        let lastChoices = [];
        let currentAnswer = '等待AI回答...';

        // 认证和UI管理器
        let authManager = null;
        let loginUI = null;
        let isAuthenticated = false;
        let userInfo = null;
        let requestCount = 0;

        // 初始化函数
        async function init() {
            console.log('🚀 Kahoot Helper 初始化开始');

            // 等待页面加载完成
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    window.addEventListener('load', resolve);
                });
            }

            // 初始化认证管理器
            if (typeof AuthManager !== 'undefined') {
                authManager = new AuthManager();
                const authResult = await authManager.init();

                if (authResult) {
                    isAuthenticated = true;
                    userInfo = authManager.user;
                    console.log('✅ 用户已登录:', userInfo.name);
                }
            }

            // 初始化登录界面
            if (typeof LoginUI !== 'undefined') {
                loginUI = new LoginUI(authManager);
            }

            // 监听认证成功事件
            window.addEventListener('kahoot-auth-success', async(e) => {
                isAuthenticated = true;
                userInfo = e.detail.user;
                console.log('✅ 认证成功:', userInfo.name);

                // 更新UI状态
                updateAuthStatus();

                // 如果有待处理的问题，重新处理
                if (quizData.currentQuestion) {
                    await handleNewQuestion();
                }
            });

            // 创建主界面
            createMainInterface();

            // 开始监听Kahoot数据变化
            startQuizDataMonitoring();

            console.log('✅ Kahoot Helper 初始化完成');
        }

        // 创建主界面
        function createMainInterface() {
            const mainPanel = createDraggableElement('kahoot-main-panel', '20px', '20px');
            if (!mainPanel) return;

            updateMainPanel();
        }

        // 更新主面板内容
        function updateMainPanel() {
            const content = document.getElementById('kahoot-main-panelContent');
            if (!content) return;

            const subscriptionInfo = authManager ? authManager.checkSubscription() : { valid: false, plan: 'free' };
            const usageLimit = authManager ? authManager.getUsageLimit() : 10;

            content.innerHTML = `
            <!-- 认证状态区域 -->
            <div style="margin-bottom: 20px;">
                ${!isAuthenticated ? `
                    <div style="
                        background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 107, 107, 0.05) 100%);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(255, 107, 107, 0.2);
                        border-radius: 20px; 
                        padding: 20px; 
                        text-align: center;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                    ">
                        <div style="
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            margin-bottom: 12px;
                            font-size: 16px;
                            font-weight: 600;
                            color: #ff6b6b;
                        ">
                            <span style="margin-right: 8px;">�</span>
                            需要登录以使用AI功能
                        </div>
                        <button id="kahoot-login-btn" style="
                            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
                            color: white; 
                            border: none; 
                            padding: 12px 24px; 
                            border-radius: 25px; 
                            cursor: pointer;
                            font-weight: 600;
                            font-size: 14px;
                            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3);
                            transition: all 0.3s ease;
                            transform: translateY(0);
                        " onmouseover="
                            this.style.transform='translateY(-2px)'; 
                            this.style.boxShadow='0 8px 30px rgba(255, 107, 107, 0.4)'
                        " onmouseout="
                            this.style.transform='translateY(0)'; 
                            this.style.boxShadow='0 4px 20px rgba(255, 107, 107, 0.3)'
                        ">立即登录</button>
                    </div>
                ` : `
                    <div style="
                        background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%);
                        backdrop-filter: blur(20px);
                        border: 1px solid rgba(76, 175, 80, 0.2);
                        border-radius: 20px; 
                        padding: 20px;
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
                    ">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="
                                width: 40px; 
                                height: 40px; 
                                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                                border-radius: 50%; 
                                display: flex; 
                                align-items: center; 
                                justify-content: center;
                                margin-right: 12px;
                                box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
                            ">
                                <span style="font-size: 18px;">👤</span>
                            </div>
                            <div>
                                <div style="font-weight: 700; font-size: 16px; color: #4CAF50; margin-bottom: 2px;">
                                    ${userInfo.name}
                                </div>
                                <div style="font-size: 12px; color: rgba(255, 255, 255, 0.7);">
                                    ${subscriptionInfo.plan.toUpperCase()} 套餐 • 今日 ${requestCount}/${usageLimit} 次
                                    ${!subscriptionInfo.valid ? ' • 已过期' : ''}
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px; margin-top: 16px;">
                            <button id="kahoot-logout-btn" style="
                                background: rgba(255, 255, 255, 0.1); 
                                color: rgba(255, 255, 255, 0.8); 
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                padding: 8px 16px; 
                                border-radius: 12px; 
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                                transition: all 0.3s ease;
                                backdrop-filter: blur(10px);
                                flex: 1;
                            " onmouseover="
                                this.style.background='rgba(255, 255, 255, 0.2)';
                                this.style.transform='translateY(-1px)';
                            " onmouseout="
                                this.style.background='rgba(255, 255, 255, 0.1)';
                                this.style.transform='translateY(0)';
                            ">登出</button>
                            <button id="kahoot-web-console" style="
                                background: rgba(255, 255, 255, 0.1); 
                                color: rgba(255, 255, 255, 0.8); 
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                padding: 8px 16px; 
                                border-radius: 12px; 
                                cursor: pointer;
                                font-size: 12px;
                                font-weight: 500;
                                transition: all 0.3s ease;
                                backdrop-filter: blur(10px);
                                flex: 2;
                            " onmouseover="
                                this.style.background='rgba(255, 255, 255, 0.2)';
                                this.style.transform='translateY(-1px)';
                            " onmouseout="
                                this.style.background='rgba(255, 255, 255, 0.1)';
                                this.style.transform='translateY(0)';
                            ">Web 控制台</button>
                        </div>
                    </div>
                `}
            </div>

            <!-- 问题信息区域 -->
            <div style="
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 20px; 
                padding: 20px; 
                margin-bottom: 20px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            ">
                <div style="
                    display: flex; 
                    align-items: center; 
                    margin-bottom: 16px;
                    font-size: 16px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.9);
                ">
                    <span style="margin-right: 8px;">📋</span>
                    问题信息
                </div>
                <div style="
                    font-size: 14px; 
                    line-height: 1.6; 
                    color: rgba(255, 255, 255, 0.8);
                    background: rgba(255, 255, 255, 0.05);
                    padding: 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: ${quizData.currentChoices.length > 0 ? '16px' : '0'};
                ">
                    ${quizData.currentQuestion || '等待问题加载...'}
                </div>
                ${quizData.currentChoices.length > 0 ? `
                    <div style="
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        padding: 16px;
                    ">
                        <div style="
                            font-weight: 600; 
                            margin-bottom: 12px; 
                            color: rgba(255, 255, 255, 0.9);
                            font-size: 14px;
                        ">选项:</div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${quizData.currentChoices.map((choice, index) => `
                                <div style="
                                    background: rgba(255, 255, 255, 0.08);
                                    border: 1px solid rgba(255, 255, 255, 0.1);
                                    border-radius: 8px;
                                    padding: 10px 12px;
                                    font-size: 13px;
                                    color: rgba(255, 255, 255, 0.8);
                                    display: flex;
                                    align-items: center;
                                ">
                                    <span style="
                                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                        color: white;
                                        width: 20px;
                                        height: 20px;
                                        border-radius: 50%;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-size: 11px;
                                        font-weight: 600;
                                        margin-right: 10px;
                                        flex-shrink: 0;
                                    ">${String.fromCharCode(65 + index)}</span>
                                    <span>${choice}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>

            <!-- AI回答区域 -->
            <div style="
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(102, 126, 234, 0.2);
                border-radius: 20px; 
                padding: 20px; 
                margin-bottom: 20px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            ">
                <div style="
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 16px;
                ">
                    <div style="
                        display: flex; 
                        align-items: center;
                        font-size: 16px;
                        font-weight: 600;
                        color: rgba(255, 255, 255, 0.9);
                    ">
                        <span style="margin-right: 8px;">🤖</span>
                        AI 助手
                    </div>
                    <button id="kahoot-ask-ai" ${!isAuthenticated || !subscriptionInfo.valid ? 'disabled' : ''} style="
                        background: ${!isAuthenticated || !subscriptionInfo.valid ? 
                            'rgba(255, 255, 255, 0.1)' : 
                            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        }; 
                        color: ${!isAuthenticated || !subscriptionInfo.valid ? 
                            'rgba(255, 255, 255, 0.4)' : 
                            'white'
                        }; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 20px; 
                        cursor: ${!isAuthenticated || !subscriptionInfo.valid ? 'not-allowed' : 'pointer'};
                        font-size: 12px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                        box-shadow: ${!isAuthenticated || !subscriptionInfo.valid ? 
                            'none' : 
                            '0 4px 15px rgba(102, 126, 234, 0.3)'
                        };
                        transform: translateY(0);
                    " onmouseover="${!isAuthenticated || !subscriptionInfo.valid ? '' : `
                        this.style.transform='translateY(-2px)';
                        this.style.boxShadow='0 8px 25px rgba(102, 126, 234, 0.4)';
                    `}" onmouseout="${!isAuthenticated || !subscriptionInfo.valid ? '' : `
                        this.style.transform='translateY(0)';
                        this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)';
                    `}">
                        ${!isAuthenticated ? '请先登录' : !subscriptionInfo.valid ? '订阅已过期' : '获取答案'}
                    </button>
                </div>
                <div id="ai-answer" style="
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 18px; 
                    border-radius: 16px; 
                    min-height: 60px;
                    font-size: 14px;
                    line-height: 1.6;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 500;
                ">${currentAnswer}</div>
            </div>

            <!-- 底部信息 -->
            <div style="
                text-align: center; 
                padding-top: 16px; 
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            ">
                <div style="
                    font-size: 12px; 
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 500;
                ">
                    Kahoot Helper v1.0 • 
                    <a href="https://kahoot.henryni.cn" target="_blank" style="
                        color: #667eea; 
                        text-decoration: none;
                        font-weight: 600;
                        transition: color 0.3s ease;
                    " onmouseover="this.style.color='#764ba2'" onmouseout="this.style.color='#667eea'">
                        Web 控制台
                    </a>
                </div>
            </div>
        `;

        // 绑定事件
        bindMainPanelEvents();
    }

    // 绑定主面板事件
    function bindMainPanelEvents() {
        // 登录按钮
        const loginBtn = document.getElementById('kahoot-login-btn');
        if (loginBtn) {
            loginBtn.onclick = () => {
                if (loginUI) {
                    loginUI.show();
                }
            };
        }

        // 登出按钮
        const logoutBtn = document.getElementById('kahoot-logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = async () => {
                if (authManager) {
                    await authManager.logout();
                    isAuthenticated = false;
                    userInfo = null;
                    currentAnswer = '请先登录以使用AI功能';
                    updateMainPanel();
                }
            };
        }

        // Web控制台按钮
        const webConsoleBtn = document.getElementById('kahoot-web-console');
        if (webConsoleBtn) {
            webConsoleBtn.onclick = () => {
                window.open('https://kahoot.henryni.cn', '_blank');
            };
        }

        // AI回答按钮
        const askAiBtn = document.getElementById('kahoot-ask-ai');
        if (askAiBtn && !askAiBtn.disabled) {
            askAiBtn.onclick = async () => {
                await getAIAnswer();
            };
        }
    }

    // 更新认证状态
    function updateAuthStatus() {
        updateMainPanel();
    }

    // 获取AI回答
    async function getAIAnswer() {
        if (!isAuthenticated || !authManager) {
            currentAnswer = '请先登录以使用AI功能';
            updateMainPanel();
            return;
        }

        const subscription = authManager.checkSubscription();
        if (!subscription.valid) {
            currentAnswer = '您的订阅已过期，请在Web控制台中续费或兑换激活码';
            updateMainPanel();
            return;
        }

        if (!quizData.currentQuestion) {
            currentAnswer = '没有检测到问题，请等待题目加载';
            updateMainPanel();
            return;
        }

        // 显示加载状态
        currentAnswer = '🤔 AI正在思考中...';
        updateMainPanel();

        try {
            const response = await fetch(`${authManager.serverUrl}/api/ai/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authManager.token}`
                },
                body: JSON.stringify({
                    question: quizData.currentQuestion,
                    choices: quizData.currentChoices,
                    model: 'gemini-2.0-flash'
                })
            });

            const data = await response.json();

            if (response.ok) {
                currentAnswer = `✅ ${data.answer}`;
                requestCount++;
                
                // 更新使用统计
                if (authManager.user) {
                    await authManager.loadUserInfo();
                }
            } else {
                if (response.status === 429) {
                    currentAnswer = `⚠️ ${data.error || '使用次数已达限制，请稍后再试'}`;
                } else if (response.status === 403) {
                    currentAnswer = `🔒 ${data.error || '订阅已过期，请续费'}`;
                } else {
                    currentAnswer = `❌ ${data.error || 'AI服务暂时不可用'}`;
                }
            }
        } catch (error) {
            console.error('AI请求错误:', error);
            currentAnswer = '❌ 网络错误，请检查连接';
        }

        updateMainPanel();
    }

    // 处理新问题
    async function handleNewQuestion() {
        console.log('🔄 检测到新问题:', quizData.currentQuestion);
        
        // 重置答案
        currentAnswer = '等待AI回答...';
        updateMainPanel();

        // 如果用户已登录且有有效订阅，自动获取答案
        if (isAuthenticated && authManager && authManager.checkSubscription().valid) {
            setTimeout(async () => {
                await getAIAnswer();
            }, 1000); // 延迟1秒自动获取答案
        } else {
            currentAnswer = isAuthenticated ? '订阅已过期，请续费' : '请先登录以使用AI功能';
            updateMainPanel();
        }
    }

    // 开始监听Quiz数据变化
    function startQuizDataMonitoring() {
        let observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    extractQuizData();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定期检查数据变化
        setInterval(extractQuizData, 2000);
    }

    // 提取Quiz数据
    function extractQuizData() {
        try {
            // 尝试从页面元素提取问题
            const questionElements = document.querySelectorAll('[data-functional-selector="question-title"], .question-title, [class*="question"], [class*="Question"]');
            let newQuestion = '';
            
            for (let elem of questionElements) {
                const text = elem.textContent?.trim();
                if (text && text.length > 10) {
                    newQuestion = text;
                    break;
                }
            }

            // 提取选项
            const choiceElements = document.querySelectorAll('[data-functional-selector="answer-option"], .answer-option, [class*="answer"], [class*="choice"], [class*="option"]');
            const newChoices = [];
            
            choiceElements.forEach(elem => {
                const text = elem.textContent?.trim();
                if (text && text.length > 0 && !newChoices.includes(text)) {
                    newChoices.push(text);
                }
            });

            // 检查是否有新的问题
            if (newQuestion && newQuestion !== lastQuestion && newQuestion !== quizData.currentQuestion) {
                quizData.currentQuestion = newQuestion;
                quizData.currentChoices = newChoices;
                lastQuestion = newQuestion;
                lastChoices = [...newChoices];
                
                handleNewQuestion();
            } else if (newChoices.length > 0 && JSON.stringify(newChoices) !== JSON.stringify(lastChoices)) {
                quizData.currentChoices = newChoices;
                lastChoices = [...newChoices];
                updateMainPanel();
            }

        } catch (error) {
            console.error('提取Quiz数据时出错:', error);
        }
    }

    // 创建可拖拽元素
    function createDraggableElement(id, initialTop, initialLeft, isMenu = false) {
        console.log(`创建可拖拽元素: ${id}`);

        if (!document.body) {
            console.error('无法创建元素: document.body为null');
            return null;
        }

        // 检查元素是否已存在
        if (document.getElementById(id)) {
            console.log(`元素 ${id} 已存在`);
            return document.getElementById(`${id}Content`);
        }

        let div = document.createElement('div');
        div.id = id;
        div.style.position = 'fixed';
        div.style.top = initialTop;
        div.style.left = initialLeft;
        div.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 100%)';
        div.style.backdropFilter = 'blur(40px)';
        div.style.webkitBackdropFilter = 'blur(40px)';
        div.style.color = 'white';
        div.style.padding = '0';
        div.style.borderRadius = '24px';
        div.style.zIndex = '999999';
        div.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        div.style.fontSize = '14px';
        div.style.width = '520px';
        div.style.minWidth = '520px';
        div.style.maxWidth = '640px';
        div.style.maxHeight = '85vh';
        div.style.overflow = 'hidden';
        div.style.userSelect = 'none';
        div.style.border = '1px solid rgba(255, 255, 255, 0.18)';
        div.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.5), 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
        div.style.transition = 'all 0.3s ease';

        let header = document.createElement('div');
        header.style.cursor = 'move';
        header.style.padding = '20px 24px 16px 24px';
        header.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.borderRadius = '24px 24px 0 0';
        header.style.fontWeight = '700';
        header.style.fontSize = '18px';
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'space-between';
        header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
        header.style.letterSpacing = '0.5px';
        
        let titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';
        
        let icon = document.createElement('div');
        icon.style.width = '32px';
        icon.style.height = '32px';
        icon.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        icon.style.borderRadius = '50%';
        icon.style.display = 'flex';
        icon.style.alignItems = 'center';
        icon.style.justifyContent = 'center';
        icon.style.marginRight = '12px';
        icon.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        icon.innerHTML = '🎯';
        
        let title = document.createElement('span');
        title.textContent = 'Kahoot Helper';
        title.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        title.style.webkitBackgroundClip = 'text';
        title.style.webkitTextFillColor = 'transparent';
        title.style.backgroundClip = 'text';
        
        titleContainer.appendChild(icon);
        titleContainer.appendChild(title);

        let minimizeBtn = document.createElement('button');
        minimizeBtn.innerHTML = '−';
        minimizeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
        minimizeBtn.style.backdropFilter = 'blur(10px)';
        minimizeBtn.style.border = '1px solid rgba(255, 255, 255, 0.2)';
        minimizeBtn.style.color = 'rgba(255, 255, 255, 0.8)';
        minimizeBtn.style.cursor = 'pointer';
        minimizeBtn.style.padding = '6px 12px';
        minimizeBtn.style.borderRadius = '12px';
        minimizeBtn.style.fontSize = '16px';
        minimizeBtn.style.fontWeight = '600';
        minimizeBtn.style.transition = 'all 0.3s ease';
        minimizeBtn.style.width = '36px';
        minimizeBtn.style.height = '36px';
        minimizeBtn.style.display = 'flex';
        minimizeBtn.style.alignItems = 'center';
        minimizeBtn.style.justifyContent = 'center';
        
        minimizeBtn.onmouseover = function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.transform = 'scale(1.05)';
        };
        minimizeBtn.onmouseout = function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.transform = 'scale(1)';
        };

        header.appendChild(titleContainer);
        header.appendChild(minimizeBtn);
        div.appendChild(header);
        
        let content = document.createElement('div');
        content.id = `${id}Content`;
        content.style.padding = '24px';
        content.style.maxHeight = '65vh';
        content.style.overflow = 'auto';
        content.style.scrollbarWidth = 'thin';
        content.style.scrollbarColor = 'rgba(255, 255, 255, 0.3) transparent';
        
        // 自定义滚动条样式
        const style = document.createElement('style');
        style.textContent = `
            #${id}Content::-webkit-scrollbar {
                width: 6px;
            }
            #${id}Content::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 3px;
            }
            #${id}Content::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
            }
            #${id}Content::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        `;
        document.head.appendChild(style);
        
        div.appendChild(content);

        try {
            document.body.appendChild(div);
            console.log(`✅ 成功创建并添加 ${id}`);
        } catch (error) {
            console.error(`❌ 添加 ${id} 时出错:`, error);
            return null;
        }

        // 添加拖拽功能
        let isDragging = false;
        let currentX, currentY;

        header.addEventListener('mousedown', (e) => {
            if (e.target === minimizeBtn) return;
            isDragging = true;
            currentX = e.clientX - parseInt(div.style.left);
            currentY = e.clientY - parseInt(div.style.top);
            header.style.cursor = 'grabbing';
            div.style.transition = 'none';
            div.style.transform = 'scale(1.02)';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                div.style.left = (e.clientX - currentX) + 'px';
                div.style.top = (e.clientY - currentY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'move';
                div.style.transition = 'all 0.3s ease';
                div.style.transform = 'scale(1)';
            }
        });

        // 最小化功能
        let isMinimized = false;
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMinimized) {
                content.style.display = 'block';
                minimizeBtn.innerHTML = '−';
                div.style.height = 'auto';
                div.style.borderRadius = '24px';
            } else {
                content.style.display = 'none';
                minimizeBtn.innerHTML = '+';
                div.style.height = header.offsetHeight + 'px';
                div.style.borderRadius = '24px';
            }
            isMinimized = !isMinimized;
        });

        return content;
    }

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();