# 🧩 Kahoot Helper - Chrome浏览器扩展

一个智能的Chrome扩展，为Kahoot问答游戏提供AI答题助手功能。

## 🌟 主要功能

- 🔍 **自动检测问题**: 实时监控Kahoot页面，自动识别问题和选项
- 🤖 **AI智能答题**: 接入先进的AI模型，提供准确的答案建议
- 🎨 **美观界面**: 现代化的用户界面，不影响游戏体验
- 👤 **用户认证**: 安全的登录系统，支持多用户管理
- 📊 **使用统计**: 实时显示使用次数和订阅状态
- 🔄 **离线回退**: 后端不可用时自动回退到本地模式

## 📦 安装方法

### 方法1：开发者模式安装
1. 下载或克隆项目到本地
2. 打开Chrome浏览器，访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目中的 `extension` 文件夹
6. 扩展安装完成！

### 方法2：打包安装
```bash
cd extension
zip -r kahoot-helper.zip * -x "*.md"
```
然后通过Chrome扩展管理页面加载zip文件。

## 🚀 使用指南

### 第一次使用
1. **安装扩展**后访问 [Kahoot.it](https://kahoot.it)
2. 页面右下角会出现**Kahoot Helper**面板
3. 点击**"登录"**按钮注册或登录账户
4. 登录成功后即可开始使用AI答题功能

### 答题流程
1. **进入游戏**：在Kahoot游戏中等待问题出现
2. **自动检测**：扩展会自动识别问题和选项
3. **获取答案**：点击**"询问AI"**按钮获取智能答案
4. **查看结果**：AI会分析问题并提供最佳答案建议

## 📁 文件结构

```
extension/
├── manifest.json        # 扩展配置文件
├── content.js          # 内容脚本（主逻辑）
├── background.js       # 后台脚本
├── popup.html         # 弹窗界面
├── popup.js           # 弹窗逻辑
├── auth.js            # 认证管理模块
├── login-ui.js        # 登录界面组件
└── TROUBLESHOOTING.md # 故障排除指南
```

## 🔧 核心组件说明

### `content.js` - 内容脚本
- 🔍 监控Kahoot页面变化
- 🎯 提取问题和选项信息
- 🎨 渲染用户界面面板
- 🤖 调用AI API获取答案
- 📊 显示使用统计信息

### `auth.js` - 认证管理
- 👤 用户登录/注册逻辑
- 🔑 JWT Token管理
- 📱 用户信息缓存
- 🔄 自动刷新Token

### `login-ui.js` - 登录界面
- 🎨 动态创建登录表单
- ✅ 表单验证和错误处理
- 🎯 响应式设计适配
- 🔄 状态切换动画

### `background.js` - 后台服务
- 🌐 处理跨域请求
- 📡 维持与服务器连接
- 🔔 消息传递协调
- 💾 数据持久化存储

## ⚙️ 配置说明

### `manifest.json` 配置
```json
{
  "name": "Kahoot Helper",
  "version": "1.0.0",
  "manifest_version": 3,
  "permissions": [
    "activeTab",
    "storage"
  ],
  "host_permissions": [
    "https://kahoot.it/*",
    "http://localhost:*"
  ],
  "content_scripts": [{
    "matches": ["https://kahoot.it/*"],
    "js": ["auth.js", "login-ui.js", "content.js"]
  }],
  "background": {
    "service_worker": "background.js"
  }
}
```

### 服务器配置
扩展默认连接到：
- **生产环境**: `https://your-server.com`
- **开发环境**: `http://localhost:932`

可以在代码中修改 `serverUrl` 变量来更改服务器地址。

## 🎯 功能特性详解

### 智能问题检测
- ✅ 实时监控DOM变化
- ✅ 自动识别问题文本
- ✅ 提取所有答案选项
- ✅ 支持多种题型格式

### AI答案分析
- 🤖 集成多种AI模型
- 🎯 上下文理解分析
- 📊 置信度评分
- 🚀 快速响应（通常<3秒）

### 用户体验
- 🎨 现代化Material Design界面
- 📱 响应式设计，支持各种屏幕尺寸
- 🌙 自适应主题色彩
- ⚡ 流畅的动画效果

### 数据安全
- 🔐 所有数据传输加密
- 🛡️ 不存储敏感信息
- 🔑 JWT安全认证
- 🚫 不记录游戏内容

## 🐛 常见问题

### 扩展不显示面板
1. 确认已正确安装扩展
2. 检查是否在 `kahoot.it` 域名下
3. 刷新页面重试
4. 查看浏览器控制台错误信息

### 无法获取AI答案
1. 检查网络连接
2. 确认已登录账户
3. 验证订阅状态是否有效
4. 查看是否达到使用限制

### 登录失败
1. 检查用户名密码是否正确
2. 确认服务器是否正常运行
3. 清除浏览器缓存重试
4. 检查网络防火墙设置

详细的故障排除指南请参考 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## 🔄 更新日志

### v1.0.0
- ✨ 初始版本发布
- 🤖 集成AI问答功能
- 👤 用户认证系统
- 🎨 现代化用户界面
- 📊 使用统计功能

## 📞 技术支持

如需帮助，请：
1. 查看 [故障排除文档](./TROUBLESHOOTING.md)
2. 检查 [系统测试页面](http://localhost:3000/test)
3. 提交 [GitHub Issue](../../issues)
4. 联系开发团队

## ⚖️ 使用条款

- ✅ 仅供学习和研究使用
- ⚠️ 请遵守Kahoot平台规则
- 🚫 不得用于商业竞争
- 📋 使用时请遵守相关法律法规

---

🎯 **让AI成为你的智能答题伙伴！**
