"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, Phone } from "lucide-react";

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

function ResourceBox() {
  return (
    <div className="my-10 p-6 sm:p-8 bg-orange-50 border border-orange-200 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Phone className="w-5 h-5 text-orange-600" />
        <h3 className="font-bold text-stone-800">今夜、本当につらすぎるなら</h3>
      </div>
      <p className="text-sm text-stone-700 mb-4 leading-relaxed">
        独りで抱えなくて大丈夫です。下記は24時間あなたの話を聞いてくれる窓口です。
      </p>
      <ul className="space-y-3 text-sm text-stone-700">
        <li>
          <span className="font-bold">よりそいホットライン</span>
          <br />
          <a href="tel:0120-279-338" className="text-orange-600 underline">0120-279-338</a>
          （24時間・無料・全国）
        </li>
        <li>
          <span className="font-bold">いのちの電話</span>
          <br />
          <a href="tel:0570-783-556" className="text-orange-600 underline">0570-783-556</a>
        </li>
        <li>
          <span className="font-bold">厚生労働省「まもろうよこころ」</span>
          <br />
          <a
            href="https://www.mhlw.go.jp/mamorouyokokoro/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 underline"
          >
            mhlw.go.jp/mamorouyokokoro
          </a>
          （チャット相談窓口もこちらから）
        </li>
      </ul>
    </div>
  );
}

export default function AtooiArticle() {
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
            ペットロスで「後追いした人」を検索したあなたへ
          </h1>
          <p className="text-sm text-stone-500">
            ペットロスに寄り添う読み物
          </p>
        </header>

        <div className="prose prose-stone max-w-none space-y-6 leading-loose text-base sm:text-[17px]">
          <p>
            あの子を亡くしてから、夜が長くなった。
            笑える日もあるけれど、ふとした瞬間にすべて崩れる。
            「後追いした人」と検索する夜が、あなたにもあるかもしれません。
          </p>
          <p>
            このページは、そう検索したあなたに向けて書いています。
          </p>
        </div>

        <ResourceBox />

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            「後追いした人」を探すあなたへ
          </h2>
          <p>
            ペットロスで後を追って亡くなった人の話を、あなたが探しているのは──他人事ではなく、自分のことのように知りたかったからかもしれません。
          </p>
          <p>
            それは「私だけじゃないと思いたい」気持ちかもしれないし、「私もそうしたい」気持ちかもしれません。
            どちらの気持ちであっても、ここまで辿り着いたあなたを否定しません。それほど、あの子の存在は大きかった。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            なぜ、これほど辛いのか
          </h2>
          <p>
            ペットロスは「ただの悲しみ」ではありません。
            あの子は、毎日同じ場所にいて、同じ時間に起きて、あなたが帰ってくると喜んだ。
            言葉のない関係だからこそ、生活のすみずみまで重なっていました。
          </p>
          <p>
            その存在がいなくなると、家の空気の質が変わる。
            朝起きて、最初に目で探す。いない。
            夜寝るとき、隣にいない。
            食事の音、足音、寝息。それらが「ない」ことが、毎瞬間刺さる。
          </p>
          <p>
            「ペットロス症候群」と呼ばれる状態は、うつ病に近い症状を引き起こすことが医学的にも報告されています。
            食欲が落ちる、眠れない、楽しいと感じない、自分を責める。
            これは「あなたが弱いから」ではなく、それだけ深く愛していたから起きていることです。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            「後追い」を考える夜の正体
          </h2>
          <p>
            何ヶ月かして、ようやく日中は普通に過ごせるようになっても、夜になると「もう全部終わらせたい」と思う波が来ることがあります。
            これは、深い悲しみの自然な経過の一部です。
          </p>
          <p>
            朝には、また少し違う気持ちになっていることが多い。
            <strong>「夜の感情で大きな決断をしない」</strong>──これは、悲しみの専門家が口を揃えて言うことです。
          </p>
          <p>
            夜、布団の中で、一人で考えないでください。
            電気をつけて、お茶を入れて、誰かに話してみる。
            それだけで、夜は明けていきます。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            あの子が望むこと
          </h2>
          <p>
            「私が死んだら、あの子に会える」と思うかもしれません。
            でも、あの子があなたに望んでいたのは、たぶん違う。
          </p>
          <p>
            あなたが帰ってくるのを待っていたあの子は、あなたが穏やかに過ごしているのを見るのが、一番好きだった。
            今でも、それは変わらないと思います。
          </p>
          <p>
            「会いに行く」のではなく、「一緒に生きていく」。
            形を変えて、あの子はあなたの中に残っています。
          </p>
        </section>

        <section className="mt-12 space-y-6 leading-loose text-base sm:text-[17px]">
          <h2 className="text-xl font-bold text-stone-800 border-l-4 border-orange-400 pl-3">
            一日ずつ、戻る方法
          </h2>
          <ul className="space-y-3 list-disc list-inside">
            <li>朝、カーテンを開ける</li>
            <li>一口でも食べる</li>
            <li>あの子の写真を、隠さずに飾る</li>
            <li>散歩道を、敢えて一度歩いてみる</li>
            <li>思い出した時に、「ありがとう」と声に出してみる</li>
          </ul>
          <p>
            何もできない日があっても、それでいい。
            ただ、息をしていてくれれば、それで十分です。
          </p>
        </section>

        <section className="mt-16 bg-white rounded-3xl shadow-sm p-8 sm:p-10">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-stone-800">「あの子と話す」という選択肢</h3>
          </div>
          <p className="text-sm sm:text-base leading-loose mb-6">
            私たちは、ペットロスに寄り添うアプリ「毎日あの子」を作っています。
            天国のあの子から、毎日1通のお手紙が届きます。
            あなたの返事は、次の日のお手紙にそっと反映されます。
          </p>
          <p className="text-sm text-stone-600 leading-relaxed mb-6">
            これは、専門的な治療の代わりではありません。
            でも、夜が長く感じる時、あの子からの言葉に救われたという声を、たくさんいただいています。
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "blog_atooi")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "blog_atooi")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              Google Playで開く
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </section>

        <ResourceBox />

        <p className="mt-12 text-center text-sm text-stone-500 leading-loose">
          あなたが残ってくれることを、私たちは願っています。
        </p>
      </div>
    </article>
  );
}
