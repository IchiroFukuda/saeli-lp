'use client';

interface HeroProps {
  onScrollToBeta: () => void;
}

export default function Hero({ onScrollToBeta }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden">
      {/* 背景エフェクト */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="container relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* バッジ */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
            PromptGuard β版
          </div>

          {/* メインタイトル */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            あなたのAIアプリ、
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              乗っ取られていませんか？
            </span>
          </h1>

          {/* サブコピー */}
          <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            ChatGPT・Claude・GeminiなどのLLMアプリに潜む
            <span className="text-blue-400 font-semibold">「プロンプト注入」</span>や
            <span className="text-blue-400 font-semibold">「情報漏洩」</span>リスクを、
            URLを入力するだけで自動診断。5分であなたのアプリの「本当の安全性」がわかります。
          </p>

          {/* URL入力フォーム */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <label htmlFor="hero-url" className="sr-only">
                APIエンドポイントのURL
              </label>
              <input
                id="hero-url"
                type="url"
                placeholder="https://example.com/api/chat"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                aria-label="診断したいAPIエンドポイントのURL"
              />
              <button 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="診断を開始する"
              >
                診断を開始
              </button>
            </div>
          </div>

          {/* CTAボタン */}
          <button
            onClick={onScrollToBeta}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            aria-label="β版登録フォームにスクロール"
          >
            <span>β版の早期アクセスを申し込む（無料）</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 装飾的な要素 */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
    </section>
  );
}
