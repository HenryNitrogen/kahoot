// content.js - Chrome扩展内容脚本
(function() {
        'use strict';

        // 配置信息
        const config = {
            apiUrl: 'https://kahoot.henryni.cn/api', // 开发环境，生产环境需要修改

            version: '1.0.0'
        };

        // 用户状态
        let userAuth = {
            token: null,
            isLoggedIn: false,
            userPlan: 'free',
            usage: null
        };

        // Quiz数据
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
        let currentAnswer = '等待登录...';

        // 从本地存储中获取用户认证信息（使用localStorage代替chrome.storage）
        async function loadUserAuth() {
            try {
                const authToken = localStorage.getItem('kahoot_smart_auth_token');
                const userInfo = localStorage.getItem('kahoot_smart_user_info');

                if (authToken && userInfo) {
                    userAuth.token = authToken;
                    userAuth.isLoggedIn = true;
                    const parsedUserInfo = JSON.parse(userInfo);
                    userAuth.userPlan = parsedUserInfo.plan || 'free';
                    currentAnswer = '等待题目...';
                    console.log('用户已登录:', parsedUserInfo.email);
                } else {
                    currentAnswer = '请在扩展中登录使用智能功能';
                    console.log('用户未登录');
                }
            } catch (error) {
                console.error('加载用户认证失败:', error);
                currentAnswer = '认证加载失败';
            }
        }

        // 保存用户认证信息
        async function saveUserAuth(token, userInfo) {
            localStorage.setItem('kahoot_smart_auth_token', token);
            localStorage.setItem('kahoot_smart_user_info', JSON.stringify(userInfo));
            userAuth.token = token;
            userAuth.isLoggedIn = true;
            userAuth.userPlan = userInfo.plan || 'free';
            console.log('用户认证已保存');
        }

        // 清除用户认证信息
        async function clearUserAuth() {
            localStorage.removeItem('kahoot_smart_auth_token');
            localStorage.removeItem('kahoot_smart_user_info');
            userAuth.token = null;
            userAuth.isLoggedIn = false;
            userAuth.userPlan = 'free';
            currentAnswer = '请在扩展中登录使用智能功能';
            console.log('用户认证已清除');
        }

        // 获取用户使用情况
        async function getUserUsage() {
            if (!userAuth.token) return null;

            try {
                const response = await fetch(`${config.apiUrl}/ai/answer`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userAuth.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    userAuth.usage = data.usage;
                    userAuth.userPlan = data.userPlan;
                    return data;
                }
            } catch (error) {
                console.error('获取使用情况失败:', error);
            }
            return null;
        }

        // 调用智能服务获取答案
        async function getSmartAnswer(question, choices, answersAllowed) {
            if (!userAuth.token) {
                return '请在扩展弹窗中登录以使用智能功能';
            }

            try {
                const response = await fetch(`${config.apiUrl}/ai/answer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userAuth.token}`
                    },
                    body: JSON.stringify({
                        question,
                        choices,
                        answersAllowed
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        await clearUserAuth();
                        return '登录已过期，请重新登录';
                    } else if (response.status === 429) {
                        const planName = data.limits?.plan === 'free' ? '免费用户' :
                            data.limits?.plan === 'premium' ? 'Premium会员' : '年费会员';
                        return `使用次数已达上限！当前计划：${planName}，请升级会员或等待重置`;
                    } else {
                        return `错误：${data.error || '未知错误'}`;
                    }
                }

                // 更新用户信息
                userAuth.userPlan = data.userPlan;
                const planName = data.userPlan === 'free' ? '免费用户' :
                    data.userPlan === 'premium' ? 'Premium会员' : '年费会员';

                return `${data.answer}\n\n[${planName}] 置信度: ${Math.round((data.confidence || 0.85) * 100)}%`;
            } catch (error) {
                console.error('智能请求失败:', error);
                return `网络错误：${error.message}`;
            }
        }

        // 创建可拖拽的UI元素
        function createDraggableElement(id, initialTop, initialLeft, isMenu = false) {
            // 获取保存的缩放比例
            const savedScale = localStorage.getItem(`kahoot_smart_${id}_scale`) || '1';
            const scale = parseFloat(savedScale);

            let div = document.createElement('div');
            div.id = id;
            div.style.position = 'fixed';
            div.style.top = initialTop;
            div.style.left = initialLeft;
            div.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
            div.style.backdropFilter = 'blur(20px)';
            div.style.webkitBackdropFilter = 'blur(20px)';
            div.style.color = 'white';
            div.style.padding = '16px';
            div.style.borderRadius = '16px';
            div.style.zIndex = '10000';
            div.style.fontFamily = '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
            div.style.fontSize = '14px';
            div.style.maxWidth = '450px';
            div.style.maxHeight = '85vh';
            div.style.overflow = 'auto';
            div.style.userSelect = 'none';
            div.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            div.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            div.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            div.style.transform = `scale(${scale})`;
            div.style.transformOrigin = 'top left';

            let header = document.createElement('div');
            header.style.cursor = 'move';
            header.style.padding = '12px';
            header.style.background = 'rgba(255, 255, 255, 0.1)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.webkitBackdropFilter = 'blur(15px)';
            header.style.borderRadius = '12px';
            header.style.marginBottom = '12px';
            header.style.border = '1px solid rgba(255, 255, 255, 0.15)';

            const title = isMenu ? '⚙️ 智能助手设置' : '🤖 Kahoot智能助手';
            header.innerHTML = `<strong style="font-size: 16px; background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${title}</strong>`;

            // 创建控制按钮容器
            let controlsContainer = document.createElement('div');
            controlsContainer.style.float = 'right';
            controlsContainer.style.display = 'flex';
            controlsContainer.style.gap = '4px';

            // 缩放减小按钮
            let scaleDownBtn = document.createElement('button');
            scaleDownBtn.innerText = '−';
            scaleDownBtn.title = '缩小';
            scaleDownBtn.style.background = 'rgba(255, 255, 255, 0.15)';
            scaleDownBtn.style.backdropFilter = 'blur(10px)';
            scaleDownBtn.style.webkitBackdropFilter = 'blur(10px)';
            scaleDownBtn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            scaleDownBtn.style.color = 'white';
            scaleDownBtn.style.cursor = 'pointer';
            scaleDownBtn.style.borderRadius = '6px';
            scaleDownBtn.style.padding = '2px 6px';
            scaleDownBtn.style.fontSize = '12px';
            scaleDownBtn.style.transition = 'all 0.3s ease';

            // 缩放显示
            let scaleDisplay = document.createElement('span');
            scaleDisplay.style.background = 'rgba(255, 255, 255, 0.1)';
            scaleDisplay.style.padding = '2px 6px';
            scaleDisplay.style.borderRadius = '6px';
            scaleDisplay.style.fontSize = '10px';
            scaleDisplay.style.opacity = '0.8';
            scaleDisplay.textContent = Math.round(scale * 100) + '%';

            // 缩放增大按钮
            let scaleUpBtn = document.createElement('button');
            scaleUpBtn.innerText = '+';
            scaleUpBtn.title = '放大';
            scaleUpBtn.style.background = 'rgba(255, 255, 255, 0.15)';
            scaleUpBtn.style.backdropFilter = 'blur(10px)';
            scaleUpBtn.style.webkitBackdropFilter = 'blur(10px)';
            scaleUpBtn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            scaleUpBtn.style.color = 'white';
            scaleUpBtn.style.cursor = 'pointer';
            scaleUpBtn.style.borderRadius = '6px';
            scaleUpBtn.style.padding = '2px 6px';
            scaleUpBtn.style.fontSize = '12px';
            scaleUpBtn.style.transition = 'all 0.3s ease';

            // 最小化按钮
            let minimizeBtn = document.createElement('button');
            minimizeBtn.innerText = '−';
            minimizeBtn.title = '最小化';
            minimizeBtn.style.background = 'rgba(255, 255, 255, 0.15)';
            minimizeBtn.style.backdropFilter = 'blur(10px)';
            minimizeBtn.style.webkitBackdropFilter = 'blur(10px)';
            minimizeBtn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            minimizeBtn.style.color = 'white';
            minimizeBtn.style.cursor = 'pointer';
            minimizeBtn.style.borderRadius = '6px';
            minimizeBtn.style.padding = '2px 8px';
            minimizeBtn.style.fontSize = '14px';
            minimizeBtn.style.transition = 'all 0.3s ease';
            minimizeBtn.style.marginLeft = '4px';

            controlsContainer.appendChild(scaleDownBtn);
            controlsContainer.appendChild(scaleDisplay);
            controlsContainer.appendChild(scaleUpBtn);
            controlsContainer.appendChild(minimizeBtn);
            header.appendChild(controlsContainer);

            div.appendChild(header);
            let content = document.createElement('div');
            content.id = `${id}Content`;
            content.style.background = 'rgba(255, 255, 255, 0.05)';
            content.style.backdropFilter = 'blur(10px)';
            content.style.webkitBackdropFilter = 'blur(10px)';
            content.style.borderRadius = '12px';
            content.style.padding = '16px';
            content.style.border = '1px solid rgba(255, 255, 255, 0.1)';
            div.appendChild(content);

            document.body.appendChild(div);

            // 悬停效果
            div.addEventListener('mouseenter', () => {
                div.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)';
                div.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
            });

            div.addEventListener('mouseleave', () => {
                div.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
                div.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
            });

            // 按钮悬停效果
            [scaleDownBtn, scaleUpBtn, minimizeBtn].forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.background = 'rgba(255, 255, 255, 0.25)';
                    btn.style.transform = 'scale(1.05)';
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.background = 'rgba(255, 255, 255, 0.15)';
                    btn.style.transform = 'scale(1)';
                });
            });

            // 缩放功能
            let currentScale = scale;

            const updateScale = (newScale) => {
                newScale = Math.max(0.5, Math.min(2, newScale)); // 限制缩放范围在0.5x到2x之间
                currentScale = newScale;
                div.style.transform = `scale(${currentScale})`;
                scaleDisplay.textContent = Math.round(currentScale * 100) + '%';
                localStorage.setItem(`kahoot_smart_${id}_scale`, currentScale.toString());
            };

            scaleDownBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateScale(currentScale - 0.1);
            });

            scaleUpBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                updateScale(currentScale + 0.1);
            });

            // 鼠标滚轮缩放（按住Ctrl键时）
            div.addEventListener('wheel', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.05 : 0.05;
                    updateScale(currentScale + delta);
                }
            });

            // 拖拽功能
            let isDragging = false;
            let currentX, currentY;

            header.addEventListener('mousedown', (e) => {
                isDragging = true;
                currentX = e.clientX - parseInt(div.style.left);
                currentY = e.clientY - parseInt(div.style.top);
                e.preventDefault();
                div.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    div.style.left = `${e.clientX - currentX}px`;
                    div.style.top = `${e.clientY - currentY}px`;
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
                div.style.cursor = 'default';
            });

            // 最小化功能
            let isMinimized = false;
            minimizeBtn.addEventListener('click', () => {
                isMinimized = !isMinimized;
                content.style.display = isMinimized ? 'none' : 'block';
                minimizeBtn.innerText = isMinimized ? '+' : '−';
                div.style.maxHeight = isMinimized ? 'auto' : '85vh';
            });

            return content;
        }

        // 创建设置菜单
        function createMenu() {
            let menuContent = createDraggableElement('quizMenu', '10px', 'calc(100% - 300px)', true);

            // 根据登录状态显示不同内容
            if (!userAuth.isLoggedIn) {
                menuContent.innerHTML = `
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 18px; margin-bottom: 16px;">🔐</div>
                        <div style="margin-bottom: 16px; opacity: 0.9;">
                            <strong>需要登录使用智能功能</strong>
                        </div>
                        <div style="font-size: 13px; opacity: 0.7; margin-bottom: 20px;">
                            请点击扩展图标进行登录
                        </div>
                        <div style="background: rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 8px; font-size: 12px; opacity: 0.8;">
                            💡 提示：点击浏览器工具栏中的扩展图标，然后登录您的账户即可使用智能答题功能
                        </div>
                    </div>
                `;
            } else {
                menuContent.innerHTML = `
                    <div style="margin-bottom: 20px;">
                        <div style="display: flex; align-items: center; margin-bottom: 12px;">
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: #4CAF50; margin-right: 8px;"></div>
                            <strong>账户状态: 已登录</strong>
                        </div>
                        <div style="font-size: 13px; opacity: 0.8; background: rgba(255, 255, 255, 0.1); padding: 10px; border-radius: 8px;">
                            计划: <span id="menuUserPlan" style="font-weight: bold;">${userAuth.userPlan.toUpperCase()}</span><br>
                            <span id="menuUsageInfo" style="font-size: 12px; opacity: 0.7;">正在获取使用情况...</span>
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px;">
                        <strong style="margin-bottom: 12px; display: block;">显示选项:</strong>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
                            <label style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 6px; cursor: pointer;">
                                <input type="checkbox" id="showImage" checked style="margin-right: 8px;"> 显示图片
                            </label>
                            <label style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 6px; cursor: pointer;">
                                <input type="checkbox" id="showVideo" checked style="margin-right: 8px;"> 显示视频
                            </label>
                            <label style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 6px; cursor: pointer;">
                                <input type="checkbox" id="showLayout" checked style="margin-right: 8px;"> 显示布局
                            </label>
                            <label style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 6px; cursor: pointer;">
                                <input type="checkbox" id="showTime" checked style="margin-right: 8px;"> 显示时间
                            </label>
                            <label style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 6px; cursor: pointer;">
                                <input type="checkbox" id="showAnswersAllowed" checked style="margin-right: 8px;"> 答案数
                            </label>
                            <label style="display: flex; align-items: center; background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 6px; cursor: pointer;">
                                <input type="checkbox" id="showChoicesCount" checked style="margin-right: 8px;"> 选项数
                            </label>
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px; text-align: center;">
                        <button id="refreshUsageBtn" style="
                            background: linear-gradient(135deg, rgba(33, 150, 243, 0.8), rgba(25, 118, 210, 0.8));
                            color: white; border: none; padding: 8px 16px; 
                            border-radius: 8px; cursor: pointer; font-size: 13px;
                            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            transition: all 0.3s ease;">
                            刷新使用情况
                        </button>
                    </div>
                `;

                // 绑定刷新按钮
                const refreshBtn = document.getElementById('refreshUsageBtn');
                if (refreshBtn) {
                    refreshBtn.addEventListener('click', async() => {
                        refreshBtn.style.opacity = '0.6';
                        refreshBtn.textContent = '刷新中...';
                        await updateMenuUsageInfo();
                        refreshBtn.style.opacity = '1';
                        refreshBtn.textContent = '刷新使用情况';
                    });
                }

                // 绑定显示选项复选框
                ['showImage', 'showVideo', 'showLayout', 'showTime', 'showAnswersAllowed', 'showChoicesCount'].forEach(id => {
                    let checkbox = document.getElementById(id);
                    if (checkbox) {
                        checkbox.checked = localStorage.getItem(`kahoot_smart_${id}`) !== 'false';
                        checkbox.addEventListener('change', () => {
                            localStorage.setItem(`kahoot_smart_${id}`, checkbox.checked);
                            updateDisplayBox(quizData, currentAnswer);
                        });
                    }
                });

                // 更新使用情况
                updateMenuUsageInfo();
            }
        }

        // 更新菜单中的使用情况显示
        async function updateMenuUsageInfo() {
            const menuUsageInfo = document.getElementById('menuUsageInfo');
            const menuUserPlan = document.getElementById('menuUserPlan');

            if (userAuth.isLoggedIn && menuUsageInfo) {
                const usage = await getUserUsage();
                if (usage) {
                    menuUserPlan.textContent = usage.userPlan.toUpperCase();

                    if (usage.userPlan === 'free') {
                        menuUsageInfo.innerHTML = `累计使用: ${usage.usage.total}/${usage.limits.total} 次`;
                    } else {
                        const planName = usage.userPlan === 'premium' ? 'Premium会员' : '年费会员';
                        menuUsageInfo.innerHTML = `
                        ${planName}<br>
                        本月使用: ${usage.usage.thisMonth}/${usage.limits.monthly} 次<br>
                        累计使用: ${usage.usage.total} 次
                    `;
                    }
                } else {
                    menuUsageInfo.innerHTML = '获取使用情况失败';
                }
            }
        }

        // 更新显示框
        function updateDisplayBox(data, answer = '等待题目...') {
            let displayContent = document.getElementById('quizInfoBoxContent') || createDraggableElement('quizInfoBox', '10px', '10px');

            if (!data.currentQuestion || data.currentChoices.length === 0) {
                displayContent.innerHTML = `
                <div style="text-align: center; padding: 24px;">
                    <div style="font-size: 24px; margin-bottom: 16px;">🔍</div>
                    <div style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">等待Kahoot题目...</div>
                    <div style="font-size: 13px; opacity: 0.8; line-height: 1.5;">
                        • 确保你在 kahoot.it 游戏页面<br>
                        • 等待题目出现<br>
                        • 如有问题请刷新页面
                    </div>
                    <div style="margin-top: 20px; padding: 12px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; font-size: 12px; opacity: 0.7;">
                        💡 点击扩展图标登录以使用智能答题功能
                    </div>
                </div>
            `;
                return;
            }

            let choicesText = data.currentChoices.map((choice, index) =>
                `<div style="margin: 4px 0; padding: 6px 10px; background: rgba(255, 255, 255, 0.1); border-radius: 6px; font-size: 13px;">${index + 1}. ${choice}</div>`
            ).join('');

            let html = `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="background: linear-gradient(135deg, #4CAF50, #45a049); color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600;">
                        题目 ${data.questionIndex + 1}/${data.totalQuestions}
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 16px; border-radius: 12px; margin: 8px 0; border: 1px solid rgba(255, 255, 255, 0.2);">
                    ${data.currentQuestion}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="font-weight: 600; margin-bottom: 8px; opacity: 0.9;">🔤 选项:</div>
                <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.15);">
                    ${choicesText}
                </div>
            </div>
        `;

            // 添加可选显示内容
            if ((localStorage.getItem('kahoot_smart_showImage') !== 'false') && data.imageUrl) {
                html += `
                <div style="margin-bottom: 16px;">
                    <img src="${data.imageUrl}" style="max-width:100%; height:auto; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2);" /><br>
                    <div style="font-size: 11px; opacity: 0.7; margin-top: 6px;">
                        图片: ${data.imageMetadata.contentType}, ${data.imageMetadata.width}x${data.imageMetadata.height}
                    </div>
                </div>
            `;
            }

            if ((localStorage.getItem('kahoot_smart_showVideo') !== 'false') && data.videoUrl) {
                html += `
                <div style="margin-bottom: 12px; padding: 10px; background: rgba(255, 255, 255, 0.1); border-radius: 8px;">
                    🎥 视频: <a href="${data.videoUrl}" target="_blank" style="color: #64b5f6; text-decoration: none;">${data.videoService} 链接</a>
                </div>
            `;
            }

            const optionalFields = [
                { id: 'showLayout', label: '📐', text: '布局', value: data.layout },
                { id: 'showTime', label: '⏱️', text: '答题时间', value: `${data.timeAvailable / 1000}秒` },
                { id: 'showAnswersAllowed', label: '✅', text: '允许答案数', value: data.numberOfAnswersAllowed },
                { id: 'showChoicesCount', label: '🔢', text: '选项数量', value: data.numberOfChoices }
            ];

            const visibleFields = optionalFields.filter(field =>
                (localStorage.getItem(`kahoot_smart_${field.id}`) !== 'false') && field.value
            );

            if (visibleFields.length > 0) {
                html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px;">';
                visibleFields.forEach(field => {
                    html += `
                    <div style="background: rgba(255, 255, 255, 0.1); padding: 8px; border-radius: 8px; text-align: center; font-size: 12px;">
                        <div style="font-size: 14px; margin-bottom: 2px;">${field.label}</div>
                        <div style="opacity: 0.8;">${field.text}</div>
                        <div style="font-weight: 600; color: #4CAF50;">${field.value}</div>
                    </div>
                `;
                });
                html += '</div>';
            }

            // 智能答案部分
            const isError = answer.includes('错误') || answer.includes('失败') || answer.includes('请在扩展') || answer.includes('请先登录');
            const isLoading = answer.includes('正在思考');

            let answerStyle = '';
            let answerIcon = '';

            if (isError) {
                answerStyle = 'border-left: 4px solid #f44336; background: linear-gradient(135deg, rgba(244, 67, 54, 0.15), rgba(244, 67, 54, 0.05));';
                answerIcon = '⚠️';
            } else if (isLoading) {
                answerStyle = 'border-left: 4px solid #FFC107; background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.05));';
                answerIcon = '🤔';
            } else {
                answerStyle = 'border-left: 4px solid #4CAF50; background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.05));';
                answerIcon = '🎯';
            }

            html += `
            <div style="margin-top: 20px; padding: 16px; ${answerStyle} backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">
                <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="font-size: 16px; margin-right: 8px;">${answerIcon}</span>
                    <strong style="font-size: 15px; opacity: 0.95;">智能推荐答案</strong>
                </div>
                <div style="font-weight: 600; line-height: 1.4; font-size: 14px;">
                    ${answer}
                </div>
            </div>
        `;

            displayContent.innerHTML = html;
        }

        // 监听来自popup的消息 - 使用window postMessage代替chrome.runtime
        window.addEventListener('message', (event) => {
            if (event.source !== window) return;

            if (event.data.type === 'FROM_EXTENSION') {
                if (event.data.action === 'login') {
                    saveUserAuth(event.data.token, event.data.userInfo).then(() => {
                        currentAnswer = '登录成功！等待题目...';
                        updateDisplayBox(quizData, currentAnswer);
                    });
                } else if (event.data.action === 'logout') {
                    clearUserAuth().then(() => {
                        updateDisplayBox(quizData, '请登录使用AI功能');
                    });
                }
            }
        });

        // WebSocket拦截
        const originalWebSocket = window.WebSocket;
        window.WebSocket = function(url) {
            console.log('🔌 WebSocket连接:', url);
            const ws = new originalWebSocket(url);

            ws.addEventListener('message', async function(event) {
                try {
                    const messageArray = JSON.parse(event.data);
                    for (let message of messageArray) {
                        if (message.data && message.data.type === 'message' && message.channel === '/service/player') {
                            const content = JSON.parse(message.data.content);
                            if (content.type === 'quiz') {
                                // 更新quiz数据 
                                quizData = {
                                    currentQuestion: content.title || '',
                                    currentChoices: (content.choices || []).map(choice => choice.answer),
                                    imageUrl: content.image || '',
                                    imageMetadata: content.imageMetadata || {},
                                    videoUrl: content.video?.fullUrl || '',
                                    videoService: content.video?.service || '',
                                    layout: content.layout || 'Unknown',
                                    questionIndex: content.questionIndex || 0,
                                    totalQuestions: content.totalGameBlockCount || 0,
                                    timeAvailable: content.timeAvailable || 0,
                                    numberOfAnswersAllowed: content.numberOfAnswersAllowed || 0,
                                    numberOfChoices: content.numberOfChoices || 0,
                                    pointsMultiplier: content.pointsMultiplier || 1,
                                    getReadyTime: content.getReadyTimeAvailable || 0
                                };

                                console.log('📝 新题目:', quizData.currentQuestion);

                                if (quizData.currentQuestion && quizData.currentChoices.length > 0) {
                                    // 检查是否是新题目
                                    if (quizData.currentQuestion !== lastQuestion ||
                                        JSON.stringify(quizData.currentChoices) !== JSON.stringify(lastChoices)) {

                                        lastQuestion = quizData.currentQuestion;
                                        lastChoices = quizData.currentChoices.slice();
                                        currentAnswer = userAuth.isLoggedIn ? '� 智能系统正在分析...' : '请在扩展中登录使用智能功能';

                                        updateDisplayBox(quizData, currentAnswer);

                                        // 获取智能答案
                                        if (userAuth.isLoggedIn) {
                                            try {
                                                const smartAnswer = await getSmartAnswer(
                                                    quizData.currentQuestion,
                                                    quizData.currentChoices,
                                                    quizData.numberOfAnswersAllowed
                                                );
                                                currentAnswer = smartAnswer;
                                                updateDisplayBox(quizData, currentAnswer);
                                            } catch (error) {
                                                console.error('获取智能答案失败:', error);
                                                currentAnswer = `获取智能答案失败: ${error.message}`;
                                                updateDisplayBox(quizData, currentAnswer);
                                            }
                                        }
                                    } else {
                                        updateDisplayBox(quizData, currentAnswer);
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.error('❌ 解析WebSocket消息错误:', e);
                }
            });

            ws.addEventListener('error', (e) => {
                console.error('❌ WebSocket错误:', e);
            });

            return ws;
        };

        // 页面加载完成时初始化
        window.addEventListener('load', async function() {
                    console.log('�� Kahoot智能助手加载中...');

                    // 加载用户认证信息
                    await loadUserAuth();

                    // 创建UI
                    let displayContent = createDraggableElement('quizInfoBox', '10px', '10px');
                    displayContent.innerHTML = `
            <div style="text-align: center; padding: 28px;">
                <div style="font-size: 28px; margin-bottom: 16px;">��</div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 12px; background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Kahoot智能助手已就绪
                </div>
                <div style="font-size: 13px; opacity: 0.8; line-height: 1.5;">
                    等待题目出现...
                </div>
                ${!userAuth.isLoggedIn ? `
                <div style="margin-top: 16px; padding: 12px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 8px; font-size: 12px; opacity: 0.8; border: 1px solid rgba(255, 255, 255, 0.15);">
                    💡 点击扩展图标登录以使用智能答题功能
                </div>
                ` : ''}
            </div>
        `;
        
        createMenu();
        
        console.log('✅ Kahoot智能助手初始化完成');
    });

})();

