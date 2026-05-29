import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "必須項目が入力されていません。" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "メールアドレスの形式が正しくありません。" },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEYが設定されていません");
      return NextResponse.json(
        {
          error:
            "メール送信の設定が完了していません。管理者にお問い合わせください。",
        },
        { status: 500 },
      );
    }

    const recipientEmail = process.env.CONTACT_EMAIL || "hello@saeli.org";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@saeli.org";

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1c1917; border-bottom: 2px solid #1c1917; padding-bottom: 10px;">
          お問い合わせがありました
        </h2>
        <div style="background-color: #f5f5f4; padding: 20px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 10px 0;"><strong>お名前:</strong> ${escapeHtml(name)}</p>
          <p style="margin: 10px 0;"><strong>メールアドレス:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        </div>
        <div style="margin-top: 20px;">
          <h3 style="color: #44403c; margin-bottom: 10px;">お問い合わせ内容:</h3>
          <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #1c1917; border-radius: 4px;">
            <p style="white-space: pre-wrap; line-height: 1.6; color: #44403c;">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          </div>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4; color: #78716c; font-size: 12px;">
          <p>このメールは、毎日あの子（合同会社SAELI）のお問い合わせフォームから送信されました。</p>
          <p>返信する場合は、上記のメールアドレス（${escapeHtml(email)}）に直接返信してください。</p>
        </div>
      </div>
    `;

    const textContent = `
お問い合わせがありました

お名前: ${name}
メールアドレス: ${email}

お問い合わせ内容:
${message}

---
このメールは、毎日あの子（合同会社SAELI）のお問い合わせフォームから送信されました。
返信する場合は、上記のメールアドレスに直接返信してください。
    `.trim();

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `毎日あの子 お問い合わせ <${fromEmail}>`,
        to: [recipientEmail],
        reply_to: email,
        subject: `【お問い合わせ】${name}様`,
        text: textContent,
        html: htmlContent,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Resend送信エラー:", res.status, errText);
      return NextResponse.json(
        {
          error:
            "メールの送信に失敗しました。しばらくしてから再度お試しください。",
        },
        { status: 500 },
      );
    }

    console.log("問い合わせメール送信成功:", {
      to: recipientEmail,
      from: email,
      name,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "お問い合わせを受け付けました。ありがとうございます。",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("問い合わせ処理エラー:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。しばらくしてから再度お試しください。" },
      { status: 500 },
    );
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
