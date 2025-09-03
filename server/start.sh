#!/bin/bash
# 启动Kahoot Quiz服务器

echo "🚀 正在启动 Kahoot Quiz 服务器..."

# 检查是否安装了Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查是否安装了npm
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

# 进入server目录
cd "$(dirname "$0")"

# 检查是否存在node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    npm install
fi

# 复制环境变量文件（如果不存在）
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "📄 已创建 .env 文件，您可以根据需要修改配置"
    fi
fi

# 启动服务器
echo "🎯 服务器启动中..."
npm start
