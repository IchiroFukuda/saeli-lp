"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";

// Klee One: 手書き風日本語フォント。便箋感を出すために使う
const LETTER_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&display=swap";
const LETTER_FONT_FAMILY = "'Klee One', serif";

type GenResult = {
  petName: string;
  petType: string;
  ownerNickname: string;
  season: string;
  previousReply: string;
  letterText: string;
  imageBase64: string | null;
  mimeType?: string;
};

export default function GeneratorPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenResult | null>(null);
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [ownerNickname, setOwnerNickname] = useState("");

  // パスワードはlocalStorageに保存（簡易）
  useEffect(() => {
    const saved = localStorage.getItem("lettersAdminPassword");
    if (saved) {
      setPassword(saved);
      setAuthed(true);
    }
  }, []);

  // 便箋用の手書きフォントを動的に読み込み
  useEffect(() => {
    const id = "letter-font-link";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = LETTER_FONT_URL;
    document.head.appendChild(link);
  }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/letters/admin/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({
          petName: petName || undefined,
          petType: petType || undefined,
          ownerNickname: ownerNickname || undefined,
        }),
      });
      if (res.status === 401) {
        setError("パスワードが違います");
        setAuthed(false);
        localStorage.removeItem("lettersAdminPassword");
        return;
      }
      if (!res.ok) {
        const err = await res.text();
        setError(`エラー: ${err}`);
        return;
      }
      const data = (await res.json()) as GenResult;
      setResult(data);
      if (!authed) {
        setAuthed(true);
        localStorage.setItem("lettersAdminPassword", password);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
          <h1 className="text-lg font-bold">あの子カフェ ジェネレーター</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理パスワード"
            className="w-full px-3 py-2 border border-stone-300 rounded-md"
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
          <button
            onClick={generate}
            disabled={!password}
            className="w-full bg-orange-500 text-white py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "認証中..." : "入る"}
          </button>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 p-4 sm:p-8 pb-24 sm:pb-16">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-bold">あの子カフェ ジェネレーター</h1>
          <button
            onClick={() => {
              localStorage.removeItem("lettersAdminPassword");
              setAuthed(false);
              setPassword("");
            }}
            className="text-xs text-stone-500 underline"
          >
            ログアウト
          </button>
        </header>

        {/* オプション入力（空ならランダム） */}
        <div className="bg-white rounded-lg p-4 space-y-3 shadow-sm">
          <p className="text-sm text-stone-600">空欄でランダム生成。指定したい場合のみ入力。</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="ペット名（例：もも）"
              className="px-3 py-2 border border-stone-300 rounded-md text-sm"
            />
            <input
              type="text"
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              placeholder="種類（例：柴犬）"
              className="px-3 py-2 border border-stone-300 rounded-md text-sm"
            />
            <input
              type="text"
              value={ownerNickname}
              onChange={(e) => setOwnerNickname(e.target.value)}
              placeholder="飼い主呼び名（例：ママ）"
              className="px-3 py-2 border border-stone-300 rounded-md text-sm"
            />
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 disabled:opacity-50 transition"
          >
            {loading ? "生成中..." : "手紙と写真を生成"}
          </button>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
        </div>

        {/* 結果表示 — フレーム + メタ情報 */}
        {result && (
          <>
            <ResultFrames result={result} />
            <div className="bg-white rounded-lg p-4 text-sm text-stone-600 space-y-2 mt-4">
              <div><span className="font-bold">ペット：</span>{result.petName}（{result.petType}）</div>
              <div><span className="font-bold">飼い主：</span>{result.ownerNickname}</div>
              <div><span className="font-bold">季節：</span>{result.season}</div>
              <div className="pt-2 border-t border-stone-200">
                <div className="font-bold mb-1">飼い主からの手紙（この返事を踏まえてあの子が返信）：</div>
                <div className="text-xs text-stone-500 italic">{result.previousReply}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ResultFrames({ result }: { result: GenResult }) {
  const SENTENCES_PER_FRAME = 2;
  const sentences = result.letterText
    .split(/(?<=[。！？!?])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const frames: string[] = [];
  for (let i = 0; i < sentences.length; i += SENTENCES_PER_FRAME) {
    frames.push(sentences.slice(i, i + SENTENCES_PER_FRAME).join(""));
  }

  const imgSrc = result.imageBase64
    ? `data:${result.mimeType || "image/png"};base64,${result.imageBase64}`
    : null;

  const frameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [downloading, setDownloading] = useState(false);

  async function downloadAll() {
    setDownloading(true);
    try {
      // 全フレーム内の画像がロードされるのを待つ（1枚目欠け対策）
      await Promise.all(
        frameRefs.current.map((node) => {
          if (!node) return Promise.resolve();
          const img = node.querySelector("img");
          if (!img) return Promise.resolve();
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        })
      );

      // 手書きフォントのロード完了を待つ（html-to-imageでフォント脱落対策）
      if (typeof document !== "undefined" && "fonts" in document) {
        try {
          await document.fonts.load(`16px ${LETTER_FONT_FAMILY}`);
          await document.fonts.ready;
        } catch {}
      }

      // html-to-image の初回キャプチャでスタイル/フォントが未確定のことがあるのでwarm-up
      const first = frameRefs.current.find((n) => n);
      if (first) {
        try {
          await toPng(first, { pixelRatio: 1, cacheBust: false });
        } catch {}
      }

      const zip = new JSZip();
      for (let i = 0; i < frameRefs.current.length; i++) {
        const node = frameRefs.current[i];
        if (!node) continue;
        // 9:16 縦長で出力（pixelRatio で解像度UP、TikTok向け1080×1920）
        const dataUrl = await toPng(node, {
          pixelRatio: 3,
          cacheBust: true,
        });
        const base64 = dataUrl.split(",")[1];
        const fileName = `${result.petName}-${String(i + 1).padStart(2, "0")}.png`;
        zip.file(fileName, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.petName}-frames.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("download failed", e);
      alert("ダウンロードに失敗しました");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-stone-500">
          {frames.length}フレーム生成
        </div>
        <button
          onClick={downloadAll}
          disabled={downloading}
          className="bg-stone-700 text-white text-sm px-4 py-2 rounded-md hover:bg-stone-800 disabled:opacity-50"
        >
          {downloading ? "ダウンロード中..." : "全フレーム ZIP ダウンロード"}
        </button>
      </div>

      <div className="space-y-6">
        {frames.map((text, i) => (
          <div key={i} className="mx-auto" style={{ maxWidth: "420px" }}>
            <div className="text-xs text-stone-400 mb-1 text-center">
              フレーム {i + 1} / {frames.length}
            </div>
            <div
              ref={(el) => { frameRefs.current[i] = el; }}
              className="relative overflow-hidden shadow-lg bg-stone-200"
              style={{ aspectRatio: "9/16" }}
            >
              {/* 背景: 木目テーブル */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse at 50% 35%, rgba(0,0,0,0) 35%, rgba(40,20,10,0.45) 100%),
                    repeating-linear-gradient(
                      88deg,
                      #8b6f47 0px,
                      #9a7a52 9px,
                      #8b6f47 21px,
                      #6b5037 33px,
                      #9a7a52 45px
                    )
                  `,
                }}
              />
              {imgSrc && (
                <>
                  {/* Polaroid 写真: 白フレーム+下余白(polaroid 風)、傾き、強いドロップシャドウ */}
                  <div
                    className="absolute"
                    style={{
                      top: "5%",
                      left: "15%",
                      width: "70%",
                      background: "#fefcf7",
                      padding: "14px 14px 50px",
                      borderRadius: "2px",
                      transform: "rotate(2.8deg)",
                      boxShadow:
                        "0 22px 40px rgba(0,0,0,0.5), 0 8px 14px rgba(0,0,0,0.35)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc}
                      alt={result.petName}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        objectPosition: "center 30%",
                        display: "block",
                      }}
                    />
                  </div>
                </>
              )}
              {/* 便箋カード: 写真と少し重ねて、逆方向に傾けて置く。下23%はTikTokキャプション領域として空ける */}
              <div
                className="absolute left-0 right-0 flex justify-center"
                style={{
                  top: "46%",
                  bottom: "23%",
                  paddingLeft: "10%",
                  paddingRight: "18%",
                  alignItems: "center",
                }}
              >
                {/* 便箋風カード。手書きフォント＋クリーム色背景＋紙テクスチャ。木目上なので不透明 */}
                <div
                  className="whitespace-pre-wrap"
                  style={{
                    fontFamily: LETTER_FONT_FAMILY,
                    fontSize: text.length > 100 ? "16px" : text.length > 70 ? "18px" : "20px",
                    lineHeight: 2.0,
                    color: "#3a2f24",
                    fontWeight: 500,
                    padding: "22px 24px",
                    width: "100%",
                    background:
                      "linear-gradient(180deg, #faf2e0 0%, #f3e8cf 50%, #ede0c0 100%)",
                    boxShadow:
                      "0 16px 32px rgba(0,0,0,0.45), 0 6px 12px rgba(0,0,0,0.3), inset 0 0 30px rgba(120,90,40,0.08)",
                    borderRadius: "3px",
                    transform: "rotate(-2deg)",
                    backgroundImage:
                      "linear-gradient(180deg, #faf2e0 0%, #f3e8cf 50%, #ede0c0 100%), repeating-linear-gradient(transparent, transparent 31px, rgba(120,90,40,0.1) 31px, rgba(120,90,40,0.1) 32px)",
                    backgroundBlendMode: "multiply",
                  }}
                >
                  {text}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
