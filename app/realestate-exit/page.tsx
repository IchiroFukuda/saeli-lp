"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Handshake,
  Scale,
  Users2,
  Sparkles,
  Check,
  MessageSquare,
  Loader2,
  Quote,
} from "lucide-react";
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

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
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

const targetAudience = [
  "相続した実家が空き家で固定資産税だけ払っている",
  "売ろうとしたが買い手が付かないと言われた",
  "解体費が高くて動けない／遠方で現地に行けない",
  "業者に相談すると“売却前提”で話が進むのが不安",
];

const menuItems = [
  {
    title: "① 無料ヒアリング（15〜20分）",
    description:
      "物件の基本情報やこれまでの検討状況を整理。売り込みは行わず、判断材料を洗い出します。",
    points: [
      "所有者目線での課題棚卸し",
      "過去の相談履歴の整理",
      "意思決定に必要な情報の確認",
    ],
  },
  {
    title: "② 最適出口レポート（有料）",
    description:
      "売却・解体・寄付・保有を数字で比較し、いま一番合理的な選択肢を提示します。",
    points: [
      "周辺相場・放置コストの概算",
      "各シナリオのメリット／デメリット",
      "推奨アクションと実行手順",
    ],
  },
  {
    title: "③ 手続き・交渉サポート（任意）",
    description:
      "業者候補の整理から見積比較、専門家への相談準備まで伴走。紹介料は受け取りません。",
    points: [
      "業者／専門家リストアップ",
      "見積・条件の比較と着地案",
      "契約・交渉時の注意点整理",
    ],
  },
];

const processFlow = [
  {
    title: "無料オンライン相談",
    detail: "15〜20分で状況整理。売り込みなし。",
  },
  {
    title: "有料レポートのご提案",
    detail: "必要な方のみ。費用と進行方法をご説明。",
  },
  {
    title: "レポート納品",
    detail: "オンライン面談＋PDFで詳細を解説。",
  },
  {
    title: "具体的な動き方の相談",
    detail: "必要に応じて伴走サポートをご提供。",
  },
];

const faqs = [
  {
    q: "無料相談だけで終えてもいいですか？",
    a: "可能です。状況整理が目的で、売り込みは行いません。",
  },
  {
    q: "地方の物件でも対応できますか？",
    a: "可能です。オンライン完結で全国の空き家に対応します。",
  },
  {
    q: "不動産会社の紹介で手数料は発生しますか？",
    a: "業者からの紹介料・手数料は受け取りません。完全に所有者側の立場です。",
  },
  {
    q: "相続や税務の相談はできますか？",
    a: "一般的な整理まで対応し、必要に応じて専門家へ相談する際の準備を支援します。",
  },
];

const initialFormState = {
  name: "",
  email: "",
  city: "",
  propertyType: "",
  propertyStatus: "",
  concern: "",
};

const propertyTypes = ["戸建て", "土地", "マンション一室", "その他"];
const propertyStatuses = ["空き家", "賃貸中", "廃屋", "その他"];

