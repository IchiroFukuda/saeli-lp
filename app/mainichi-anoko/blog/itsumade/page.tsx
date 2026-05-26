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

export default function ItsumadeArticle() {
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
            ペットロスは、いつまで続くのか
          </h1>
          <p className="text-sm text-stone-500">
            ペットロスに寄り添う読み物
          </p>
        </header>

        <div className="prose prose-stone max-w-none space-y-6 leading-loose text-base sm:text-[17px]">
          <p>
            「ペットロスは、いつまで続くんだろう」
            <br />
            検索しながら、あなたはきっと疲れているのだと思います。
          </p>
          <p>
            結論から書きます。<strong>ペットロスに、決まったゴールはありません。</strong>
          </p>
          <p>
            「○ヶ月で終わる」というカレンダーのような決まりは、どこにも存在しません。
          </p>
        </div>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            期間に「正解」はない
          </h2>
          <p>
            ある人は数週間で日常を取り戻し、ある人は1年以上、深い悲しみの中で過ごします。
            どちらも、おかしいことではありません。
          </p>
          <p>
            悲しみの深さは、あの子をどれだけ愛していたか、どれだけ一緒に過ごしたか、そして自分自身の感情の処理の仕方によって、人それぞれ違います。
          </p>
          <p>
            「思っていたより長く悲しい」と感じても、それはあなたが弱いからではありません。
            それだけ深く、あの子を愛していたからです。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            一般的な目安(参考程度に)
          </h2>
          <p>
            心理学やグリーフケアの研究では、おおまかな目安として、次のような期間が示されています。
          </p>

          <div className="space-y-4 mt-4">
            <div>
              <h3 className="font-bold text-stone-900 mb-1">急性期(1〜3ヶ月)</h3>
              <p>
                深い悲しみが断続的に襲ってくる時期。
                眠れない、食欲がない、何も手につかない、ふとした瞬間に涙が止まらない——
                心と体が、まだ「失った」という事実を処理できていない段階です。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-1">移行期(3〜6ヶ月)</h3>
              <p>
                日常を少しずつ取り戻し始める時期。
                悲しみの波は引いていきますが、まだ周期的に深い喪失感が戻ってきます。
                「もう大丈夫だと思っていたのに、また泣いてしまう」——そういう揺れがあるのが自然です。
              </p>
            </div>

            <div>
              <h3 className="font-bold text-stone-900 mb-1">統合期(6ヶ月〜)</h3>
              <p>
                あの子を心に置きながら、自分の人生を歩めるようになる時期。
                悲しみが消えるのではなく、温かい思い出に変わっていく段階です。
                ふとした時に「会いたい」と思う気持ちは残りますが、その気持ちと共に穏やかに過ごせるようになります。
              </p>
            </div>
          </div>

          <p>
            ただ、これはあくまで「目安」です。
            半年以上、時に数年にわたって深い悲しみが続くケースも珍しくありません。
          </p>
          <p>
            「○ヶ月過ぎたのにまだ涙が出る」「1年経つのにまだ立ち直れない」——
            それは異常ではなく、あなたの悲しみの深さが、あなたが愛した深さに比例しているということです。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            「いつまで」と感じる時の、セルフチェック
          </h2>
          <p>
            「いつまで続くんだろう」と検索する気持ちは、しんどさが続いている合図です。
            その時、自分の状態を確認してみてください。
          </p>
          <ul className="space-y-3 list-disc list-inside mt-4 pl-2">
            <li>食事や睡眠は、最低限取れていますか?</li>
            <li>仕事や家事を、何ヶ月も全くできない状態が続いていませんか?</li>
            <li>自分や他人を傷つけたい気持ちは、ありませんか?</li>
            <li>一人で抱え込んでいませんか?(誰かに気持ちを話せていますか?)</li>
          </ul>
          <p>
            いくつか「いいえ」がついたら、専門家に頼っていい段階かもしれません。
            「いつまで悲しんでいるんだろう」と自分を責めるより、外からの手を借りる選択肢を持ってください。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            時間が変えるもの、変えないもの
          </h2>
          <p>
            「時間が経てば癒える」とよく言われます。
            でも、ペットロスを経験した人の多くは、こう感じています。
          </p>
          <div className="space-y-3 mt-4">
            <p>
              <strong>時間が変えるもの</strong>: 悲しみの強さ、痛みの頻度
            </p>
            <p>
              <strong>時間が変えないもの</strong>: あの子を愛した気持ち、思い出
            </p>
          </div>
          <p>
            時間が経つと、毎日泣いていたのが週に1回になり、月に1回になり、特別な日だけになっていく——
            そういう変化は起こります。
          </p>
          <p>
            でも、ふとした瞬間に「会いたい」と思う気持ちが消えることは、たぶんありません。
            それでいいのです。それは、あなたが本当に愛した証だから。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            「自分のペース」を取り戻すために
          </h2>
          <p>
            「自分のペースで」という言葉は、聞こえはいいけれど、実践は難しいかもしれません。
            周りはもう新しい日常に戻っていて、自分だけ取り残されている気がする。
            SNSで誰かが楽しそうにペットの写真を投稿しているのを見ると、苦しくなる。
          </p>
          <p>
            そんな時、こう、自分に言ってあげてください。
          </p>
          <p className="text-center font-bold text-stone-900 text-lg leading-relaxed">
            「私の悲しみは、誰かと比べるものじゃない。」
          </p>
          <p>
            具体的にできることは、たとえばこんなことです。
          </p>
          <ul className="space-y-3 list-disc list-inside mt-4 pl-2">
            <li>自分の感情を、毎日少しでも文字にして書き出す(ジャーナリング)</li>
            <li>「もう大丈夫」と急いで装わない</li>
            <li>同じ経験をした人と繋がる(SNS、コミュニティ、アプリ)</li>
            <li>心療内科やペットロス専門のカウンセラーに頼ることを、恥じない</li>
          </ul>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <p>
            「自分の今の心の状態を、整理してみたい」と思った時は、診断ツールも参考になります。
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
            急がなくていい、何ヶ月でも、何年でも。
            あの子はずっと、あなたのペースを待ってくれます。
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
              onClick={() => trackStoreClick("app_store", "blog_itsumade")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "blog_itsumade")}
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
              <Link href="/blog/tachinaori" className="text-orange-600 underline">
                ペットロスの乗り越え方
              </Link>
              {" "}— 行動を起こしたい方へ
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
          あなたのペースで、あなたの時間を生きてください。
        </p>
      </div>
    </article>
  );
}
