import Link from "next/link";
import { supabaseServer } from "@/lib/supabase-server";
import { LetterCard } from "./components/LetterCard";
import { FeedViewTracker } from "./components/FeedViewTracker";

export const revalidate = 30;

type Letter = {
  id: string;
  pet_name: string;
  owner_nickname: string;
  body: string;
  photo_path: string | null;
  created_at: string;
};

export default async function LettersFeedPage() {
  const supabase = supabaseServer();
  const { data: letters } = await supabase
    .from("letters")
    .select("id, pet_name, owner_nickname, body, photo_path, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const list = (letters as Letter[] | null) ?? [];

  return (
    <div className="space-y-6">
      <FeedViewTracker count={list.length} />
      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <p className="text-xs text-stone-500 text-center">
            天国のあの子へ宛てた手紙が、ここに届きます。
          </p>
          <div className="space-y-6">
            {list.map((letter) => (
              <LetterCard key={letter.id} letter={letter} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 px-6">
      <div className="text-5xl mb-4">✉️</div>
      <h2 className="text-lg font-bold mb-2">まだ手紙が届いていません</h2>
      <p className="text-sm text-stone-600 leading-relaxed mb-6">
        最初の一通を、あなたから書いてみませんか。
        <br />
        どんな言葉でも、あの子に届きます。
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
