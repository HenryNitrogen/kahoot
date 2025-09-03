const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 使用更新的数据库模块
let database;
let usingMemoryDB = false;

try {
    database = require('./database-updated');
} catch (error) {
    console.log('⚠️ 更新的MySQL模块加载失败，尝试原始版本');
    try {
        database = require('./database');
    } catch (error2) {
        console.log('⚠️ MySQL模块加载失败，使用内存数据库');
        database = require('./database-memory');
        usingMemoryDB = true;
    }
}

const { 
    pool, 
    testConnection, 
    initDatabase,
    userQueries,
    subscriptionQueries,
    usageQueries,
    aiRequestQueries,
    redeemCodeQueries,
    redemptionQueries
} = database;

require('dotenv').config();

const app = express();
const port = process.env.PORT || 932;

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['https://kahoot.it', 'http://localhost:3000', 'https://localhost:3000', 'chrome-extension://*'],
    credentials: true
}));
app.use(express.json());

// AI API配置
const AI_CONFIG = {
    model: process.env.AI_MODEL || 'gemini-2.0-flash',
    apiUrl: process.env.AI_API_URL || 'https://api.henryni.cn/v1/chat/completions',
    defaultApiKey: process.env.DEFAULT_API_KEY || 'sk-FCg7LbxdDaXruAByQlIv6DBl8h5T2vFEvccgVJF4UecVRPB9'
};

