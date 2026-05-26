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

export default function TsuraiArticle() {
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
            ペットロスが辛い時に、読んでほしい話
          </h1>
          <p className="text-sm text-stone-500">
            ペットロスに寄り添う読み物
          </p>
        </header>

        <div className="prose prose-stone max-w-none space-y-6 leading-loose text-base sm:text-[17px]">
          <p>
            今、辛い気持ちでこのページを開いたあなたへ。
          </p>
          <p>
            何かを変えようとしなくて大丈夫です。読み終わったら、また泣いてもいい。
            ただ、少しの間だけ、ここに立ち止まってみてください。
          </p>
        </div>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            「辛い」と感じることは、おかしくない
          </h2>
          <p>
            あの子がいなくなってから、息をするだけで精一杯な日があると思います。
            食事の用意もできない。仕事も手につかない。ふとした瞬間に涙が出てきて、止まらない——。
          </p>
          <p>
            どれも、おかしいことではありません。
          </p>
          <p>
            人は、深く愛したものを失った時、心と体の両方で深い反応を起こします。
            眠れない、食欲がない、何をしても楽しめない。胸の奥が痛い。
            これらはすべて、あの子をどれだけ愛していたかを表しているサインです。
          </p>
          <p>
            「たかが動物のことで」と言われたことがあるかもしれません。
            「いつまで引きずるの」と思われたかもしれません。
          </p>
          <p>
            でも、あの子はあなたにとって家族でした。
            毎日そばにいて、何も言わずにあなたを見守ってくれた存在でした。
            その存在を失った悲しみは、誰かに測られるものではありません。
          </p>
          <p>
            どれだけ辛くても、それはあなたが普通でない、ということでは決してありません。
            むしろ、あなたが正しく深く愛していた、ということの証なのです。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            なぜ、こんなに辛いのか
          </h2>
          <p>
            ペットを失った悲しみが、こんなにも深く、長く続くのには、ちゃんと理由があります。
          </p>
          <p>
            心理学者キューブラー・ロスは、人が大切な存在を失った時、心が「否認・怒り・取引・抑うつ・受容」という5つの段階を経て、少しずつ変化していくと示しました。
            ペットロスも、これと同じ流れをたどると言われています。
          </p>
          <p>
            「もういないなんて信じられない」「なぜあの子だったのか」「もっと早く気づいていれば」——
            こういう感情が順番に、あるいは同時にあなたを襲っているとしたら、
            それは異常な反応ではなく、心が悲しみを処理するために通る、自然な過程です。
          </p>
          <p>
            もう一つ、あなたが特に辛さを感じやすい理由があります。
          </p>
          <p>
            ペットは、毎日の生活そのものに溶け込んでいた存在でした。
            朝、目を覚ました時、玄関を開けた時、ご飯を作る時、夜眠る時——
            どの瞬間にも、あの子の気配がありました。
            その気配が突然消えると、心は空白を抱えたまま、時間だけが流れていきます。
          </p>
          <p>
            失ったのは、家族の一員であると同時に、自分の毎日のリズムそのものでもあったのです。
          </p>
          <p>
            「自分の今の心の状態」を知りたい時は、こちらの診断も参考になります。
          </p>
          <p>
            <a
              href="https://saeli.org/pet-loss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 underline"
            >
              → 10問でわかる、ペットロスの心の段階
            </a>
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            辛い時に、すぐできること
          </h2>
          <p>
            今夜、これからでもできることを、いくつか書いておきます。
            どれも「やらなきゃいけない」ものではありません。心が向くものだけ、選んでみてください。
          </p>

          <div className="space-y-5">
            <div>
              <h3 className="font-bold text-stone-900 mb-2">1. 涙を、我慢しない</h3>
              <p>
                涙が出る時は、思い切り泣いてください。涙は、悲しみを体の外に出す自然な働きです。
                「いい大人がみっともない」なんて、誰も言いません。あなたの涙の理由を知っている人なら、なおさら。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2">2. あの子の写真は、見ても見なくても、どちらも正解</h3>
              <p>
                見て涙が出る時は、無理に見続けなくていい。でも、見たくなった時は、いくらでも見ていい。
                「もう片付けなきゃ」と急がないでください。物の整理は、心が落ち着いてからで十分です。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2">3. あの子に話しかける</h3>
              <p>
                「ただいま」「おやすみ」——いつも通り、声に出してみてください。心の中で話しかけるだけでも構いません。
                会話を続けることは、悲しみを温めて柔らかくする作業です。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2">4. 体を、ちゃんと休める</h3>
              <p>
                食欲がなくても、温かい飲み物を一口だけでも。眠れなくても、布団に入って目を閉じるだけでも。
                心を守るには、まず体を守る必要があります。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-2">5. 「何もしない」を、自分に許す</h3>
              <p>
                今日は何もできなかった——それで、いいのです。
                悲しみの中にいる時、ただ呼吸をしているだけで、あなたは十分に頑張っています。
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            辛さを、書くことで外に出してみる
          </h2>
          <p>
            辛い気持ちは、一人で抱えきれるものではありません。
          </p>
          <p>
            話せる相手が身近にいるなら、まずその人に話してみてください。
            何度も同じ話になっても、構いません。
            ペットロスの悲しみは、繰り返し言葉にする中で、少しずつ形を変えていきます。
          </p>
          <p>
            ただ、現実には、こんなこともあります。
          </p>
          <p>
            家族はもう新しい日常に戻り始めていて、自分だけ取り残されている気がする。
            友人に話したけれど、本当の意味では届いていない気がする。
            「いつまでも引きずって」と思われたくなくて、本当の気持ちは飲み込んでしまう。
          </p>
          <p>
            そんな時、辛さを <strong>「あの子に直接、書いてみる」</strong> のは、心理学的にも勧められている方法です。
          </p>
          <p>
            頭の中でぐるぐる回っている感情を文字にして外に出すことを、心理学では「ジャーナリング」と呼びます。
            大切な存在を失った時の悲嘆ケアとしても、書くことの効果は多くの研究で示されています。
          </p>
          <p>
            あの子に宛てた手紙は、誰かに見せるためのものではありません。
            「ごめんね」も「ありがとう」も、「会いたい」も「もう一回だけ抱きしめたかった」も——
            全部、書いていい。あの子は、もう全部受け止めてくれます。
          </p>
          <p>
            ノートが家にあれば、今夜から書き始められます。
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
            「ありがとう」も「ごめんね」も「会いたい」も——
            誰にも見られない、二人だけの場所で、ゆっくり言葉を交わせます。
          </p>
          <p className="text-sm sm:text-base leading-loose mb-6">
            朝起きて、まず手紙を読む。それだけで、一日のはじまりが少し穏やかになる——
            そんな時間を、よかったらあなたにも。
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "blog_tsurai")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "blog_tsurai")}
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
              <Link href="/blog/itsumade" className="text-orange-600 underline">
                ペットロスは、いつまで続くのか
              </Link>
              {" "}— 期間が気になる方へ
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
                毎日あの子（アプリ紹介）
              </Link>
              {" "}— あの子からの手紙が毎日届くアプリ
            </li>
          </ul>
        </section>

        <p className="mt-16 text-center text-sm text-stone-500 leading-loose">
          あなたの心が、少しだけ穏やかになりますように。
        </p>
      </div>
    </article>
  );
}
