import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://grantsaigent.com'),
  title: 'GrantsAIgent - 補助金申請の手間を1/10に',
  description: 'AIが補助金業務を最適化。制度調査・書類作成・提出管理を自動化し、中小企業・個人事業主の時間を事業の本質に取り戻します。',
  keywords: ['GrantsAIgent', '補助金', '助成金', '申請', 'AI', '自動化', '中小企業'],
  authors: [{ name: 'GrantsAIgent' }],
  openGraph: {
    title: 'GrantsAIgent - 補助金申請の手間を1/10に',
    description: 'AIが補助金業務を最適化。制度調査・書類作成・提出管理を自動化し、中小企業・個人事業主の時間を事業の本質に取り戻します。',
    url: 'https://grantsaigent.com',
    siteName: 'GrantsAIgent',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GrantsAIgent - 補助金申請の手間を1/10に',
    description: 'AIが補助金業務を最適化。制度調査・書類作成・提出管理を自動化し、中小企業・個人事業主の時間を事業の本質に取り戻します。',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className="scroll-smooth">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17624092605"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17624092605');
            `,
          }}
        />
        {/* Event snippet for ページビュー conversion page */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function gtag_report_conversion(url) {
                var callback = function () {
                  if (typeof(url) != 'undefined') {
                    window.location = url;
                  }
                };
                gtag('event', 'conversion', {
                    'send_to': 'AW-17624092605/02E-CK-cxLkbEL2f6dNB',
                    'event_callback': callback
                });
                return false;
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
