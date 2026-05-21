// あの子カフェのTikTok用 手紙+ペット画像 生成API
// city-api（毎日あの子アプリと同じバックエンド）を経由してGemini呼ぶ
// = アプリと同じ品質の手紙が生成される

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const CITY_API_URL = "https://city-api-six.vercel.app/api/generate-petdiary";

const PET_TYPES = ["柴犬", "トイプードル", "ミニチュアダックスフンド", "猫", "ハムスター", "ウサギ", "セキセイインコ"];
const PET_NAMES = ["もも", "ハナ", "ココ", "そら", "ゆず", "あんこ", "ちゃちゃ", "コタロウ", "リリィ", "ムギ", "マロン", "シロ"];
const OWNER_NAMES = ["お母さん", "お父さん", "お姉ちゃん", "お兄ちゃん", "ママ", "パパ"];
const PERSONALITIES = [
  "元気で甘えん坊、ご飯と散歩が大好き",
  "落ち着いていて優しい、静かに寄り添うのが好き",
  "好奇心旺盛でいたずら好き、いつも何かを探検している",
  "賢くて飼い主の気持ちをよく察する",
  "マイペースで自由気まま、お昼寝が一番好き",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get("x-admin-password");
  return password === process.env.LETTERS_ADMIN_PASSWORD;
}

function currentSeason(): string {
  const m = new Date().getMonth() + 1;
  if (m >= 3 && m <= 5) return "春";
  if (m >= 6 && m <= 8) return "夏";
  if (m >= 9 && m <= 11) return "秋";
  return "冬";
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const petName = body.petName || pick(PET_NAMES);
  const petType = body.petType || pick(PET_TYPES);
  const ownerNickname = body.ownerNickname || pick(OWNER_NAMES);
  const personality = body.personality || pick(PERSONALITIES);
  const season = currentSeason();

  try {
    const cityRes = await fetch(CITY_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        petName,
        animalType: petType,
        gender: "",
        personality,
        favorites: "",
        ownerName: ownerNickname,
        weatherInfo: `今は${season}です`,
        eventInfo: "",
        daysSinceLastLetter: 1,
      }),
    });

    if (!cityRes.ok) {
      const errText = await cityRes.text();
      return NextResponse.json(
        { error: `city-api error: ${cityRes.status} ${errText}` },
        { status: 502 }
      );
    }

    const data = await cityRes.json();
    return NextResponse.json({
      petName,
      petType,
      ownerNickname,
      season,
      letterText: data.diaryText || "",
      imageBase64: data.imageBase64 || null,
      mimeType: data.mimeType || "image/png",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: `fetch failed: ${e.message}` },
      { status: 500 }
    );
  }
}
