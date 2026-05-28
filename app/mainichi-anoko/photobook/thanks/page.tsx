import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ご注文ありがとうございました - 毎日あの子 フォトブック",
  description: "あの子からの手紙のフォトブックのご注文を受け付けました。",
  robots: { index: false, follow: false },
};

export default function PhotobookThanksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAF6EF] to-[#F5EFDF] text-stone-800">
      <section className="mx-auto max-w-xl px-6 pt-24 pb-32">
        <div className="rounded-2xl bg-white/70 backdrop-blur p-8 sm:p-12 shadow-sm border border-stone-200/60">
          <h1 className="text-2xl sm:text-3xl font-semibold leading-snug">
            ご注文ありがとうございました
          </h1>
          <p className="mt-6 text-base leading-loose text-stone-700">
            あの子からのお手紙のフォトブック、ご注文を受け付けました。
          </p>
          <p className="mt-4 text-base leading-loose text-stone-700">
            ご入金の確認ができ次第、印刷・発送の準備に入ります。
            お届けまで少しお時間をいただきますが、心を込めて1冊1冊お送りします。
          </p>
          <p className="mt-8 text-sm text-stone-500">
            ご不明な点があれば{" "}
            <a
              href="mailto:hello@saeli.org"
              className="underline underline-offset-4 hover:text-stone-700"
            >
              hello@saeli.org
            </a>{" "}
            までお問い合わせください。
          </p>
        </div>
      </section>
    </main>
  );
}
