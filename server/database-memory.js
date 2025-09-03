// 内存数据库实现 - 用于测试和演示
class MemoryDatabase {
    constructor() {
        this.users = new Map();
        this.userUsage = new Map();
        this.quizLogs = [];
        this.payments = new Map();
        this.connected = false;
    }

    // 模拟连接
    async connect() {
        this.connected = true;
        console.log('✅ 内存数据库连接成功');
        return true;
    }

    // 模拟执行查询
    async execute(query, params = []) {
        if (!this.connected) {
            throw new Error('Database not connected');
        }

        const sql = query.toLowerCase().trim();

        // CREATE TABLE 操作
        if (sql.startsWith('create table')) {
            return [{ affectedRows: 0 }];
        }

        // INSERT 操作
        if (sql.startsWith('insert into users')) {
            const [id, email, passwordHash, name] = params;
            this.users.set(id, {
                id,
                email,
                password_hash: passwordHash,
                name,
                plan: 'free',
                subscription_expires_at: null,
                subscription_status: 'trial',
                created_at: new Date().toISOString()
            });
            return [{ insertId: id, affectedRows: 1 }];
        }

        if (sql.startsWith('insert into user_usage')) {
            const [userId, date, requestsCount] = params;
            const key = `${userId}-${date}`;
            this.userUsage.set(key, {
                user_id: userId,
                date,
                requests_count: requestsCount || 0
            });
            return [{ insertId: Date.now(), affectedRows: 1 }];
        }

        if (sql.startsWith('insert into quiz_logs')) {
            const [userId, question, choices, aiAnswer] = params;
            this.quizLogs.push({
                id: this.quizLogs.length + 1,
                user_id: userId,
                question,
                choices,
                ai_answer: aiAnswer,
                answered_at: new Date().toISOString()
            });
            return [{ insertId: this.quizLogs.length, affectedRows: 1 }];
        }

        if (sql.startsWith('insert into payments')) {
            const [id, userId, plan, amount, status] = params;
            this.payments.set(id, {
                id,
                user_id: userId,
                plan,
                amount,
                status,
                created_at: new Date().toISOString()
            });
            return [{ insertId: id, affectedRows: 1 }];
        }

        // SELECT 操作
        if (sql.includes('select') && sql.includes('from users')) {
            if (sql.includes('where email =')) {
                const email = params[0];
                const user = Array.from(this.users.values()).find(u => u.email === email);
                return user ? [
                    [user]
                ] : [
                    []
                ];
            }
            if (sql.includes('where id =')) {
                const id = params[0];
                const user = this.users.get(id);
                return user ? [
                    [user]
                ] : [
                    []
                ];
            }
        }

        if (sql.includes('select') && sql.includes('from user_usage')) {
            if (sql.includes('where user_id =') && sql.includes('and date =')) {
                const [userId, date] = params;
                const key = `${userId}-${date}`;
                const usage = this.userUsage.get(key);
                return usage ? [
                    [usage]
                ] : [
                    []
                ];
            }
            if (sql.includes('sum(requests_count)')) {
                const userId = params[0];
                let total = 0;
                for (const [key, usage] of this.userUsage) {
                    if (key.startsWith(userId)) {
                        total += usage.requests_count;
                    }
                }
                return [
                    [{ total_requests: total }]
                ];
            }
        }

        if (sql.includes('select') && sql.includes('from payments')) {
            if (sql.includes('where id =')) {
                const id = params[0];
                const payment = this.payments.get(id);
                return payment ? [
                    [payment]
                ] : [
                    []
                ];
            }
        }

        // UPDATE 操作
        if (sql.startsWith('update user_usage')) {
            const [userId, date] = params;
            const key = `${userId}-${date}`;
            const usage = this.userUsage.get(key);
            if (usage) {
                usage.requests_count += 1;
                this.userUsage.set(key, usage);
                return [{ affectedRows: 1 }];
            }
            return [{ affectedRows: 0 }];
        }

        if (sql.startsWith('update users')) {
            const [plan, expiresAt, status, userId] = params;
            const user = this.users.get(userId);
            if (user) {
                user.plan = plan;
                user.subscription_expires_at = expiresAt;
                user.subscription_status = status;
                this.users.set(userId, user);
                return [{ affectedRows: 1 }];
            }
            return [{ affectedRows: 0 }];
        }

        if (sql.startsWith('update payments')) {
            const [status, id] = params;
            const payment = this.payments.get(id);
            if (payment) {
                payment.status = status;
                this.payments.set(id, payment);
                return [{ affectedRows: 1 }];
            }
            return [{ affectedRows: 0 }];
        }

        // 系统查询
        if (sql.includes('select 1 as test')) {
            return [
                [{ test: 1 }]
            ];
        }

        if (sql.includes('information_schema.tables')) {
            return [
                [
                    { TABLE_NAME: 'users' },
                    { TABLE_NAME: 'user_usage' },
                    { TABLE_NAME: 'quiz_logs' },
                    { TABLE_NAME: 'payments' }
                ]
            ];
        }

        if (sql.includes('count(*)')) {
            if (sql.includes('from users')) {
                return [
                    [{ count: this.users.size }]
                ];
            }
            if (sql.includes('from user_usage')) {
                return [
                    [{ count: this.userUsage.size }]
                ];
            }
        }

        // 默认返回空结果
        return [
            []
        ];
    }

    async getConnection() {
        return {
            execute: this.execute.bind(this),
            release: () => {}
        };
    }

    async end() {
        this.connected = false;
        console.log('✅ 内存数据库连接已关闭');
    }
}

// 创建内存数据库实例
const memoryDB = new MemoryDatabase();

// 创建pool接口兼容性
const pool = {
    execute: memoryDB.execute.bind(memoryDB),
    getConnection: memoryDB.getConnection.bind(memoryDB),
    end: memoryDB.end.bind(memoryDB)
};

// 测试数据库连接
const testConnection = async() => {
    try {
        await memoryDB.connect();
        return true;
    } catch (error) {
        console.error('❌ 内存数据库连接失败:', error.message);
        return false;
    }
};

// 初始化数据库表
const initDatabase = async() => {
    try {
        console.log('✅ 内存数据库表初始化完成');
        return true;
    } catch (error) {
        console.error('❌ 内存数据库初始化失败:', error.message);
        return false;
    }
};

module.exports = {
    pool,
    testConnection,
    initDatabase
};