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

export default function DogArticle() {
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
            愛犬を亡くした方へ
            <br />
            <span className="text-xl sm:text-2xl text-stone-600">— 散歩のない朝を生きるあなたに</span>
          </h1>
          <p className="text-sm text-stone-500">
            ペットロスに寄り添う読み物
          </p>
        </header>

        <div className="prose prose-stone max-w-none space-y-6 leading-loose text-base sm:text-[17px]">
          <p>
            朝、目を覚ました瞬間に、いつも足元にあった温かさがない。
            玄関を開けても、しっぽを振って迎えに来てくれる音がしない。
            散歩の時間になっても、リードを取り出すあの瞬間が、もう来ない。
          </p>
          <p>
            愛犬を失う悲しみは、犬一匹を失うことではありません。
            <strong>犬と過ごした「日常そのもの」を失う</strong>ことです。
          </p>
        </div>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            犬を失う悲しみが、深い理由
          </h2>
          <p>
            犬は、毎日の生活のあらゆる瞬間に、自然に存在していました。
          </p>
          <p>
            朝起きると、足音を聞きつけて尻尾を振る。
            食事の準備をしていると、足元で待っている。
            出かけようとすると、寂しそうな目で見つめる。
            帰宅すると、玄関で全身で喜んでくれる。
            夜、ソファで隣に座って、自然に寝息を立てる。
          </p>
          <p>
            一日の中に、何度も「あの子の気配」がありました。
            その気配が、ある日突然、全部消える。
            残るのは、空っぽの食器、使われなくなったリード、空いてしまったベッドの隙間。
          </p>
          <p>
            悲しみが深いのは、当然なのです。
            あなたは家族を失っただけでなく、毎日の生活のリズムそのものを失ったのですから。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            犬を亡くした人によくある気持ち
          </h2>
          <p>
            愛犬を失った後、こんな感情が出てきても、すべて自然なことです。
          </p>
          <ul className="space-y-3 list-disc list-inside pl-2 mt-4">
            <li>散歩の時間になると、無意識に立ち上がってしまう</li>
            <li>朝の散歩ルートを通ると、涙が止まらない</li>
            <li>散歩仲間に会うのが、辛い</li>
            <li>「もっと長く散歩に連れて行けばよかった」と後悔する</li>
            <li>あの子の鳴き声が、ふと聞こえる気がする</li>
            <li>新しい犬を迎えるべきか、迷っている自分を責める</li>
            <li>家の中の「あの子の場所」を見るのが辛い</li>
          </ul>
          <p>
            どれも、犬と深く生活を共にした人だからこそ出る感情です。
            あなたが弱いからでも、おかしいからでもありません。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            散歩道は、いつかまた歩けるようになる
          </h2>
          <p>
            あの子と歩いた散歩道は、今は涙の出る場所かもしれません。
            無理に通る必要はありません。当分、迂回しても構いません。
          </p>
          <p>
            ただ、いつか時間が経って、また歩けるようになる日が来ます。
            その時、涙ではなく、温かい記憶があの子との時間を思い出させてくれる瞬間があります。
          </p>
          <p>
            「あの公園で、よくボールを追いかけてたな」
            <br />
            「あの坂道、最後の頃は抱っこして登ったな」
            <br />
            一つひとつの場所が、悲しい記憶ではなく、愛した記録に変わる時が、必ず来ます。
          </p>
          <p>
            それまでは、自分のペースで。
            散歩道を歩けない自分を、責めないでください。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            あの子のものを、どうすればいいか
          </h2>
          <p>
            首輪、リード、食器、おもちゃ、ベッド、洋服——
            あの子の使っていたものを見るのが、辛いかもしれません。
          </p>
          <p>
            急いで片付ける必要はありません。
            むしろ、悲しみの真っ只中で物を処分すると、後で後悔することが多いです。
          </p>
          <p>
            まずは、見える場所に置いたままで構いません。
            見るのが辛い時は、布で覆ったり、引き出しにしまうだけでも十分です。
            時間が経って、心が落ち着いた頃に、一つずつ整理していけば大丈夫です。
          </p>
          <p>
            首輪やお気に入りのおもちゃは、ずっと残しておく人も少なくありません。
            「思い出を形にする」ことは、悲しみと向き合う大切な手段の一つです。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            新しい犬を迎えるかどうか
          </h2>
          <p>
            「もう二度と犬を飼わない」と決める人も、「いつかまた」と思える人も、どちらも正解です。
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
            散歩の時間に手紙を読む。
            あの子に「今日は散歩道、歩けなかった」と返事を書く。
            そんな小さな日課が、空っぽになった日常に、少しの温かさを取り戻します。
          </p>
          <p className="text-sm sm:text-base leading-loose mb-6">
            あの子はあなたの中で、ずっと尻尾を振っています。
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "blog_dog")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "blog_dog")}
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
          あの子と歩いた時間は、永遠にあなたのものです。
        </p>
      </div>
    </article>
  );
}
