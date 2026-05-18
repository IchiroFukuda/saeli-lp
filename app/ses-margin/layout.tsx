import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SES中抜き率データベース | あなたの単価、知っていますか？",
  description:
    "SESエンジニアの95%が、自分の中抜き率を最後まで知らない。会社別マージン率を匿名投稿で集約・透明化するデータベース。事前登録受付中。",
  keywords: [
    "SES",
    "SES 中抜き率",
    "SES マージン率",
    "SES 還元率",
    "SES 単価",
    "SES 闇",
    "SES 透明化",
    "高還元SES",
    "エンジニア 単価",
    "エンジニア 搾取",
  ],
  openGraph: {
    title: "SES中抜き率データベース | あなたの単価、知っていますか？",
    description:
      "SESエンジニアの95%が、自分の中抜き率を最後まで知らない。会社別マージン率を匿名投稿で集約・透明化するデータベース。",
    url: "https://saeli.org/ses-margin",
    siteName: "SAELI",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SES中抜き率データベース | あなたの単価、知っていますか？",
    description:
      "SESエンジニアの95%が、自分の中抜き率を最後まで知らない。会社別マージン率を匿名投稿で集約・透明化するデータベース。",
  },
  alternates: {
    canonical: "https://saeli.org/ses-margin",
  },
};

export default function SesMarginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
