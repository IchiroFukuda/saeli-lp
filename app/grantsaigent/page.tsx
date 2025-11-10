"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Shield, Lock, Sparkles, FileText, Search, Clock, BarChart3, Users, CheckCircle2, Loader2 } from "lucide-react";
import Footer from "@/components/Footer";

// Googleタグのコンバージョン測定関数の型定義
declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
  }
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section = ({ id, className = "", children }: { id: string; className?: string; children: React.ReactNode }) => (
  <section id={id} className={`py-16 sm:py-24 ${className}`}>{children}</section>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-blue-100 bg-white shadow-md hover:shadow-lg transition-shadow p-6 ${className}`}>{children}</div>
);

const Feature = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <Card className="h-full">
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-2 shadow-md"><Icon className="h-5 w-5" /></div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{children}</p>
      </div>
    </div>
  </Card>
);

export default function HojokinLandingPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    // Googleタグのコンバージョン測定
    if (typeof window !== 'undefined' && window.gtag_report_conversion) {
      window.gtag_report_conversion();
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: data.message || "お問い合わせを受け付けました。ありがとうございます。",
        });
        // フォームをリセット
        setFormData({
          companyName: "",
          name: "",
          email: "",
          message: "",
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "送信に失敗しました。しばらくしてから再度お試しください。",
        });
      }
    } catch (error) {
      console.error('送信エラー:', error);
      setSubmitStatus({
        type: "error",
        message: "ネットワークエラーが発生しました。接続を確認して再度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/30 text-gray-900 selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <Section id="hero" className="pt-24 sm:pt-32 bg-gradient-to-b from-blue-600 via-blue-500 to-white">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
              補助金申請の手間を、<span className="text-blue-100">1/10に。</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-blue-50 leading-relaxed drop-shadow-md">
              面倒な制度調査・書類作成・提出管理を、AIが自動で整理。<br className="hidden sm:block" />
              中小企業・個人事業主の時間を、事業の本質に取り戻します。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://grantsaigent.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.gtag_report_conversion) {
                    window.gtag_report_conversion('https://grantsaigent.com');
                  }
                }}
                className="rounded-xl bg-white text-blue-600 px-8 py-4 text-base font-semibold hover:bg-blue-50 inline-flex items-center justify-center gap-2 shadow-xl transition-all hover:shadow-2xl hover:scale-105"
              >
                MVPを試す
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#testimonials"
                className="rounded-xl border-2 border-white text-white px-8 py-4 text-base font-semibold hover:bg-white/10 backdrop-blur-sm inline-flex items-center justify-center gap-2 transition-all"
              >
                導入事例を見る
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 1: 課題の提示 */}
      <Section id="problems" className="bg-blue-50/50">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
              補助金は「難しすぎる」から、取りこぼされている。
            </h2>
            <p className="mt-6 text-lg text-gray-700 leading-relaxed">
              日本には年間<span className="font-semibold text-blue-600">4万件以上の補助金・助成金</span>があります。
              <br className="hidden sm:block" />
              しかし、その多くは「探すのに時間がかかる」「申請書が難しい」「提出期限に間に合わない」といった理由で活用されていません。
              <br className="hidden sm:block" />
              本来もらえるはずの支援を逃している企業が、数え切れないほど存在します。
            </p>
          </div>
        </Container>
      </Section>

      {/* Section 2: 解決策の提示 */}
      <Section id="solution" className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
                AIが、補助金業務を最適化します。
              </h2>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                私たちのシステムは、AIが国・自治体・省庁の補助金情報を自動収集。
                <br className="hidden sm:block" />
                事業内容をもとに、該当する補助金を自動で抽出し、
                <br className="hidden sm:block" />
                テンプレート化された書類を数分で生成します。
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Feature icon={Search} title="最新の補助金データを自動更新">
                国・自治体・省庁の補助金情報を自動で収集し、最新の情報を常に提供します。
              </Feature>
              <Feature icon={Sparkles} title="対象条件をAIが判定">
                事業内容を入力するだけで、AIが該当する補助金を自動で抽出します。
              </Feature>
              <Feature icon={FileText} title="書類テンプレートを自動生成">
                申請に必要な書類をテンプレート化し、数分で生成できます。
              </Feature>
              <Feature icon={BarChart3} title="進捗をダッシュボードで一元管理">
                申請の進捗状況をダッシュボードで一元管理し、提出期限を逃しません。
              </Feature>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 3: 信頼・安全性訴求 */}
      <Section id="trust" className="bg-gradient-to-b from-blue-50 to-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
                「正確さ」と「信頼性」を最優先に設計。
              </h2>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                行政書士が監修した申請テンプレートと、
                <br className="hidden sm:block" />
                最新の制度データベースを基盤にしています。
                <br className="hidden sm:block" />
                補助金の正確なマッチングを担保するため、
                <br className="hidden sm:block" />
                制度改定の自動検知機能も搭載。
              </p>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-blue-700 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Lock className="h-5 w-5 text-blue-600" />
              <span className="font-medium">すべての通信はSSL暗号化。個人情報は安全に管理されます。</span>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center border-blue-200 hover:border-blue-300 transition-colors">
                <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center shadow-md">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-gray-900">行政書士監修</h4>
                <p className="text-sm text-gray-600">専門家による申請テンプレート</p>
              </Card>
              <Card className="text-center border-blue-200 hover:border-blue-300 transition-colors">
                <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center shadow-md">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-gray-900">自動検知機能</h4>
                <p className="text-sm text-gray-600">制度改定を自動で検知</p>
              </Card>
              <Card className="text-center border-blue-200 hover:border-blue-300 transition-colors">
                <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 w-14 h-14 mx-auto mb-3 flex items-center justify-center shadow-md">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-gray-900">SSL暗号化</h4>
                <p className="text-sm text-gray-600">安全なデータ管理</p>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 4: 実績・声 */}
      <Section id="testimonials" className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
                すでに多くの事業者が、時間を取り戻しています。
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-blue-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-gray-900">製造業</h4>
                    <p className="text-gray-700 leading-relaxed">
                      「これまで丸2日かかっていた申請準備が、わずか30分に。」
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="border-blue-200 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gradient-to-br from-blue-400 to-blue-500 p-3 shadow-md">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 text-gray-900">個人事業主</h4>
                    <p className="text-gray-700 leading-relaxed">
                      「申請書の言い回しをAIが自動補正。専門家に頼む必要がなくなった。」
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 5: CTA */}
      <Section id="cta" className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight drop-shadow-lg">
              申請業務を、自動化しませんか。
            </h2>
            <p className="mt-6 text-lg text-blue-50 leading-relaxed drop-shadow-md">
              GrantsAIgentで、
              <br className="hidden sm:block" />
              本業に集中できる時間を取り戻しましょう。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://grantsaigent.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.gtag_report_conversion) {
                    window.gtag_report_conversion('https://grantsaigent.com');
                  }
                }}
                className="rounded-xl bg-white text-blue-600 px-8 py-4 text-base font-semibold hover:bg-blue-50 inline-flex items-center justify-center gap-2 shadow-xl transition-all hover:shadow-2xl hover:scale-105"
              >
                MVPを試す
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  if (typeof window !== 'undefined' && window.gtag_report_conversion) {
                    e.preventDefault();
                    window.gtag_report_conversion('#contact');
                  }
                }}
                className="rounded-xl border-2 border-white text-white px-8 py-4 text-base font-semibold hover:bg-white/10 backdrop-blur-sm inline-flex items-center justify-center gap-2 transition-all"
              >
                導入のご相談はこちら
              </a>
            </div>
          </div>
        </Container>
      </Section>

      {/* Contact Section */}
      <Section id="contact" className="bg-blue-50/50">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card className="border-blue-200 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">お問い合わせ</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">会社名</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="例）○○工業株式会社"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">お名前 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="山田 太郎"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-gray-700 font-medium">メールアドレス <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="taro@example.co.jp"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-gray-700 font-medium">ご相談内容 <span className="text-red-500">*</span></label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="現状の課題や導入イメージなど"
                  />
                </div>
                {submitStatus.type && (
                  <div className={`md:col-span-2 p-4 rounded-xl ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}>
                    <div className="flex items-center gap-2">
                      {submitStatus.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-red-600">⚠</span>
                      )}
                      <span className="text-sm font-medium">{submitStatus.message}</span>
                    </div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 font-semibold hover:from-blue-700 hover:to-blue-600 shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> 送信中...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" /> 送信
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
