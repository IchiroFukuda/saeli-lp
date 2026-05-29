import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ - 毎日あの子",
  description:
    "毎日あの子（合同会社SAELI）へのお問い合わせフォーム。サービスや物理商品（フォトブック）に関するご質問はこちらから。",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAF6EF] to-[#F5EFDF] text-stone-800">
      <section className="mx-auto max-w-2xl px-6 pt-16 pb-24">
        <h1 className="text-3xl font-semibold tracking-tight">お問い合わせ</h1>
        <p className="mt-4 text-stone-700 leading-loose">
          毎日あの子（合同会社SAELI）へのお問い合わせは、以下のフォームよりお送りください。サービス内容、フォトブック（物理商品）に関するご質問、その他のご相談を承ります。
        </p>
        <p className="mt-2 text-sm text-stone-500 leading-loose">
          通常2〜5営業日以内にメールでお返事いたします。お急ぎの場合や返信が届かない場合は、
          {" "}
          <a
            href="mailto:hello@saeli.org"
            className="underline underline-offset-4 hover:text-stone-900"
          >
            hello@saeli.org
          </a>
          {" "}
          まで直接ご連絡ください。
        </p>

        <div className="mt-10 rounded-2xl border border-stone-200/80 bg-white/70 backdrop-blur p-6 sm:p-8">
          <ContactForm />
        </div>

        <p className="mt-10 text-sm text-stone-500 leading-loose">
          ご記入いただいた個人情報は、お問い合わせ対応の目的のみに使用し、
          {" "}
          <a
            href="https://saeli.org/privacy"
            className="underline underline-offset-4 hover:text-stone-900"
          >
            プライバシーポリシー
          </a>
          {" "}
          に基づいて適切に取り扱います。
        </p>
      </section>
    </main>
  );
}
