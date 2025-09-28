export default function Solution() {
  const solutions = [
    {
      icon: '🛡️',
      title: 'プロンプト注入診断',
      description: '攻撃的な指示を自動送信し挙動を検証',
      features: ['複数の攻撃パターンを自動実行', 'リアルタイムでの挙動監視', '詳細なログ出力']
    },
    {
      icon: '🔍',
      title: '情報漏洩チェック',
      description: '会話履歴や内部プロンプトの露出確認',
      features: ['会話履歴の漏洩検出', '内部プロンプトの露出確認', '機密情報の特定']
    },
    {
      icon: '📊',
      title: 'リスクスコアと改善提案',
      description: 'スコア化＋日本語の改善ガイド',
      features: ['総合リスクスコア算出', '具体的な改善提案', '優先度付きの対策リスト']
    }
  ];

  return (
    <section className="section-padding bg-white dark:bg-gray-800">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="text-blue-600 dark:text-blue-400">PromptGuard（β）</span>でできること
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            LLM特有の脆弱性に特化した診断で、あなたのアプリを守ります
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="card group hover:shadow-lg transition-all duration-200">
              <div className="text-5xl mb-6">{solution.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {solution.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {solution.description}
              </p>
              <ul className="space-y-2">
                {solution.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-blue-500 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
