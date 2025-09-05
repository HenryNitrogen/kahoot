import { NextRequest, NextResponse } from 'next/server';
import JSZip from 'jszip';
import { readFile } from 'fs/promises';
import path from 'path';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'zip';

    const zip = new JSZip();
    const extensionDir = path.join(process.cwd(), 'public', 'extension');

    // 扩展文件列表
    const extensionFiles = [
      'manifest.json',
      'popup.html',
      'popup.js',
      'content.js',
      'content-bridge.js',
      'background.js'
    ];

    // 添加所有文件到ZIP
    for (const fileName of extensionFiles) {
      try {
        const filePath = path.join(extensionDir, fileName);
        const content = await readFile(filePath, 'utf-8');
        zip.file(fileName, content);
      } catch (error) {
        console.warn(`无法读取文件 ${fileName}:`, error);
        // 对于缺失的文件，添加一个占位符
        if (fileName === 'content.js') {
          zip.file(fileName, `// Kahoot Quiz Helper Content Script
console.log('Kahoot Quiz Helper loaded!');

// 这里是扩展的主要功能代码
// 该文件会被自动更新
`);
        }
      }
    }

    // 生成ZIP文件
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', 'attachment; filename="kahoot-ai-helper-extension.zip"');
    headers.set('Content-Length', zipBuffer.length.toString());

    return new NextResponse(new Uint8Array(zipBuffer), { headers });

  } catch (error) {
    console.error('生成扩展包失败:', error);
    return NextResponse.json(
      { error: '生成扩展包失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { recaptchaToken } = await request.json();

    // 验证reCAPTCHA
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

    // reCAPTCHA验证通过，生成扩展包
    const zip = new JSZip();
    const extensionDir = path.join(process.cwd(), 'public', 'extension');

    // 扩展文件列表
    const extensionFiles = [
      'manifest.json',
      'popup.html',
      'popup.js',
      'content.js',
      'content-bridge.js',
      'background.js'
    ];

    // 添加所有文件到ZIP
    for (const fileName of extensionFiles) {
      try {
        const filePath = path.join(extensionDir, fileName);
        const content = await readFile(filePath, 'utf-8');
        zip.file(fileName, content);
      } catch (error) {
        console.warn(`无法读取文件 ${fileName}:`, error);
        // 对于缺失的文件，添加一个占位符
        if (fileName === 'content.js') {
          zip.file(fileName, `// Kahoot Quiz Helper Content Script
console.log('Kahoot Quiz Helper loaded!');

// 这里是扩展的主要功能代码
// 该文件会被自动更新
`);
        }
      }
    }

    // 生成ZIP文件
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // 设置响应头
    const headers = new Headers();
    headers.set('Content-Type', 'application/zip');
    headers.set('Content-Disposition', 'attachment; filename="kahoot-ai-helper-extension.zip"');
    headers.set('Content-Length', zipBuffer.length.toString());

    return new NextResponse(new Uint8Array(zipBuffer), { headers });

  } catch (error) {
    console.error('生成扩展包失败:', error);
    return NextResponse.json(
      { error: '生成扩展包失败' },
      { status: 500 }
    );
  }
}
