# 🎯 Kahoot Helper - AI增强问答助手

一个智能的Kahoot问答助手系统，集成了AI问答功能、用户管理、订阅系统和Chrome扩展。

## 🏗️ 项目架构

```
kahoot/
├── extension/          # Chrome浏览器扩展
├── server/            # Node.js后端API服务
├── web/              # Next.js Web应用
├── STRUCTURE.md      # 详细项目结构说明
└── TESTING.md        # 系统测试指南
```

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd kahoot
```

### 2. 启动后端服务
```bash
cd server
npm install
cp .env.example .env  # 配置环境变量
npm start
```

### 3. 启动Web应用
```bash
cd web
npm install
npm run dev
```

### 4. 安装Chrome扩展
1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `extension` 文件夹

## 📁 目录结构详解

### 🔧 Server (后端服务)
```
server/
├── server.js          # 主服务器文件
├── database.js        # 数据库连接和查询
├── package.json       # Node.js依赖配置
├── .env               # 环境变量配置
├── .env.example       # 环境变量模板
├── start.sh          # 启动脚本
└── README.md         # 服务器文档
```

**主要功能：**
- 🤖 AI问答服务
- 👤 用户认证和管理
- 📊 使用统计和限制
- 🎫 兑换码系统
- 💳 订阅管理

### 🌐 Web (前端应用)
```
web/
├── app/              # Next.js应用目录
├── lib/              # 工具库和服务
├── prisma/           # 数据库模式
├── public/           # 静态资源
├── scripts/          # 脚本文件
└── package.json      # 前端依赖配置
```

**主要页面：**
- 🏠 首页和登录
- 📊 用户仪表板
- ⚙️ 管理员后台
- 🎫 兑换码管理
- 📥 扩展下载

### 🧩 Extension (Chrome扩展)
```
extension/
├── manifest.json     # 扩展配置文件
├── content.js        # 内容脚本
├── background.js     # 后台脚本
├── popup.html        # 弹窗界面
├── popup.js          # 弹窗逻辑
├── auth.js          # 认证管理
├── login-ui.js      # 登录界面
└── TROUBLESHOOTING.md # 故障排除
```

**主要功能：**
- 🔍 自动检测Kahoot问题
- 🤖 AI智能答题
- 🎨 美观的答案显示界面
- 👤 用户登录和认证
- 📱 实时状态更新

## 🛠️ API接口文档

### 认证相关 API

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "用户名",
  "email": "user@example.com",
  "password": "密码"
}
```

**响应:**
```json
{
  "success": true,
  "message": "注册成功",
  "user": {
    "id": "user_id",
    "name": "用户名",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "密码"
}
```

**响应:**
```json
{
  "success": true,
  "message": "登录成功",
  "user": {
    "id": "user_id",
    "name": "用户名",
    "email": "user@example.com",
    "plan": "free"
  },
  "token": "jwt_token"
}
```

#### 获取用户信息
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

**响应:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "用户名",
    "email": "user@example.com",
    "plan": "free",
    "subscription": {
      "status": "active",
      "endDate": "2024-12-31T23:59:59Z"
    }
  }
}
```

### AI问答 API

#### 获取AI答案
```http
POST /api/ai/answer
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "question": "问题内容",
  "choices": ["选项A", "选项B", "选项C", "选项D"],
  "model": "gemini-2.0-flash"
}
```

**响应:**
```json
{
  "success": true,
  "answer": "正确答案是：选项A",
  "question": "问题内容",
  "choices": ["选项A", "选项B", "选项C", "选项D"],
  "confidence": 0.95,
  "usage": {
    "requestsToday": 5,
    "limitPerDay": 100
  }
}
```

### 兑换码 API

#### 兑换激活码
```http
POST /api/redeem
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "code": "ABCD-EFGH-IJKL"
}
```

**响应:**
```json
{
  "success": true,
  "message": "兑换成功",
  "subscription": {
    "plan": "premium",
    "endDate": "2024-12-31T23:59:59Z"
  }
}
```

### 管理员 API

#### 创建兑换码
```http
POST /api/admin/codes
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "plan": "premium",
  "duration": 30,
  "quantity": 10
}
```

**响应:**
```json
{
  "success": true,
  "message": "创建成功",
  "codes": [
    {
      "id": "code_id",
      "code": "ABCD-EFGH-IJKL",
      "plan": "premium",
      "duration": 30,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### 获取管理员仪表板
```http
GET /api/admin/dashboard
Authorization: Bearer <admin_jwt_token>
```

**响应:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1250,
    "totalCodes": 500,
    "usedCodes": 320,
    "totalRequests": 15000,
    "todayRequests": 450
  }
}
```

### 健康检查 API

#### 服务器状态
```http
GET /api/health
```

**响应:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "database": "mysql"
}
```

## 🔧 配置说明

### 环境变量 (server/.env)
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

### Chrome扩展配置 (extension/manifest.json)
```json
{
  "name": "Kahoot Helper",
  "version": "1.0.0",
  "manifest_version": 3,
  "permissions": ["activeTab", "storage"],
  "host_permissions": ["https://kahoot.it/*", "http://localhost:*"],
  "content_scripts": [{
    "matches": ["https://kahoot.it/*"],
    "js": ["auth.js", "login-ui.js", "content.js"]
  }]
}
```

## 🔐 认证流程

1. **用户注册/登录** → 获取JWT Token
2. **Token存储** → Chrome扩展本地存储
3. **API调用** → 每次请求携带Authorization头
4. **Token验证** → 服务器验证用户身份和权限
5. **使用限制** → 基于用户订阅等级限制使用次数

## 📊 订阅计划

| 计划 | 每日请求次数 | 价格 | 功能 |
|------|-------------|------|------|
| Free | 10次 | 免费 | 基础AI问答 |
| Premium | 100次 | ¥9.9/月 | 高级AI模型 |
| Pro | 1000次 | ¥19.9/月 | 优先支持 |

## 🧪 测试

访问 [测试页面](http://localhost:3000/test) 进行系统集成测试：
- ✅ 服务器健康检查
- ✅ 数据库连接测试
- ✅ 用户认证测试
- ✅ AI接口测试

详细测试说明请参考 [TESTING.md](./TESTING.md)

## 🚀 部署

### 生产环境部署

1. **服务器部署**
```bash
# 使用PM2
npm install -g pm2
pm2 start server/server.js --name kahoot-server

# 使用Docker
docker build -t kahoot-server ./server
docker run -p 932:932 kahoot-server
```

2. **Web应用部署**
```bash
cd web
npm run build
npm start
```

3. **扩展打包**
```bash
cd extension
zip -r kahoot-helper.zip * -x "*.md"
```

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 支持

如遇问题，请：
1. 查看 [故障排除文档](./extension/TROUBLESHOOTING.md)
2. 运行 [系统测试](http://localhost:3000/test)
3. 提交 [Issue](../../issues)

---

🎯 **让AI助你在Kahoot中脱颖而出！**
