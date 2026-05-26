import type { Metadata } from "next";

const SITE_URL = "https://mainichi-anoko.com";
const PAGE_URL = `${SITE_URL}/blog/cat`;
const TITLE = "愛猫を亡くした方へ — もう膝に乗ってこない夜に";
const DESCRIPTION =
  "愛猫を亡くした悲しみは、静かでけれど深いものです。膝の上、寝息、気まぐれな視線——猫特有の喪失を言語化し、寄り添う言葉で書きました。";

export const metadata: Metadata = {
  title: `${TITLE} | 毎日あの子`,
  description: DESCRIPTION,
  alternates: {
    canonical: "/blog/cat",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "毎日あの子",
    locale: "ja_JP",
    type: "article",
    images: [
      {
        url: "/images/mainichi-anoko/og-image.jpg",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/mainichi-anoko/og-image.jpg"],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITLE,
  description: DESCRIPTION,
  url: PAGE_URL,
  image: `${SITE_URL}/images/mainichi-anoko/og-image.jpg`,
  author: {
    "@type": "Organization",
    name: "毎日あの子",
  },
  publisher: {
    "@type": "Organization",
    name: "合同会社SAELI",
    email: "hello@saeli.org",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": PAGE_URL,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {children}
    </>
  );
}
