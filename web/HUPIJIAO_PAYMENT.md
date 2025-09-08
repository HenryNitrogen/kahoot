# 虎皮椒支付宝支付接入说明

## 概述

本项目已成功接入虎皮椒支付系统，支持支付宝支付功能。虎皮椒是一个个人收款解决方案，无需企业资质即可接入支付宝支付。

## 配置步骤

### 1. 环境变量配置

在 `.env.local` 文件中添加以下配置：

```bash
# 虎皮椒支付配置
HUPIJIAO_APPID="你的虎皮椒APPID"
HUPIJIAO_APP_SECRET="你的虎皮椒密钥"
HUPIJIAO_GATEWAY_URL="https://api.xunhupay.com/payment/do.html"
HUPIJIAO_QUERY_URL="https://api.xunhupay.com/payment/query.html"
```

### 2. 获取虎皮椒配置信息

1. 访问 [虎皮椒官网](https://xunhupay.com) 注册账号
2. 在商户后台获取 APPID 和 APP_SECRET
3. 将这些信息填入 `.env.local` 文件

## API 接口

### 1. 创建支付订单

**接口地址：** `POST /api/payment/hupijiao/create`

**请求参数：**
```json
{
  "order_id": "订单号（唯一）",
  "money": 支付金额（数字，如 1.00）,
  "title": "商品标题",
  "return_url": "支付成功后跳转地址（可选）",
  "attach": "备注信息（可选）"
}
```

**响应数据：**
```json
{
  "success": true,
  "data": {
    "openid": "订单ID",
    "url_qrcode": "PC端扫码支付链接",
    "url": "手机端支付链接",
    "errcode": 0,
    "errmsg": "success!",
    "hash": "签名"
  },
  "message": "支付订单创建成功",
  "timestamp": 1673856000000
}
```

### 2. 支付回调通知

**接口地址：** `POST /api/payment/hupijiao/notify`

虎皮椒会在用户支付成功后向此接口发送POST请求通知。

**通知参数：**
- `trade_order_id`: 商户订单号
- `total_fee`: 支付金额
- `transaction_id`: 交易号
- `status`: 订单状态（OD=已支付，CD=已退款等）
- `hash`: 签名

### 3. 查询支付状态

**接口地址：** `GET /api/payment/hupijiao/query?trade_order_id=订单号`

## 前端组件使用

### HupijiaoPayment 组件

```tsx
import HupijiaoPayment from '@/components/HupijiaoPayment';

// 在组件中使用
<HupijiaoPayment
  order_id="ORDER_123456"
  money={1.00}
  title="测试商品"
  onPaymentSuccess={(data) => {
    console.log('支付成功', data);
  }}
  onPaymentError={(error) => {
    console.error('支付失败', error);
  }}
/>
```

## 支付流程

1. **创建订单：** 前端调用创建支付接口
2. **发起支付：** 用户跳转到支付页面或扫描二维码
3. **支付完成：** 虎皮椒发送回调通知到服务器
4. **处理结果：** 服务器处理支付成功的业务逻辑
5. **用户跳转：** 支付成功后跳转到指定页面

## 测试页面

访问 `/payment/test` 可以测试支付功能。

## 注意事项

1. **订单号唯一性：** 确保每个订单号在系统中是唯一的
2. **金额格式：** 支付金额单位为人民币元，支持小数点后两位
3. **回调处理：** 回调通知必须返回 "success" 字符串，否则虎皮椒会重复发送通知
4. **签名验证：** 所有请求和回调都会进行签名验证，确保数据安全
5. **测试环境：** 建议先在测试环境使用小金额（如0.01元）进行测试

## 业务集成

在 `/api/payment/hupijiao/notify/route.ts` 的 `handlePaymentSuccess` 函数中添加你的业务逻辑：

```typescript
async function handlePaymentSuccess(data: NotifyData) {
  // 根据订单号查询订单信息
  // 更新订单状态
  // 增加用户积分/会员时长
  // 发送支付成功通知
  // 记录支付日志
}
```

## 错误处理

- 支付创建失败会返回详细的错误信息
- 回调验签失败会记录日志但仍返回success避免重复通知
- 网络异常等情况有相应的错误处理机制

## 安全说明

- 所有支付请求都使用MD5签名验证
- 密钥存储在环境变量中，不会暴露给前端
- 回调通知会验证签名确保数据来源可靠

## 支持的支付方式

- ✅ 支付宝H5支付（手机端）
- ✅ 支付宝扫码支付（PC端）

## 联系支持

如有问题，可以联系虎皮椒客服：
- QQ群：295292794
- 微信客服：hupijiao007
- 手机：15086781218
