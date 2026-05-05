import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ペットロス診断 — あなたの心は今、どの段階？ | 毎日あの子",
  description:
    "あの子を失った悲しみには段階があります。10問の質問で、今のあなたの心の状態を見つめてみませんか。ペットロスに寄り添うアプリ「毎日あの子」をご紹介します。",
  keywords: [
    "ペットロス",
    "ペットロス診断",
    "ペットロス症候群",
    "ペットロス 段階",
    "ペットロス 立ち直り",
    "ペット 死",
    "ペット 喪失",
    "毎日あの子",
  ],
  openGraph: {
    title: "ペットロス診断 — あなたの心は今、どの段階？",
    description:
      "あの子を失った悲しみには段階があります。10問の質問で、今のあなたの心の状態を見つめてみませんか。",
    url: "https://saeli.org/pet-loss",
    siteName: "毎日あの子",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ペットロス診断 — あなたの心は今、どの段階？",
    description:
      "あの子を失った悲しみには段階があります。10問の質問で、今のあなたの心の状態を見つめてみませんか。",
  },
  alternates: {
    canonical: "https://saeli.org/pet-loss",
  },
};

export default function PetLossLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
