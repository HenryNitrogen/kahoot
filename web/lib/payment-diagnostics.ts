/**
 * 支付状态诊断工具
 * 用于检查支付流程中的各个环节
 */

// 诊断清单：
console.log('=== 支付状态诊断清单 ===');

console.log('1. 检查支付创建时的订单号传递');
console.log('   - 前端传入的 order_id');
console.log('   - 虎皮椒 API 的 trade_order_id');
console.log('   - 组件状态中的 currentOrderId');

console.log('2. 检查回调通知处理');
console.log('   - 虎皮椒回调是否正确到达');
console.log('   - 回调中的 trade_order_id');
console.log('   - 状态更新是否成功');

console.log('3. 检查前端轮询');
console.log('   - 轮询使用的订单号');
console.log('   - API 返回的数据结构');
console.log('   - 状态判断逻辑');

console.log('4. 可能的问题点');
console.log('   a) 订单号不匹配：创建时用 order_id，回调用 trade_order_id');
console.log('   b) 回调地址不可达：localhost vs 外网地址');
console.log('   c) 状态存储问题：内存存储在重启后丢失');
console.log('   d) 轮询逻辑错误：数据结构不匹配');

// 建议的调试步骤
console.log('\n=== 调试步骤 ===');
console.log('1. 打开浏览器开发者工具');
console.log('2. 发起支付，观察以下日志：');
console.log('   - 支付创建请求和响应');
console.log('   - currentOrderId 的值');
console.log('   - 轮询请求和响应');
console.log('3. 支付成功后，检查服务器日志中的回调信息');
console.log('4. 使用 /test-payment-status 页面手动测试状态查询');

export default function PaymentDiagnostics() {
  return null;
}
