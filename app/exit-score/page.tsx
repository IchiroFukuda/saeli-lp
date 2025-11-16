"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Loader2,
} from "lucide-react";
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

const heroTitle = `訳あり物件の“現場出動”を最小化する。`;
const heroSubtitle = `難度スコアで、行く価値がある物件だけを絞り込む。`;
const heroDesc = `現場調査のムダを削り、判断をデジタル化するSaaS。`;

const initialFormState = {
  companyName: "",
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ExitScoreLanding() {
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

      // 定義が無ければスニペット互換の関数を用意
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

      // 直接gtagイベント送信（callback不要ケース）
      if (typeof window.gtag === "function") {
        window.gtag("event", "conversion", {
          send_to: sendTo,
          value: 1.0,
          currency: "JPY",
        });
        return;
      }

      // フォールバックで定義済み関数を呼ぶ
      window.gtag_report_conversion();
    } catch {
      // no-op
    }
  };

  useEffect(() => {
    if (pageViewSentRef.current) return;

    trackEvent("pageview", { page: "exit_score" });
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

  const composeMessage = () => {
    return [
      `【会社名】${formData.companyName || "未入力"}`,
      `【担当者】${formData.name || "未入力"}`,
      `【メール】${formData.email || "未入力"}`,
      `【電話】${formData.phone || "未入力"}`,
      "",
      "【想定している活用シーン】",
      formData.message || "未入力",
    ].join("\n");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });
    trackEvent("exit_score_form_submit_attempt");

    try {
      const payload = {
        companyName: formData.companyName || "未入力",
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
        reportGAdsConversion();
        trackEvent("contact_submit", { page: "exit_score" });
        setSubmitStatus({
          type: "success",
          message:
            data.message ||
            "送信を受け付けました。担当より24時間以内にご連絡します。",
        });
        setFormData(initialFormState);
      } else {
        trackEvent("exit_score_form_submit_error", {
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
      trackEvent("exit_score_form_submit_error", { phase: "network_error" });
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
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Exit Score｜訳あり物件の難度スコア</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
              {heroTitle}
            </h1>
            <h2 className="text-lg sm:text-xl leading-relaxed text-emerald-50">
              {heroSubtitle}
            </h2>
            <div className="space-y-2 text-base sm:text-lg text-emerald-50"><p>{heroDesc}</p></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#beta"
                onClick={() =>
                  trackEvent("heroclick", { page: "exit_score", target: "#beta", button: "primary" })
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 font-semibold px-8 py-4 shadow-2xl hover:scale-[1.02] hover:bg-emerald-50 transition-transform"
              >
                β版テスター登録
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#apply"
                onClick={() =>
                  trackEvent("heroclick", { page: "exit_score", target: "#apply", button: "secondary" })
                }
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 text-white px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
              >
                テスター応募フォーム
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="reason">
        <Container>
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">現場の負担が重い理由</h2>
            <p className="text-slate-700">現場に行かないと分からない情報が多すぎる</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-900">
              {["残置物","臭い","腐食","傾き","雨漏り","越境","売主ヒアリング"].map((item) => (
                <div key={item} className="rounded-xl bg-white border border-slate-100 px-4 py-3 text-sm">{item}</div>
              ))}
            </div>
            <p className="text-slate-600">これらは Google Mapでも図面でも分からない。<br />そして、行った結果「行く必要がなかった」と判明するケースが多い。</p>
          </div>
        </Container>
      </Section>

      <Section id="solution" className="bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">本サービスが解決すること</h2>
            </div>
            <div className="grid gap-6">
              <Card className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">行く前： “事前難度スコア” で出動を最適化</h3>
                <p className="text-slate-800">
                  物件URLを入力すると、立地・環境・再建築可否可能性などから
                  “行く価値があるか” を0〜100でスコア化。現場の優先順位が客観的に決まる。
                </p>
              </Card>
              <Card className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">行った後： 現場で10秒入力 → スコアが即更新</h3>
                <div className="text-slate-800 space-y-3">
                  <p>スマホで以下をタップするだけ：</p>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm">
                    {[
                      "残置：少 / 中 / 多",
                      "臭い：なし / 弱 / 強",
                      "腐食：なし / 表面 / 深刻",
                      "傾き：なし / 軽度 / 明確",
                      "雨漏り：なし / 跡あり / 進行",
                      "越境：なし / あり",
                    ].map((l) => (
                      <div key={l} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">{l}</div>
                    ))}
                  </div>
                  <p className="text-slate-800">
                    → “現場難度スコア” が瞬時に再計算される。<br />
                    「現場 → スコア → 意思決定」がその場で完結する。
                  </p>
                </div>
              </Card>
              <Card className="space-y-3">
                <h3 className="text-xl font-semibold text-slate-900">スコアは一行レビューで理解できる</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="font-semibold text-slate-900">総合難度：72（要注意）</p>
                    <p className="text-sm text-slate-800 mt-1">腐食レベル高め。残置多め。再生コスト上振れ見込み。</p>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <p className="font-semibold text-slate-900">総合難度：28（問題小）</p>
                    <p className="text-sm text-slate-800 mt-1">外観状態良好。再生難度低め。</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="who">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">どんな現場が得をする？</h2>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              {[
                { title: "訳あり買取業者", desc: "「行ってみないと分からない」負担が最も大きい層。" },
                { title: "空き家・ボロ戸建て再生業者", desc: "腐食・残置・近隣リスクの評価が重い。" },
                { title: "任意売却・相続案件の業者", desc: "売主ヒアリング＋現地判断の二重負担。" },
              ].map((b) => (
                <Card key={b.title} className="space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">{b.title}</h3>
                  <p className="text-slate-800 text-sm">{b.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="benefits" className="bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">導入メリット（数値想定）</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">現場9件 → 実際に必要なのは3件</h3>
                <p className="text-sm text-slate-800">出動コスト（1件あたり75〜120分）が大幅に削減される。</p>
              </Card>
              <Card className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">現場判断の“主観”をデジタル化</h3>
                <p className="text-sm text-slate-800">属人化を防ぐ。新人・アルバイトでも判断軸が揃う。</p>
              </Card>
              <Card className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">現場調査メモがクラウドに自動保存</h3>
                <p className="text-sm text-slate-800">写真・入力内容・難度スコアが統合される。</p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="ui">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">プロダクト画面イメージ（テキスト）</h2>
            <Card className="text-left space-y-3">
              <p className="font-semibold text-slate-900">物件難度スコア： 53</p>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-900">
                {[
                  "残置物量：   少 ○   中 ○   多 ○",
                  "臭い：       なし ○  弱い ○  強い ○",
                  "腐食：       なし ○  表面 ○  深刻 ○",
                  "傾き：       なし ○  軽度 ○  明確 ○",
                  "雨漏り：    なし ○  跡あり ○  進行 ○",
                  "越境：       なし ○  あり ○",
                ].map((l) => (
                  <div key={l} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">{l}</div>
                ))}
              </div>
              <div className="pt-2">
                <button className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-semibold">スコア再計算</button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="voices" className="bg-slate-50">
        <Container>
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center">ユーザーの声</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                "「現場に行く前に“これは危ない”が分かるので、\n1日3件が1日1件で済むようになりました。」",
                "「新人でも同じ判断軸で動ける。現場判断の属人化がなくなる。」",
                "「スマホで10秒だから、とりあえず押すだけでデータになる。」",
              ].map((v, i) => (
                <Card key={i} className="text-sm whitespace-pre-line text-slate-900">{v}</Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="beta" className="bg-emerald-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center space-y-6 text-slate-900">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">β版テスター募集</h2>
            <p className="text-base sm:text-lg text-slate-900">現場出動が多い事業者限定で、無料テスターを募集します。</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#apply"
                onClick={() => trackEvent("ctaclick", { page: "exit_score", target: "#apply", button: "beta" })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white px-10 py-4 font-semibold shadow-lg hover:bg-emerald-700 transition-all"
              >
                β版テスター登録
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#apply"
                onClick={() => trackEvent("ctaclick", { page: "exit_score", target: "#apply", button: "apply" })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 text-emerald-700 px-10 py-4 font-semibold hover:bg-white transition-all"
              >
                テスター応募フォーム
              </a>
            </div>
            <div className="grid md:grid-cols-3 gap-4 text-left">
              {["訳あり買取業者","再建築不可・空き家再生","任意売却・相続専門業者"].map((t) => (
                <Card key={t} className="text-slate-900 text-sm">{t}</Card>
              ))}
              <Card className="md:col-span-3 text-slate-900 text-sm">
                3社のみ、詳細ヒアリング＋優先導入枠をご用意。
              </Card>
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
                  テスター応募フォーム
                </p>
                <h3 className="text-3xl font-bold text-slate-900">
                  Exit Score βテスター
                </h3>
                <p className="text-base text-slate-900">
                  登録後、24時間以内にご連絡します。対象：現場出動が多い事業者さま。
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
                    placeholder="例：Exit不動産株式会社"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-900">
                      ご担当者名 <span className="text-red-500">*</span>
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
                      電話番号
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="ハイフンなし"
                    />
                  </div>
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
                    想定している活用シーン
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="現場出動の現状や改善したいKPIをご記載ください。"
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
                      テスター応募を送信
                    </>
                  )}
                </button>
              </form>
            </Card>
          </div>
        </Container>
      </Section>

      <Section id="last" className="bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">最後の訴求</h2>
            <p className="text-slate-800">現場の“感覚”を、デジタル化する。<br />あなたの判断を、スコアとして蓄積する。<br />現場出動のムダが消え、意思決定が速くなる。</p>
            <p className="text-slate-800">現場を回るすべての人に、時間と正確さを。</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#beta"
                onClick={() => trackEvent("ctaclick", { page: "exit_score", target: "#beta", button: "beta" })}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-white px-8 py-4 font-semibold shadow-lg hover:bg-emerald-700 transition-all"
              >
                β版テスター登録
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
