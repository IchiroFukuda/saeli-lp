"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, AlertTriangle, Lock, Eye, Mail } from "lucide-react";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    posthog?: {
      capture: (event: string, properties?: Record<string, any>) => void;
      flush?: () => void;
      __loaded?: boolean;
    };
  }
}

export default function SesMarginLP() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [marginInfo, setMarginInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const pageViewSentRef = useRef(false);

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
    trackEvent("pageview", { page: "ses_margin" });
    pageViewSentRef.current = true;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName || "未入力",
          name: "SES中抜き率LP登録",
          email,
          message: `[SES中抜き率データベース 事前登録]\n\n勤務先: ${companyName || "未入力"}\n\n投稿情報:\n${marginInfo || "なし"}\n\n公開時のお知らせを希望します。`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "送信に失敗しました");
      }

      trackEvent("ses_margin_signup", {
        provided_company: !!companyName,
        provided_info: !!marginInfo,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-stone-100">
      {/* Hero */}
      <section className="pt-20 pb-16 sm:pt-28 sm:pb-20 border-b border-stone-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-900/50 text-red-400 text-xs font-medium mb-6">
            <AlertTriangle className="w-3.5 h-3.5" />
            業界の透明化プロジェクト
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight tracking-tight">
            あなたの会社の<span className="text-red-500">中抜き率</span>、
            <br className="sm:hidden" />
            知っていますか？
          </h1>

          <p className="text-stone-400 text-base sm:text-lg leading-relaxed mb-8">
            SESエンジニアの大半が、
            <span className="text-stone-200">自分の単価・中抜き率を最後まで知らない</span>
            まま働いています。
            <br className="hidden sm:block" />
            派遣業界では法律でマージン率の公開が義務化されていますが、
            <span className="text-stone-200">SESは法の枠外</span>
            で、公開義務がありません。
          </p>

          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-6 sm:p-8">
            <p className="text-xs sm:text-sm text-stone-500 mb-4">業界の現実</p>
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-500 mb-1">35-40%</p>
                <p className="text-xs text-stone-400">SES企業の平均マージン率</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-500 mb-1">40%+</p>
                <p className="text-xs text-stone-400">非公開企業の推定マージン率</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-500 mb-1">義務なし</p>
                <p className="text-xs text-stone-400">SESの公開義務</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 sm:py-20 border-b border-stone-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 leading-tight">
            なぜ、自分の中抜き率を<br className="sm:hidden" />知れないのか
          </h2>

          <div className="space-y-6">
            <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-red-950/40 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-2 text-stone-100">客先単価は会社の機密</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    あなたが客先に何円で売られているかは、SES会社の営業しか知らない。NDAで縛られていて、エンジニア本人には開示されないことが多い。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-red-950/40 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-2 text-stone-100">派遣法の枠外</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    派遣業界は2012年法改正でマージン率公開が義務化された。SESは「準委任契約」の形を取り、派遣法の縛りを受けない。これが業界の闇の根本原因。
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-red-950/40 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold mb-2 text-stone-100">比較するデータがない</h3>
                  <p className="text-sm text-stone-400 leading-relaxed">
                    自分の会社の中抜き率が「業界平均より高いか低いか」を知る術がない。判断材料がないまま、長年その会社で働き続けることになる。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 sm:py-20 border-b border-stone-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-xs font-medium mb-6">
            開発中
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-6 leading-tight">
            SES会社別<br className="sm:hidden" />
            <span className="text-emerald-400">中抜き率データベース</span>
          </h2>

          <p className="text-stone-400 text-base leading-relaxed mb-8">
            会社別のマージン率を、現役・元SESエンジニアからの匿名投稿で集約。
            <span className="text-stone-200">推定中抜き率を客観データで可視化</span>
            します。
          </p>

          <div className="space-y-4">
            <FeatureRow
              num="01"
              title="会社別マージン率の推定値"
              desc="投稿された月給と業界相場（80-100万/月）から、会社ごとの推定中抜き率を集計。"
            />
            <FeatureRow
              num="02"
              title="完全匿名投稿システム"
              desc="投稿者の身元は完全に保護。月給・職種・年数のみ収集。NDA違反にならない範囲で。"
            />
            <FeatureRow
              num="03"
              title="業界平均との比較"
              desc="あなたの会社が業界平均より高いか低いか、一目で分かる。判断材料が手に入る。"
            />
            <FeatureRow
              num="04"
              title="高還元SES企業の発見"
              desc="マージン率20%台の優良企業を見つけられる。転職判断の根拠データに。"
            />
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 sm:py-20 border-b border-stone-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 leading-tight">
            なぜ、これを作るのか
          </h2>

          <div className="bg-stone-900/40 border border-stone-800 rounded-2xl p-6 sm:p-8">
            <p className="text-stone-300 leading-relaxed mb-4">
              私自身、元SESエンジニアでした。
            </p>
            <p className="text-stone-300 leading-relaxed mb-4">
              数年勤めて、自分の中抜き率を最後まで知らないまま退職しました。営業に聞いても「答えられない」と言われ、退職後にうっすら推測することしかできませんでした。
            </p>
            <p className="text-stone-300 leading-relaxed mb-4">
              これは私個人の話ではなく、
              <span className="text-stone-100">業界の構造的な問題</span>
              です。エンジニアが自分の単価を知らないまま働くこと自体が異常で、本来は派遣業のように透明化されるべきです。
            </p>
            <p className="text-stone-300 leading-relaxed">
              SES会社に公開を強制することはできない。でも、
              <span className="text-emerald-400">第三者として透明化する</span>
              ことはできる。
              <br />
              そのために、このデータベースを作っています。
            </p>
          </div>
        </div>
      </section>

      {/* CTA - Signup Form */}
      <section className="py-16 sm:py-20 border-b border-stone-800" id="signup">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {!submitted ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight text-center">
                公開時に<br className="sm:hidden" />お知らせを受け取る
              </h2>
              <p className="text-stone-400 text-sm sm:text-base text-center mb-10 leading-relaxed">
                データベース公開時に、登録メールへ通知します。
                <br />
                投稿情報の提供（任意）にもご協力ください。
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs text-stone-400 mb-2 font-medium">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-stone-600"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-2 font-medium">
                    勤務先（または元勤務先）SES会社名
                    <span className="text-stone-600 ml-1">（任意）</span>
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-stone-600"
                    placeholder="例：株式会社○○"
                  />
                  <p className="text-xs text-stone-600 mt-2">
                    ※ 公開時には匿名化されます。投稿協力者として扱います。
                  </p>
                </div>

                <div>
                  <label className="block text-xs text-stone-400 mb-2 font-medium">
                    あなたの月給・推定単価・知ってる情報
                    <span className="text-stone-600 ml-1">（任意）</span>
                  </label>
                  <textarea
                    value={marginInfo}
                    onChange={(e) => setMarginInfo(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-stone-900 border border-stone-800 rounded-xl text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-stone-600 resize-none"
                    placeholder="例：月給45万円、客先単価は推定80万円、5年目バックエンド..."
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !email}
                  className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    submitting || !email
                      ? "bg-stone-800 text-stone-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-900/30"
                  }`}
                >
                  {submitting ? "送信中..." : "事前登録する"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>

                <p className="text-xs text-stone-600 text-center leading-relaxed">
                  ※ メールアドレスは公開通知のみに使用します。
                  <br />
                  投稿いただいた情報は匿名化の上、データベース構築に活用させていただきます。
                </p>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-950/40 border border-emerald-900/50 mb-6">
                <Mail className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">登録ありがとうございます</h2>
              <p className="text-stone-400 leading-relaxed">
                データベース公開時にメールでお知らせします。
                <br />
                業界の透明化に向けて、一緒に動きましょう。
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Final note */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <p className="text-sm text-stone-500 leading-relaxed mb-2">
            合同会社SAELI が運営する、業界透明化プロジェクトです。
          </p>
          <p className="text-xs text-stone-600 leading-relaxed">
            お問い合わせ: hello@saeli.org
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureRow({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 sm:gap-6 py-5 border-t border-stone-800">
      <div className="shrink-0 text-stone-600 font-mono text-sm pt-1">{num}</div>
      <div>
        <h3 className="font-bold mb-2 text-stone-100">{title}</h3>
        <p className="text-sm text-stone-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
