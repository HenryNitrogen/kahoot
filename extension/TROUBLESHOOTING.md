# 🔍 扩展问题排查指南

## 步骤1: 检查扩展是否加载

1. 打开Chrome扩展管理页面: `chrome://extensions/`
2. 确保"开发者模式"已开启
3. 找到"Kahoot Quiz Info Display"扩展
4. 确保扩展已启用（开关是蓝色的）
5. 点击"重新加载"按钮刷新扩展

## 步骤2: 测试扩展功能

### 方法1: 使用测试页面
1. 在扩展文件夹中找到`test-page.html`
2. 在浏览器中打开此文件
3. 查看是否出现绿色边框的黑色弹窗
4. 检查控制台输出

### 方法2: 访问Kahoot.it
1. 访问 `https://kahoot.it/`
2. 按F12打开开发者工具
3. 查看控制台是否有以下日志：
   ```
   🚀 Kahoot Quiz Helper loading...
   Extension initializing...
   Creating UI elements...
   ✅ UI elements created successfully
   ```

## 步骤3: 常见问题解决

### 问题1: 扩展不加载
**症状**: 控制台没有任何扩展相关日志
**解决**:
- 检查manifest.json是否有语法错误
- 重新加载扩展
- 检查是否在正确的网站(kahoot.it)

### 问题2: 语法错误
**症状**: 控制台显示JavaScript语法错误
**解决**:
- 检查content.js第134行附近的可选链操作符
- 确保所有`?.`操作符格式正确，没有多余空格

### 问题3: UI不显示
**症状**: 有扩展日志但看不到黑色弹窗
**解决**:
- 检查z-index是否被其他元素覆盖
- 查看元素是否被创建但位置不对
- 在控制台运行: `document.getElementById('quizInfoBox')`

### 问题4: 权限问题
**症状**: 扩展加载但功能不工作
**解决**:
- 检查host_permissions是否包含所需网站
- 确保"world": "MAIN"设置正确

## 步骤4: 手动调试

在开发者工具控制台中运行以下命令:

```javascript
// 检查扩展元素是否存在
console.log('Quiz Box:', document.getElementById('quizInfoBox'));
console.log('Menu:', document.getElementById('quizMenu'));

// 手动创建测试元素
const testDiv = document.createElement('div');
testDiv.style.position = 'fixed';
testDiv.style.top = '10px';
testDiv.style.left = '10px';
testDiv.style.background = 'red';
testDiv.style.color = 'white';
testDiv.style.padding = '20px';
testDiv.style.zIndex = '999999';
testDiv.textContent = 'Test Extension Element';
document.body.appendChild(testDiv);
```

## 步骤5: 重置扩展

如果以上步骤都不工作:

1. 删除扩展:
   - 在`chrome://extensions/`页面点击"删除"

2. 重新安装:
   - 点击"加载已解压的扩展程序"
   - 选择扩展文件夹

3. 清除缓存:
   - 按F5刷新页面
   - 或按Ctrl+Shift+R强制刷新

## 获取帮助

如果问题仍然存在，请提供以下信息:

1. Chrome浏览器版本
2. 控制台完整错误信息
3. 扩展管理页面截图
4. 测试页面的控制台输出

## 成功标志

扩展正常工作时应该看到:
- 页面左上角有一个带绿色边框的黑色"📊 Quiz Info"窗口
- 页面右上角有一个"🔧 Menu"窗口
- 控制台有成功日志
- 两个窗口都可以拖拽和最小化
