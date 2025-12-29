"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, CheckCircle2, AlertTriangle, Banknote, FileText, Zap, Building2, Shield, Clock, Users, Award } from "lucide-react";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
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

const initialFormState = {
  companyName: "",
  name: "",
  email: "",
  units: "",
};

export default function BankAPIIntegrationLanding() {
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

  useEffect(() => {
    if (pageViewSentRef.current) return;
    trackEvent("pageview", { page: "bank_api_integration" });
    pageViewSentRef.current = true;
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    trackEvent("bank_api_form_submit_attempt");
    try {
      const payload = {
        companyName: formData.companyName,
        name: formData.name,
        email: formData.email,
        message: `【銀行API連携ツール 無料相談・デモ依頼】
会社名: ${formData.companyName || "未記入"}
担当者名: ${formData.name || "未記入"}
現在の管理戸数: ${formData.units || "未記入"}`,
      };
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        if (typeof window !== "undefined" && window.gtag_report_conversion) {
          window.gtag_report_conversion();
        }
        trackEvent("contact_submit", { page: "bank_api_integration" });
        setSubmitStatus({
          type: "success",
          message:
            data.message ||
            "お問い合わせを受け付けました。担当者よりご連絡いたします。",
        });
        setFormData(initialFormState);
      } else {
        trackEvent("bank_api_form_submit_error", {
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
      trackEvent("bank_api_form_submit_error", {
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
      {/* 1. ファーストビュー（Hero Area） */}
      <Section
        id="hero"
        className="pt-24 sm:pt-32 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white"
      >
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">
              銀行API連携｜家賃入金確認・消込自動化ツール
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight whitespace-pre-line drop-shadow-lg">
              毎月末の「通帳記帳」と「エクセル入力」、人力でやっていませんか？
            </h1>
            <h2 className="text-lg sm:text-xl leading-relaxed text-emerald-50 whitespace-pre-line">
              銀行API連携で、家賃の入金確認・消込作業を<strong className="text-2xl sm:text-3xl text-emerald-300">「毎月3分」</strong>に短縮します。
            </h2>
            <div className="space-y-2 text-base sm:text-lg text-emerald-50">
              <p>管理戸数100〜1,000戸の管理会社様専用。</p>
              <p>既存の管理ソフトはそのままに、「入金チェック」だけを自動化する安価なツール制作サービス。</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                onClick={() =>
                  trackEvent("heroclick", {
                    page: "bank_api_integration",
                    target: "#contact",
                    button: "primary",
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 font-semibold px-8 py-4 shadow-2xl hover:scale-[1.02] hover:bg-emerald-50 transition-transform"
              >
                まずは無料相談・デモ依頼（30秒で完了）
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. こんなお悩みありませんか？（Pain） */}
      <Section id="pain">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                こんなお悩みありませんか？
              </h2>
              <p className="text-slate-700">
                毎月の入金確認作業に時間を取られていませんか？
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "毎月25日〜末日は、通帳の記帳とExcelへの入力だけで半日潰れる。",
                "同姓同名の振込や、金額不足のチェックでミスが起きる。",
                "「誰がまだ払っていないか」を特定するのに時間がかかり、督促が遅れる。",
                "大手システムを導入しようとしたが、初期費用数百万と言われて諦めた。",
              ].map((pain, i) => (
                <Card key={i} className="border-l-4 border-red-500">
                  <p className="text-slate-900 text-sm leading-relaxed">{pain}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. 解決策・機能（Solution） */}
      <Section id="solution" className="bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                解決策・機能
              </h2>
              <p className="text-slate-700">
                難しいことはしない、シンプルだ
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-600 text-white p-3">
                    <Banknote className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    特徴1：銀行口座と直接つながる
                  </h3>
                </div>
                <p className="text-slate-800 text-sm leading-relaxed">
                  ネットバンキングのAPIを活用し、入金データを自動取得。手入力ミスをゼロにします。
                </p>
              </Card>
              <Card className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-600 text-white p-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    特徴2：今のExcel管理表を変えなくていい
                  </h3>
                </div>
                <p className="text-slate-800 text-sm leading-relaxed">
                  今お使いの契約者リスト（Excel/CSV）を読み込ませるだけ。高価な基幹システムの入れ替えは不要です。
                </p>
              </Card>
              <Card className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-600 text-white p-3">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    特徴3：未払い者を1秒で特定
                  </h3>
                </div>
                <p className="text-slate-800 text-sm leading-relaxed">
                  「誰が」「いくら足りないか」を瞬時に判定。チャット（LINE/Chatwork）やメールで、担当者に即座に通知します。
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. 開発費用（Price） */}
      <Section id="price">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                開発費用
              </h2>
              <p className="text-slate-700">
                見積もりのやり取りを省くため、価格を明示します
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-emerald-600">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-emerald-600" />
                    <h3 className="text-2xl font-bold text-slate-900">
                      パッケージ導入開発費
                    </h3>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-4">
                    <p className="text-4xl font-black text-emerald-600">
                      300,000円
                    </p>
                    <p className="text-sm text-slate-600 mt-2">（税別）〜</p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>御社の業務フローに合わせてカスタマイズ実装します</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>大手ベンダーの相場（100万〜）の1/3以下の価格です</span>
                    </li>
                  </ul>
                </div>
              </Card>
              <Card className="border-2 border-slate-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-slate-600" />
                    <h3 className="text-2xl font-bold text-slate-900">
                      保守運用サポート
                    </h3>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-4xl font-black text-slate-700">
                      15,000円
                    </p>
                    <p className="text-sm text-slate-600 mt-2">（税別）/月</p>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <span>サーバー維持</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <span>銀行仕様変更への対応</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <span>チャットでの技術サポート込み</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* 5. 開発者について（Authority） */}
      <Section id="authority" className="bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                開発者について
              </h2>
              <p className="text-slate-700">
                技術力のある法人として
              </p>
            </div>
            <Card className="border-2 border-emerald-200">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-emerald-600" />
                  <h3 className="text-2xl font-bold text-slate-900">
                    運営：合同会社Saeli
                  </h3>
                </div>
                <div className="bg-emerald-50 rounded-lg p-6 space-y-4">
                  <h4 className="text-lg font-semibold text-slate-900">
                    代表エンジニアプロフィール
                  </h4>
                  <ul className="space-y-2 text-slate-700 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>現役のGMOシステムエンジニアとして、金融・業務システムの開発に従事</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>「現場の事務員さんが説明書なしで使える分かりやすさ」をモットーに開発しています</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* 6. よくある質問（FAQ） */}
      <Section id="faq">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">
              よくある質問
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q. パソコンに詳しくないですが使えますか？
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed">
                  はい。デスクトップのアイコンをクリックする（またはチャットを見る）だけの設計にします。
                </p>
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q. どの銀行でも使えますか？
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed">
                  現在はGMOあおぞらネット銀行、住信SBIネット銀行などを推奨していますが、インターネットバンキング対応の銀行なら相談可能です。
                </p>
              </Card>
              <Card>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Q. セキュリティは大丈夫ですか？
                </h3>
                <p className="text-sm text-slate-800 leading-relaxed">
                  銀行が公式に提供するAPI（接続口）のみを使用します。暗証番号をお預かりすることはありません。
                </p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* 7. 最後のひと押し（Footer CTA） */}
      <Section id="contact" className="bg-gradient-to-b from-white to-emerald-50">
        <Container>
          <div className="max-w-3xl mx-auto text-slate-900">
            <Card className="border-emerald-100 shadow-xl">
              <div className="space-y-4 mb-8 text-center">
                <p className="text-sm font-semibold text-emerald-600">
                  無料相談・デモ依頼フォーム
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  まずは相談してみる
                </h3>
                <p className="text-base text-slate-700">
                  30秒で完了。担当者よりご連絡いたします。
                </p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    会社名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="株式会社○○不動産"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    担当者名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="山田 太郎"
                  />
                </div>
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
                    現在の管理戸数（任意）
                  </label>
                  <input
                    type="text"
                    name="units"
                    value={formData.units}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="例）300戸"
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
                    <div className="flex items-center gap-2">
                      {submitStatus.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                      <span>{submitStatus.message}</span>
                    </div>
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
                    <>
                      まずは相談してみる
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
            </Card>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}

