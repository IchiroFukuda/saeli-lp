// Supabase Edge Function: リアクション通知メール送信（Resend HTTP API）
// letter_reactions テーブルへのINSERT Webhookで起動される想定。
//
// デプロイ:
//   supabase functions deploy send-reaction-notification --project-ref arneigfpwleljkwadupj
//
// シークレット設定（一度だけ）:
//   supabase secrets set RESEND_API_KEY=re_xxx RESEND_FROM_EMAIL=noreply@saeli.org --project-ref arneigfpwleljkwadupj
//
// Database Webhook 設定（Supabase Dashboard > Database > Webhooks）:
//   - name: notify-reaction
//   - table: letter_reactions
//   - events: INSERT
//   - type: HTTP Request
//   - method: POST
//   - URL: https://arneigfpwleljkwadupj.supabase.co/functions/v1/send-reaction-notification
//   - HTTP Headers: Authorization: Bearer <service_role_key>

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const REACTION_LABEL: Record<string, string> = {
  heart: "ハート ❤️",
  flower: "お花 🌸",
  pray: "合掌 🙏",
  paw: "肉球 🐾",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") || "noreply@saeli.org";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

type WebhookPayload = {
  type: "INSERT";
  table: "letter_reactions";
  record: {
    id: string;
    letter_id: string;
    email_lower: string;
    emoji: string;
  };
};

Deno.serve(async (req) => {
  try {
    const payload: WebhookPayload = await req.json();
    if (payload.type !== "INSERT" || payload.table !== "letter_reactions") {
      return new Response("ignored", { status: 200 });
    }

    const { letter_id, email_lower: reactor_email, emoji } = payload.record;

    // 手紙の投稿者を取得
    const { data: letter, error } = await supabase
      .from("letters")
      .select("pet_name, owner_nickname, email_lower")
      .eq("id", letter_id)
      .maybeSingle();

    if (error || !letter) {
      return new Response(`letter not found: ${error?.message ?? ""}`, { status: 200 });
    }

    // 自分のリアクションなら通知しない
    if (letter.email_lower === reactor_email) {
      return new Response("self reaction, skipped", { status: 200 });
    }

    const label = REACTION_LABEL[emoji] ?? emoji;
    const letterUrl = `https://mainichi-anoko.com/letters/${letter_id}`;

    const subject = `${letter.pet_name}への手紙に${label}が届きました`;
    const text = [
      `${letter.owner_nickname} さま`,
      "",
      `あなたが書いた ${letter.pet_name} への手紙に、`,
      `「${label}」が届きました。`,
      "",
      `▼ お手紙を見る`,
      letterUrl,
      "",
      "--",
      "あの子への手紙 / 合同会社SAELI",
      "通知が不要な場合は hello@saeli.org までご連絡ください。",
    ].join("\n");

    // Resend HTTP API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `あの子への手紙 <${FROM_EMAIL}>`,
        to: [letter.email_lower],
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("resend failed", res.status, errText);
      // メール失敗は致命ではないので200を返してwebhook再送を防ぐ
      return new Response(`resend ${res.status}`, { status: 200 });
    }

    return new Response("sent", { status: 200 });
  } catch (e) {
    console.error("notify failed", e);
    return new Response("error", { status: 200 });
  }
});
