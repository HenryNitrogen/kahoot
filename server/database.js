const mysql = require('mysql2/promise');
require('dotenv').config();

// 数据库配置
const dbConfig = {
    host: process.env.DB_HOST || 'hk.henryni.cn',
    port: process.env.DB_PORT || 932,
    user: process.env.DB_USER || 'henrynitrogen',
    password: process.env.DB_PASSWORD || 'Ni114514',
    database: process.env.DB_NAME || 'kahoot',
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ 数据库连接成功');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ 数据库连接失败:', error.message);
        return false;
    }
}

// 初始化数据库表结构（与Prisma Schema同步）
async function initDatabase() {
    try {
        const connection = await pool.getConnection();

        // 创建用户表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS User (
                id VARCHAR(191) PRIMARY KEY,
                email VARCHAR(191) UNIQUE NOT NULL,
                name VARCHAR(191) NOT NULL,
                password VARCHAR(191) NOT NULL,
                isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
                createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
            )
        `);

        // 创建订阅表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Subscription (
                id VARCHAR(191) PRIMARY KEY,
                userId VARCHAR(191) NOT NULL,
                plan ENUM('free', 'premium', 'pro') NOT NULL DEFAULT 'free',
                status ENUM('active', 'expired', 'trial') NOT NULL DEFAULT 'trial',
                startDate DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                endDate DATETIME(3),
                createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);

        // 创建使用记录表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS UsageRecord (
                id VARCHAR(191) PRIMARY KEY,
                userId VARCHAR(191) NOT NULL,
                requestsToday INT NOT NULL DEFAULT 0,
                requestsThisMonth INT NOT NULL DEFAULT 0,
                totalRequests INT NOT NULL DEFAULT 0,
                lastRequestDate DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);

        // 创建AI请求表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS AIRequest (
                id VARCHAR(191) PRIMARY KEY,
                userId VARCHAR(191) NOT NULL,
                question TEXT NOT NULL,
                answer TEXT,
                model VARCHAR(191),
                tokensUsed INT,
                responseTime INT,
                createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE
            )
        `);

        // 创建兑换码表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS RedeemCode (
                id VARCHAR(191) PRIMARY KEY,
                code VARCHAR(191) UNIQUE NOT NULL,
                planType ENUM('premium', 'pro') NOT NULL,
                duration INT NOT NULL,
                isUsed BOOLEAN NOT NULL DEFAULT FALSE,
                expiresAt DATETIME(3),
                createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
            )
        `);

        // 创建兑换记录表
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS Redemption (
                id VARCHAR(191) PRIMARY KEY,
                userId VARCHAR(191) NOT NULL,
                redeemCodeId VARCHAR(191) NOT NULL,
                planType ENUM('premium', 'pro') NOT NULL,
                startDate DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                endDate DATETIME(3) NOT NULL,
                isActive BOOLEAN NOT NULL DEFAULT TRUE,
                createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
                FOREIGN KEY (redeemCodeId) REFERENCES RedeemCode(id) ON DELETE CASCADE
            )
        `);

        connection.release();
        console.log('✅ 数据库表结构初始化完成');
        return true;
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error.message);
        return false;
    }
}

// 用户相关查询
const userQueries = {
    async findById(id) {
        const [rows] = await pool.execute(
            'SELECT id, email, name, isAdmin, createdAt, updatedAt FROM User WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    async findByEmail(email) {
        const [rows] = await pool.execute(
            'SELECT * FROM User WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    async create(userData) {
        const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await pool.execute(
            'INSERT INTO User (id, email, name, password, isAdmin) VALUES (?, ?, ?, ?, ?)',
            [id, userData.email, userData.name, userData.password, userData.isAdmin || false]
        );
        
        // 创建默认订阅
        await subscriptionQueries.create({
            userId: id,
            plan: 'free',
            status: 'trial'
        });

        // 创建使用记录
        await usageQueries.create({ userId: id });

        return await this.findById(id);
    },

    async updateAdmin(email, isAdmin) {
        await pool.execute(
            'UPDATE User SET isAdmin = ? WHERE email = ?',
            [isAdmin, email]
        );
        return await this.findByEmail(email);
    }
};

// 订阅相关查询
const subscriptionQueries = {
    async findByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM Subscription WHERE userId = ? ORDER BY createdAt DESC LIMIT 1',
            [userId]
        );
        return rows[0];
    },

    async create(subData) {
        const id = 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await pool.execute(
            'INSERT INTO Subscription (id, userId, plan, status, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)',
            [id, subData.userId, subData.plan, subData.status, subData.startDate || new Date(), subData.endDate]
        );
        return await this.findById(id);
    },

    async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM Subscription WHERE id = ?', [id]);
        return rows[0];
    },

    async update(id, updateData) {
        const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updateData);
        values.push(id);
        
        await pool.execute(
            `UPDATE Subscription SET ${fields} WHERE id = ?`,
            values
        );
        return await this.findById(id);
    }
};

