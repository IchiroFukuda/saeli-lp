"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { trackLetters } from "@/lib/analytics";
import { detectNG } from "@/lib/letters/ng-words";

export default function NewLetterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get("verified") === "1";
  const [step, setStep] = useState<"form" | "magic-sent" | "verified">("form");
  const [email, setEmail] = useState("");
  const [petName, setPetName] = useState("");
  const [ownerNickname, setOwnerNickname] = useState("");
  const [body, setBody] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 投稿ページ表示計測（verified=1ありなら "verified" view、なしなら新規view）
  useEffect(() => {
    trackLetters("letter_new_view", { verified });
  }, [verified]);

  const ngDetected = useMemo(() => detectNG(body), [body]);

  // NG検出時に1度だけ計測
  useEffect(() => {
    if (ngDetected) trackLetters("letter_ng_detected");
  }, [ngDetected]);

  // magic linkを踏んで戻ってきた場合：localStorageの下書きを復元（投稿は明示的に押させる）
  useEffect(() => {
    if (!verified) return;
    (async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return;
      setEmail(user.email);

      const raw = localStorage.getItem("pendingLetter");
      if (!raw) return;
      try {
        const pending = JSON.parse(raw);
        setPetName(pending.petName ?? "");
        setOwnerNickname(pending.ownerNickname ?? "");
        setBody(pending.body ?? "");
      } catch {}
    })();
  }, [verified]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!petName || !ownerNickname || !body || (!verified && !email)) {
      setError("すべての必須項目をご入力ください。");
      return;
    }

    setSubmitting(true);
    trackLetters("letter_submit_attempt", { body_len: body.length, has_photo: !!photo });

    const supabase = supabaseBrowser();

    // 既にログイン済みの場合はそのまま投稿
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      await submitLetter(user.email);
      return;
    }

    // 未認証 → 入力内容をlocalStorageに退避してmagic link送信
    localStorage.setItem(
      "pendingLetter",
      JSON.stringify({ petName, ownerNickname, body })
    );

    const { error: authErr } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/letters/new?verified=1`,
      },
    });

    if (authErr) {
      setError(authErr.message);
      setSubmitting(false);
      return;
    }

    setStep("magic-sent");
    setSubmitting(false);
    trackLetters("letter_magic_link_sent");
  }

  async function submitLetter(userEmail: string) {
    const supabase = supabaseBrowser();
    const email_lower = userEmail.toLowerCase();

    let photo_path: string | null = null;
    if (photo) {
      const path = `${email_lower}/${crypto.randomUUID()}.${photo.name.split(".").pop() ?? "jpg"}`;
      const { error: upErr } = await supabase.storage
        .from("letter-photos")
        .upload(path, photo, { upsert: false });
      if (upErr) {
        setError(`写真のアップロードに失敗しました: ${upErr.message}`);
        setSubmitting(false);
        return;
      }
      photo_path = path;
    }

    const { error: insErr } = await supabase.from("letters").insert({
      pet_name: petName,
      owner_nickname: ownerNickname,
      body,
      photo_path,
      email_lower,
    });

    if (insErr) {
      setError(`投稿に失敗しました: ${insErr.message}`);
      setSubmitting(false);
      return;
    }

    localStorage.removeItem("pendingLetter");
    trackLetters("letter_published", { has_photo: !!photo, body_len: body.length });
    router.push("/letters");
  }

  if (step === "magic-sent") {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-lg font-bold mb-3">確認メールをお送りしました</h2>
        <p className="text-sm text-stone-600 leading-relaxed">
          メール内のリンクを開いていただくと、
          <br />
          お手紙が広場に届きます。
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-6 text-center">あの子へ手紙を書く</h1>

      {verified && (
        <div className="mb-5 text-sm text-stone-700 bg-orange-50 border border-orange-200 rounded-md p-3 text-center">
          ✓ メール認証が完了しました。
          <br />
          投稿ボタンを押すと、お手紙が広場に届きます。
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="あの子のお名前" required>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            maxLength={30}
            className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white"
            placeholder="例：もも"
          />
        </Field>

        <Field label="あなたの呼び名" required>
          <input
            type="text"
            value={ownerNickname}
            onChange={(e) => setOwnerNickname(e.target.value)}
            maxLength={30}
            className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white"
            placeholder="例：ママ"
          />
        </Field>

        <Field label="手紙の本文" required>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={10}
            className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white font-serif leading-loose"
            placeholder="あの子へ伝えたいことを、自由に書いてください。"
          />
          <p className="text-xs text-stone-500 text-right mt-1">
            {body.length} / 2000
          </p>
          {ngDetected && (
            <div className="mt-3 text-sm bg-stone-50 border border-stone-300 rounded-md p-4 leading-relaxed">
              <p className="mb-2">お辛い気持ちが伝わってきました。</p>
              <p className="mb-3 text-stone-600">
                ひとりで抱え込まず、よかったら相談窓口もご覧ください。
              </p>
              <Link
                href="/mainichi-anoko/blog/atooi"
                target="_blank"
                rel="noopener"
                onClick={() => trackLetters("atooi_link_click", { from: "letter_form_ng" })}
                className="inline-block text-stone-700 underline hover:text-stone-900"
              >
                相談窓口を見る →
              </Link>
            </div>
          )}
        </Field>

        <Field label="写真（任意）">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </Field>

        {!verified && (
          <Field label="メールアドレス" required>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white"
              placeholder="hello@example.com"
            />
            <p className="text-xs text-stone-500 mt-1">
              初回のみ、確認メールをお送りします。投稿の削除にも必要です。
            </p>
          </Field>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-full hover:bg-orange-600 disabled:opacity-50 transition"
        >
          {submitting
            ? "送信中..."
            : verified
            ? "広場に投稿する"
            : "確認メールを送る"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-bold mb-1.5">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
