'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: '無料で使えますか？',
      answer: 'β期間（〜2025年12月31日予定）は無料です。正式版リリース後も、基本的な診断機能は無料でご利用いただけます。'
    },
    {
      question: 'データは保存されますか？',
      answer: '診断目的以外では保存・共有しません。診断結果はお客様のセキュリティ向上のためのみに使用されます。'
    },
    {
      question: '既存の脆弱性診断との違いは？',
      answer: 'LLM特有の脆弱性（プロンプト注入・情報漏洩等）に特化しています。従来のWebアプリケーション診断では検出できない新しい脅威に対応します。'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-white dark:bg-gray-800">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              よくある質問
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              PromptGuardについて、よくお寄せいただく質問にお答えします
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span 
                    id={`faq-question-${index}`}
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div 
                    id={`faq-answer-${index}`}
                    className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
