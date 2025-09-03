# 🌐 Kahoot Helper - Web管理面板

基于Next.js构建的现代化Web应用，为Kahoot Helper系统提供用户管理、订阅管理和管理员后台功能。

## 🌟 主要功能

- 👤 **用户管理**: 注册、登录、个人资料管理
- 📊 **使用仪表板**: 实时查看使用统计和订阅状态
- 🎫 **兑换码系统**: 激活码兑换和历史记录
- ⚙️ **管理员后台**: 用户管理、数据统计、兑换码管理
- 📥 **扩展下载**: Chrome扩展下载和安装指导
- 💳 **订阅管理**: 订阅计划查看和续费

## 🚀 快速开始

### 安装依赖
```bash
cd web
npm install
```

### 环境配置
复制并配置环境变量：
```bash
cp .env.local.example .env.local
```

### 开发模式
```bash
npm run dev
```
访问 [http://localhost:3000](http://localhost:3000)

### 生产构建
```bash
npm run build
npm start
```

## 📁 项目结构

```
web/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局组件
│   ├── page.tsx           # 首页
│   ├── admin/             # 管理员页面
│   ├── api/               # API路由
│   ├── dashboard/         # 用户仪表板
│   ├── download/          # 扩展下载页面
│   ├── login/            # 登录页面
│   ├── register/         # 注册页面
│   └── redeem/           # 兑换码页面
├── lib/                   # 工具库
├── prisma/               # 数据库模式
├── public/               # 静态资源
└── scripts/              # 脚本文件
```

## 🔧 API路由

### 认证API (`/api/auth/`)
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取用户信息

### 兑换API (`/api/redeem`)
- `POST /api/redeem` - 兑换激活码

### 管理员API (`/api/admin/`)
- `GET /api/admin/dashboard` - 管理员仪表板
- `POST /api/admin/codes` - 创建兑换码
- `GET /api/admin/codes` - 获取兑换码列表

## 🚀 部署

### Vercel部署
The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel

# 配置环境变量
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
```

### Docker部署
```bash
docker build -t kahoot-web .
docker run -p 3000:3000 --env-file .env.local kahoot-web
```

## 🧪 测试

访问 `/test` 页面进行系统集成测试：
- ✅ 服务器连接测试
- ✅ 数据库连接测试  
- ✅ 用户认证测试
- ✅ API接口测试

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

🌐 **现代化的Web管理界面，让管理更简单！**
