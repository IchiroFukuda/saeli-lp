// あの子カフェのTikTok用 手紙+ペット画像 生成API
// city-api（毎日あの子アプリと同じバックエンド）を経由してGemini呼ぶ
// = アプリと同じ品質の手紙が生成される

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const CITY_API_URL = "https://city-api-six.vercel.app/api/generate-petdiary";

// 犬猫中心、他は時々（メインターゲット＝犬猫飼い主層）
const PET_TYPES_COMMON = [
  "柴犬", "トイプードル", "ミニチュアダックスフンド", "チワワ", "ポメラニアン",
  "ゴールデンレトリバー", "コーギー", "シーズー", "フレンチブルドッグ", "ヨークシャテリア",
  "ミックス犬",
  "猫", "雑種猫", "アメリカンショートヘア", "スコティッシュフォールド", "マンチカン", "ロシアンブルー",
];
const PET_TYPES_RARE = ["ハムスター", "ウサギ", "セキセイインコ", "文鳥", "フェレット"];

const PET_NAMES = [
  "もも", "ハナ", "ココ", "そら", "ゆず", "あんこ", "ちゃちゃ", "コタロウ", "リリィ", "ムギ",
  "マロン", "シロ", "レオ", "リン", "さくら", "モカ", "きなこ", "クロ", "ミルク", "ベル",
  "ロン", "ナナ", "ふく", "タロ", "シナモン", "ハル", "ノエル", "ラム", "リク", "クッキー",
  "ジャム", "チョコ", "クー", "テン", "バニラ", "ミント", "あん", "きら", "コタ", "ぽん",
];

// メインターゲット＝母（お母さん／ママ）を高頻度に
const OWNER_NAMES_COMMON = ["お母さん", "ママ"];
const OWNER_NAMES_RARE = ["お父さん", "お姉ちゃん", "お兄ちゃん", "パパ"];
const PERSONALITIES = [
  "元気で甘えん坊、ご飯と散歩が大好き",
  "落ち着いていて優しい、静かに寄り添うのが好き",
  "好奇心旺盛でいたずら好き、いつも何かを探検している",
  "賢くて飼い主の気持ちをよく察する",
  "マイペースで自由気まま、お昼寝が一番好き",
];

// 飼い主からあの子へ送った前回の手紙（previousReply）テンプレ集
// バリエーション豊富にすることで、生成される返事も多様化する
const OWNER_REPLIES = [
  // 寂しさ系
  "今日は雨だったね。あなたがいない部屋がとても静かで、少し寂しいよ。",
  "あなたがいなくなってから、家の中の音が変わった気がする。元気にしてる？",
  "今日もあなたのお気に入りだった毛布を見て、思わず泣いてしまったよ。",
  // 日常報告系
  "今日、あなたとよく散歩した公園に行ってきたよ。桜が咲いてた。",
  "新しいごはん見つけたんだけど、あなたきっと好きだったろうな。",
  "おばあちゃんが家に来てくれたよ。あなたに会いたかったって言ってた。",
  // 思い出系
  "あなたが初めてうちに来た日のこと、よく思い出すよ。あの日は雪だったね。",
  "写真を整理してたら、あなたが子供の頃の動画が出てきた。可愛すぎて笑った。",
  "あなたが一番喜んでくれたおもちゃ、まだ大切にとってあるよ。",
  // 季節・行事系
  "今日はクリスマスだよ。あなたと過ごした去年のクリスマスを覚えてる？",
  "もうすぐお正月だね。お雑煮あなたにもあげたかったな。",
  "夏が来たね。あなたが大好きだった扇風機の風、まだ覚えてる？",
  // 夢系
  "昨日夢にあなたが出てきたよ。元気に走り回ってて、本当に嬉しかった。",
  "最近よくあなたの夢を見るんだ。そっちから会いに来てくれてるのかな。",
  // 質問系
  "そっちは寒くない？ちゃんとご飯食べてる？お友達はできた？",
  "あなたは今、痛くない？苦しくない？それだけが心配で。",
  // 感謝系
  "あの子、本当にありがとう。あなたがいてくれた毎日が、私の宝物です。",
  "あなたと過ごした時間が、私を強くしてくれました。",
  // 前向き系
  "少しずつ、笑えるようになってきたよ。あなたが見守ってくれてるからかな。",
  "新しい子をお迎えするかどうか、迷ってる。あなたはどう思う？",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 確率で主リスト・サブリストから選ぶ（commonRatio=0.85なら85%でcommon側）
function pickWeighted<T>(common: T[], rare: T[], commonRatio: number): T {
  return Math.random() < commonRatio ? pick(common) : pick(rare);
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
  // 犬猫を88%、その他（ハム・ウサ・鳥）を12%で選ぶ
  const petType = body.petType || pickWeighted(PET_TYPES_COMMON, PET_TYPES_RARE, 0.88);
  // お母さん／ママを75%、その他を25%
  const ownerNickname = body.ownerNickname || pickWeighted(OWNER_NAMES_COMMON, OWNER_NAMES_RARE, 0.75);
  const personality = body.personality || pick(PERSONALITIES);
  const previousReply = body.previousReply || pick(OWNER_REPLIES);
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
        previousReply,
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
    let letterText: string = (data.diaryText || "").trim();

    // 末尾に「○○より」の署名を付与（既に署名がある場合はスキップ）
    const hasSignature = /より\s*$/.test(letterText) || letterText.includes(`${petName}より`);
    if (letterText && !hasSignature) {
      letterText = `${letterText}\n\n${petName}より`;
    }

    return NextResponse.json({
      petName,
      petType,
      ownerNickname,
      season,
      previousReply,
      letterText,
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