// 生成随机ID
function generateId(prefix = 'id') {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 认证中间件
const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Missing authentication token' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userQueries.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid token - user not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// 管理员验证中间件
const requireAdmin = async (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

// 订阅验证中间件
const checkSubscription = async (req, res, next) => {
    try {
        const subscription = await subscriptionQueries.findByUserId(req.user.id);
        
        if (!subscription) {
            return res.status(403).json({ error: 'No subscription found' });
        }

        // 检查订阅状态
        if (subscription.status === 'expired') {
            return res.status(403).json({ 
                error: 'Subscription expired',
                subscription: subscription 
            });
        }

        // 检查订阅是否过期
        if (subscription.endDate && new Date() > new Date(subscription.endDate)) {
            await subscriptionQueries.update(subscription.id, { status: 'expired' });
            return res.status(403).json({ 
                error: 'Subscription expired',
                subscription: subscription 
            });
        }

        req.subscription = subscription;
        next();
    } catch (error) {
        console.error('Subscription check error:', error);
        res.status(500).json({ error: 'Subscription check failed' });
    }
};

// 使用限制检查中间件
const checkUsageLimit = async (req, res, next) => {
    try {
        const usage = await usageQueries.findByUserId(req.user.id);
        const subscription = req.subscription;

        // 根据订阅计划设置限制
        let dailyLimit = 10; // 免费版默认限制
        if (subscription.plan === 'premium') dailyLimit = 100;
        if (subscription.plan === 'pro') dailyLimit = 1000;

        if (usage && usage.requestsToday >= dailyLimit) {
            return res.status(429).json({ 
                error: 'Daily usage limit exceeded',
                limit: dailyLimit,
                used: usage.requestsToday,
                plan: subscription.plan
            });
        }

        next();
    } catch (error) {
        console.error('Usage limit check error:', error);
        next(); // 发生错误时继续，避免阻塞服务
    }
};

// ===== API路由 =====

// 健康检查
app.get('/health', async (req, res) => {
    try {
        const isConnected = await testConnection();
        const stats = usingMemoryDB ? null : await aiRequestQueries.getStats();
        
        res.json({
            status: 'ok',
            database: isConnected ? 'connected' : 'disconnected',
            databaseType: usingMemoryDB ? 'memory' : 'mysql',
            timestamp: new Date().toISOString(),
            stats
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 用户注册
app.post('/auth/register', async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 检查用户是否已存在
        const existingUser = await userQueries.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 12);

        // 创建用户
        const user = await userQueries.create({
            email,
            name,
            password: hashedPassword,
            isAdmin: email === 'henryni710@gmail.com' // 自动设置管理员
        });

        // 生成JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            },
            token
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// 用户登录
app.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }

        // 查找用户
        const user = await userQueries.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 验证密码
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // 生成JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// 获取用户信息
app.get('/auth/me', authenticateUser, async (req, res) => {
    try {
        const subscription = await subscriptionQueries.findByUserId(req.user.id);
        const usageRecords = await usageQueries.findByUserId(req.user.id);

        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
            subscription: {
                id: subscription?.id,
                plan: subscription?.plan || 'free',
                status: subscription?.status || 'trial',
                expiresAt: subscription?.endDate
            },
            usageRecords: usageRecords ? [usageRecords] : []
        });
    } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({ error: 'Failed to get user info' });
    }
});

// AI问答接口
app.post('/api/ask', authenticateUser, checkSubscription, checkUsageLimit, async (req, res) => {
    const startTime = Date.now();
    
    try {
        const { question, options, model } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // 构建AI请求
        const aiModel = model || AI_CONFIG.model;
        const prompt = options && options.length > 0 
            ? `问题: ${question}\n选项: ${options.join(', ')}\n请选择正确答案并解释原因。`
            : `问题: ${question}\n请提供详细答案。`;

        const response = await axios.post(AI_CONFIG.apiUrl, {
            model: aiModel,
            messages: [
                {
                    role: 'system',
                    content: '你是一个知识渊博的AI助手，专门帮助用户回答各种问题。请提供准确、详细的答案。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        }, {
            headers: {
                'Authorization': `Bearer ${AI_CONFIG.defaultApiKey}`,
                'Content-Type': 'application/json'
            },
            timeout: 30000
        });

        const aiAnswer = response.data.choices[0]?.message?.content || '抱歉，无法获取答案。';
        const tokensUsed = response.data.usage?.total_tokens || 0;
        const responseTime = Date.now() - startTime;

        // 更新使用统计
        await usageQueries.updateRequests(req.user.id);

        // 记录AI请求
        await aiRequestQueries.create({
            userId: req.user.id,
            question,
            answer: aiAnswer,
            model: aiModel,
            tokensUsed,
            responseTime
        });

        res.json({
            success: true,
            answer: aiAnswer,
            model: aiModel,
            tokensUsed,
            responseTime
        });

    } catch (error) {
        console.error('AI request error:', error);
        
        // 记录失败的请求
        try {
            await aiRequestQueries.create({
                userId: req.user.id,
                question: req.body.question,
                answer: null,
                model: req.body.model || AI_CONFIG.model,
                tokensUsed: 0,
                responseTime: Date.now() - startTime
            });
        } catch (logError) {
            console.error('Failed to log error request:', logError);
        }

        if (error.response?.status === 429) {
            res.status(429).json({ error: 'AI service rate limit exceeded. Please try again later.' });
        } else if (error.code === 'ECONNABORTED') {
            res.status(408).json({ error: 'AI service timeout. Please try again.' });
        } else {
            res.status(500).json({ error: 'AI service temporarily unavailable' });
        }
    }
});

// ===== 管理员API =====

// 管理员仪表板统计
app.get('/admin/dashboard', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const codeStats = await redeemCodeQueries.getStats();
        const redemptionCount = await redemptionQueries.getCount();

        res.json({
            stats: {
                totalCodes: codeStats.totalCodes || 0,
                usedCodes: codeStats.usedCodes || 0,
                activeCodes: codeStats.activeCodes || 0,
                expiredCodes: codeStats.expiredCodes || 0,
                totalRedemptions: redemptionCount || 0
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({ error: 'Failed to load dashboard stats' });
    }
});

// 创建兑换码
app.post('/admin/codes', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const { planType, duration, quantity, expiresAt } = req.body;

        if (!planType || !duration || !quantity) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (quantity > 100) {
            return res.status(400).json({ error: 'Cannot create more than 100 codes at once' });
        }

        const codes = [];
        
        for (let i = 0; i < quantity; i++) {
            // 生成兑换码
            const code = generateRedeemCode();
            const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
            
            const createdCode = await redeemCodeQueries.create({
                code,
                planType,
                duration,
                expiresAt: expiresAtDate
            });
            
            codes.push(createdCode);
        }

        res.json({
            success: true,
            codes,
            count: codes.length
        });
    } catch (error) {
        console.error('Create codes error:', error);
        res.status(500).json({ error: 'Failed to create codes' });
    }
});

// 获取兑换码列表
app.get('/admin/codes', authenticateUser, requireAdmin, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const result = await redeemCodeQueries.getPaginated(page, limit);

        res.json(result);
    } catch (error) {
        console.error('Get codes error:', error);
        res.status(500).json({ error: 'Failed to load codes' });
    }
});

// ===== 兑换码API =====

// 兑换码兑换
app.post('/redeem', authenticateUser, async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Redeem code is required' });
        }

        // 查找兑换码
        const redeemCode = await redeemCodeQueries.findByCode(code.toUpperCase());
        
        if (!redeemCode) {
            return res.status(404).json({ error: 'Invalid redeem code' });
        }

        if (redeemCode.isUsed) {
            return res.status(400).json({ error: 'Redeem code already used' });
        }

        if (redeemCode.expiresAt && new Date() > new Date(redeemCode.expiresAt)) {
            return res.status(400).json({ error: 'Redeem code expired' });
        }

        // 标记兑换码为已使用
        await redeemCodeQueries.markAsUsed(redeemCode.id);

        // 计算订阅时间
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + redeemCode.duration * 24 * 60 * 60 * 1000);

        // 创建兑换记录
        const redemption = await redemptionQueries.create({
            userId: req.user.id,
            redeemCodeId: redeemCode.id,
            planType: redeemCode.planType,
            startDate,
            endDate
        });

        // 更新或创建订阅
        const existingSubscription = await subscriptionQueries.findByUserId(req.user.id);
        
        if (existingSubscription) {
            // 如果已有订阅，延长时间或升级
            const newEndDate = existingSubscription.endDate && new Date(existingSubscription.endDate) > new Date()
                ? new Date(new Date(existingSubscription.endDate).getTime() + redeemCode.duration * 24 * 60 * 60 * 1000)
                : endDate;

            await subscriptionQueries.update(existingSubscription.id, {
                plan: redeemCode.planType,
                status: 'active',
                endDate: newEndDate
            });
        } else {
            // 创建新订阅
            await subscriptionQueries.create({
                userId: req.user.id,
                plan: redeemCode.planType,
                status: 'active',
                startDate,
                endDate
            });
        }

        res.json({
            success: true,
            message: 'Redeem code successfully redeemed',
            redemption: {
                planType: redeemCode.planType,
                duration: redeemCode.duration,
                startDate,
                endDate
            }
        });
    } catch (error) {
        console.error('Redeem error:', error);
        res.status(500).json({ error: 'Failed to redeem code' });
    }
});

