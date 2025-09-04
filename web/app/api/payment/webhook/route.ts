import { NextResponse } from 'next/server';

// Payment webhook handler
export async function POST() {
    try {
        // TODO: Implement webhook logic
        return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
}

// Handle other methods
export async function GET() {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}