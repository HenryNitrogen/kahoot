/**
 * 虎皮椒支付 - 查询支付状态接口
 */
import { NextRequest, NextResponse } from 'next/server';
import { formatResponse } from '../../../../../lib/utils/tools';
import axios from 'axios';
import md5 from 'md5';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trade_order_id = searchParams.get('trade_order_id');

    if (!trade_order_id) {
      return NextResponse.json(
        formatResponse(false, null, '缺少订单号参数'),
        { status: 400 }
      );
    }

    // 虎皮椒查询接口参数
    const params = {
      appid: process.env.HUPIJIAO_APPID,
      out_trade_no: trade_order_id,
      time: Math.floor(Date.now() / 1000),
      nonce_str: Math.random().toString(16).slice(2, 8),
    };

    // 生成签名
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key as keyof typeof params]}`)
      .join('&');
    const hash = md5(sortedParams + process.env.HUPIJIAO_APP_SECRET);

    // 发送查询请求
    const queryParams = new URLSearchParams({
      ...params,
      hash,
    } as any);

    const queryUrl = process.env.HUPIJIAO_QUERY_URL || 'https://api.xunhupay.com/payment/query.html';
    const response = await axios.post(queryUrl, queryParams, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('虎皮椒查询响应:', response.data);

    return NextResponse.json(
      formatResponse(true, response.data, '查询成功')
    );
  } catch (error) {
    console.error('查询虎皮椒支付状态错误:', error);
    return NextResponse.json(
      formatResponse(false, null, '查询失败'),
      { status: 500 }
    );
  }
}
