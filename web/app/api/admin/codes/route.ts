import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { UserService } from '@/lib/userService';
import { RedeemCodeService } from '@/lib/redeemCodeService';

// 验证管理员权限
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('未提供授权令牌');
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error('无效的授权令牌');
  }

  const user = await UserService.getUserById(decoded.userId);
  
  if (user.email !== 'henryni710@gmail.com') {
    throw new Error('权限不足');
  }

  return user;
}

// 创建兑换码
export async function POST(request: NextRequest) {
  try {
    await verifyAdmin(request);

    const { planType, duration, quantity, expiresAt } = await request.json();

    // 验证输入
    if (!planType || !['premium', 'pro'].includes(planType)) {
      return NextResponse.json(
        { error: '无效的套餐类型' },
        { status: 400 }
      );
    }

    if (!duration || duration <= 0) {
      return NextResponse.json(
        { error: '持续时间必须大于0' },
        { status: 400 }
      );
    }

    if (!quantity || quantity <= 0 || quantity > 100) {
      return NextResponse.json(
        { error: '数量必须在1-100之间' },
        { status: 400 }
      );
    }

    const codes = await RedeemCodeService.createRedeemCodes({
      planType,
      duration,
      quantity,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined
    });

    console.log(`✅ 管理员创建了 ${quantity} 个兑换码 (${planType}, ${duration}天)`);

    return NextResponse.json({
      success: true,
      message: `成功创建 ${quantity} 个兑换码`,
      codes: codes.map((code: { id: string; code: string; planType: string; duration: number; createdAt: Date; expiresAt: Date | null }) => ({
        id: code.id,
        code: code.code,
        planType: code.planType,
        duration: code.duration,
        createdAt: code.createdAt,
        expiresAt: code.expiresAt
      }))
    });

  } catch (error) {
    console.error('Create redeem codes error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: error instanceof Error && error.message.includes('权限') ? 403 : 500 }
    );
  }
}

// 获取兑换码列表
export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await RedeemCodeService.getRedeemCodes(page, limit);

    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Get redeem codes error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: error instanceof Error && error.message.includes('权限') ? 403 : 500 }
    );
  }
}
