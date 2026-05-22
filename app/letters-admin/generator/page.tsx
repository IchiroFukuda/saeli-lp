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
              // 句点・！・？で分割して、2文ごとに1フレームにまとめる
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

              return (
                <div className="space-y-6">
                  {frames.map((text, i) => (
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
                        {/* 中央エリアに半透明オーバーレイ＋テキスト */}
                        <div className="absolute inset-0 flex items-center justify-center px-6">
                          <div
                            className="font-serif text-white leading-loose whitespace-pre-wrap text-center"
                            style={{
                              fontSize: text.length > 100 ? "17px" : text.length > 70 ? "20px" : "23px",
                              lineHeight: 1.7,
                              textShadow: "0 2px 6px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)",
                              background: "rgba(0,0,0,0.35)",
                              padding: "20px 18px",
                              borderRadius: "10px",
                              backdropFilter: "blur(2px)",
                            }}
                          >
                            {text}
                          </div>
                        </div>
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