// 使用记录相关查询
const usageQueries = {
    async findByUserId(userId) {
        const [rows] = await pool.execute(
            'SELECT * FROM UsageRecord WHERE userId = ?',
            [userId]
        );
        return rows[0];
    },

    async create(usageData) {
        const id = 'usage_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await pool.execute(
            'INSERT INTO UsageRecord (id, userId) VALUES (?, ?)',
            [id, usageData.userId]
        );
        return await this.findById(id);
    },

    async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM UsageRecord WHERE id = ?', [id]);
        return rows[0];
    },

    async updateRequests(userId) {
        const today = new Date().toISOString().split('T')[0];
        
        await pool.execute(`
            UPDATE UsageRecord 
            SET requestsToday = CASE 
                    WHEN DATE(lastRequestDate) = ? THEN requestsToday + 1 
                    ELSE 1 
                END,
                requestsThisMonth = requestsThisMonth + 1,
                totalRequests = totalRequests + 1,
                lastRequestDate = CURRENT_TIMESTAMP(3)
            WHERE userId = ?
        `, [today, userId]);
        
        return await this.findByUserId(userId);
    }
};

// AI请求相关查询
const aiRequestQueries = {
    async create(requestData) {
        const id = 'ai_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await pool.execute(
            'INSERT INTO AIRequest (id, userId, question, answer, model, tokensUsed, responseTime) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, requestData.userId, requestData.question, requestData.answer, requestData.model, requestData.tokensUsed, requestData.responseTime]
        );
        return id;
    },

    async getStats() {
        const [rows] = await pool.execute(`
            SELECT 
                COUNT(*) as totalRequests,
                COUNT(DISTINCT userId) as uniqueUsers,
                AVG(responseTime) as avgResponseTime,
                SUM(tokensUsed) as totalTokens
            FROM AIRequest 
            WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        `);
        return rows[0];
    }
};

// 兑换码相关查询
const redeemCodeQueries = {
    async create(codeData) {
        const id = 'code_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await pool.execute(
            'INSERT INTO RedeemCode (id, code, planType, duration, expiresAt) VALUES (?, ?, ?, ?, ?)',
            [id, codeData.code, codeData.planType, codeData.duration, codeData.expiresAt]
        );
        return await this.findById(id);
    },

    async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM RedeemCode WHERE id = ?', [id]);
        return rows[0];
    },

    async findByCode(code) {
        const [rows] = await pool.execute('SELECT * FROM RedeemCode WHERE code = ?', [code]);
        return rows[0];
    },

    async markAsUsed(id) {
        await pool.execute('UPDATE RedeemCode SET isUsed = TRUE WHERE id = ?', [id]);
        return await this.findById(id);
    },

    async getStats() {
        const [rows] = await pool.execute(`
            SELECT 
                COUNT(*) as totalCodes,
                SUM(CASE WHEN isUsed = TRUE THEN 1 ELSE 0 END) as usedCodes,
                SUM(CASE WHEN isUsed = FALSE AND (expiresAt IS NULL OR expiresAt > NOW()) THEN 1 ELSE 0 END) as activeCodes,
                SUM(CASE WHEN isUsed = FALSE AND expiresAt IS NOT NULL AND expiresAt <= NOW() THEN 1 ELSE 0 END) as expiredCodes
            FROM RedeemCode
        `);
        return rows[0];
    },

    async getPaginated(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.execute(`
            SELECT rc.*, r.userId as redemptionUserId, u.name as redemptionUserName, u.email as redemptionUserEmail,
                   r.startDate as redemptionStartDate, r.endDate as redemptionEndDate
            FROM RedeemCode rc
            LEFT JOIN Redemption r ON rc.id = r.redeemCodeId
            LEFT JOIN User u ON r.userId = u.id
            ORDER BY rc.createdAt DESC
            LIMIT ? OFFSET ?
        `, [limit, offset]);

        const [countRows] = await pool.execute('SELECT COUNT(*) as total FROM RedeemCode');
        const total = countRows[0].total;

        return {
            codes: rows,
            page,
            totalPages: Math.ceil(total / limit),
            total
        };
    }
};

// 兑换记录相关查询
const redemptionQueries = {
    async create(redemptionData) {
        const id = 'redeem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await pool.execute(
            'INSERT INTO Redemption (id, userId, redeemCodeId, planType, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?)',
            [id, redemptionData.userId, redemptionData.redeemCodeId, redemptionData.planType, redemptionData.startDate, redemptionData.endDate]
        );
        return await this.findById(id);
    },

    async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM Redemption WHERE id = ?', [id]);
        return rows[0];
    },

    async findByUserId(userId) {
        const [rows] = await pool.execute(`
            SELECT r.*, rc.code, rc.duration 
            FROM Redemption r
            JOIN RedeemCode rc ON r.redeemCodeId = rc.id
            WHERE r.userId = ?
            ORDER BY r.createdAt DESC
        `, [userId]);
        return rows;
    },

    async getCount() {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM Redemption');
        return rows[0].count;
    }
};

module.exports = {
    pool,
    testConnection,
    initDatabase,
    userQueries,
    subscriptionQueries,
    usageQueries,
    aiRequestQueries,
    redeemCodeQueries,
    redemptionQueries
};
