import { NextRequest, NextResponse } from 'next/server';
import { validateSubscriptionForm } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, url, company } = body;

    // バリデーション
    const validation = validateSubscriptionForm({ email, url, company });
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    // 現在はスタブ実装（後日DB接続予定）
    console.log('New subscription:', { email, url, timestamp: new Date().toISOString() });

    return NextResponse.json(
      { 
        success: true, 
        message: 'β版への登録が完了しました' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { 
        success: false, 
        errors: ['サーバーエラーが発生しました'] 
      },
      { status: 500 }
    );
  }
}
