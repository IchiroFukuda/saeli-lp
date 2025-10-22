'use client';

export default function BetaCTA() {

  return (
    <>
      <section id="beta" className="section-padding bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              現在、βテスターを募集中！
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              クローズドβ期間中は無料でお試しいただけます。
              <br />
              正式版前にご意見をお寄せください。
            </p>

            {/* Googleフォーム埋め込み */}
            <div className="w-full">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSccsgNeN9BmU-2R2DaNn7xNi5YtjLGSSo-QoGujhNOjW7E5XA/viewform?embedded=true"
                width="100%"
                height="600"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                className="rounded-lg"
                title="PromptGuard β版登録フォーム"
              >
                読み込んでいます…
              </iframe>
            </div>

            <div className="text-sm text-blue-200 mt-4 space-y-2">
              <p>※ 登録いただいたメールアドレスは、β版のご案内以外には使用いたしません</p>
              <p className="text-xs text-blue-300">
                &gt; 「この診断は、あなたが所有または明示的許可を得たアプリに対してのみ実行してください。」
              </p>
              <p className="text-xs">
                <a href="/privacy" className="underline hover:text-white transition-colors">
                  プライバシーポリシー
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

