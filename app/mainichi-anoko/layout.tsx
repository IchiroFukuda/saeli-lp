import type { Metadata } from "next";

const SITE_URL = "https://mainichi-anoko.com";
const APP_STORE_URL =
  "https://apps.apple.com/jp/app/%E6%AF%8E%E6%97%A5%E3%81%82%E3%81%AE%E5%AD%90-%E3%83%9A%E3%83%83%E3%83%88%E3%83%AD%E3%82%B9%E3%81%AB%E5%AF%84%E3%82%8A%E6%B7%BB%E3%81%86%E6%89%8B%E7%B4%99%E3%82%A2%E3%83%97%E3%83%AA/id6760970361";
const GOOGLE_PLAY_URL =
  "https://play.google.com/store/apps/details?id=com.petletter.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "毎日あの子 - 天国のあの子と手紙を交わすアプリ",
  description:
    "ペットロスに寄り添う手紙アプリ「毎日あの子」。天国のあの子から、毎日1通のお手紙が届きます。あなたの返事は次のお手紙にそっと反映されます。",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "毎日あの子 - 天国のあの子と手紙を交わすアプリ",
    description:
      "ペットロスに寄り添う手紙アプリ。天国のあの子から、毎日1通のお手紙が届きます。",
    url: SITE_URL,
    siteName: "毎日あの子",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/images/mainichi-anoko/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "毎日あの子 - 天国のあの子からの手紙",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "毎日あの子 - 天国のあの子と手紙を交わすアプリ",
    description:
      "ペットロスに寄り添う手紙アプリ。天国のあの子から、毎日1通のお手紙が届きます。",
    images: ["/images/mainichi-anoko/og-image.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "毎日あの子",
  description:
    "ペットロスに寄り添う、お手紙のアプリ。天国のあの子から、毎日1通のお手紙が届きます。あなたの返事は、次の日のお手紙にそっと反映されます。",
  operatingSystem: "iOS, Android",
  applicationCategory: "LifestyleApplication",
  url: SITE_URL,
  image: `${SITE_URL}/images/mainichi-anoko/og-image.jpg`,
  sameAs: [APP_STORE_URL, GOOGLE_PLAY_URL],
  offers: [
    {
      "@type": "Offer",
      name: "週額プラン",
      price: "500",
      priceCurrency: "JPY",
    },
    {
      "@type": "Offer",
      name: "月額プラン",
      price: "1480",
      priceCurrency: "JPY",
    },
    {
      "@type": "Offer",
      name: "年額プラン",
      price: "9800",
      priceCurrency: "JPY",
    },
  ],
  publisher: {
    "@type": "Organization",
    name: "合同会社SAELI",
    email: "hello@saeli.org",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
