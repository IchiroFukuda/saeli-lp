import { NextRequest, NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// SendGrid APIキーを設定
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, name, email, message } = body;

    // バリデーション
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '必須項目が入力されていません。' },
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
    const recipientEmail = process.env.CONTACT_EMAIL || 'hello@saeli.org';
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@saeli.org';

    // メール本文（HTML形式）
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">
          お問い合わせがありました
        </h2>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 10px 0;"><strong>会社名:</strong> ${companyName || '未入力'}</p>
          <p style="margin: 10px 0;"><strong>お名前:</strong> ${name}</p>
          <p style="margin: 10px 0;"><strong>メールアドレス:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="color: #374151; margin-bottom: 10px;">ご相談内容:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #1e40af; border-radius: 4px;">
            <p style="white-space: pre-wrap; line-height: 1.6; color: #4b5563;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>このメールは、合同会社SAELIのお問い合わせフォームから送信されました。</p>
          <p>返信する場合は、上記のメールアドレス（${email}）に直接返信してください。</p>
        </div>
      </div>
    `;

    // メール本文（テキスト形式）
    const textContent = `
お問い合わせがありました

会社名: ${companyName || '未入力'}
お名前: ${name}
メールアドレス: ${email}

ご相談内容:
${message}

---
このメールは、合同会社SAELIのお問い合わせフォームから送信されました。
返信する場合は、上記のメールアドレスに直接返信してください。
    `.trim();

    // SendGridでメール送信
    const msg = {
      to: recipientEmail,
      from: {
        email: fromEmail,
        name: '合同会社SAELI お問い合わせフォーム',
      },
      replyTo: email,
      subject: `【お問い合わせ】${companyName ? `${companyName} - ` : ''}${name}様`,
      text: textContent,
      html: htmlContent,
    };

    await sgMail.send(msg);

    console.log('問い合わせメール送信成功:', {
      to: recipientEmail,
      from: email,
      name,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'お問い合わせを受け付けました。ありがとうございます。' 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('問い合わせ処理エラー:', error);
    
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
