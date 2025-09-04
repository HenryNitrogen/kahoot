import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { downloadType } = await request.json();
    
    // 记录下载统计
    // 这里可以记录到数据库或其他存储中
    console.log(`扩展下载记录: ${downloadType}, 时间: ${new Date().toISOString()}`);
    
    // 如果需要记录到数据库，可以取消注释以下代码
    /*
    await prisma.downloadStats.create({
      data: {
        downloadType,
        userAgent: request.headers.get('user-agent') || '',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('remote-addr') || '',
        downloadedAt: new Date()
      }
    });
    */

    return NextResponse.json({ 
      success: true, 
      message: '下载记录已保存' 
    });
  } catch (error) {
    console.error('记录下载失败:', error);
    return NextResponse.json(
      { error: '记录失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // 返回下载统计信息
    // 这里可以从数据库查询实际统计
    const stats = {
      totalDownloads: 1248,
      crxDownloads: 856,
      zipDownloads: 392,
      todayDownloads: 23
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('获取统计失败:', error);
    return NextResponse.json(
      { error: '获取统计失败' },
      { status: 500 }
    );
  }
}
