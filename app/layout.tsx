import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PromptGuard | LLMアプリ専用セキュリティ診断',
  description: 'プロンプト注入・情報漏洩を自動診断。5分で安全性を可視化。β登録で無料体験。',
  keywords: ['PromptGuard', 'LLM', 'セキュリティ', 'プロンプト注入', '診断', 'AI'],
  authors: [{ name: 'SAELI' }],
  openGraph: {
    title: 'PromptGuard | LLMアプリ専用セキュリティ診断',
    description: 'プロンプト注入・情報漏洩を自動診断。5分で安全性を可視化。β登録で無料体験。',
    url: 'https://saeli.org',
    siteName: 'PromptGuard',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PromptGuard | LLMアプリ専用セキュリティ診断',
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
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}
