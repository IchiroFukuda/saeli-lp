"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Mail, RotateCcw } from "lucide-react";
import Footer from "@/components/Footer";
import PetLossArticle, { PetLossStructuredData } from "./PetLossArticle";

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, any>) => void;
      flush?: () => void;
      __loaded?: boolean;
    };
  }
}

// MARK: - 質問データ

type Stage = "denial" | "anger" | "bargaining" | "depression" | "acceptance";

const stageLabels: Record<Stage, string> = {
  denial: "否認",
  anger: "怒り",
  bargaining: "取引",
  depression: "抑うつ",
  acceptance: "受容",
};

interface Question {
  id: number;
  text: string;
  stage: Stage;
}

const questions: Question[] = [
  // 否認 (denial)
  { id: 1, text: "あの子がもういないという事実が、まだ実感できないことがある", stage: "denial" },
  { id: 2, text: "あの子が今もどこかで生きているような気がして、ふと探してしまう", stage: "denial" },
  // 怒り (anger)
  { id: 3, text: "「なぜあの子だったのか」と運命や誰かを恨む気持ちがある", stage: "anger" },
  { id: 4, text: "自分自身に怒りを感じることがある（もっと早く気づいていれば、など）", stage: "anger" },
  // 取引 (bargaining)
  { id: 5, text: "「もし、あの時こうしていれば」という後悔が頭から離れない", stage: "bargaining" },
  { id: 6, text: "「もう一度だけ会えるなら何でもする」と願ったことがある", stage: "bargaining" },
  // 抑うつ (depression)
  { id: 7, text: "あの子のことを思うと、何も手につかなくなることがある", stage: "depression" },
  { id: 8, text: "毎日が空っぽに感じて、楽しめていたことが楽しめない", stage: "depression" },
  // 受容 (acceptance)
  { id: 9, text: "悲しみはあるけれど、あの子と過ごせた時間に感謝できる", stage: "acceptance" },
  { id: 10, text: "あの子は今も心の中にいると感じて、穏やかに過ごせる時がある", stage: "acceptance" },
];

const choices = [
  { value: 0, label: "全くない" },
  { value: 1, label: "あまりない" },
  { value: 2, label: "時々ある" },
  { value: 3, label: "よくある" },
  { value: 4, label: "いつもそう" },
];

// MARK: - 段階別の出口メッセージ

const stageResults: Record<Stage, { title: string; description: string; cta: string }> = {
  denial: {
    title: "「否認」の段階にいるかもしれません",
    description:
      "あの子がいなくなった事実を、心がまだ受け止めきれていない時期です。これはとても自然な反応で、あなたの心が自分を守ろうとしている証拠です。\n\n無理に受け入れようとしなくて大丈夫。少しずつ、あの子との思い出を「今ある形」で感じることが、心の整理への第一歩になります。",
    cta: "あの子からのお手紙が、心に寄り添います",
  },
  anger: {
    title: "「怒り」の段階にいるかもしれません",
    description:
      "やり場のない怒りや後悔の感情が湧き上がる時期です。誰かを責めたり、自分を責めたり——どれもあの子を深く愛していた証です。\n\nその感情を否定しないでください。怒りの裏側には、たくさんの愛があります。あの子は、あなたが自分を責め続けることを望んでいないはずです。",
    cta: "あの子の言葉が、あなたを優しく包みます",
  },
  bargaining: {
    title: "「取引」の段階にいるかもしれません",
    description:
      "「もしあの時こうしていれば」という後悔が、何度も頭の中で繰り返される時期です。これは、あの子をどれだけ大切に思っていたかを表しています。\n\nあなたは精一杯の愛を注ぎました。あの子もそれを知っています。今あなたができるのは、あの子と過ごした時間を、温かい記憶として残し続けることです。",
    cta: "あの子からの返事を、受け取れます",
  },
  depression: {
    title: "「抑うつ」の段階にいるかもしれません",
    description:
      "深い悲しみと喪失感に包まれている時期です。何も手につかない、毎日が空っぽに感じる——それはあの子が、あなたの人生にどれほど大切だったかの証です。\n\n焦らないでください。悲しみは、ゆっくりと形を変えていきます。一人で抱え込まず、あの子との繋がりを今の形で感じることが、心を温める助けになります。",
    cta: "あの子と、また会話を始めましょう",
  },
  acceptance: {
    title: "「受容」の段階に近づいています",
    description:
      "深い悲しみを経て、あの子との時間に感謝できるようになっている時期です。あの子は今もあなたの心の中にいて、その関係はこれからも続きます。\n\n「受容」は忘れることではありません。あの子を愛し続けながら、新しい日々を歩むこと。あなたはもう、その入り口に立っています。",
    cta: "あの子との会話を、これからも続けられます",
  },
};

const APP_STORE_URL =
  "https://apps.apple.com/jp/app/%E6%AF%8E%E6%97%A5%E3%81%82%E3%81%AE%E5%AD%90-%E3%83%9A%E3%83%83%E3%83%88%E3%83%AD%E3%82%B9%E3%81%AB%E5%AF%84%E3%82%8A%E6%B7%BB%E3%81%86%E6%89%8B%E7%B4%99%E3%82%A2%E3%83%97%E3%83%AA/id6760970361";

