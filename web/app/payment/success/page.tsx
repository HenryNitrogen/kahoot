'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<any>(null);

  useEffect(() => {
    // 从URL参数获取支付信息
    const trade_order_id = searchParams.get('trade_order_id');
    const total_fee = searchParams.get('total_fee');
    const transaction_id = searchParams.get('transaction_id');
    
    if (trade_order_id) {
      setOrderInfo({
        trade_order_id,
        total_fee,
        transaction_id,
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            支付成功！
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            感谢您的支付，订单已处理完成
          </p>
        </div>

        {orderInfo && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">订单详情</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">订单号:</span>
                <span className="text-gray-900 font-mono">{orderInfo.trade_order_id}</span>
              </div>
              {orderInfo.total_fee && (
                <div className="flex justify-between">
                  <span className="text-gray-500">支付金额:</span>
                  <span className="text-gray-900">¥{orderInfo.total_fee}</span>
                </div>
              )}
              {orderInfo.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-500">交易号:</span>
                  <span className="text-gray-900 font-mono text-xs">{orderInfo.transaction_id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">支付状态:</span>
                <span className="text-green-600 font-semibold">已支付</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            返回控制台
          </Link>
          <Link
            href="/"
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