export default function RealEstateExitLanding() {
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

  const trackEvent = (
    eventName: string,
    properties?: Record<string, any>
  ) => {
    waitForPostHog(() => {
      if (window.posthog) {
        window.posthog.capture(eventName, properties);
      }
    });
  };

  useEffect(() => {
    if (pageViewSentRef.current) return;

    trackEvent("pageview", { page: "realestate_exit" });
    pageViewSentRef.current = true;
  }, []);

  const buildFormEventPayload = () => ({
    property_type: formData.propertyType || "未選択",
    property_status: formData.propertyStatus || "未選択",
    has_city: Boolean(formData.city),
    has_concern: Boolean(formData.concern),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const composeMessage = () => {
    return [
      `【お住まい】${formData.city || "未入力"}`,
      `【物件種別】${formData.propertyType || "未選択"}`,
      `【現在の状況】${formData.propertyStatus || "未選択"}`,
      "",
      "【いちばん困っていること】",
      formData.concern || "未入力",
    ].join("\n");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    const eventPayload = buildFormEventPayload();
    trackEvent("propexit_form_submit_attempt", eventPayload);

    try {
      const payload = {
        companyName: formData.city || "個人",
        name: formData.name,
        email: formData.email,
        message: composeMessage(),
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (
          typeof window !== "undefined" &&
          typeof window.gtag_report_conversion === "function"
        ) {
          window.gtag_report_conversion();
        }
        trackEvent("contact_submit", { page: "realestate_exit", ...eventPayload });
        setSubmitStatus({
          type: "success",
          message:
            data.message ||
            "お問い合わせを受け付けました。24時間以内にご連絡いたします。",
        });
        setFormData(initialFormState);
      } else {
        trackEvent("propexit_form_submit_error", {
          ...eventPayload,
          status: response.status,
          error_message:
            data.error || "送信に失敗しました。しばらくしてから再度お試しください。",
          phase: "response_error",
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
      trackEvent("propexit_form_submit_error", {
        ...eventPayload,
        error_message:
          error instanceof Error ? error.message : "unknown_error",
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
              Neutral Real Estate Exit Consulting
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
              売れない・処分できない不動産の
              <br />
              「損を最小化する出口」を、中立の立場で設計します。
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed text-emerald-50">
              不動産会社でも買取業者でもない、所有者側だけに立つコンサルです。
              <br className="hidden sm:block" />
              売却・解体・寄付・保有…すべてをフラットに比較し、今いちばん合理的な一手を提示します。
              <br />
              （オンライン15〜20分｜首都圏在住の方向け／物件所在地は全国対応）
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#consult-form"
                onClick={() =>
                  trackEvent("heroclick", { page: "realestate_exit", target: "#consult-form", button: "primary" })
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 font-semibold px-8 py-4 shadow-2xl hover:scale-[1.02] hover:bg-emerald-50 transition-transform"
              >
                無料で状況を相談する
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#services"
                onClick={() =>
                  trackEvent("heroclick", { page: "realestate_exit", target: "#services", button: "secondary" })
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
              >
                サービス内容を見る
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="targets">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6 text-slate-900">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-4 py-1 text-sm font-semibold border border-emerald-100">
                <Users2 className="h-4 w-4" />
                想定ターゲット
              </p>
              <div className="space-y-4">
                {targetAudience.map((copy) => (
                  <div
                    key={copy}
                    className="flex items-start gap-3 text-base text-slate-900"
                  >
                    <Check className="h-5 w-5 text-emerald-500 mt-1" />
                    <p>{copy}</p>
                  </div>
                ))}
              </div>
            </div>
            <Card className="bg-slate-100 text-slate-900 border-slate-200 shadow-2xl">
              <div className="space-y-4">
                <p className="uppercase text-xs tracking-[0.3em] text-emerald-700">
                  DIFFERENTIATOR
                </p>
                <h3 className="text-2xl font-bold">
                  なぜ「中立」か。手数料ではなく相談料だけで成り立つ仕組み。
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-slate-900">
                  一般の不動産会社・買取業者・解体業者は、自社に利益が出る手段を提案しがちです。
                  私たちは業者からの手数料を一切受け取りません。報酬は依頼者からの相談料のみ。
                  だから、
                  <span className="font-semibold text-emerald-700">
                    「いまは動かない方が損が少ない」
                  </span>
                  という結論もはっきりお伝えします。
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-emerald-800">
                  <span className="inline-flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full border border-emerald-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    完全クライアント側
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full border border-emerald-100">
                    <Handshake className="h-4 w-4 text-emerald-600" />
                    売却前提なし
                  </span>
                  <span className="inline-flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full border border-emerald-100">
                    <Scale className="h-4 w-4 text-emerald-600" />
                    全選択肢を比較
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="services" className="bg-slate-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 text-slate-900">
            <p className="text-sm font-semibold text-emerald-600">SERVICE MENU</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              サービス内容（3メニュー）
            </h2>
            <p className="text-base sm:text-lg text-slate-900">
              オンライン完結で、遠方の空き家も全国対応。
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {menuItems.map((item) => (
              <Card key={item.title} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-900">{item.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-slate-900">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="pricing">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card className="space-y-6">
              <p className="text-sm font-semibold text-emerald-600">FLOW</p>
              <h3 className="text-2xl font-bold text-slate-900">料金・進め方</h3>
              <div className="space-y-5 text-slate-900">
                {processFlow.map((step, index) => (
                  <div key={step.title} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-semibold border border-emerald-100">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{step.title}</h4>
                      <p className="text-sm text-slate-900">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-transparent space-y-6">
              <div>
                <p className="text-sm font-semibold text-emerald-300">PRICING</p>
                <h3 className="text-2xl font-bold mt-2">料金</h3>
              </div>
              <div className="space-y-4 text-sm text-white">
                <div>
                  <p className="text-emerald-200 font-semibold">
                    最適出口レポート
                  </p>
                  <p className="text-3xl font-bold">30,000〜80,000円（税込）</p>
                  <p className="text-slate-200 mt-1">※1物件あたり</p>
                </div>
                <div>
                  <p className="text-emerald-200 font-semibold">
                    手続き・交渉サポート
                  </p>
                  <p className="text-lg font-semibold">個別見積り</p>
                  <p className="text-slate-200">
                    定額＋成果連動も可。案件の難易度に応じて設計します。
                  </p>
                </div>
              </div>
              <div className="text-xs text-emerald-200/80">
                不動産会社・買取業者・解体業者からの手数料は一切受け取りません（完全クライアント側）。
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="cta" className="bg-emerald-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6 text-slate-900">
            <p className="text-sm font-semibold text-emerald-600">CTA</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              いま動くべきかどうか。中立の立場で一緒に整理します。
            </h2>
            <p className="text-base sm:text-lg text-slate-900">
              無料ヒアリングで、意思決定に必要な情報を15分で棚卸し。オンライン完結で全国対応。
            </p>
            <a
              href="#consult-form"
              onClick={() =>
                trackEvent("ctaclick", { page: "realestate_exit", target: "#consult-form", button: "consult" })
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white px-10 py-4 font-semibold shadow-lg hover:bg-emerald-700 transition-all"
            >
              無料で状況を相談する
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </Container>
      </Section>

      <Section id="consult-types" className="bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 text-slate-900">
            <p className="text-sm font-semibold text-emerald-600">
              CONSULTATION OPTIONS
            </p>
            <h2 className="text-3xl font-bold">相談方法を選べます</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 text-slate-900">
            <Card className="space-y-4 h-full">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <ArrowRight className="h-4 w-4" />
                オンライン面談
              </div>
              <h3 className="text-xl font-semibold">15〜20分・カメラOFF可</h3>
              <p className="text-sm leading-relaxed">
                画面越しに状況整理。資料共有やその場での質疑応答が可能です。
              </p>
            </Card>
            <Card className="space-y-4 h-full">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <ArrowRight className="h-4 w-4" />
                チャット相談
              </div>
              <h3 className="text-xl font-semibold">メール / LINE（24時間以内に回答）</h3>
              <p className="text-sm leading-relaxed">
                非同期でやり取り。移動中や隙間時間でもご相談いただけます。
              </p>
            </Card>
            <Card className="space-y-4 h-full">
              <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <ArrowRight className="h-4 w-4" />
                匿名ヒアリング
              </div>
              <h3 className="text-xl font-semibold">概算の方針だけ確認</h3>
              <p className="text-sm leading-relaxed">
                個人情報を伏せたまま、取るべき方向性をざっくり把握できます。
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="case">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-4 text-slate-900">
              <p className="text-sm font-semibold text-emerald-600">MINI CASE</p>
              <h3 className="text-3xl font-bold text-slate-900">ミニ事例（プレースホルダ）</h3>
              <Card className="bg-slate-100 text-slate-900 border-slate-200">
                <div className="space-y-4 text-sm leading-relaxed text-slate-900">
                  <p className="font-semibold text-slate-900">
                    地方の古い戸建て（築37年／空き家）。
                    売却を試みるも反応なし。解体見積は高額。
                  </p>
                  <p>
                    10年放置の概算コストを算出し、
                    売却／賃貸に出す／解体＋更地売却／寄付を比較。
                  </p>
                  <p className="font-semibold text-slate-900">
                    結論：売却に出すことが最も損が少ないと判断。
                    具体的手順を整理し、実行へ。
                  </p>
                </div>
              </Card>
            </div>
            <Card className="space-y-4 text-slate-900">
              <Quote className="h-10 w-10 text-emerald-500" />
              <p className="text-lg text-slate-900 leading-relaxed">
                「業者ごとの提案がバラバラで決めきれなかったところ、数字で比較してもらったことで納得して進められました。」
              </p>
              <p className="text-sm text-slate-900">— オーナー様の声</p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="faq" className="bg-slate-50">
        <Container>
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-4 text-slate-900">
            <p className="text-sm font-semibold text-emerald-600">FAQ</p>
            <h2 className="text-3xl font-bold text-slate-900">よくある質問</h2>
            <p className="text-base text-slate-900">
              相談前によくいただくご質問を抜粋しました。
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4 text-slate-900">
            {faqs.map((faq) => (
              <Card key={faq.q} className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">{faq.q}</h3>
                <p className="text-sm text-slate-900">{faq.a}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="consult-form" className="bg-gradient-to-b from-white to-emerald-50">
        <Container>
          <div className="max-w-3xl mx-auto text-slate-900">
            <Card className="border-emerald-100 shadow-xl">
              <div className="space-y-6 mb-8 text-center text-slate-900">
                <p className="text-sm font-semibold text-emerald-600">
                  無料オンライン相談
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  首都圏在住で「地方の実家・空き家」をお持ちの方向け
                </h3>
                <p className="text-base text-slate-900">
                  物件所在地は全国対応。送信後、24時間以内に日程調整のご連絡を差し上げます。
                </p>
              </div>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    お名前 <span className="text-red-500">*</span>
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
                    お住まいの市区町村
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="例：東京都◯◯区"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      物件種別
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="">選択してください</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      現在の状況
                    </label>
                    <select
                      name="propertyStatus"
                      value={formData.propertyStatus}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    >
                      <option value="">選択してください</option>
                      {propertyStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900">
                    いちばん困っていること
                  </label>
                  <textarea
                    name="concern"
                    value={formData.concern}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="自由記述でご入力ください"
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
                    <>
                      <MessageSquare className="h-5 w-5" />
                      無料相談を申し込む
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-900">
                  送信ありがとうございます。24時間以内に日程調整のご連絡を差し上げます。
                </p>
              </form>
            </Card>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
