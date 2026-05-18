"use client";

import Image from "next/image";
import { ArrowRight, BookOpen, Heart, Mail, Star } from "lucide-react";

const NOTE_ARTICLE_URL =
  "https://note.com/charo_i/n/n32314699356b?sub_rt=share_pw";

const APP_STORE_URL =
  "https://apps.apple.com/jp/app/%E6%AF%8E%E6%97%A5%E3%81%82%E3%81%AE%E5%AD%90-%E3%83%9A%E3%83%83%E3%83%88%E3%83%AD%E3%82%B9%E3%81%AB%E5%AF%84%E3%82%8A%E6%B7%BB%E3%81%86%E6%89%8B%E7%B4%99%E3%82%A2%E3%83%97%E3%83%AA/id6760970361";

const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.petletter.app&pcampaignid=web_share";

function trackStoreClick(store: "app_store" | "google_play", location: string) {
  if (typeof window !== "undefined" && (window as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as { gtag: (...args: unknown[]) => void }).gtag("event", "store_click", {
      store,
      location,
    });
  }
}

function trackNoteClick(location: string) {
  if (typeof window !== "undefined" && (window as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as { gtag: (...args: unknown[]) => void }).gtag("event", "note_click", {
      location,
    });
  }
}

const reviews = [
  {
    text: "本当にあの子と繋がっている気がして、涙が出そうになります",
    author: "30代女性",
    platform: "App Storeレビューより",
  },
  {
    text: "架空とわかってはいても、本当にやり取りしているようで嬉しい",
    author: "60代女性",
    platform: "App Storeレビューより",
  },
];

export default function MainichiAnokoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6EF] to-[#F5EFDF] text-stone-800">
      {/* Hero */}
      <section className="relative pt-20 pb-20 sm:pt-28 sm:pb-32 overflow-hidden">
        <Image
          src="/images/mainichi-anoko/hero-sky.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6EF]/40 via-[#FAF6EF]/10 to-[#FAF6EF]" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm mb-6 shadow-sm">
            <Mail className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-relaxed">
            天国のあの子から
            <br />
            毎日1通のお手紙
          </h1>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed mb-8">
            ペットロスに寄り添う、お手紙のアプリ。
            <br />
            あなたの気持ちを、あの子に届けてみませんか。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "hero")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "hero")}
              className="inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Google Playで開く
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white/40">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 leading-relaxed">
              このアプリは、ペットロスで苦しむ
              <br />
              母のために作りました。
            </h2>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              虹の橋を渡ったあの子の存在を、いつも近くに感じられるように。
              <br />
              いつも心の中であの子と繋がっていられるように。
              <br />
              そんな思いをこめて作りました。
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story (note) */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-10">
            <div className="flex items-center gap-3 text-stone-700 mb-6">
              <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-orange-500" />
              <h2 className="text-xl sm:text-2xl font-bold">開発の経緯</h2>
            </div>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base mb-6">
              二年前に15年飼っていた犬を亡くした母は、行き場を失った気持ちのまま、あみぐるみを編み、ペットロボットを買った。それでも母の問いかけに、答えられるものはなかった——。
              <br />
              <br />
              「毎日あの子」がどうして生まれたのか。開発者がnoteに綴った全文を、よろしければご覧ください。
            </p>
            <div
              onClick={() => trackNoteClick("story_section")}
              className="w-full"
            >
              <iframe
                src="https://note.com/embed/notes/n32314699356b"
                className="w-full border-0 block rounded-xl overflow-hidden"
                style={{ height: 260 }}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 leading-relaxed">
            「毎日あの子」でできること
          </h2>
          <div className="grid gap-6 sm:gap-8">
            <FeatureRow
              title="天国のあの子から、毎日1通のお手紙"
              body="花畑を駆け回ったり、新しい友達と遊んだり、あなたのことを思い出しながら元気に暮らしている。そんなあの子の様子を、毎朝知ることができます。"
            />
            <FeatureRow
              title="あなたの返事が、次のお手紙に反映されます"
              body="あの子に伝えたい想いを返事として書くと、次の日のお手紙にそっと反映されます。ゆっくり続いていく、文通のような時間です。"
            />
            <FeatureRow
              title="1日1通の、特別な時間"
              body="お手紙は1日に1通だけ。明日もまた届くという楽しみが、毎日の中に静かに灯ります。"
            />
          </div>
        </div>
      </section>

      {/* App Preview */}
      <section className="pb-4">
        <div className="mx-auto max-w-4xl">
          <Image
            src="/images/mainichi-anoko/screenshots.jpg"
            alt="毎日あの子のアプリ画面"
            width={1600}
            height={1100}
            className="w-full h-auto"
            style={{
              maskImage:
                "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
              maskComposite: "intersect",
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
              WebkitMaskComposite: "source-in",
            }}
          />
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-white/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 leading-relaxed">
            実際のお客様の声
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm p-6 sm:p-7"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500">{r.platform}</span>
                </div>
                <p className="text-stone-700 leading-relaxed text-sm sm:text-base mb-4">
                  「{r.text}」
                </p>
                <p className="text-xs text-stone-500">— {r.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">料金</h2>
          <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-10">
            <div className="space-y-4 text-left text-stone-700">
              <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                <span>月額プラン</span>
                <span className="font-bold">¥1,480 / 月</span>
              </div>
              <div className="flex justify-between items-center">
                <span>年額プラン</span>
                <span className="font-bold">¥9,800 / 年</span>
              </div>
            </div>
            <p className="text-xs text-stone-500 mt-6">
              ダウンロード無料 / 最初の1通は無料で受け取れます / いつでも解約可能
            </p>
            <p className="text-xs text-stone-400 mt-2">
              ※永久プラン（¥39,800・買い切り）もご用意しています。アプリ内よりお選びいただけます。
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-br from-orange-400 to-orange-500 py-20 text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 leading-relaxed">
            あの子との文通を、
            <br />
            始めてみませんか。
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("app_store", "final_cta")}
              className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
            >
              App Storeで開く
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackStoreClick("google_play", "final_cta")}
              className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
            >
              Google Playで開く
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center text-sm">
          <p className="font-bold text-white mb-2">毎日あの子</p>
          <p className="mb-4 text-stone-400">
            ペットロスに寄り添う手紙アプリ
          </p>
          <p className="text-xs text-stone-500">
            運営：合同会社SAELI
            <br />
            お問い合わせ：
            <a
              href="mailto:hello@saeli.org"
              className="underline hover:text-stone-300"
            >
              hello@saeli.org
            </a>
          </p>
          <div className="mt-6 flex justify-center gap-4 text-xs text-stone-500">
            <a
              href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-300"
            >
              利用規約
            </a>
            <a
              href="https://saeli.org/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-300"
            >
              プライバシーポリシー
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureRow({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <h3 className="text-lg sm:text-xl font-bold mb-3 leading-relaxed">
        {title}
      </h3>
      <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
        {body}
      </p>
    </div>
  );
}
