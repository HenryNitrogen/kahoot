import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// AI API配置
const AI_CONFIG = {
  model: 'gemini-2.0-flash',
  apiKey: process.env.AI_API_KEY || 'sk-FCg7LbxdDaXruAByQlIv6DBl8h5T2vFEvccgVJF4UecVRPB9',
  apiUrl: process.env.AI_API_URL || 'https://api.henryni.cn/v1/chat/completions'
};

// 用量限制配置
const USAGE_LIMITS = {
  free: { total: 7 }, // 免费用户累计7个问题
  premium: { monthly: 300 }, // premium会员每月300个问题
  pro: { monthly: 2000 } // 年会员每月2000个问题
};

async function callAI(question: string, choices: string[], answersAllowed: number) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(AI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          { 
            role: 'system', 
            content: `你是一个专业的Kahoot答题AI助手。选项从左到右的顺序分别是 1，2，3，4。此题允许选择 ${answersAllowed} 个答案。请仔细分析题目和选项，给出最准确的答案。请按照以下格式回答：选项名字/数字` 
          },
          { 
            role: 'user', 
            content: `Question: ${question}\nChoices: ${choices.join(', ')}` 
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI API错误: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;
    const processingTime = Date.now() - startTime;

    return {
      answer,
      confidence: 0.85, // 可以根据实际情况调整
      processingTime
    };
  } catch (error) {
    console.error('AI请求失败:', error);
    throw new Error(`AI请求失败: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function checkUsageLimit(userId: string, plan: string): Promise<boolean> {
  const thisMonth = new Date();
  thisMonth.setDate(1);
  thisMonth.setHours(0, 0, 0, 0);

  // 获取或创建使用记录
  let usageRecord = await prisma.usageRecord.findFirst({
    where: { userId }
  });

  if (!usageRecord) {
    usageRecord = await prisma.usageRecord.create({
      data: {
        userId,
        requestsToday: 0,
        requestsThisMonth: 0,
        totalRequests: 0
      }
    });
  }

  // 检查是否需要重置当月计数
  const lastRequestDate = new Date(usageRecord.lastRequestDate);
  if (lastRequestDate < thisMonth) {
    await prisma.usageRecord.update({
      where: { id: usageRecord.id },
      data: { requestsThisMonth: 0 }
    });
    usageRecord.requestsThisMonth = 0;
  }

  const limits = USAGE_LIMITS[plan as keyof typeof USAGE_LIMITS] || USAGE_LIMITS.free;
  
  if (plan === 'free') {
    const limits = USAGE_LIMITS.free;
    return usageRecord.totalRequests < limits.total;
  } else {
    const limits = USAGE_LIMITS[plan as 'premium' | 'pro'] || USAGE_LIMITS.premium;
    return usageRecord.requestsThisMonth < limits.monthly;
  }
}

async function updateUsage(userId: string) {
  await prisma.usageRecord.updateMany({
    where: { userId },
    data: {
      requestsToday: { increment: 1 },
      requestsThisMonth: { increment: 1 },
      totalRequests: { increment: 1 },
      lastRequestDate: new Date()
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, choices, answersAllowed = 1 } = body;

    if (!question || !choices || !Array.isArray(choices)) {
      return NextResponse.json(
        { error: '缺少必要参数：question, choices' },
        { status: 400 }
      );
    }

    // 验证用户令牌
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

    // 获取用户信息和订阅状态
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true, redemptions: { where: { isActive: true } } }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 确定用户的计划类型
    let userPlan = 'free';
    if (user.subscription && user.subscription.status === 'active') {
      userPlan = user.subscription.plan;
    } else if (user.redemptions.length > 0) {
      // 检查是否有有效的兑换记录
      const activeRedemption = user.redemptions.find(r => 
        r.isActive && new Date() < new Date(r.endDate)
      );
      if (activeRedemption) {
        userPlan = activeRedemption.planType;
      }
    }

    // 检查用量限制
    const canUse = await checkUsageLimit(userId, userPlan);
    if (!canUse) {
      return NextResponse.json(
        { 
          error: '已达到使用限制',
          limits: {
            plan: userPlan,
            ...(userPlan === 'free' ? 
              { total: USAGE_LIMITS.free.total } : 
              { monthly: USAGE_LIMITS[userPlan as 'premium' | 'pro'].monthly }
            )
          }
        },
        { status: 429 }
      );
    }

    // 调用AI获取答案
    const aiResult = await callAI(question, choices, answersAllowed);

    // 更新使用次数
    await updateUsage(userId);

    // 记录AI请求
    await prisma.aIRequest.create({
      data: {
        userId,
        question,
        choices,
        answer: aiResult.answer,
        confidence: aiResult.confidence,
        processingTime: aiResult.processingTime
      }
    });

    return NextResponse.json({
      success: true,
      answer: aiResult.answer,
      confidence: aiResult.confidence,
      userPlan,
      remainingUsage: {
        plan: userPlan,
        // 这里可以返回剩余使用次数，但为了简化先省略
      }
    });

  } catch (error) {
    console.error('AI答题API错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // 获取用户使用情况
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        subscription: true, 
        usageRecords: true,
        redemptions: { where: { isActive: true } }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 确定用户的计划类型
    let userPlan = 'free';
    if (user.subscription && user.subscription.status === 'active') {
      userPlan = user.subscription.plan;
    } else if (user.redemptions.length > 0) {
      const activeRedemption = user.redemptions.find(r => 
        r.isActive && new Date() < new Date(r.endDate)
      );
      if (activeRedemption) {
        userPlan = activeRedemption.planType;
      }
    }

    const usageRecord = user.usageRecords[0] || {
      requestsToday: 0,
      requestsThisMonth: 0,
      totalRequests: 0
    };

    return NextResponse.json({
      success: true,
      userPlan,
      usage: {
        today: usageRecord.requestsToday,
        thisMonth: usageRecord.requestsThisMonth,
        total: usageRecord.totalRequests
      },
      limits: userPlan === 'free' ? 
        { total: USAGE_LIMITS.free.total } : 
        { monthly: USAGE_LIMITS[userPlan as 'premium' | 'pro'].monthly }
    });

  } catch (error) {
    console.error('获取使用情况错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}
