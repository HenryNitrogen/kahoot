#!/bin/bash

# Kahoot AI助手 Chrome扩展打包脚本

echo "🚀 开始打包Kahoot AI助手扩展..."

# 设置变量
EXTENSION_DIR="web/public/extension"
BUILD_DIR="extension-build"
ZIP_NAME="kahoot-ai-helper-$(date +%Y%m%d-%H%M%S).zip"

# 检查扩展目录是否存在
if [ ! -d "$EXTENSION_DIR" ]; then
    echo "❌ 扩展目录不存在: $EXTENSION_DIR"
    exit 1
fi

# 创建构建目录
echo "📁 创建构建目录..."
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# 复制扩展文件
echo "📋 复制扩展文件..."
cp -r "$EXTENSION_DIR"/* "$BUILD_DIR/"

# 检查必需文件
echo "🔍 检查必需文件..."
required_files=("manifest.json" "content.js" "popup.html" "popup.js")
missing_files=()

for file in "${required_files[@]}"; do
    if [ ! -f "$BUILD_DIR/$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ 缺少必需文件: ${missing_files[*]}"
    echo "请确保所有必需文件都存在于 $EXTENSION_DIR 目录中"
    exit 1
fi

# 检查图标文件
echo "🖼️ 检查图标文件..."
icon_files=("icon16.png" "icon48.png" "icon128.png")
for icon in "${icon_files[@]}"; do
    if [ ! -f "$BUILD_DIR/$icon" ]; then
        echo "⚠️ 警告: 图标文件不存在: $icon"
        echo "  请添加图标文件或更新manifest.json"
    fi
done

# 验证manifest.json
echo "✅ 验证manifest.json..."
if ! python3 -m json.tool "$BUILD_DIR/manifest.json" > /dev/null 2>&1; then
    echo "❌ manifest.json格式错误"
    exit 1
fi

# 移除开发文件（如果存在）
echo "🧹 清理开发文件..."
dev_files=("*.md" "*.txt" ".DS_Store" "Thumbs.db")
for pattern in "${dev_files[@]}"; do
    find "$BUILD_DIR" -name "$pattern" -type f -delete 2>/dev/null || true
done

# 检查文件大小
echo "📊 检查文件大小..."
total_size=$(du -sh "$BUILD_DIR" | cut -f1)
echo "扩展总大小: $total_size"

# 创建ZIP文件
echo "📦 创建ZIP文件..."
cd "$BUILD_DIR"
zip -r "../$ZIP_NAME" . -x "*.DS_Store*" "*.md" "*.txt"
cd ..

# 验证ZIP文件
if [ -f "$ZIP_NAME" ]; then
    zip_size=$(du -sh "$ZIP_NAME" | cut -f1)
    echo "✅ 扩展打包完成!"
    echo "📁 输出文件: $ZIP_NAME"
    echo "📊 文件大小: $zip_size"
    echo ""
    echo "📝 安装说明:"
    echo "1. 打开Chrome浏览器"
    echo "2. 访问 chrome://extensions/"
    echo "3. 开启'开发者模式'"
    echo "4. 解压 $ZIP_NAME"
    echo "5. 点击'加载已解压的扩展程序'"
    echo "6. 选择解压后的文件夹"
    echo ""
    echo "🌐 或者提交到Chrome Web Store:"
    echo "1. 访问 https://chrome.google.com/webstore/devconsole/"
    echo "2. 上传 $ZIP_NAME 文件"
    echo "3. 填写应用详情并提交审核"
else
    echo "❌ 打包失败!"
    exit 1
fi

# 清理构建目录
echo "🧹 清理构建目录..."
rm -rf "$BUILD_DIR"

echo "🎉 所有操作完成!"
