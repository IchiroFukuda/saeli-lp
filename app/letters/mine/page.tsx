"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase";
import { trackLetters } from "@/lib/analytics";

type Letter = {
  id: string;
  pet_name: string;
  owner_nickname: string;
  body: string;
  photo_path: string | null;
  created_at: string;
};

export default function MineLettersPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    trackLetters("mine_view");
    (async () => {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        setLoading(false);
        return;
      }
      setEmail(user.email);
      const { data } = await supabase
        .from("letters")
        .select("id, pet_name, owner_nickname, body, photo_path, created_at")
        .eq("email_lower", user.email.toLowerCase())
        .order("created_at", { ascending: false });
      setLetters((data as Letter[] | null) ?? []);
      setLoading(false);
    })();
  }, []);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!magicLinkEmail) return;
    const supabase = supabaseBrowser();
    const { error: authErr } = await supabase.auth.signInWithOtp({
      email: magicLinkEmail,
      options: { emailRedirectTo: `${window.location.origin}/letters/mine` },
    });
    if (authErr) {
      setError(authErr.message);
      return;
    }
    setMagicLinkSent(true);
    trackLetters("mine_magic_link_sent");
  }

  if (loading) {
    return <div className="text-center py-16 text-sm text-stone-500">読み込み中...</div>;
  }

  if (!email) {
    if (magicLinkSent) {
      return (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-lg font-bold mb-3">確認メールをお送りしました</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            メール内のリンクを開くと、
            <br />
            投稿した手紙の一覧が表示されます。
          </p>
        </div>
      );
    }
    return (
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-xl font-bold mb-4 text-center">あなたの手紙</h1>
        <p className="text-sm text-stone-600 leading-relaxed mb-6 text-center">
          投稿時のメールアドレスで認証すると、
          <br />
          ご自身の手紙の編集・削除ができます。
        </p>
        <form onSubmit={sendMagicLink} className="space-y-4">
          <input
            type="email"
            value={magicLinkEmail}
            onChange={(e) => setMagicLinkEmail(e.target.value)}
            placeholder="hello@example.com"
            className="w-full px-3 py-2 border border-stone-300 rounded-md bg-white"
            required
          />
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-full hover:bg-orange-600 transition"
          >
            認証メールを送る
          </button>
        </form>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-4">✉️</div>
        <p className="text-sm text-stone-600 mb-6">
          まだ手紙を投稿していません。
        </p>
        <Link
          href="/letters/new"
          className="inline-block bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition"
        >
          手紙を書く
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">あなたの手紙</h1>
      <p className="text-xs text-stone-500">
        {email} で投稿された手紙 {letters.length}通
      </p>

      <div className="space-y-3 mt-4">
        {letters.map((letter) => (
          <Link
            key={letter.id}
            href={`/letters/${letter.id}`}
            className="block bg-[#FDFBF5] border border-stone-200 rounded-lg p-4 hover:border-stone-300 transition"
          >
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <div className="text-sm font-bold text-stone-700">
                {letter.pet_name}へ
              </div>
              <div className="text-xs text-stone-400 font-serif shrink-0">
                {formatDate(letter.created_at)}
              </div>
            </div>
            <div className="text-sm text-stone-600 line-clamp-2 leading-relaxed">
              {letter.body}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}
