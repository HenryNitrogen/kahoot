# 📁 Kahoot Helper - 项目结构说明

## 🏗️ 整体架构

```
kahoot/                     # 项目根目录
├── extension/              # Chrome浏览器扩展
├── server/                # Node.js后端API服务
├── web/                   # Next.js Web管理面板
├── .gitignore            # Git忽略文件配置
├── README.md             # 项目总览文档
└── TESTING.md            # 系统测试指南
```

## 🧩 Extension - Chrome扩展

```
extension/
├── manifest.json           # 扩展配置文件
├── content.js             # 内容脚本 - 主要逻辑
├── background.js          # 后台服务脚本
├── popup.html             # 扩展弹窗页面
├── popup.js               # 弹窗交互逻辑
├── auth.js                # 用户认证管理模块
├── login-ui.js            # 动态登录界面组件
├── TROUBLESHOOTING.md     # 扩展故障排除指南
└── README.md              # 扩展详细说明文档
```

### 核心文件功能

- **`manifest.json`** - 扩展权限配置、脚本加载配置
- **`content.js`** - 监控Kahoot页面、提取问题、调用AI API、UI渲染
- **`auth.js`** - JWT token管理、用户状态管理、服务器通信
- **`login-ui.js`** - 动态创建登录表单、验证逻辑

## 🔧 Server - 后端API服务

```
server/
├── server.js              # Express服务器主文件
├── database.js            # MySQL数据库连接和查询
├── package.json           # Node.js项目配置和依赖
├── .env                   # 环境变量配置 (需要创建)
├── .env.example           # 环境变量模板
├── start.sh               # 服务器启动脚本
└── README.md              # 服务器API文档
```

### 核心功能模块

- **`server.js`** - REST API路由、认证中间件、业务逻辑
- **`database.js`** - 数据库操作封装、查询方法、连接管理

### API端点结构

```
/api/
├── auth/                  # 用户认证相关
│   ├── register          # POST - 用户注册
│   ├── login             # POST - 用户登录
│   └── me                # GET - 获取用户信息
├── ai/
│   └── answer            # POST - AI问答服务
├── admin/                # 管理员功能
│   ├── dashboard         # GET - 仪表板统计
│   └── codes             # GET/POST - 兑换码管理
├── redeem                # POST - 兑换激活码
└── health                # GET - 服务器健康检查
```

## 🌐 Web - Next.js管理面板

```
web/
├── app/                   # Next.js 13+ App Router
│   ├── layout.tsx         # 根布局组件
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式文件
│   ├── api/               # API路由处理
│   │   ├── auth/          # 认证API
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   └── me/route.ts
│   │   ├── admin/         # 管理员API
│   │   │   ├── dashboard/route.ts
│   │   │   └── codes/route.ts
│   │   ├── payment/       # 支付相关API
│   │   └── redeem/route.ts
│   ├── dashboard/         # 用户仪表板页面
│   ├── admin/             # 管理员后台页面
│   ├── login/             # 登录页面
│   ├── register/          # 注册页面
│   ├── redeem/            # 兑换码页面
│   ├── download/          # 扩展下载页面
│   ├── extension/         # 扩展相关页面
│   └── test/              # 系统测试页面
├── lib/                   # 工具库和服务
│   ├── auth.ts            # NextAuth配置
│   ├── prisma.ts          # Prisma客户端
│   ├── userService.ts     # 用户服务
│   └── redeemCodeService.ts
├── prisma/                # 数据库ORM
│   ├── schema.prisma      # 数据库模式定义
│   └── dev.db             # 开发环境SQLite数据库
├── public/                # 静态资源
│   ├── extension/         # 扩展相关静态文件
│   └── *.svg              # 图标文件
├── scripts/               # 工具脚本
│   └── updateAdmin.ts     # 管理员权限更新脚本
├── package.json           # 前端项目配置
├── next.config.ts         # Next.js配置
├── tsconfig.json          # TypeScript配置
├── postcss.config.mjs     # PostCSS配置
├── eslint.config.mjs      # ESLint配置
└── README.md              # Web应用说明文档
```

## 🗄️ 数据库结构

### 主要数据表

```sql
Users                      # 用户表
├── id (主键)
├── email (邮箱,唯一)
├── name (用户名)
├── password (加密密码)
├── isAdmin (管理员标识)
└── timestamps

Subscriptions              # 订阅表
├── id (主键)
├── userId (外键→Users)
├── plan (订阅计划)
├── status (状态)
├── endDate (到期时间)
└── timestamps

Usage                      # 使用记录表
├── id (主键)
├── userId (外键→Users)
├── date (使用日期)
├── requestsCount (请求次数)
└── timestamps

RedeemCodes               # 兑换码表
├── id (主键)
├── code (兑换码)
├── plan (对应计划)
├── duration (有效期天数)
├── isUsed (是否已使用)
├── usedBy (使用者ID)
└── timestamps

AIRequests                # AI请求记录表
├── id (主键)
├── userId (外键→Users)
├── question (问题内容)
├── answer (AI回答)
├── model (使用的AI模型)
└── timestamp
```

## 🔄 数据流向

### 用户问答流程
```
Kahoot页面 → Chrome扩展 → 后端API → AI服务 → 数据库记录 → 返回答案
```

### 认证流程
```
Web端/扩展 → 登录请求 → 后端验证 → JWT生成 → 客户端存储 → API调用携带Token
```

### 管理流程
```
管理员登录 → Web管理后台 → 管理API → 数据库操作 → 实时统计更新
```

## 🚀 部署架构

### 开发环境
```
localhost:3000  - Next.js Web应用
localhost:932   - Express API服务器  
localhost:3306  - MySQL数据库
Chrome扩展      - 开发者模式加载
```

### 生产环境
```
your-domain.com     - Web应用 (Vercel/自建)
api.your-domain.com - API服务器 (VPS/云服务)
数据库服务器         - MySQL (云数据库/自建)
Chrome商店          - 扩展发布
```

## 📦 依赖关系

### 技术栈
- **前端**: Next.js 14, React, TypeScript, Tailwind CSS
- **后端**: Node.js, Express, MySQL, JWT
- **扩展**: Vanilla JavaScript, Chrome Extension API
- **数据库**: MySQL (生产), SQLite (开发)
- **部署**: Vercel, PM2, Docker

### 关键依赖
```json
{
  "server": ["express", "mysql2", "jsonwebtoken", "bcryptjs"],
  "web": ["next", "react", "prisma", "@auth/prisma-adapter"],
  "extension": ["chrome-extension-api"]
}
```

## 🔐 安全架构

### 认证层级
1. **无认证**: 健康检查、静态资源
2. **用户认证**: 基本AI问答、个人信息
3. **管理员认证**: 后台管理、系统统计

### 数据保护
- API调用全部使用HTTPS
- 密码使用bcrypt加密存储
- JWT token有过期时间
- CORS限制跨域访问
- 输入验证防止注入攻击

---

📁 **清晰的项目结构，便于开发和维护！**
