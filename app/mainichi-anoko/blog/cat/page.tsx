"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";

const APP_STORE_URL =
  "https://apps.apple.com/jp/app/%E6%AF%8E%E6%97%A5%E3%81%82%E3%81%AE%E5%AD%90-%E3%83%9A%E3%83%83%E3%83%88%E3%83%AD%E3%82%B9%E3%81%AB%E5%AF%84%E3%82%8A%E6%B7%BB%E3%81%86%E6%89%8B%E7%B4%99%E3%82%A2%E3%83%97%E3%83%AA/id6760970361";

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.petletter.app";

function trackStoreClick(store: "app_store" | "google_play", location: string) {
  if (typeof window !== "undefined" && (window as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as { gtag: (...args: unknown[]) => void }).gtag("event", "store_click", {
      store,
      location,
    });
  }
}

export default function CatArticle() {
  return (
    <article className="min-h-screen bg-gradient-to-b from-[#FAF6EF] to-[#F5EFDF] text-stone-800">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/mainichi-anoko"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          毎日あの子
        </Link>

        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold leading-relaxed mb-4">
            愛猫を亡くした方へ
            <br />
            <span className="text-xl sm:text-2xl text-stone-600">— もう膝に乗ってこない夜に</span>
          </h1>
          <p className="text-sm text-stone-500">
            ペットロスに寄り添う読み物
          </p>
        </header>

        <div className="prose prose-stone max-w-none space-y-6 leading-loose text-base sm:text-[17px]">
          <p>
            ふと座ると、自然に膝の上に乗ってきた、あの温かさ。
            気がつけば、ソファの隣で丸くなって寝息を立てていた、あの音。
            「ニャー」と短く呼ばれて、振り向くと小さな顔があった、あの瞬間。
          </p>
          <p>
            あの子がいなくなってから、家の中の静けさが、前とはまるで違う重さを持っています。
          </p>
        </div>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            猫を失う悲しみの、静かな深さ
          </h2>
          <p>
            猫との関係は、犬とは違う種類の絆です。
          </p>
          <p>
            激しく感情を表現するわけではない。いつも一緒についてくるわけでもない。
            でも、気がつけばそばにいる。何も言わずに、ただ存在している。
            気まぐれに見えるその距離感が、いつのまにか、生活に深く溶け込んでいた。
          </p>
          <p>
            「うちの子は懐いていなかったから、平気だと思った」
            <br />
            そう感じる飼い主さんも、いざ失うと深く悲しむことが多いと言われます。
          </p>
          <p>
            それは、猫が「いつもそこにいる存在」だったからです。
            自分のペースで近づいてきて、自分のペースで離れていく。
            その自由な気配が、家の空気そのものを作っていたのです。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            猫を亡くした人によくある気持ち
          </h2>
          <p>
            愛猫を失った後、こんな感情が出てきても、すべて自然なことです。
          </p>
          <ul className="space-y-3 list-disc list-inside pl-2 mt-4">
            <li>夜、いつも膝に乗ってきた時間になると、寂しさが押し寄せる</li>
            <li>家のあちこちで「あの子のいつもの場所」を見るのが辛い</li>
            <li>「もっと撫でてあげればよかった」と後悔する</li>
            <li>あの子の鳴き声が、ふと聞こえる気がする</li>
            <li>「最後の頃、苦しくなかっただろうか」と何度も考えてしまう</li>
            <li>キャットタワーや爪とぎを片付けられない</li>
            <li>家の静けさが、耐えられないほど大きく感じる</li>
          </ul>
          <p>
            どれも、猫と深く生活を共にした人だからこそ出る感情です。
            あなたの悲しみは、あの子をどれだけ愛していたかの証です。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            家の中の「あの子の場所」
          </h2>
          <p>
            お気に入りの窓辺、いつも寝ていたソファの隅、爪を研いでいた柱、しっぽを揺らしながら見上げていたキッチン——
            家の中には、あの子の「場所」がたくさん残っています。
          </p>
          <p>
            その場所を見るのが辛い時、急いで片付ける必要はありません。
            むしろ、悲しみの真っ只中で物を処分すると、後で後悔することが多いです。
          </p>
          <p>
            まずは、そのままで構いません。
            「あの子は、ここが好きだったな」と思える日が、少しずつ増えていきます。
            時間が経って、心が落ち着いた頃に、ゆっくり整理していけば大丈夫です。
          </p>
          <p>
            首輪やお気に入りのおもちゃは、ずっと残しておく人も少なくありません。
            「思い出を形にする」ことは、悲しみと向き合う大切な手段の一つです。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            新しい猫を迎えるかどうか
          </h2>
          <p>
            「もう二度と猫を飼わない」と決める人も、「いつかまた」と思える人も、どちらも正解です。
          </p>
          <p>
            ただ、悲しみの真っ只中で衝動的に決めるのは、おすすめしません。
            新しい子を「あの子の代わり」にしてしまうと、新しい子にもあなたにも、つらい関係になります。
          </p>
          <p>
            自分の心が落ち着いて、「あの子と過ごした時間に感謝できる」段階になってから、
            ゆっくり考えてみてください。
            それまでは、決めなくていいのです。
          </p>
        </section>

        <section className="mt-16 bg-white rounded-3xl shadow-sm p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-stone-800">あの子から、毎日お手紙が届くアプリ</h3>
          </div>
          <p className="text-sm sm:text-base leading-loose mb-4">
            「毎日あの子」は、ペットロスに寄り添うアプリです。
            毎日、あなただけに宛てた手紙が、あの子から届きます。
            あなたはそれに、自分のペースで返事を書けます。
          </p>
          <p className="text-sm sm:text-base leading-loose mb-4">
            ソファに座って、いつもあの子が乗ってきた時間に、手紙を読む。
            あの子に「今日も静かだったよ」と返事を書く。
            そんな小さな日課が、空っぽになった夜に、少しの温かさを取り戻します。
          </p>
          <p className="text-sm sm:text-base leading-loose mb-6">
            あの子はあなたの中で、ずっと喉を鳴らしています。
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "blog_cat")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "blog_cat")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              Google Playで開く
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            ＊「毎日あの子」は、グリーフケアの専門医療や治療を代替するものではありません。
          </p>
        </section>

        <section className="mt-12 bg-stone-50 rounded-2xl p-6 text-sm text-stone-600 leading-relaxed">
          <p className="font-bold text-stone-800 mb-2">
            悲しみが長く続く時は、専門家へ
          </p>
          <p>
            半年以上経っても日常生活に支障が出ている、強い抑うつ症状や不眠が続く、自分や他人を傷つけたくなる——
            このような場合は、心療内科やペットロス専門のカウンセラーに相談してください。
            一人で抱え込まないことが、一番大切です。
          </p>
        </section>

        <section className="mt-12 space-y-3 text-sm leading-relaxed">
          <h2 className="text-lg font-bold text-stone-800 mb-3">もう少し読みたい方へ</h2>
          <ul className="space-y-2 list-disc list-inside text-stone-700">
            <li>
              <Link href="/blog/tsurai" className="text-orange-600 underline">
                ペットロスが辛い時に、読んでほしい話
              </Link>
              {" "}— 辛さの真っ只中にいる方へ
            </li>
            <li>
              <Link href="/blog/itsumade" className="text-orange-600 underline">
                ペットロスは、いつまで続くのか
              </Link>
              {" "}— 期間が気になる方へ
            </li>
            <li>
              <Link href="/blog/tachinaori" className="text-orange-600 underline">
                ペットロスの乗り越え方
              </Link>
              {" "}— 行動を起こしたい方へ
            </li>
            <li>
              <Link href="/blog/symptom" className="text-orange-600 underline">
                ペットロス症候群の症状
              </Link>
              {" "}— 自分の症状が気になる方へ
            </li>
            <li>
              <Link href="/mainichi-anoko" className="text-orange-600 underline">
                毎日あの子(アプリ紹介)
              </Link>
              {" "}— あの子からの手紙が毎日届くアプリ
            </li>
          </ul>
        </section>

        <p className="mt-16 text-center text-sm text-stone-500 leading-loose">
          あの子の温もりは、永遠にあなたのものです。
        </p>
      </div>
    </article>
  );
}
