import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptcha } from '@/lib/recaptcha';

export async function POST(request: NextRequest) {
  try {
    const { recaptchaToken } = await request.json();

    if (!recaptchaToken) {
      return NextResponse.json(
        { success: false, error: 'No reCAPTCHA token provided' },
        { status: 400 }
      );
    }

    console.log('Testing reCAPTCHA verification...');
    const isValid = await verifyRecaptcha(recaptchaToken);

    return NextResponse.json({
      success: true,
      recaptchaValid: isValid,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasSecretKey: !!process.env.RECAPTCHA_SECRET_KEY,
        hasSiteKey: !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
        secretKeyFormat: process.env.RECAPTCHA_SECRET_KEY ? {
          length: process.env.RECAPTCHA_SECRET_KEY.length,
          starts_with: process.env.RECAPTCHA_SECRET_KEY.substring(0, 6),
          ends_with: process.env.RECAPTCHA_SECRET_KEY.substring(process.env.RECAPTCHA_SECRET_KEY.length - 4)
        } : null
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test reCAPTCHA API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
