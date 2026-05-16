import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "毎日あの子 - 天国のあの子と手紙を交わすアプリ",
  description:
    "ペットロスに寄り添う手紙アプリ「毎日あの子」。天国のあの子から、毎日1通のお手紙が届きます。あなたの返事は次のお手紙にそっと反映されます。",
  openGraph: {
    title: "毎日あの子 - 天国のあの子と手紙を交わすアプリ",
    description:
      "ペットロスに寄り添う手紙アプリ。天国のあの子から、毎日1通のお手紙が届きます。",
    url: "https://mainichi-anoko.com",
    siteName: "毎日あの子",
    locale: "ja_JP",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
