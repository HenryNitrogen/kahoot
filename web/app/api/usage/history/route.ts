import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: '未授权：缺少访问令牌' },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: '未授权：无效的访问令牌' },
        { status: 401 }
      );
    }

    const userId = payload.userId as string;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // 获取用户的问答历史
    const [history, total] = await Promise.all([
      prisma.aIRequest.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          question: true,
          choices: true,
          answer: true,
          confidence: true,
          processingTime: true,
          createdAt: true
        }
      }),
      prisma.aIRequest.count({
        where: { userId }
      })
    ]);

    // 获取今日、本月、本年的统计
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const thisYear = new Date();
    thisYear.setMonth(0, 1);
    thisYear.setHours(0, 0, 0, 0);

    const [todayCount, thisMonthCount, thisYearCount] = await Promise.all([
      prisma.aIRequest.count({
        where: {
          userId,
          createdAt: { gte: today }
        }
      }),
      prisma.aIRequest.count({
        where: {
          userId,
          createdAt: { gte: thisMonth }
        }
      }),
      prisma.aIRequest.count({
        where: {
          userId,
          createdAt: { gte: thisYear }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        history,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        },
        statistics: {
          today: todayCount,
          thisMonth: thisMonthCount,
          thisYear: thisYearCount,
          total
        }
      }
    });

  } catch (error) {
    console.error('获取使用历史错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
