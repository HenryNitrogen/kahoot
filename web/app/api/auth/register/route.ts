import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/userService';
import { generateToken, isValidEmail, isValidPassword } from '@/lib/auth';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, recaptchaToken } = await request.json();

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '请填写所有必需字段' },
        { status: 400 }
      );
    }

    // 检查是否为扩展请求
    const isExtensionRequest = request.headers.get('x-source') === 'extension';
    
    if (isExtensionRequest) {
      console.log('🔗 Extension register request detected - skipping reCAPTCHA');
    }

    // 验证reCAPTCHA (扩展请求跳过)
    if (!isExtensionRequest) {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: 'Please complete the reCAPTCHA verification' },
          { status: 400 }
        );
      }

      const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
      if (!isRecaptchaValid) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed' },
          { status: 400 }
        );
      }
    }

    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证密码强度
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    // 验证用户名
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: '用户名长度不能少于2位' },
        { status: 400 }
      );
    }

    // 创建用户
    const user = await UserService.createUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    // 生成JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email
    });

    console.log('✅ 用户注册成功:', { userId: user.id, email: user.email });

    return NextResponse.json({
      message: '注册成功',
      token,
      user
    });

  } catch (error) {
    console.error('❌ 注册失败:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
}

// TODO: 数据库集成示例
/*
使用 Prisma 的示例：

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 创建用户
const newUser = await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,
    subscription: {
      create: {
        plan: 'free',
        status: 'trial'
      }
    }
  },
  include: {
    subscription: true
  }
});

// 检查用户是否存在
const existingUser = await prisma.user.findUnique({
  where: { email }
});
*/
