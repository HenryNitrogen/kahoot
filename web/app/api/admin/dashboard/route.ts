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
  
  // 检查是否为指定管理员邮箱
  if (user.email !== 'henryni710@gmail.com') {
    throw new Error('权限不足');
  }

  return user;
}

// 获取管理面板数据
export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);

    const stats = await RedeemCodeService.getRedemptionStats();
    
    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: error instanceof Error && error.message.includes('权限') ? 403 : 401 }
    );
  }
}
