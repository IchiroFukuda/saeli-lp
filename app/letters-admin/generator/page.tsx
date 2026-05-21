"use client";

import { useEffect, useState } from "react";

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

        {/* 結果表示 — 段落ごとに画像背景+大文字のフレームを複数 */}
        {result && (
          <div className="space-y-4">
            <div className="text-xs text-stone-500 text-center">
              各フレームをスクショして繋げる（9:16 × 段落数）
            </div>

            {(() => {
              // 段落分割（空行 or 改行で区切る、空文字除外）
              const paragraphs = result.letterText
                .split(/\n\s*\n|\n/)
                .map((p) => p.trim())
                .filter((p) => p.length > 0);
              const imgSrc = result.imageBase64
                ? `data:${result.mimeType || "image/png"};base64,${result.imageBase64}`
                : null;

              const frames = [
                // 最初は画像のみ（オープニング）
                { type: "opening" as const, text: "" },
                // 各段落
                ...paragraphs.map((text) => ({ type: "para" as const, text })),
              ];

              return (
                <div className="space-y-6">
                  {frames.map((frame, i) => (
                    <div key={i} className="mx-auto" style={{ maxWidth: "420px" }}>
                      <div className="text-xs text-stone-400 mb-1 text-center">
                        フレーム {i + 1} / {frames.length}
                      </div>
                      <div
                        className="relative overflow-hidden shadow-lg bg-stone-300"
                        style={{ aspectRatio: "9/16" }}
                      >
                        {imgSrc && (
                          <img
                            src={imgSrc}
                            alt={result.petName}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}

                        {/* 段落フレーム：下部に半透明オーバーレイ + 大きい文字 */}
                        {frame.type === "para" && (
                          <>
                            <div
                              className="absolute inset-x-0 bottom-0"
                              style={{
                                height: "55%",
                                background:
                                  "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 25%, rgba(0,0,0,0.85) 100%)",
                              }}
                            />
                            <div
                              className="absolute inset-x-0 bottom-0 px-6 py-8 font-serif text-white leading-loose whitespace-pre-wrap"
                              style={{
                                fontSize: frame.text.length > 80 ? "18px" : frame.text.length > 50 ? "21px" : "24px",
                                lineHeight: 1.7,
                                textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                              }}
                            >
                              {frame.text}
                            </div>
                          </>
                        )}

                        {/* オープニングフレーム：上部に小さくキャプション */}
                        {frame.type === "opening" && (
                          <>
                            <div
                              className="absolute inset-x-0 top-0"
                              style={{
                                height: "30%",
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                              }}
                            />
                            <div className="absolute inset-x-0 top-6 text-center font-serif text-white"
                                 style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
                              <div className="text-sm opacity-80">空の町から</div>
                              <div className="text-lg mt-1">お手紙が届きました</div>
                            </div>
                            <div className="absolute inset-x-0 bottom-6 text-center font-serif text-white"
                                 style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
                              <div className="text-base">— {result.petName} より —</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="bg-white rounded-lg p-4 text-sm text-stone-600 space-y-2">
              <div><span className="font-bold">ペット：</span>{result.petName}（{result.petType}）</div>
              <div><span className="font-bold">飼い主：</span>{result.ownerNickname}</div>
              <div><span className="font-bold">季節：</span>{result.season}</div>
              <div className="pt-2 border-t border-stone-200">
                <div className="font-bold mb-1">飼い主からの手紙（この返事を踏まえてあの子が返信）：</div>
                <div className="text-xs text-stone-500 italic">{result.previousReply}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
