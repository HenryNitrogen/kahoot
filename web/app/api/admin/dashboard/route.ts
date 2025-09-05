import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 验证管理员权限
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('未提供授权令牌');
  }

  const token = authHeader.substring(7);
  const decoded = await verifyToken(token);
  if (!decoded) {
    throw new Error('无效的授权令牌');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId as string }
  });

  if (!user || !user.isAdmin) {
    throw new Error('权限不足');
  }

  return user;
}

// 获取管理面板数据
export async function GET(request: NextRequest) {
  try {
    await verifyAdmin(request);

    // 获取统计数据
    const [
      totalUsers,
      activeUsers,
      totalCodes,
      usedCodes,
      activeCodes,
      totalRedemptions
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          usageRecords: {
            some: {
              lastRequestDate: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30天内有活动
              }
            }
          }
        }
      }),
      prisma.redeemCode.count(),
      prisma.redeemCode.count({ where: { isUsed: true } }),
      prisma.redeemCode.count({ 
        where: { 
          isUsed: false,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        } 
      }),
      prisma.redemption.count()
    ]);

    const expiredCodes = totalCodes - usedCodes - activeCodes;
    
    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalCodes,
        usedCodes,
        activeCodes,
        expiredCodes,
        totalRedemptions
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器错误' },
      { status: error instanceof Error && error.message.includes('权限') ? 403 : 401 }
    );
  }
}
