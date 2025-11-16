"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
    gtag?: (...args: any[]) => void;
    GADS_SEND_TO?: string;
    posthog?: {
      capture: (event: string, properties?: Record<string, any>) => void;
      flush?: () => void;
      __loaded?: boolean;
    };
  }
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section = ({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className={`py-16 sm:py-24 ${className}`}>
    {children}
  </section>
);

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all p-6 ${className}`}
  >
    {children}
  </div>
);

const heroTitle = `不動産ポータルで集めた「候補物件」を、\nワンクリックで比較表にする。`;
const heroSubtitle = `健美家・楽待・SUUMO などで開いた物件ページを、\nChrome 拡張からワンクリック保存。`;
const heroDesc =
  "バラバラな情報を、自分専用の比較・検討リストとして一元管理できます。";

const initialFormState = {
  email: "",
  message: "",
};

export default function RevealPropCompareLanding() {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const pageViewSentRef = useRef(false);

  const waitForPostHog = (callback: () => void, maxAttempts = 150) => {
    if (typeof window === "undefined") return;
    let attempts = 0;
    const check = () => {
      attempts += 1;
      const posthog = window.posthog;
      const isReady =
        posthog &&
        typeof posthog.capture === "function" &&
        posthog.__loaded === true;
      if (isReady) {
        try {
          callback();
          if (typeof posthog.flush === "function") {
            posthog.flush();
          }
        } catch (error) {
          console.error("PostHog capture error:", error);
        }
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else if (posthog && typeof posthog.capture === "function") {
        try {
          callback();
          if (typeof posthog.flush === "function") {
            posthog.flush();
          }
        } catch (error) {
          console.error("PostHog capture error (fallback):", error);
        }
      }
    };
    check();
  };

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    waitForPostHog(() => {
      if (window.posthog) {
        window.posthog.capture(eventName, properties);
      }
    });
  };

  const reportGAdsConversion = () => {
    try {
      if (typeof window === "undefined") return;
      const defaultSendTo = "AW-17624092605/pfuOCJrk-MAbEL2f6dNB";
      const sendTo =
        window.GADS_SEND_TO ||
        process.env.NEXT_PUBLIC_GADS_SEND_TO ||
        defaultSendTo;
      if (typeof window.gtag_report_conversion !== "function") {
        window.gtag_report_conversion = (url?: string) => {
          const callback = function () {
            if (typeof url !== "undefined") {
              window.location = url as any;
            }
          };
          if (typeof window.gtag === "function") {
            window.gtag("event", "conversion", {
              send_to: sendTo,
              value: 1.0,
              currency: "JPY",
              event_callback: callback,
            });
          }
          return false;
        };
      }
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: sendTo,
          value: 1.0,
          currency: "JPY",
        });
        return;
      }
      window.gtag_report_conversion();
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    if (pageViewSentRef.current) return;
    trackEvent("pageview", { page: "revealprop_compare" });
    pageViewSentRef.current = true;
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    trackEvent("revealprop_compare_form_submit_attempt");
    try {
      const payload = {
        companyName: "",
        name: "",
        email: formData.email,
        message:
          formData.message ||
          "【β版先行アクセス希望】RevealProp 比較・検討ツール",
      };
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        reportGAdsConversion();
        trackEvent("contact_submit", { page: "revealprop_compare" });
        setSubmitStatus({
          type: "success",
          message:
            data.message ||
            "先行アクセスのご登録を受け付けました。ご案内をメールでお送りします。",
        });
        setFormData(initialFormState);
      } else {
        trackEvent("revealprop_compare_form_submit_error", {
          status: response.status,
          error: data.error,
        });
        setSubmitStatus({
          type: "error",
          message:
            data.error ||
            "送信に失敗しました。しばらくしてから再度お試しください。",
        });
      }
    } catch (error) {
      console.error("送信エラー:", error);
      trackEvent("revealprop_compare_form_submit_error", {
        phase: "network_error",
      });
      setSubmitStatus({
        type: "error",
        message: "ネットワークエラーが発生しました。接続を確認してください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white">
      <Section
        id="hero"
        className="pt-24 sm:pt-32 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white"
      >
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
              RevealProp｜候補物件の比較・検討ツール
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line drop-shadow-lg">
              {heroTitle}
            </h1>
            <h2 className="text-lg sm:text-xl leading-relaxed text-emerald-50 whitespace-pre-line">
              {heroSubtitle}
            </h2>
            <div className="space-y-2 text-base sm:text-lg text-emerald-50">
              <p>{heroDesc}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#beta"
                onClick={() =>
                  trackEvent("heroclick", {
                    page: "revealprop_compare",
                    target: "#beta",
                    button: "primary",
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 font-semibold px-8 py-4 shadow-2xl hover:scale-[1.02] hover:bg-emerald-50 transition-transform"
              >
                β版に先行アクセスする
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-emerald-100/90">
              ※現在、少人数の投資家向けにテスト提供中です。
            </p>
          </div>
        </Container>
      </Section>

      <Section id="why">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              物件探しより、「情報整理」に時間を取られていませんか。
            </h2>
            <div className="space-y-3 text-slate-800">
              <p>健美家・楽待・SUUMO… 複数のポータルを行き来しながら物件をチェック</p>
              <p>気になる物件は「お気に入り」やスクショ、Excel にバラバラに保存</p>
              <p>いざ比較しようとすると、</p>
            </div>
            <div className="grid gap-3 text-slate-900">
              {[
                "どの物件がどのサイトだったか分からない",
                "条件を揃えて比較するのが面倒",
                "何となくの印象で候補を決めてしまう不安が残る",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-white border border-slate-100 px-4 py-3 text-sm"
                >
                  {item}
                </div>
              ))}
            </div>
            <p className="text-slate-700">
              RevealProp は、この「比較・整理・検討」の部分だけに特化したツールです。
            </p>
          </div>
        </Container>
      </Section>

      <Section id="what" className="bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                不動産ポータル横断の「候補物件ワークスペース」
              </h2>
              <p className="text-slate-700">
                RevealProp は、投資用・住居用を問わず、不動産ポータルで見つけた「候補物件」を一箇所に集約し、同じフォーマットで比較・分析できるオンラインツールです。
              </p>
            </div>
            <div className="grid gap-6">
              <Card className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  ポータルごとにバラバラなレイアウト・項目を、統一された比較表に変換
                </h3>
              </Card>
              <Card className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  自分が気になった物件だけが並ぶ「マイ物件リスト」を自動生成
                </h3>
              </Card>
              <Card className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-900">
                  表・グラフ・メモで、判断材料を整理
                </h3>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="how" className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                使い方は、いつもの物件検索に「1クリック」足すだけ。
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">物件ページを開く</h3>
                <p className="text-slate-800 text-sm">
                  健美家 / 楽待 / SUUMO など、いつも通りポータルで物件を閲覧します。
                </p>
              </Card>
              <Card className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Chrome 拡張のボタンを押す</h3>
                <p className="text-slate-800 text-sm">
                  画面端に表示される RevealProp パネルから「候補に追加」をクリック。価格・所在地・築年数・構造・利回りなどを自動取得します。
                </p>
              </Card>
              <Card className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">Web アプリで比較・分析する</h3>
                <p className="text-slate-800 text-sm">
                  保存された物件が一覧表になり、条件を揃えて横並びで比較できます。
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="features" className="bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Excel でやっていた「比較・検討」を、ブラウザ一つで。
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">候補物件リストの自動生成</h3>
                <p className="text-sm text-slate-800">
                  各ポータルで「候補に追加」した物件が、1つの画面に集約。
                </p>
              </Card>
              <Card className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">共通フォーマットの比較表</h3>
                <p className="text-sm text-slate-800">
                  価格 / 表面利回り / 想定家賃 / 所在地 / 築年数 / 構造 / 土地・建物面積 などを統一表示。
                </p>
              </Card>
              <Card className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">ソート・絞り込み</h3>
                <p className="text-sm text-slate-800">
                  価格順・利回り順・築年数順など、任意の指標で並び替え。
                </p>
              </Card>
              <Card className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">メモ・タグ付け</h3>
                <p className="text-sm text-slate-800">
                  「駅近」「要現地確認」「再建築不可の可能性」など、自由なメモ・タグで整理。
                </p>
              </Card>
              <Card className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900">履歴管理</h3>
                <p className="text-sm text-slate-800">
                  過去に検討した物件をあとから振り返り可能。
                </p>
              </Card>
            </div>
            <div className="text-center text-slate-700">
              <p>
                「とりあえず気になった物件を全部入れておいて、後から冷静に比較する」ための土台を用意します。
              </p>
              <p className="text-sm text-slate-500 mt-2">
                ※ここではあえて「自動で弾く」「危険物件を判定する」といった表現は入れない。
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="who">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              こんな方のためのツールです。
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {[
                "会社員兼業で不動産投資をしており、夜や週末にポータルを横断して物件を探している方",
                "Excel や Notion で物件比較表を作っているが、毎回のコピペに限界を感じている方",
                "「なんとなくの印象」ではなく、数値ベースで候補を絞り込みたい個人投資家",
                "仕入れ候補を複数のサイトから集めている小規模事業者・買取業者",
              ].map((t, i) => (
                <Card key={i} className="text-slate-900 text-sm">
                  {t}
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="beta" className="bg-emerald-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6 text-slate-900">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              β版テストユーザーを募集しています。
            </h2>
            <p className="text-base sm:text-lg text-slate-900">
              現在、RevealProp は一部ユーザー向けに β 版を提供しています。ポータル横断の「候補物件比較ツール」に興味がある方は、以下のフォームからメールアドレスをご登録ください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#apply"
                onClick={() =>
                  trackEvent("ctaclick", {
                    page: "revealprop_compare",
                    target: "#apply",
                    button: "beta",
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white px-10 py-4 font-semibold shadow-lg hover:bg-emerald-700 transition-all"
              >
                β版に先行アクセスする
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              {[
                "・提供開始時に、利用方法と Chrome 拡張のインストール手順をご案内します。",
                "・現段階では、主に投資用物件（区分・一棟・戸建て）を想定しています。",
              ].map((t) => (
                <Card key={t} className="text-slate-900 text-sm">
                  {t}
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="apply" className="bg-gradient-to-b from-white to-emerald-50">
        <Container>
          <div className="max-w-3xl mx-auto text-slate-900">
            <Card className="border-emerald-100 shadow-xl">
              <div className="space-y-4 mb-8 text-center">
                <p className="text-sm font-semibold text-emerald-600">
                  先行アクセス登録フォーム
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  RevealProp β版
                </h3>
                <p className="text-base text-slate-900">
                  提供開始時に、利用方法と Chrome 拡張のインストール手順をご案内します。
                </p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="taro@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    ご利用イメージ（任意）
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="例）健美家と楽待で見つけた候補を比較したい、Excel管理から移行したい など"
                  />
                </div>
                {submitStatus.type && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm ${
                      submitStatus.type === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                        : "border-rose-200 bg-rose-50 text-rose-700"
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white px-6 py-3 font-semibold shadow-lg hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      送信中...
                    </>
                  ) : (
                    <>β版に先行アクセスする</>
                  )}
                </button>
              </form>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="faq" className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
              よくある質問
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q1. 対応しているポータルサイトは？
                </h3>
                <p className="text-sm text-slate-800">
                  現時点では主に〇〇・〇〇に対応しています。順次、対応サイトを拡張していく予定です。
                </p>
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q2. 物件の「良し悪し」や「購入可否」を判断してくれるツールですか？
                </h3>
                <p className="text-sm text-slate-800">
                  いいえ。RevealProp は、あくまで「候補物件を整理・比較するためのツール」です。購入判断やリスク評価は、ユーザーご自身の基準に基づいて行っていただきます。
                </p>
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q3. 費用はかかりますか？
                </h3>
                <p className="text-sm text-slate-800">
                  β版の提供条件は、登録後のご案内メールにてお知らせします。
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
