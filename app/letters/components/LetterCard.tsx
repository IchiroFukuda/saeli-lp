"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

const REACTIONS = [
  { key: "heart", label: "ハート", emoji: "❤️" },
  { key: "flower", label: "お花", emoji: "🌸" },
  { key: "pray", label: "合掌", emoji: "🙏" },
  { key: "paw", label: "肉球", emoji: "🐾" },
] as const;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function LetterCard({ letter }: { letter: Letter }) {
  const [sentEmoji, setSentEmoji] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !trackedRef.current) {
            trackedRef.current = true;
            trackLetters("letter_view", { letter_id: letter.id });
          }
        }
      },
      { threshold: 0.5 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [letter.id]);

  async function sendReaction(emoji: typeof REACTIONS[number]["key"]) {
    if (sending) return;
    setSending(true);
    try {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        window.location.href = `/letters/new?reaction=${emoji}&letter=${letter.id}`;
        return;
      }
      await supabase.from("letter_reactions").insert({
        letter_id: letter.id,
        email_lower: user.email.toLowerCase(),
        emoji,
      });
      setSentEmoji(emoji);
      trackLetters("reaction_sent", { letter_id: letter.id, emoji });
    } catch {
      // 重複等は静かに無視
      setSentEmoji(emoji);
    } finally {
      setSending(false);
    }
  }

  const dateText = formatDate(letter.created_at);
  const photoUrl = letter.photo_path
    ? `${SUPABASE_URL}/storage/v1/object/public/letter-photos/${letter.photo_path}`
    : null;

  return (
    <article ref={cardRef} className="relative bg-[#FDFBF5] border border-stone-200 rounded-xl p-5 sm:p-7 shadow-sm">
      <Link
        href={`/letters/${letter.id}`}
        onClick={() => trackLetters("letter_detail_link_click", { letter_id: letter.id, from: "feed_date" })}
        className="absolute top-3 right-4 text-xs text-stone-400 hover:text-stone-600 font-serif"
      >
        {dateText}
      </Link>

      <div className="text-sm text-stone-500 font-serif mb-3">
        {letter.pet_name}へ
      </div>

      <div className="font-serif text-stone-700 leading-loose whitespace-pre-wrap text-[15px] mb-4">
        {letter.body}
      </div>

      {photoUrl && (
        <div className="my-4 -mx-1">
          <Image
            src={photoUrl}
            alt={`${letter.pet_name}の写真`}
            width={600}
            height={600}
            className="w-full h-auto rounded-xl"
            unoptimized
          />
        </div>
      )}

      <div className="text-right text-sm text-stone-500 font-serif mt-4">
        {letter.owner_nickname} より
      </div>

      <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between">
        <div className="flex gap-2">
          {REACTIONS.map((r) => (
            <button
              key={r.key}
              onClick={() => sendReaction(r.key)}
              disabled={sending || sentEmoji === r.key}
              className={`text-xl p-2 rounded-full transition ${
                sentEmoji === r.key
                  ? "bg-orange-100 scale-110"
                  : "hover:bg-stone-100"
              }`}
              aria-label={`${r.label}を送る`}
            >
              {r.emoji}
            </button>
          ))}
        </div>
        {sentEmoji && (
          <span className="text-xs text-stone-500 transition">届きました</span>
        )}
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}
