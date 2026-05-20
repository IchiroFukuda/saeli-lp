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
      <Hero />
      {list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {list.map((letter) => (
            <LetterCard key={letter.id} letter={letter} />
          ))}
        </div>
      )}
    </div>
  );
}

function Hero() {
  return (
    <section className="text-center py-6 sm:py-8">
      <h1 className="text-lg sm:text-xl font-bold text-stone-700 mb-3 leading-relaxed">
        天国のあの子へ、
        <br className="sm:hidden" />
        手紙を書ける場所
      </h1>
      <p className="text-sm text-stone-600 leading-relaxed mb-5 px-2">
        どんな言葉でも、あの子に届きます。
        <br />
        誰でも自由に、無料で書けます。
      </p>
      <Link
        href="/letters/new"
        className="inline-block bg-orange-500 text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition"
      >
        手紙を書く
      </Link>
    </section>
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
