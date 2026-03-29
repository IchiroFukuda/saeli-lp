"use client";

import React from "react";

export default function KeepLP() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* ヒーロー */}
      <section className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <h1 className="text-6xl sm:text-8xl font-extralight tracking-tight mb-6">
          keep
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 mb-4">
          AGA治療を、続けるためのアプリ。
        </p>
        <p className="text-sm text-gray-600 max-w-md">
          毎日の服薬を1タップで記録。維持日数を可視化して、
          静かに、確実に、治療を続ける習慣をつくる。
        </p>
      </section>

      {/* 特徴 */}
      <section className="px-6 pb-24 max-w-2xl mx-auto">
        <div className="space-y-16">
          <Feature
            title="1タップで記録"
            desc="飲んだら押す。それだけ。余計な入力は一切なし。"
          />
          <Feature
            title="維持日数の可視化"
            desc="続けた日数がそのままモチベーションになる。ストリークが途切れそうなとき、静かに問いかける。"
          />
          <Feature
            title="擬似血中濃度バー"
            desc="服薬の継続状況から血中濃度を擬似表示。蓄積中、上昇中、安定。今の状態がひと目でわかる。"
          />
          <Feature
            title="尖ったリマインダー"
            desc="「薬の時間です」じゃない。「今日の維持、まだです。」AGA治療に特化した文言で、忘れない。"
          />
          <Feature
            title="残数管理"
            desc="手持ちの薬の残数を管理。少なくなったら補充をリマインド。"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 text-center">
        <p className="text-gray-500 text-sm mb-6">近日公開予定</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-block bg-white text-black font-semibold px-8 py-4 rounded-xl text-sm hover:bg-gray-200 transition-colors"
          >
            App Store（準備中）
          </a>
          <a
            href="#"
            className="inline-block border border-gray-700 text-gray-300 font-semibold px-8 py-4 rounded-xl text-sm hover:border-gray-500 transition-colors"
          >
            Google Play（準備中）
          </a>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-gray-900 py-8 px-6 text-center">
        <p className="text-gray-700 text-xs">
          &copy; {new Date().getFullYear()} keep. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
