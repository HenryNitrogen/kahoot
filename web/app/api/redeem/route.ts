import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { RedeemCodeService } from '@/lib/redeemCodeService';

// 兑换兑换码
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供授权令牌' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: '无效的授权令牌' },
        { status: 401 }
      );
    }

    const { code } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: '请输入有效的兑换码' },
        { status: 400 }
      );
    }

    const redemption = await RedeemCodeService.redeemCode(decoded.userId, code);

    console.log(`✅ 用户 ${decoded.userId} 成功兑换了兑换码: ${code}`);

    return NextResponse.json({
      success: true,
      message: '兑换成功！',
      redemption: {
        id: redemption.id,
        planType: redemption.planType,
        startDate: redemption.startDate,
        endDate: redemption.endDate
      }
    });

  } catch (error) {
    console.error('Redeem code error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '兑换失败，请稍后重试' },
      { status: 400 }
    );
  }
}

// 获取用户的兑换记录
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供授权令牌' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: '无效的授权令牌' },
        { status: 401 }
      );
    }

    const redemptions = await RedeemCodeService.getUserRedemptions(decoded.userId);

    return NextResponse.json({
      success: true,
      redemptions
    });

  } catch (error) {
    console.error('Get redemptions error:', error);
    return NextResponse.json(
      { error: '获取兑换记录失败' },
      { status: 500 }
    );
  }
}
