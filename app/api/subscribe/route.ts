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
    const subscriptionData = { 
      email, 
      url: url || '', 
      timestamp: new Date().toISOString(),
      utm_source: request.headers.get('referer') || 'direct',
      user_agent: request.headers.get('user-agent') || ''
    };
    
    console.log('New subscription:', subscriptionData);
    
    // CSVファイルに追記（本格運用前の簡易実装）
    const fs = require('fs');
    const path = require('path');
    const csvPath = path.join(process.cwd(), 'subscriptions.csv');
    const csvRow = `${subscriptionData.email},${subscriptionData.url},${subscriptionData.timestamp},${subscriptionData.utm_source}\n`;
    
    try {
      fs.appendFileSync(csvPath, csvRow);
    } catch (error) {
      console.error('CSV write error:', error);
    }

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
