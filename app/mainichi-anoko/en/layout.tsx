import type { Metadata } from "next";

const SITE_URL = "https://mainichi-anoko.com";
const PAGE_URL = `${SITE_URL}/en`;
const TITLE = "Daily Letters from Your Beloved Pet — Coming Soon";
const DESCRIPTION =
  "An AI letter app that helps you heal from pet loss. A daily letter from your beloved pet, arriving each morning. Join the waitlist to be notified when we launch in English.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    siteName: "Mainichi Anoko",
    locale: "en_US",
    type: "website",
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

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
