import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { generateToken, isValidEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { error: '请输入邮箱和密码' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 用户登录
    const user = await UserService.loginUser({
      email: email.toLowerCase().trim(),
      password
    });

    // 生成JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    console.log('✅ 用户登录成功:', { userId: user.id, email: user.email });

    return NextResponse.json({
      message: '登录成功',
      token,
      user
    });

  } catch (error) {
    console.error('❌ 登录失败:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}
