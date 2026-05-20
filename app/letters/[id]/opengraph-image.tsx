import { ImageResponse } from "next/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// jsDelivr経由でNoto Sans CJK JP TTFを取得。
// Vercel Edgeで初回fetch後はCDNキャッシュで再利用される。
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(FONT_URL);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { id: string } }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: letter } = await supabase
    .from("letters")
    .select("pet_name, owner_nickname, body")
    .eq("id", params.id)
    .maybeSingle();

  const fontData = await loadFont();
  const fontFamily = fontData ? "NotoSansJP" : undefined;
  const fonts = fontData
    ? [{ name: "NotoSansJP", data: fontData, style: "normal" as const }]
    : undefined;

  if (!letter) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            background: "#FAF6EF",
            color: "#57534e",
            fontSize: 48,
            justifyContent: "center",
            alignItems: "center",
            fontFamily,
          }}
        >
          あの子への手紙
        </div>
      ),
      { ...size, fonts }
    );
  }

  const excerpt = letter.body.slice(0, 80) + (letter.body.length > 80 ? "…" : "");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#FDFBF5",
          padding: "80px 90px",
          color: "#44403c",
          borderTop: "20px solid #f97316",
          fontFamily,
        }}
      >
        <div style={{ fontSize: 28, color: "#a8a29e", marginBottom: 30 }}>
          あの子への手紙
        </div>

        <div style={{ fontSize: 44, color: "#78716c", marginBottom: 36 }}>
          {letter.pet_name}へ
        </div>

        <div
          style={{
            fontSize: 36,
            lineHeight: 1.6,
            color: "#57534e",
            flex: 1,
            display: "flex",
          }}
        >
          {excerpt}
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#78716c",
            textAlign: "right",
            marginTop: 30,
          }}
        >
          {letter.owner_nickname} より
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
