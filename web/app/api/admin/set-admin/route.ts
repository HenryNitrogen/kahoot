import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, setAdmin } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: '邮箱地址是必需的' }, { status: 400 });
    }

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    // 更新管理员状态
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isAdmin: setAdmin !== false } // 默认设置为管理员
    });

    return NextResponse.json({
      success: true,
      message: `用户 ${email} 的管理员权限已${updatedUser.isAdmin ? '开启' : '关闭'}`,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin
      }
    });

  } catch (error) {
    console.error('设置管理员权限时出错:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// 获取所有用户的管理员状态
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ users });

  } catch (error) {
    console.error('获取用户列表时出错:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