// 获取用户兑换记录
app.get('/redeem', authenticateUser, async (req, res) => {
    try {
        const redemptions = await redemptionQueries.findByUserId(req.user.id);

        const formattedRedemptions = redemptions.map(redemption => ({
            id: redemption.id,
            planType: redemption.planType,
            startDate: redemption.startDate,
            endDate: redemption.endDate,
            isActive: redemption.isActive && new Date() <= new Date(redemption.endDate),
            redeemCode: {
                code: redemption.code,
                duration: redemption.duration
            }
        }));

        res.json({
            redemptions: formattedRedemptions
        });
    } catch (error) {
        console.error('Get redemptions error:', error);
        res.status(500).json({ error: 'Failed to load redemptions' });
    }
});

// 生成兑换码函数
function generateRedeemCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < 3) result += '-';
    }
    
    return result;
}

// 启动服务器
async function startServer() {
    try {
        console.log('🚀 正在启动服务器...');
        
        // 测试数据库连接
        const isConnected = await testConnection();
        if (isConnected && !usingMemoryDB) {
            await initDatabase();
        }
        
        app.listen(port, () => {
            console.log(`✅ 服务器运行在端口 ${port}`);
            console.log(`📊 数据库类型: ${usingMemoryDB ? 'Memory' : 'MySQL'}`);
            console.log(`🔗 健康检查: http://localhost:${port}/health`);
        });
    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
}

startServer();
