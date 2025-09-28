export default function Problems() {
  const problems = [
    {
      icon: '⚠️',
      title: 'プロンプトインジェクション',
      description: '前の命令を無視させ内部情報を出力させる誘導'
    },
    {
      icon: '🔓',
      title: 'データリーク',
      description: '会話履歴や内部プロンプトが露出'
    },
    {
      icon: '🚫',
      title: 'アクセス越権',
      description: '本来見せてはいけないユーザー情報を出力'
    },
    {
      icon: '🔄',
      title: '制限バイパス',
      description: '禁止ワードや検閲を容易に回避'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            従来の診断では見抜けない、
            <br />
            <span className="text-red-600 dark:text-red-400">新しい危険</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            従来のセキュリティ診断では検出できない、LLM特有の脆弱性が存在します
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div key={index} className="card group hover:scale-105 transition-all duration-300 hover:shadow-lg border-l-4 border-red-500/20 hover:border-red-500/40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{problem.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                {problem.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
