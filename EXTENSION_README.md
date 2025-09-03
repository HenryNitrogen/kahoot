# Kahoot AI助手 - Chrome扩展

## 项目概述

这是一个基于AI的Kahoot答题助手，包含：
- **服务端**：Next.js应用，处理用户认证、AI请求、用量管理
- **客户端**：Chrome扩展，在kahoot.it页面提供智能答题辅助

## 功能特点

### 🤖 AI智能答题
- 实时解析Kahoot题目和选项
- 调用AI模型提供答案建议
- 显示置信度和推理过程

### 👤 用户系统
- 用户注册/登录
- 不同会员等级（免费、高级、专业）
- 使用次数限制和统计

### 💰 商业化功能
- 免费用户：每日10次，每月100次
- 高级会员：每日100次，每月1000次
- 专业会员：每日500次，每月5000次
- 兑换码系统
- 支付集成（已有基础框架）

### 📊 数据分析
- 使用情况统计
- AI请求记录
- 用户行为分析

## 安装和部署

### 1. 环境准备

```bash
# 克隆项目
cd /Users/henrynitrogen/hi/projects/kahoot

# 安装依赖
cd web
npm install

# 配置环境变量
cp ../.env.example .env.local
# 编辑 .env.local 填入实际配置
```

### 2. 数据库设置

```bash
# 生成Prisma客户端
npx prisma generate

# 推送数据库结构
npx prisma db push

# （可选）查看数据库
npx prisma studio
```

### 3. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3001 运行

### 4. 安装Chrome扩展

1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 `web/public/extension` 目录
6. 扩展安装完成

## 使用指南

### 服务端使用

1. 访问 http://localhost:3001
2. 注册账户或使用现有账户登录
3. 在控制面板查看使用情况
4. 管理订阅和兑换码

### 扩展使用

1. 访问 https://kahoot.it 并加入游戏
2. 点击扩展图标登录账户
3. 等待题目出现，AI将自动分析并提供答案
4. 查看AI推荐和置信度
5. 根据需要调整显示设置

## API接口

### 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息

### AI答题
- `POST /api/ai/answer` - 获取AI答案
- `GET /api/ai/answer` - 获取用户使用情况

### 管理相关
- `GET /api/admin/dashboard` - 管理员仪表板
- `POST /api/admin/codes` - 生成兑换码

### 兑换系统
- `POST /api/redeem` - 兑换码兑换

## 技术架构

### 后端技术栈
- **框架**：Next.js 15.5.2
- **数据库**：MySQL + Prisma ORM
- **认证**：JWT + bcrypt
- **AI集成**：自定义API调用

### 前端技术栈
- **UI框架**：React 19.1.0
- **样式**：Tailwind CSS 4
- **状态管理**：React hooks
- **图标**：Lucide React

### 扩展技术栈
- **清单版本**：Manifest V3
- **内容脚本**：原生JavaScript
- **存储**：Chrome Storage API
- **权限**：activeTab, storage

## 部署到生产环境

### 1. 服务端部署

```bash
# 构建应用
npm run build

# 启动生产服务器
npm run start
```

### 2. 环境变量配置

更新生产环境的环境变量：
- `DATABASE_URL`: 生产数据库连接
- `NEXT_PUBLIC_BASE_URL`: 你的域名
- `JWT_SECRET`: 强随机密钥
- `AI_API_KEY`: 生产AI API密钥

### 3. 扩展发布

1. 更新 `manifest.json` 中的主机权限
2. 更新 `content.js` 和 `popup.js` 中的API地址
3. 添加实际的扩展图标
4. 打包扩展文件
5. 提交到Chrome Web Store

## 商业化建议

### 定价策略
- **免费版**：每日10次，适合偶尔使用
- **高级版**：$4.99/月，每日100次，适合学生
- **专业版**：$9.99/月，每日500次，适合教师

### 营销策略
- 社交媒体推广
- 教育机构合作
- 口碑营销
- 免费试用期

### 功能扩展
- 多语言支持
- 题目收藏功能
- 答题历史记录
- 团队共享功能
- 自定义AI模型

## 安全考虑

1. **API安全**：所有敏感操作需要认证
2. **用量限制**：防止API滥用
3. **数据保护**：加密存储敏感信息
4. **输入验证**：严格验证用户输入

## 监控和分析

建议集成以下工具：
- **错误监控**：Sentry
- **分析工具**：Google Analytics
- **性能监控**：Vercel Analytics
- **用户反馈**：内置反馈系统

## 开发注意事项

1. **本地开发**：使用localhost地址
2. **生产环境**：更新所有硬编码的URL
3. **API限制**：合理设置请求频率限制
4. **用户体验**：保证界面响应速度
5. **错误处理**：提供友好的错误信息

## 许可证和法律

请确保：
1. 遵守Kahoot的使用条款
2. 不干扰正常游戏体验
3. 明确告知用户这是辅助工具
4. 符合当地法律法规

## 支持和维护

- 定期更新AI模型
- 监控API使用情况
- 收集用户反馈
- 修复bug和安全漏洞
- 优化用户体验

---

**注意**：这是一个教育和学习辅助工具，请负责任地使用，遵守相关平台的使用条款。
