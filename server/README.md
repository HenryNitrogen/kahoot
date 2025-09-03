# Kahoot Quiz Info Display - 后端服务

## 功能特性

- 🤖 **AI查询服务**: 将AI查询移至后端，提高安全性和性能
- 📊 **数据处理**: 处理和存储quiz数据
- 🔒 **用户管理**: 支持多用户API密钥管理
- 🚀 **高性能**: 后端缓存和优化处理
- 🛡️ **安全性**: API密钥不暴露在前端

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

## API接口

### 1. AI答案查询

**POST** `/api/ai/answer`

请求体:
```json
{
  "question": "问题内容",
  "choices": ["选项1", "选项2", "选项3", "选项4"],
  "answersAllowed": 1,
  "userId": "default"
}
```

响应:
```json
{
  "success": true,
  "answer": "AI回答内容",
  "question": "问题内容",
  "choices": ["选项1", "选项2", "选项3", "选项4"]
}
```

### 2. 健康检查

**GET** `/api/health`

响应:
```json
{
  "status": "ok",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 3. Quiz数据处理

**POST** `/api/quiz/process`

请求体:
```json
{
  "quizData": {
    "currentQuestion": "问题",
    "currentChoices": ["选项数组"],
    "questionIndex": 0,
    "totalQuestions": 10
  }
}
```

### 4. 用户注册

**POST** `/api/user/register`

请求体:
```json
{
  "userId": "用户ID",
  "apiKey": "用户的API密钥"
}
```

## Chrome扩展集成

扩展会优先尝试使用后端API，如果后端不可用会自动回退到直接API调用：

1. **后端优先**: 首先尝试调用 `http://localhost:3001/api/ai/answer`
2. **自动回退**: 如果后端不可用，自动回退到直接调用AI API
3. **数据同步**: 可选地将quiz数据发送到后端进行处理和存储

## 安全特性

- ✅ CORS配置，只允许来自Kahoot.it和chrome扩展的请求
- ✅ Helmet.js安全头部
- ✅ API密钥存储在后端，前端不暴露
- ✅ 输入验证和错误处理
- ✅ 用户身份验证

## 开发

### 目录结构

```
server/
├── server.js          # 主服务器文件
├── package.json       # 依赖配置
├── .env.example       # 环境变量模板
├── .env              # 环境变量（需要创建）
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
