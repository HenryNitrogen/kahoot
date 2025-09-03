# 🚀 Kahoot Helper - 后端API服务

## 🌟 功能特性

- 🤖 **AI智能问答**: 集成多种AI模型，提供准确的问题解答
- � **用户认证系统**: JWT认证，支持注册登录
- � **使用统计管理**: 追踪用户使用情况和限制
- 🎫 **兑换码系统**: 支持激活码兑换订阅
- � **订阅管理**: 多层级订阅计划
- � **安全防护**: API密钥保护，CORS配置
- 📈 **管理员后台**: 完整的后台管理功能

## 安装和运行

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env` 并根据需要修改：

```bash
cp .env.example .env
```

### 3. 启动服务器

```bash
# 开发模式
npm run dev

# 生产模式
npm start

# 或者使用启动脚本
./start.sh
```

### 4. 验证服务

访问 http://localhost:3001/api/health 检查服务状态

## 📡 API接口文档

### 🔐 认证相关

#### 用户注册
- **POST** `/api/auth/register`
- **请求体**:
```json
{
  "name": "用户名",
  "email": "user@example.com", 
  "password": "密码"
}
```
- **响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "user": { "id": "user_id", "name": "用户名", "email": "user@example.com" },
  "token": "jwt_token"
}
```

#### 用户登录
- **POST** `/api/auth/login`
- **请求体**:
```json
{
  "email": "user@example.com",
  "password": "密码"
}
```

#### 获取用户信息
- **GET** `/api/auth/me`
- **Headers**: `Authorization: Bearer <jwt_token>`

### 🤖 AI问答

#### 智能问答
- **POST** `/api/ai/answer`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **请求体**:
```json
{
  "question": "问题内容",
  "choices": ["选项A", "选项B", "选项C", "选项D"],
  "model": "gemini-2.0-flash"
}
```
- **响应**:
```json
{
  "success": true,
  "answer": "正确答案是：选项A",
  "confidence": 0.95,
  "usage": {
    "requestsToday": 5,
    "limitPerDay": 100
  }
}
```

### 🎫 兑换码系统

#### 兑换激活码
- **POST** `/api/redeem`
- **Headers**: `Authorization: Bearer <jwt_token>`
- **请求体**:
```json
{
  "code": "ABCD-EFGH-IJKL"
}
```

#### 获取兑换记录
- **GET** `/api/redeem`
- **Headers**: `Authorization: Bearer <jwt_token>`

### ⚙️ 管理员接口

#### 管理员仪表板
- **GET** `/api/admin/dashboard`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **响应**:
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "totalCodes": 500,
    "usedCodes": 320,
    "totalRequests": 15000
  }
}
```

#### 创建兑换码
- **POST** `/api/admin/codes`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **请求体**:
```json
{
  "plan": "premium",
  "duration": 30,
  "quantity": 10
}
```

#### 获取兑换码列表
- **GET** `/api/admin/codes`
- **Headers**: `Authorization: Bearer <admin_jwt_token>`
- **查询参数**: `?page=1&limit=10`

### 💊 系统监控

#### 健康检查
- **GET** `/api/health`
- **响应**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "database": "mysql"
}
```

## 🔧 环境配置

复制 `.env.example` 到 `.env` 并配置以下变量：

```bash
# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=kahoot
DB_USER=username
DB_PASSWORD=password

# 服务器配置
PORT=932

# AI API配置
AI_API_URL=https://api.henryni.cn/v1/chat/completions
AI_MODEL=gemini-2.0-flash
DEFAULT_API_KEY=your-ai-api-key

# CORS配置
ALLOWED_ORIGINS=https://kahoot.it,chrome-extension://*

# 日志级别
LOG_LEVEL=info
```

## 📊 订阅计划

| 计划 | 每日请求 | 功能特色 |
|------|----------|----------|
| Free | 10次 | 基础AI问答 |
| Premium | 100次 | 高级AI模型 |
| Pro | 1000次 | 优先支持 |

## 🛡️ 安全特性

- ✅ **JWT认证**: 安全的用户身份验证
- ✅ **CORS保护**: 限制跨域访问
- ✅ **API限流**: 防止滥用
- ✅ **输入验证**: 防止注入攻击
- ✅ **Helmet.js**: HTTP安全头部

## 🚀 部署指南

### PM2部署
```bash
npm install -g pm2
pm2 start server.js --name kahoot-server
pm2 startup
pm2 save
```

### Docker部署
```bash
docker build -t kahoot-server .
docker run -p 932:932 --env-file .env kahoot-server
```

## 开发

## 📁 项目结构

```
server/
├── server.js          # 主服务器文件
├── database.js        # 数据库连接和查询
├── package.json       # 依赖配置
├── .env              # 环境变量（需要创建）
├── .env.example      # 环境变量模板
├── start.sh          # 启动脚本
└── README.md         # 说明文档
```

### 环境变量

- `PORT`: 服务器端口（默认3001）
- `AI_API_URL`: AI API地址
- `AI_MODEL`: AI模型名称
- `DEFAULT_API_KEY`: 默认API密钥
- `ALLOWED_ORIGINS`: 允许的CORS源
- `LOG_LEVEL`: 日志级别

## 故障排除

### 1. 端口占用

如果3001端口被占用，修改 `.env` 文件中的 `PORT` 配置

### 2. CORS错误

检查 `ALLOWED_ORIGINS` 配置是否正确

### 3. AI API错误

检查API密钥是否有效，网络是否可达

## 生产部署

建议使用PM2或Docker进行生产部署：

```bash
# 使用PM2
npm install -g pm2
pm2 start server.js --name kahoot-quiz-server

# 使用Docker (需要先创建Dockerfile)
docker build -t kahoot-quiz-server .
docker run -p 3001:3001 kahoot-quiz-server
```
