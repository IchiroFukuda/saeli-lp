// あの子カフェのTikTok用 手紙+ペット画像 生成API
// 公開しない管理ツール用。簡易パスワード認証。

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";
export const maxDuration = 60;

const PET_TYPES = ["柴犬", "トイプードル", "ミニチュアダックスフンド", "猫", "ハムスター", "ウサギ", "セキセイインコ"];
const PET_NAMES = ["もも", "ハナ", "ココ", "そら", "ゆず", "あんこ", "ちゃちゃ", "コタロウ", "リリィ", "ムギ", "マロン", "シロ"];
const OWNER_NAMES = ["お母さん", "お父さん", "お姉ちゃん", "お兄ちゃん", "ママ", "パパ"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get("x-admin-password");
  return password === process.env.LETTERS_ADMIN_PASSWORD;
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const petName = body.petName || pick(PET_NAMES);
  const petType = body.petType || pick(PET_TYPES);
  const ownerNickname = body.ownerNickname || pick(OWNER_NAMES);
  const season = body.season || currentSeason();

  const ai = new GoogleGenAI({ apiKey });

  // 1. 手紙テキスト生成
  const letterPrompt = `あなたは虹の橋を渡ったペット「${petName}」（${petType}）です。
天国の「空の町」で元気に暮らしています。
飼い主の「${ownerNickname}」へあてた短い手紙を書いてください。

季節: ${season}

要件:
- 100〜200文字
- ひらがな多め、優しく温かい言葉
- 「ありがとう」「元気」「大丈夫」のニュアンスを含む
- ペットらしい無邪気さ、ちょっとしたユーモア可
- 改行は2〜3箇所
- 最後に「${ownerNickname}へ ${petName}より」と署名
- 「拝啓」「敬具」等の堅い形式は使わない

手紙本文のみを返してください。説明文や前置きは不要。`;

  const letterRes = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: letterPrompt,
    config: {
      temperature: 0.9,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  const letterText = letterRes.text?.trim() || "";

  // 2. ペット画像生成
  const imagePrompt = `A peaceful ${petType} in a warm cozy atmosphere, watercolor illustration style, soft warm lighting, gentle pastel and amber colors, picture book quality, slightly nostalgic, looking happy and content, NOT photorealistic, NOT cute cartoon, melancholic warm vibe, vertical composition`;

  let imageBase64: string | null = null;
  try {
    const imageRes = await ai.models.generateImages({
      model: "imagen-3.0-generate-002",
      prompt: imagePrompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "3:4",
      },
    });
    const generated = imageRes.generatedImages?.[0];
    if (generated?.image?.imageBytes) {
      imageBase64 = generated.image.imageBytes;
    }
  } catch (e) {
    console.error("image gen failed", e);
  }

  return NextResponse.json({
    petName,
    petType,
    ownerNickname,
    season,
    letterText,
    imageBase64,
  });
}

function currentSeason(): string {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "春";
  if (m >= 6 && m <= 8) return "夏";
  if (m >= 9 && m <= 11) return "秋";
  return "冬";
}
