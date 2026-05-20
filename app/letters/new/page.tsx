"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase";
import { trackLetters } from "@/lib/analytics";

export default function NewLetterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    const verified = searchParams.get("verified") === "1";
    trackLetters("letter_new_view", { verified });
  }, [searchParams]);

  // magic linkを踏んで戻ってきた場合：localStorageの下書きを復元して自動投稿
  useEffect(() => {
    if (searchParams.get("verified") !== "1") return;
    (async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) return;

      const raw = localStorage.getItem("pendingLetter");
      if (!raw) return;
      try {
        const pending = JSON.parse(raw);
        setPetName(pending.petName ?? "");
        setOwnerNickname(pending.ownerNickname ?? "");
        setBody(pending.body ?? "");
        // 投稿は明示的に押させる（自動投稿だと違和感）
      } catch {}
    })();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!petName || !ownerNickname || !body || !email) {
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="あの子のお名前" required>
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            maxLength={30}
            className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white"
            placeholder="例：メリ"
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
        </Field>

        <Field label="写真（任意）">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </Field>

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
          {submitting ? "送信中..." : "確認メールを送る"}
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
