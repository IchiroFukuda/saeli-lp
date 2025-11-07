import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://saeli.org'),
  title: 'SAELI',
  description: 'プロンプト注入・情報漏洩を自動診断。5分で安全性を可視化。β登録で無料体験。',
  keywords: ['SAELI', 'LLM', 'セキュリティ', 'プロンプト注入', '診断', 'AI'],
  authors: [{ name: 'SAELI' }],
  openGraph: {
    title: 'SAELI',
    description: 'プロンプト注入・情報漏洩を自動診断。5分で安全性を可視化。β登録で無料体験。',
    url: 'https://saeli.org',
    siteName: 'SAELI',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAELI',
    description: 'プロンプト注入・情報漏洩を自動診断。5分で安全性を可視化。β登録で無料体験。',
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
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
