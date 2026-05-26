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

export default function TachinaoriArticle() {
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
            ペットロスの乗り越え方
            <br />
            <span className="text-xl sm:text-2xl text-stone-600">— 5つの方法と、忘れないという選択</span>
          </h1>
          <p className="text-sm text-stone-500">
            ペットロスに寄り添う読み物
          </p>
        </header>

        <div className="prose prose-stone max-w-none space-y-6 leading-loose text-base sm:text-[17px]">
          <p>
            「ペットロスを乗り越えたい」
            <br />
            そう検索したあなたは、たぶん、もう十分すぎるほど苦しんできたのだと思います。
          </p>
          <p>
            この記事を書くにあたり、最初に書いておきたいことがあります。
          </p>
          <p>
            <strong>「乗り越える」とは、「忘れる」ことではありません。</strong>
          </p>
        </div>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            「乗り越える」=「忘れる」ではない
          </h2>
          <p>
            ペットロスに関する記事を読むと、「乗り越える」という言葉がよく使われます。
            でも、この言葉が時々、誤解を生みます。
          </p>
          <p>
            「乗り越える」ためには、あの子のことを忘れなきゃいけない——
            そう感じてしまうことが、あるかもしれません。
          </p>
          <p>
            違います。
          </p>
          <p>
            本当の「乗り越える」とは、悲しみを消すことでも、あの子を忘れることでもありません。
            <strong>悲しみと共に、自分の人生を歩めるようになること</strong>です。
          </p>
          <p>
            あの子の存在を心に置きながら、自分自身の毎日を再び動かしていく。
            涙の出る日があっても、それを抱えながら、ちゃんと食べて、眠れる日が増えていく。
            それが「乗り越える」の本当の意味です。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            なぜ今、「乗り越え方」を検索したのか
          </h2>
          <p>
            この言葉を検索するのは、たぶん、こんな気持ちからではないでしょうか。
          </p>
          <ul className="space-y-3 list-disc list-inside pl-2 mt-4">
            <li>毎日が辛くて、何かしら手を打ちたい</li>
            <li>自分を取り戻したい、けれどどうすればいいかわからない</li>
            <li>周りに「いつまで悲しんでるの」と言われたくない</li>
            <li>あの子のためにも、ちゃんと立ち直りたい</li>
          </ul>
          <p>
            どの気持ちも、健康なサインです。
            ずっと悲しみの底にいたい人なんていません。出口を探したい気持ちは、自然なこと。
          </p>
          <p>
            ただ、焦らないでください。「乗り越える」ためには、まず「今、自分は悲しい」という事実を、十分に受け止める時間が必要です。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            ペットロスを乗り越えるための、5つの方法
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-stone-900 mb-2 text-lg">
                1. 悲しみを否定しない
              </h3>
              <p>
                「いつまでも泣いていてはダメ」と自分を責めないでください。
                涙が出る日は、思い切り泣いてください。
                悲しみを抑え込もうとすると、かえって長引きます。
              </p>
              <p>
                あなたの涙は、あの子を深く愛した証です。誰かに責められるものではありません。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2 text-lg">
                2. 思い出を「形」にする
              </h3>
              <p>
                写真をアルバムにする、お墓やメモリアルコーナーを作る、絵を描く、手紙を書く——
                思い出を形にすることで、悲しみが少しずつ整理されていきます。
              </p>
              <p>
                「あの子を忘れる」のではなく、「あの子と過ごした時間を残す」ためのものです。
                目に見える形があることで、心が落ち着く瞬間があります。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2 text-lg">
                3. 体を動かす、太陽を浴びる
              </h3>
              <p>
                悲しみの中にいる時、体は固くなり、心はますます重くなります。
                朝、カーテンを開けて少し光を浴びる。短い散歩でも、体を動かす。
                それだけで、心の重さが少し変わります。
              </p>
              <p>
                心と体は、繋がっています。
                心を直接動かすのは難しい時、体から先に動かしてみてください。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2 text-lg">
                4. 同じ経験をした人と繋がる
              </h3>
              <p>
                ペットロスを経験した人にしか分からない感情があります。
                「たかが動物のことで」と言われない場所で、自分の気持ちを話せると、それだけで救われる瞬間があります。
              </p>
              <p>
                SNS、オンラインコミュニティ、ペットロス専門のカウンセラー——
                話せる場所を、一つでも見つけてください。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2 text-lg">
                5. 専門家やツールに頼ることを、恥じない
              </h3>
              <p>
                「自分で乗り越えなきゃ」と思いすぎないでください。
                心療内科、ペットロス専門カウンセラー、グリーフケアの本、寄り添うアプリ——
                どれも、あなたを助けるために存在しています。
              </p>
              <p>
                頼ることは、弱さではなく、回復への賢い選択です。
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            「会いに行く」のではなく、「一緒に生きていく」
          </h2>
          <p>
            あの子を失ってから、「会いたい」「もう一度会えるなら何でもする」と願う夜があると思います。
            その気持ちは、否定しなくて大丈夫。
          </p>
          <p>
            ただ、もう一つだけ、覚えておいてほしいことがあります。
          </p>
          <p>
            あの子は、あなたが穏やかに過ごしているのを、いちばん喜びます。
            あなたが帰ってくるのを玄関で待ってくれていた、あの瞬間と同じように。
          </p>
          <p>
            「会いに行く」のではなく、「一緒に生きていく」。
            形を変えて、あの子はあなたの中にずっといます。
            あなたが幸せに歩んでいくことが、あの子への何よりの愛し続け方です。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            書くことの力
          </h2>
          <p>
            「乗り越え方」の中で、特に効果があるとされているのが、<strong>書くこと(ジャーナリング)</strong>です。
          </p>
          <p>
            心の中でぐるぐる回っている感情を、文字にして外に出すと、不思議と少し落ち着きます。
            大切な存在を失った時のグリーフケアとしても、書くことの効果は多くの研究で示されています。
          </p>
          <p>
            あの子に宛てて、手紙を書いてみてください。
            誰にも見せなくていい。「ごめんね」も「ありがとう」も「会いたい」も、全部書いていい。
            あの子は、もう全部受け止めてくれます。
          </p>
          <p>
            ノートでも、スマホのメモでも、何でも構いません。
            続けるうちに、自分の感情が少しずつ整理されていく感覚が、きっとあります。
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
            「書く」ことを続けやすくする、小さな伴走者のような存在です。
            朝起きて、まず手紙を読む。それだけで、一日のはじまりが少し穏やかになります。
          </p>
          <p className="text-sm sm:text-base leading-loose mb-6">
            乗り越え方は、人それぞれ。
            「書く」が合うなら、よかったらあなたにも。
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "blog_tachinaori")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "blog_tachinaori")}
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
              <Link href="/blog/symptom" className="text-orange-600 underline">
                ペットロス症候群の症状
              </Link>
              {" "}— 自分の症状が気になる方へ
            </li>
            <li>
              <Link href="/blog/dog" className="text-orange-600 underline">
                愛犬を亡くした方へ
              </Link>
              {" "}— 散歩のない朝に
            </li>
            <li>
              <Link href="/blog/cat" className="text-orange-600 underline">
                愛猫を亡くした方へ
              </Link>
              {" "}— もう膝に乗ってこない夜に
            </li>
            <li>
              <a
                href="https://saeli.org/pet-loss"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 underline"
              >
                10問でわかる、ペットロスの心の段階
              </a>
              {" "}— 自分の今の状態を知りたい方へ
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
          あの子は、あなたの中で生き続けます。あなたが幸せに歩むことを、誰よりも願って。
        </p>
      </div>
    </article>
  );
}
