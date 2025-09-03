(function() {
    'use strict';

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
    let currentAnswer = 'Waiting for AI answer...';

    function createDraggableElement(id, initialTop, initialLeft, isMenu = false) {
        console.log(`Creating draggable element: ${id}`, {
            top: initialTop,
            left: initialLeft,
            isMenu: isMenu,
            bodyExists: !!document.body
        });

        if (!document.body) {
            console.error('Cannot create element: document.body is null');
            return null;
        }

        // 检查元素是否已存在
        if (document.getElementById(id)) {
            console.log(`Element ${id} already exists, returning existing content`);
            return document.getElementById(`${id}Content`);
        }

        let div = document.createElement('div');
        div.id = id;
        div.style.position = 'fixed';
        div.style.top = initialTop;
        div.style.left = initialLeft;
        div.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        div.style.color = 'white';
        div.style.padding = '15px';
        div.style.borderRadius = '8px';
        div.style.zIndex = '999999'; // 更高的z-index
        div.style.fontFamily = 'Arial, sans-serif';
        div.style.fontSize = '14px';
        div.style.maxWidth = '450px';
        div.style.maxHeight = '80vh';
        div.style.overflow = 'auto';
        div.style.userSelect = 'none';
        div.style.border = '2px solid #4CAF50';
        div.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';

        let header = document.createElement('div');
        header.style.cursor = 'move';
        header.style.padding = '8px';
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        header.style.borderBottom = '2px solid #4CAF50';
        header.style.marginBottom = '10px';
        header.innerHTML = isMenu ? '<strong>🔧 Menu</strong>' : '<strong>📊 Quiz Info</strong>';

        let minimizeBtn = document.createElement('button');
        minimizeBtn.innerText = '−';
        minimizeBtn.style.float = 'right';
        minimizeBtn.style.background = '#4CAF50';
        minimizeBtn.style.border = 'none';
        minimizeBtn.style.color = 'white';
        minimizeBtn.style.cursor = 'pointer';
        minimizeBtn.style.padding = '2px 8px';
        minimizeBtn.style.borderRadius = '3px';
        header.appendChild(minimizeBtn);

        div.appendChild(header);
        let content = document.createElement('div');
        content.id = `${id}Content`;
        div.appendChild(content);

        try {
            document.body.appendChild(div);
            console.log(`✅ Successfully created and appended ${id} to body`);
        } catch (error) {
            console.error(`❌ Error appending ${id} to body:`, error);
            return null;
        }

        let isDragging = false;
        let currentX, currentY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            currentX = e.clientX - parseInt(div.style.left);
            currentY = e.clientY - parseInt(div.style.top);
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                div.style.left = `${e.clientX - currentX}px`;
                div.style.top = `${e.clientY - currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        let isMinimized = false;
        minimizeBtn.addEventListener('click', () => {
            isMinimized = !isMinimized;
            content.style.display = isMinimized ? 'none' : 'block';
            minimizeBtn.innerText = isMinimized ? '+' : '−';
            div.style.maxHeight = isMinimized ? 'auto' : '80vh';
        });

        return content;
    }

    function createMenu() {
        let menuContent = createDraggableElement('quizMenu', '10px', 'calc(100% - 210px)', true);
        menuContent.innerHTML = `
            <strong>Display Options:</strong><br>
            <label><input type="checkbox" id="showImage" checked> Show Image</label><br>
            <label><input type="checkbox" id="showVideo" checked> Show Video</label><br>
            <label><input type="checkbox" id="showLayout" checked> Show Layout</label><br>
            <label><input type="checkbox" id="showTime" checked> Show Time Available</label><br>
            <label><input type="checkbox" id="showAnswersAllowed" checked> Show Answers Allowed</label><br>
            <label><input type="checkbox" id="showChoicesCount" checked> Show Choices Count</label><br>
            <label><input type="checkbox" id="showPointsMultiplier" checked> Show Points Multiplier</label><br>
            <label><input type="checkbox" id="showPrepTime" checked> Show Prep Time</label><br>
        `;

        ['showImage', 'showVideo', 'showLayout', 'showTime', 'showAnswersAllowed', 'showChoicesCount', 'showPointsMultiplier', 'showPrepTime'].forEach(id => {
            let checkbox = document.getElementById(id);
            checkbox.checked = localStorage.getItem(id) !== 'false';
            checkbox.addEventListener('change', () => {
                localStorage.setItem(id, checkbox.checked);
                updateDisplayBox(quizData, currentAnswer);
            });
        });
    }

    function updateDisplayBox(data, answer = 'Waiting for AI answer...') {
        let displayContent = document.getElementById('quizInfoBoxContent') || createDraggableElement('quizInfoBox', '10px', '10px');
        if (!data.currentQuestion || data.currentChoices.length === 0) {
            displayContent.innerHTML = `<strong>No valid quiz data detected.</strong><br>Possible reasons:<br>
                - WebSocket messages not intercepted<br>
                - Quiz data format changed<br>
                - Page not fully loaded`;
            return;
        }
        let choicesText = data.currentChoices.join(' | ');
        let html = `<strong>Question ${data.questionIndex + 1}/${data.totalQuestions}:</strong> ${data.currentQuestion}<br><strong>Choices:</strong> ${choicesText}<br>`;

        if (document.getElementById('showImage') ? .checked && data.imageUrl) {
            html += `<img src="${data.imageUrl}" style="max-width:100%;height:auto;" /><br>Image: ${data.imageMetadata.contentType}, ${data.imageMetadata.width}x${data.imageMetadata.height}<br>`;
        }
        if (document.getElementById('showVideo') ? .checked && data.videoUrl) {
            html += `Video: <a href="${data.videoUrl}" target="_blank">${data.videoService} Link</a><br>`;
        }
        if (document.getElementById('showLayout') ? .checked) {
            html += `<strong>Layout:</strong> ${data.layout}<br>`;
        }
        if (document.getElementById('showTime') ? .checked) {
            html += `<strong>Time Available:</strong> ${data.timeAvailable / 1000} seconds<br>`;
        }
        if (document.getElementById('showAnswersAllowed') ? .checked) {
            html += `<strong>Answers Allowed:</strong> ${data.numberOfAnswersAllowed}<br>`;
        }
        if (document.getElementById('showChoicesCount') ? .checked) {
            html += `<strong>Choices Count:</strong> ${data.numberOfChoices}<br>`;
        }
        if (document.getElementById('showPointsMultiplier') ? .checked) {
            html += `<strong>Points Multiplier:</strong> ${data.pointsMultiplier}x<br>`;
        }
        if (document.getElementById('showPrepTime') ? .checked) {
            html += `<strong>Prep Time:</strong> ${data.getReadyTime / 1000} seconds<br>`;
        }
        html += `<strong>AI Answer:</strong> ${answer}`;

        displayContent.innerHTML = html;
    }

    // 后端服务配置
    const BACKEND_URL = 'http://localhost:932';
    const WEB_URL = 'http://localhost:3000';

    // 获取用户认证信息
    let authToken = null;
    let userInfo = null;

    // 从web应用获取认证信息
    async function getUserAuth() {
        try {
            // 尝试从localStorage获取token (如果在同域)
            const token = localStorage.getItem('authToken');
            if (token) {
                authToken = token;
                // 验证token并获取用户信息
                const response = await fetch(`${WEB_URL}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    userInfo = await response.json();
                    return true;
                }
            }
        } catch (error) {
            console.log('Failed to get user auth:', error);
        }
        return false;
    }

    // 显示登录提示
    function showLoginPrompt() {
        let displayContent = document.getElementById('quizInfoBoxContent') || createDraggableElement('quizInfoBox', '10px', '10px');
        displayContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="color: #f59e0b; margin-bottom: 10px;">⚠️ 需要登录</h3>
                <p style="margin-bottom: 15px;">请先登录以使用AI助手功能</p>
                <a href="${WEB_URL}/login" target="_blank" 
                   style="display: inline-block; background: #4f46e5; color: white; 
                          padding: 10px 20px; text-decoration: none; border-radius: 6px; 
                          font-weight: 500;">
                    立即登录
                </a>
                <br><br>
                <small style="color: #6b7280;">登录后刷新页面即可使用</small>
            </div>
        `;
    }

    // 显示使用限制提示
    function showUsageLimitPrompt(limitInfo) {
        let displayContent = document.getElementById('quizInfoBoxContent') || createDraggableElement('quizInfoBox', '10px', '10px');
        displayContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h3 style="color: #dc2626; margin-bottom: 10px;">🚫 请求次数已用完</h3>
                <p style="margin-bottom: 10px;">今日使用次数: ${limitInfo.used}/${limitInfo.limit}</p>
                <p style="margin-bottom: 15px;">当前套餐: ${limitInfo.plan === 'free' ? '免费版' : limitInfo.plan}</p>
                <a href="${WEB_URL}/dashboard" target="_blank" 
                   style="display: inline-block; background: #059669; color: white; 
                          padding: 10px 20px; text-decoration: none; border-radius: 6px; 
                          font-weight: 500;">
                    升级套餐
                </a>
                <br><br>
                <small style="color: #6b7280;">升级后可获得更多使用次数</small>
            </div>
        `;
    }

    async function getAIAnswer(question, choices, answersAllowed) {
        // 首先检查用户认证
        if (!authToken) {
            const hasAuth = await getUserAuth();
            if (!hasAuth) {
                showLoginPrompt();
                return '需要登录后使用';
            }
        }

        try {
            // 先尝试使用后端API
            const response = await fetch(`${BACKEND_URL}/api/ai/answer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    question: question,
                    choices: choices,
                    answersAllowed: answersAllowed,
                    userId: userInfo ? .id
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Backend API Response:', data);

                // 显示使用情况
                if (data.usage) {
                    console.log(`今日使用: ${data.usage.requestsToday} 次 (${data.usage.plan} 套餐)`);
                }

                return data.answer;
            } else if (response.status === 401) {
                // 认证失败，清除token并提示登录
                authToken = null;
                userInfo = null;
                localStorage.removeItem('authToken');
                showLoginPrompt();
                return '认证已过期，请重新登录';
            } else if (response.status === 429) {
                // 请求次数超限
                const errorData = await response.json();
                showUsageLimitPrompt(errorData);
                return `今日请求次数已用完 (${errorData.used}/${errorData.limit})`;
            } else {
                console.warn('Backend API failed, falling back to direct API call');
                // 如果后端失败，回退到直接API调用（仅限已认证用户）
                return await getAIAnswerDirect(question, choices, answersAllowed);
            }
        } catch (error) {
            console.error('Backend API error:', error);
            // 如果后端不可用且用户已认证，回退到直接API调用
            if (authToken && userInfo) {
                return await getAIAnswerDirect(question, choices, answersAllowed);
            } else {
                showLoginPrompt();
                return '服务暂不可用，请稍后重试';
            }
        }
    }

    // 回退方案：直接调用AI API
    async function getAIAnswerDirect(question, choices, answersAllowed) {
        const apiKey = 'sk-FCg7LbxdDaXruAByQlIv6DBl8h5T2vFEvccgVJF4UecVRPB9';
        const apiUrl = 'https://api.henryni.cn/v1/chat/completions';
        const model = 'gemini-2.0-flash';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        { role: 'system', content: `你是一个回答问题的 AI。选项从左到右的顺序分别是 1，2，3，4。此题允许选择 ${answersAllowed} 个答案。请按照以下格式回答：选项名字/数字` },
                        { role: 'user', content: `Question: ${question}\nChoices: ${choices.join(', ')}` }
                    ]
                })
            });

            console.log('Direct API Response:', response);
            if (!response.ok) {
                console.error('Direct API Error:', response.status, response.statusText);
                return `API Error: ${response.status} ${response.statusText}`;
            }
            const data = await response.json();
            console.log('Direct API Data:', data);
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Failed to fetch AI answer directly:', error);
            return 'Error fetching AI answer';
        }
    }

    // 发送quiz数据到后端进行处理（可选）
    async function sendQuizDataToBackend(quizData) {
        try {
            await fetch(`${BACKEND_URL}/api/quiz/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quizData: quizData })
            });
        } catch (error) {
            console.log('Failed to send quiz data to backend:', error);
            // 这是可选功能，不影响主要功能
        }
    }

    const originalWebSocket = window.WebSocket;
    window.WebSocket = function(url) {
        console.log('WebSocket connection opened:', url); // 调试 WebSocket 连接
        const ws = new originalWebSocket(url);
        ws.addEventListener('message', async function(event) {
            console.log('WebSocket message received:', event.data); // 调试 WebSocket 消息
            try {
                const messageArray = JSON.parse(event.data);
                console.log('Parsed message:', messageArray); // 调试解析后的消息
                for (let message of messageArray) {
                    if (message.data && message.data.type === 'message' && message.channel === '/service/player') {
                        const content = JSON.parse(message.data.content);
                        console.log('Quiz content:', content); // 调试 quiz 数据
                        if (content.type === 'quiz') {
                            quizData.currentQuestion = content.title || '';
                            quizData.currentChoices = (content.choices || []).map(choice => choice.answer);
                            quizData.imageUrl = content.image || '';
                            quizData.imageMetadata = content.imageMetadata || {};
                            quizData.videoUrl = content.video ? .fullUrl || '';
                            quizData.videoService = content.video ? .service || '';
                            quizData.layout = content.layout || 'Unknown';
                            quizData.questionIndex = content.questionIndex || 0;
                            quizData.totalQuestions = content.totalGameBlockCount || 0;
                            quizData.timeAvailable = content.timeAvailable || 0;
                            quizData.numberOfAnswersAllowed = content.numberOfAnswersAllowed || 0;
                            quizData.numberOfChoices = content.numberOfChoices || 0;
                            quizData.pointsMultiplier = content.pointsMultiplier || 1;
                            quizData.getReadyTime = content.getReadyTimeAvailable || 0;

                            console.log('Updated quizData:', quizData); // 调试 quizData

                            // 发送数据到后端进行处理（可选）
                            sendQuizDataToBackend(quizData);

                            if (quizData.currentQuestion && quizData.currentChoices.length > 0) {
                                if (quizData.currentQuestion !== lastQuestion || JSON.stringify(quizData.currentChoices) !== JSON.stringify(lastChoices)) {
                                    lastQuestion = quizData.currentQuestion;
                                    lastChoices = quizData.currentChoices.slice();
                                    currentAnswer = 'Waiting for AI answer...';
                                    updateDisplayBox(quizData, currentAnswer);
                                    const aiAnswer = await getAIAnswer(quizData.currentQuestion, quizData.currentChoices, quizData.numberOfAnswersAllowed);
                                    currentAnswer = aiAnswer;
                                    updateDisplayBox(quizData, aiAnswer);
                                } else {
                                    updateDisplayBox(quizData, currentAnswer);
                                }
                            } else {
                                updateDisplayBox(quizData);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
                let displayContent = document.getElementById('quizInfoBoxContent') || createDraggableElement('quizInfoBox', '10px', '10px');
                displayContent.innerHTML = `<strong>Error parsing data.</strong><br>Error: ${e.message}`;
            }
        });
        ws.addEventListener('error', (e) => {
            console.error('WebSocket error:', e); // 调试 WebSocket 错误
        });
        return ws;
    };

    // 改进的初始化函数
    async function initializeExtension() {
        console.log('Extension initializing...', {
            readyState: document.readyState,
            hasBody: !!document.body,
            url: window.location.href
        });

        // 确保在Kahoot页面
        if (!window.location.href.includes('kahoot.it')) {
            console.log('Not on Kahoot.it, skipping initialization');
            return;
        }

        // 确保document.body可用
        if (!document.body) {
            console.log('Document body not ready, retrying...');
            setTimeout(initializeExtension, 100);
            return;
        }

        // 检查是否已存在元素
        if (document.getElementById('quizInfoBox') || document.getElementById('quizMenu')) {
            console.log('UI elements already exist, skipping');
            return;
        }

        try {
            console.log('Creating UI elements...');

            // 尝试获取用户认证信息
            await getUserAuth();

            // 创建主显示框
            let displayContent = createDraggableElement('quizInfoBox', '10px', '10px');

            if (authToken && userInfo) {
                displayContent.innerHTML = `
                    <strong>🎯 Kahoot Quiz Helper Active</strong><br>
                    <small>用户: ${userInfo.name} (${userInfo.subscription?.plan || 'free'})</small><br>
                    等待题目数据...
                `;
            } else {
                displayContent.innerHTML = `
                    <strong>🎯 Kahoot Quiz Helper</strong><br>
                    <small style="color: #f59e0b;">请先登录以使用AI功能</small><br>
                    <a href="${WEB_URL}/login" target="_blank" 
                       style="color: #4f46e5; text-decoration: underline;">
                        点击登录
                    </a>
                `;
            }

            // 创建菜单
            createMenu();

            console.log('✅ UI elements created successfully');

            // 添加一个明显的样式来确保可见
            const infoBox = document.getElementById('quizInfoBox');
            if (infoBox) {
                infoBox.style.border = '2px solid #00ff00';
                infoBox.style.boxShadow = '0 0 10px rgba(0,255,0,0.5)';
            }

        } catch (error) {
            console.error('❌ Error creating UI elements:', error);
            setTimeout(initializeExtension, 1000);
        }
    }

    // 多种方式确保初始化
    console.log('🚀 Kahoot Quiz Helper loading...');

    // 立即尝试初始化
    initializeExtension();

    // DOM内容加载完成时
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM content loaded, initializing...');
            setTimeout(initializeExtension, 100);
        });
    }

    // 页面完全加载时
    window.addEventListener('load', () => {
        console.log('Window loaded, initializing...');
        setTimeout(initializeExtension, 200);
    });

    // 备用定时器
    setTimeout(() => {
        console.log('Backup initialization timer...');
        initializeExtension();
    }, 2000);

    setTimeout(() => {
        console.log('Final backup initialization timer...');
        initializeExtension();
    }, 5000);
})();