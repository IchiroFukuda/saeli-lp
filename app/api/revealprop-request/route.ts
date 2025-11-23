import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// SendGrid APIキーを設定
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, email } = body;

    // バリデーション
    if (!url || !email) {
      return NextResponse.json(
        { error: 'URLとメールアドレスを入力してください。' },
        { status: 400 }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'メールアドレスの形式が正しくありません。' },
        { status: 400 }
      );
    }

    // SendGrid APIキーのチェック
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEYが設定されていません');
      return NextResponse.json(
        { error: 'メール送信の設定が完了していません。管理者にお問い合わせください。' },
        { status: 500 }
      );
    }

    // 送信先メールアドレスを環境変数から取得
    const recipientEmail = process.env.REVEALPROP_REQUEST_EMAIL || process.env.CONTACT_EMAIL || 'hello@saeli.org';
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@saeli.org';

    // メール本文（HTML形式）
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
          RevealProp αテスト リスク判定依頼
        </h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 10px 0;"><strong>物件URL:</strong></p>
          <p style="margin: 10px 0; word-break: break-all;"><a href="${url}" style="color: #1e40af;">${url}</a></p>
          <p style="margin: 20px 0 10px 0;"><strong>依頼者メールアドレス:</strong></p>
          <p style="margin: 10px 0;">${email}</p>
          <p style="margin: 20px 0 10px 0;"><strong>依頼日時:</strong></p>
          <p style="margin: 10px 0;">${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</p>
        </div>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">
          このメールは、RevealPropのαテスト期間中のリスク判定依頼フォームから送信されました。<br>
          開発者がAIの判定結果を目視でダブルチェックし、補正した完全版レポートを${email}に送信してください。
        </p>
      </div>
    `;

    const textContent = `
RevealProp αテスト リスク判定依頼

物件URL:
${url}

依頼者メールアドレス:
${email}

依頼日時:
${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}

---
このメールは、RevealPropのαテスト期間中のリスク判定依頼フォームから送信されました。
開発者がAIの判定結果を目視でダブルチェックし、補正した完全版レポートを${email}に送信してください。
    `.trim();

    // SendGridでメール送信
    const msg = {
      to: recipientEmail,
      from: {
        email: fromEmail,
        name: 'RevealProp リスク判定依頼',
      },
      replyTo: email,
      subject: `【RevealProp αテスト】リスク判定依頼: ${url.substring(0, 50)}...`,
      text: textContent,
      html: htmlContent,
    };

    await sgMail.send(msg);

    console.log('RevealProp判定依頼メール送信成功:', {
      to: recipientEmail,
      url,
      email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'リスク判定依頼を受け付けました。数時間〜24時間以内に完全版レポートをお送りします。' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('RevealProp判定依頼処理エラー:', error);
    
    // SendGridのエラーレスポンスを確認
    if (error.response) {
      console.error('SendGridエラー詳細:', error.response.body);
    }

    return NextResponse.json(
      { error: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。' },
      { status: 500 }
    );
  }
}
