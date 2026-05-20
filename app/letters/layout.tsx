import type { Metadata } from "next";
import Link from "next/link";
import { AppPromoLink } from "./components/AppPromoLink";

export const metadata: Metadata = {
  title: "あの子への手紙",
  description:
    "天国のあの子へ宛てた手紙を、誰でも自由に書ける場所です。同じようにペットを亡くした人へ、そっと届きます。",
  openGraph: {
    title: "あの子への手紙",
    description:
      "天国のあの子へ宛てた手紙を、誰でも自由に書ける場所です。",
    siteName: "あの子への手紙",
    locale: "ja_JP",
    type: "website",
  },
};

export default function LettersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF6EF] text-stone-800">
      <header className="border-b border-stone-200 bg-[#FAF6EF]/90 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <Link href="/letters" className="text-base sm:text-lg font-bold tracking-wide">
            あの子への手紙
          </Link>
          <Link
            href="/letters/new"
            className="text-xs sm:text-sm bg-orange-500 text-white px-3 py-1.5 rounded-full hover:bg-orange-600 transition"
          >
            手紙を書く
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>

      <footer className="border-t border-stone-200 mt-12 py-8 text-center text-xs text-stone-500">
        <p>
          毎日あの子からのお手紙が届くアプリも提供しています →{" "}
          <AppPromoLink />
        </p>
        <p className="mt-3">運営：合同会社SAELI</p>
      </footer>
    </div>
  );
}
