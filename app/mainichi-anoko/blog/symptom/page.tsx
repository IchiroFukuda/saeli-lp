"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, AlertCircle } from "lucide-react";

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

export default function SymptomArticle() {
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
            ペットロス症候群の症状
            <br />
            <span className="text-xl sm:text-2xl text-stone-600">— これは普通?それとも病気?</span>
          </h1>
          <p className="text-sm text-stone-500">
            ペットロスに寄り添う読み物
          </p>
        </header>

        <div className="prose prose-stone max-w-none space-y-6 leading-loose text-base sm:text-[17px]">
          <p>
            眠れない。食欲がない。何も手につかない。体のあちこちが痛い。
            <br />
            「自分の状態、おかしいんじゃないか」と検索しているあなたへ。
          </p>
          <p>
            最初に書いておきます。
            <strong>あなたが今感じている症状の多くは、ペットロスの「正常な反応」です。</strong>
            病気でも、おかしくも、ありません。
          </p>
          <p>
            それでも、症状が長く続いたり、強く出ている場合は、専門家の手を借りることも考えてください。
            この記事では、よくある症状と、専門家に相談すべき目安をまとめます。
          </p>
        </div>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            ペットロス症候群とは
          </h2>
          <p>
            「ペットロス症候群」とは、大切なペットを失ったことによって、心と体にさまざまな症状が現れる状態を指します。
          </p>
          <p>
            ただし、これは「病名」ではなく、グリーフ(悲嘆)反応の一種です。
            人を失った時の悲しみと、医学的には同じカテゴリーに分類されます。
          </p>
          <p>
            つまり、ペットロスは「気のせい」でも「甘え」でもなく、心理学的・医学的に認められた、ごく自然な人間の反応です。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            主な症状(心の症状)
          </h2>
          <p>
            ペットロスで現れることが多い心の症状は、次のようなものです。
          </p>
          <ul className="space-y-3 list-disc list-inside pl-2 mt-4">
            <li>深い悲しみ、喪失感が続く</li>
            <li>あの子がいないことを、信じられない(否認)</li>
            <li>自分や周囲に対する怒り、苛立ち</li>
            <li>「もっと早く気付いていれば」という後悔・罪悪感</li>
            <li>無気力、何も楽しめない、虚しさ</li>
            <li>集中力の低下、仕事や家事が手につかない</li>
            <li>あの子の声や気配を感じる(幻聴・幻視のような体験)</li>
            <li>誰にも会いたくない、外出したくない</li>
          </ul>
          <p>
            これらは、心が「失った」という事実を処理するための、自然なプロセスです。
            すべて出ても、一部だけ出ても、どちらも正常な反応です。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            主な症状(体の症状)
          </h2>
          <p>
            ペットロスは、心だけでなく体にも症状を引き起こします。
          </p>
          <ul className="space-y-3 list-disc list-inside pl-2 mt-4">
            <li>不眠、または過度な眠気</li>
            <li>食欲不振、または過食</li>
            <li>胸や胃が締めつけられるような痛み</li>
            <li>頭痛、めまい</li>
            <li>動悸、息苦しさ</li>
            <li>疲労感、体に力が入らない</li>
            <li>免疫力低下による風邪などの体調不良</li>
          </ul>
          <p>
            悲しみは、目に見えない形で体に現れます。
            「心は大丈夫なつもりなのに、体が動かない」という時は、心が無意識に痛みを抱えているサインかもしれません。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            「正常な悲嘆」と「複雑性悲嘆」の境目
          </h2>
          <p>
            ほとんどのペットロスは、時間と共に少しずつ和らいでいく「正常な悲嘆反応」です。
            ただし、症状が長期間、強く続く場合、「複雑性悲嘆」と呼ばれる状態に至ることがあります。
          </p>
          <p>
            一般的に、次のような場合は専門家への相談を検討してください。
          </p>
          <ul className="space-y-3 list-disc list-inside pl-2 mt-4">
            <li>半年以上経っても、日常生活に大きな支障が出ている</li>
            <li>強い抑うつ症状(無気力、絶望感)が続いている</li>
            <li>不眠や食欲不振が長期間続いている</li>
            <li>自分や他人を傷つけたいと思うことがある</li>
            <li>仕事や学校に行けない状態が続いている</li>
            <li>アルコールや薬に過度に頼ってしまう</li>
          </ul>
          <p>
            これは「弱さ」ではありません。
            風邪が長引いたら病院に行くのと同じで、心の痛みが長引いたら、ケアする場所があります。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            症状が出ている時に、できること
          </h2>
          <p>
            症状を「無理矢理消そう」としないでください。
            消そうとするほど、かえって長引きます。
          </p>
          <p>
            まずは、症状と「共に過ごす」つもりで、できることから始めてみてください。
          </p>
          <ul className="space-y-3 list-disc list-inside pl-2 mt-4">
            <li>睡眠と食事を、最低限取る(できる範囲で)</li>
            <li>朝、カーテンを開けて光を浴びる</li>
            <li>短い散歩でも、体を動かす</li>
            <li>自分の気持ちを、文字や声で外に出す</li>
            <li>同じ経験をした人と繋がる</li>
            <li>無理に「いつも通り」を演じない</li>
            <li>必要なら、心療内科やペットロス専門カウンセラーに相談する</li>
          </ul>
          <p>
            一つでも、できる日があれば十分。
            ゼロの日があっても、自分を責めないでください。
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
            気持ちを文字にして外に出す——書くという行為は、グリーフケアでも効果が示されています。
            朝の数分、あの子の言葉を読んで返事を書く。それだけで、一日のはじまりが少し穏やかになります。
          </p>
          <p className="text-sm sm:text-base leading-loose mb-6">
            症状の重さに合わせて、自分のペースで。
            よかったらあなたにも。
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "blog_symptom")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "blog_symptom")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              Google Playで開く
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            ＊「毎日あの子」は、グリーフケアの専門医療や治療を代替するものではありません。
            症状が重い場合は、心療内科やカウンセラーの受診を優先してください。
          </p>
        </section>

        <section className="mt-12 bg-orange-50 border border-orange-200 rounded-2xl p-6 leading-relaxed">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <p className="font-bold text-stone-800">専門家への相談を検討してください</p>
          </div>
          <p className="text-sm text-stone-700 mb-3">
            次のような状態が続く時は、心療内科やペットロス専門のカウンセラーに相談することを強くおすすめします。
          </p>
          <ul className="space-y-2 list-disc list-inside text-sm text-stone-700 pl-2 mb-4">
            <li>半年以上、日常生活に大きな支障が出ている</li>
            <li>強い抑うつや不眠が続いている</li>
            <li>自分や他人を傷つけたい気持ちがある</li>
            <li>仕事や学校に長期間行けない</li>
          </ul>
          <p className="text-sm text-stone-700">
            また、今すぐ誰かに話を聞いてほしい時は、以下の窓口が24時間対応しています。
          </p>
          <ul className="space-y-2 text-sm text-stone-700 mt-3">
            <li>
              <span className="font-bold">よりそいホットライン</span>
              <br />
              <a href="tel:0120-279-338" className="text-orange-600 underline">0120-279-338</a>
              (24時間・無料・全国)
            </li>
            <li>
              <span className="font-bold">いのちの電話</span>
              <br />
              <a href="tel:0570-783-556" className="text-orange-600 underline">0570-783-556</a>
            </li>
          </ul>
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
          あなたの心と体が、少しずつ落ち着いていきますように。
        </p>
      </div>
    </article>
  );
}
