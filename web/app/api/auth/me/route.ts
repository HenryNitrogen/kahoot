import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供授权令牌' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // 验证JWT token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: '无效的授权令牌' },
        { status: 401 }
      );
    }
    
    // 获取用户信息
    const user = await UserService.getUserById(decoded.userId);

    console.log('✅ 用户信息获取成功:', { userId: user.id, email: user.email });

    return NextResponse.json(user);

  } catch (error) {
    console.error('❌ 用户信息获取失败:', error);
    
    if (error instanceof Error && error.message === '用户不存在') {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
