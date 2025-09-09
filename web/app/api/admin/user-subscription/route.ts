import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-in-production';

// 更新用户订阅计划
export async function PUT(request: NextRequest) {
  try {
    // 验证管理员身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供授权令牌' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: { userId: string; email: string };

    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: '无效的授权令牌' },
        { status: 401 }
      );
    }

    // 检查是否为管理员
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isAdmin: true }
    });

    if (!adminUser?.isAdmin) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const { userId, plan, status, expiresAt, notes } = await request.json();

    // 验证输入
    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    if (!['free', 'premium', 'pro'].includes(plan)) {
      return NextResponse.json(
        { error: '无效的订阅计划' },
        { status: 400 }
      );
    }

    if (!['trial', 'active', 'expired', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: '无效的订阅状态' },
        { status: 400 }
      );
    }

    // 检查目标用户是否存在
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 更新或创建订阅
    const subscriptionData = {
      plan,
      status,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      updatedAt: new Date()
    };

    let subscription;
    if (targetUser.subscription) {
      // 更新现有订阅
      subscription = await prisma.subscription.update({
        where: { userId },
        data: subscriptionData
      });
    } else {
      // 创建新订阅
      subscription = await prisma.subscription.create({
        data: {
          userId,
          ...subscriptionData
        }
      });
    }

    // 记录管理员操作日志
    console.log(`管理员 ${decoded.userId} 修改了用户 ${userId} 的订阅:`, {
      plan,
      status,
      expiresAt,
      notes,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      subscription,
      message: '用户订阅已更新'
    });

  } catch (error) {
    console.error('更新用户订阅失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取用户详细信息（包括订阅信息）
export async function GET(request: NextRequest) {
  try {
    // 验证管理员身份
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未提供授权令牌' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: { userId: string; email: string };

    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    } catch (error) {
      return NextResponse.json(
        { error: '无效的授权令牌' },
        { status: 401 }
      );
    }

    // 检查是否为管理员
    const adminUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isAdmin: true }
    });

    if (!adminUser?.isAdmin) {
      return NextResponse.json(
        { error: '权限不足' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '用户ID不能为空' },
        { status: 400 }
      );
    }

    // 获取用户详细信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        usageRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        redemptions: {
          include: {
            redeemCode: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