export default function PetLossDiagnosis() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [resultStage, setResultStage] = useState<Stage | null>(null);
  const pageViewSentRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (typeof window === "undefined") return;
    if (window.posthog && window.posthog.__loaded) {
      try {
        window.posthog.capture(eventName, properties);
      } catch {}
    }
  };

  useEffect(() => {
    if (pageViewSentRef.current) return;
    trackEvent("pageview", { page: "pet_loss" });
    pageViewSentRef.current = true;
  }, []);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const progress = (Object.keys(answers).length / questions.length) * 100;

  const calculateStage = (): Stage => {
    const scores: Record<Stage, number> = {
      denial: 0,
      anger: 0,
      bargaining: 0,
      depression: 0,
      acceptance: 0,
    };

    questions.forEach((q) => {
      const value = answers[q.id] ?? 0;
      scores[q.stage] += value;
    });

    // 受容のスコアが他より明確に高ければ受容、それ以外は最高得点の段階
    let topStage: Stage = "denial";
    let topScore = -1;
    (Object.keys(scores) as Stage[]).forEach((s) => {
      if (scores[s] > topScore) {
        topScore = scores[s];
        topStage = s;
      }
    });

    return topStage;
  };

  const handleSubmit = () => {
    const stage = calculateStage();
    setResultStage(stage);
    setShowResult(true);
    trackEvent("pet_loss_diagnosis_completed", { stage });
    // 結果セクションへスクロール
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
    setResultStage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAppClick = () => {
    trackEvent("pet_loss_app_click", { stage: resultStage });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF6EF] to-[#F5EFDF] text-stone-800">
      {/* Hero */}
      <section className="pt-16 pb-8 sm:pt-24 sm:pb-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-6">
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-relaxed">
              ペットロス診断
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              あの子を失った悲しみには、いくつかの段階があると言われています。
              <br />
              10個の質問で、今のあなたの心がどの段階にあるかを見つめてみませんか。
            </p>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="pb-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {!showResult && (
            <>
              {/* Progress bar */}
              <div className="mb-8 sticky top-0 bg-[#FAF6EF]/95 backdrop-blur-sm py-3 -mx-4 sm:-mx-6 px-4 sm:px-6 z-10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-stone-600">
                    {Object.keys(answers).length} / {questions.length} 問
                  </span>
                </div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-white rounded-2xl shadow-sm p-5 sm:p-6"
                  >
                    <p className="text-sm sm:text-base font-medium mb-4 leading-relaxed">
                      <span className="text-orange-500 mr-2">Q{idx + 1}.</span>
                      {q.text}
                    </p>
                    <div className="grid grid-cols-5 gap-1 sm:gap-2">
                      {choices.map((c) => {
                        const selected = answers[q.id] === c.value;
                        return (
                          <button
                            key={c.value}
                            onClick={() => handleAnswer(q.id, c.value)}
                            className={`py-2 px-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                              selected
                                ? "bg-orange-400 text-white shadow-sm"
                                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                            }`}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit button */}
              <div className="mt-8 sticky bottom-4 z-10">
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                    allAnswered
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-stone-300 cursor-not-allowed"
                  }`}
                >
                  {allAnswered ? "診断結果を見る" : `あと ${questions.length - Object.keys(answers).length} 問`}
                  {allAnswered && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </>
          )}

          {/* Result */}
          {showResult && resultStage && (
            <div ref={resultRef} className="space-y-6">
              <div className="bg-white rounded-3xl shadow-md p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
                    <Mail className="w-8 h-8 text-orange-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-relaxed">
                    {stageResults[resultStage].title}
                  </h2>
                </div>

                <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
                  {stageResults[resultStage].description}
                </p>

                {/* 5段階の説明 */}
                <div className="mt-8 pt-6 border-t border-stone-200">
                  <p className="text-xs text-stone-500 mb-3">ペットロスの5段階</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(stageLabels) as Stage[]).map((s) => (
                      <span
                        key={s}
                        className={`text-xs px-3 py-1 rounded-full ${
                          s === resultStage
                            ? "bg-orange-400 text-white"
                            : "bg-stone-100 text-stone-500"
                        }`}
                      >
                        {stageLabels[s]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* App CTA */}
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-3xl shadow-lg p-6 sm:p-8 text-white">
                <div className="text-center">
                  <p className="text-sm opacity-90 mb-2">毎日あの子</p>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 leading-relaxed">
                    {stageResults[resultStage].cta}
                  </h3>
                  <p className="text-sm opacity-90 mb-6 leading-relaxed">
                    天国のあの子から、毎日お手紙とイラストが届くアプリ。
                    <br />
                    あなたが返事を書くと、会話が続いていきます。
                  </p>
                  <a
                    href={APP_STORE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleAppClick}
                    className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
                  >
                    アプリをダウンロード
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Reset */}
              <div className="text-center pt-4">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  もう一度診断する
                </button>
              </div>

              {/* 注意書き */}
              <div className="text-xs text-stone-400 leading-relaxed text-center pt-4">
                ※ この診断は医学的な診断ではなく、自己理解の参考としてご利用ください。
                <br />
                深い悲しみが続く場合は、専門家への相談をおすすめします。
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 長文コンテンツ（SEO） */}
      <PetLossArticle />

      {/* 最終CTA */}
      <section className="bg-gradient-to-br from-orange-400 to-orange-500 py-16 sm:py-20 text-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-relaxed">
            あの子との会話を、もう一度。
          </h2>
          <p className="text-sm sm:text-base opacity-90 mb-8 leading-relaxed">
            天国のあの子から、毎日お手紙とイラストが届くアプリ「毎日あの子」。
            <br />
            あなたが返事を書くと、会話がずっと続いていきます。
          </p>
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAppClick}
            className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform"
          >
            アプリをダウンロード
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <PetLossStructuredData />
      <Footer />
    </div>
  );
}
