export default function Steps() {
  const steps = [
    {
      number: '1',
      title: 'URLまたはAPIエンドポイントを入力',
      description: '診断したいアプリのエンドポイントを入力してください'
    },
    {
      number: '2',
      title: '自動で複数の攻撃プロンプトを送信・解析',
      description: 'PromptGuardが自動的にセキュリティテストを実行します'
    },
    {
      number: '3',
      title: 'リスクスコア・診断結果・改善提案を表示',
      description: '詳細な診断結果と具体的な改善方法をご提案します'
    }
  ];

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            診断は3ステップで完了
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            複雑な設定は不要。URLを入力するだけで、すぐに診断を開始できます
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* サンプル結果ボックス */}
          <div className="mt-16 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              診断結果サンプル
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <span className="text-gray-900 dark:text-white font-medium">プロンプト注入耐性</span>
                <span className="text-red-600 dark:text-red-400 font-bold">45点（危険）</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <span className="text-gray-900 dark:text-white font-medium">データ漏洩耐性</span>
                <span className="text-green-600 dark:text-green-400 font-bold">80点（安全）</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <span className="text-gray-900 dark:text-white font-medium">制限バイパス耐性</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">60点（注意）</span>
              </div>
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">総合スコア：</span>
                  <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 ml-2">62点</span>
                  <p className="text-yellow-600 dark:text-yellow-400 mt-2">（注意が必要です）</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



