import { NextRequest, NextResponse } from 'next/server';

// Cloud RunのAPI URL（環境変数で上書き可能）
const API_BASE_URL = process.env.REVEALPROP_API_URL || 'https://revealprop-api-kupzzphjna-an.a.run.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // バリデーション
    if (!url) {
      return NextResponse.json(
        { error: 'URLが入力されていません。' },
        { status: 400 }
      );
    }

    // Cloud RunのAPIにリクエストを転送
    const apiUrl = `${API_BASE_URL}/v1/url-score`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'APIエラーが発生しました。' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('URLスコア取得エラー:', error);
    
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    );
  }
}
