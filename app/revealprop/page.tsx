"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ArrowRight, Shield, AlertTriangle, Filter, X, TrendingDown, Building2, Calculator, MapPin, Clock, BarChart3, Users, CheckCircle2, Loader2, Link as LinkIcon, Layers, Zap } from "lucide-react";
import Footer from "@/components/Footer";

// Googleタグのコンバージョン測定関数の型定義
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

// APIレスポンスの型定義
interface ScoreResult {
  property_id: number;
  risk_score: number;
  p50_cost: number;
  p90_cost: number;
  factors: {
    age_score?: { value: number; note: string };
    structure_score?: { value: number; note: string };
    reform_adjustment?: { value: number; note: string };
    equipment_adjustment?: { value: number; note: string };
    region_score?: { value: number; note: string };
    keyword_score?: { value: number; hits?: number; keywords?: string[] };
    area_adjustment?: { value: number; note: string };
    final_risk_score: number;
  };
  version: string;
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section = ({ id, className = "", children }: { id: string; className?: string; children: React.ReactNode }) => (
  <section id={id} className={`py-16 sm:py-24 ${className}`}>{children}</section>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border-2 border-gray-300 bg-white shadow-md hover:shadow-lg transition-shadow p-6 ${className}`}>{children}</div>
);

const Feature = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <Card className="h-full">
    <div className="flex items-start gap-4">
      <div className="rounded-lg bg-red-600 text-white p-2 shadow-md"><Icon className="h-5 w-5" /></div>
      <div>
        <h4 className="text-lg font-bold text-gray-900">{title}</h4>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{children}</p>
      </div>
    </div>
  </Card>
);

export default function RevealPropLandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    propertyCount: "",
    portal: "",
    purpose: "",
  });
  const [urlInput, setUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string>("");
  const pageViewSentRef = useRef(false);

  // PostHogが初期化されるまで待つヘルパー関数
  const waitForPostHog = (callback: () => void, maxAttempts = 150) => {
    if (typeof window === 'undefined') return;
    
    let attempts = 0;
    const checkPostHog = () => {
      attempts++;
      const posthog = window.posthog;
      // PostHogが初期化完了しているか確認
      // __loadedフラグがtrueになるまで待つ必要がある
      const isReady = posthog && 
        typeof posthog.capture === 'function' &&
        posthog.__loaded === true;
      
      if (isReady) {
        try {
          callback();
          if (typeof posthog.flush === 'function') {
            posthog.flush();
          }
        } catch (error) {
          console.error('PostHog capture error:', error);
        }
      } else if (attempts < maxAttempts) {
        // まだ初期化中なので待つ
        setTimeout(checkPostHog, 100);
      } else {
        // タイムアウトした場合でも、captureメソッドが存在すれば送信を試みる
        if (posthog && typeof posthog.capture === 'function') {
          try {
            callback();
            if (typeof posthog.flush === 'function') {
              posthog.flush();
            }
          } catch (error) {
            console.error('PostHog capture error (fallback):', error);
          }
        }
      }
    };
    checkPostHog();
  };

  // 初回ページ表示時にイベントを送信（1回のみ）
  useEffect(() => {
    // React Strict Modeでの重複実行を防ぐ
    if (pageViewSentRef.current) return;
    
    waitForPostHog(() => {
      if (pageViewSentRef.current) return; // 念のため再度チェック
      
      pageViewSentRef.current = true;
      if (window.posthog) {
        window.posthog.capture('pageview', { page: 'revealprop' });
        
        if (typeof window.posthog.flush === 'function') {
          window.posthog.flush();
        }
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: "",
          name: formData.name,
          email: formData.email,
          message: `【RevealProp 先行登録】
所有物件数/検討件数: ${formData.propertyCount}
利用ポータル: ${formData.portal}
試したいこと: ${formData.purpose || "未記入"}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // フォーム送信成功時のみコンバージョンを計測
        if (typeof window !== 'undefined' && window.gtag_report_conversion) {
          window.gtag_report_conversion();
        }

        // PostHogにメール送信イベントを送信
        waitForPostHog(() => {
          if (window.posthog) {
            window.posthog.capture('contact_submit', {
              page: 'revealprop',
              property_count: formData.propertyCount,
              portal: formData.portal,
              purpose: formData.purpose || '未記入',
              email: formData.email, // メールアドレスも送信（必要に応じて匿名化）
            });
            if (typeof window.posthog.flush === 'function') {
              window.posthog.flush();
            }
          }
        });

        setSubmitStatus({
          type: "success",
          message: data.message || "お申し込みを受け付けました。ありがとうございます。",
        });
        // フォームをリセット
        setFormData({
          name: "",
          email: "",
          propertyCount: "",
          portal: "",
          purpose: "",
        });
      } else {
        // PostHogにエラーイベントを送信
        waitForPostHog(() => {
          if (window.posthog) {
            window.posthog.capture('revealprop_beta_signup_error', {
              error: data.error || '送信失敗',
            });
            if (typeof window.posthog.flush === 'function') {
              window.posthog.flush();
            }
          }
        });

        setSubmitStatus({
          type: "error",
          message: data.error || "送信に失敗しました。しばらくしてから再度お試しください。",
        });
      }
    } catch (error) {
      console.error('送信エラー:', error);
      
      // PostHogにエラーイベントを送信
      waitForPostHog(() => {
        if (window.posthog) {
          window.posthog.capture('revealprop_beta_signup_error', {
            error: 'ネットワークエラー',
            error_message: error instanceof Error ? error.message : 'Unknown error',
          });
          if (typeof window.posthog.flush === 'function') {
            window.posthog.flush();
          }
        }
      });

      setSubmitStatus({
        type: "error",
        message: "ネットワークエラーが発生しました。接続を確認して再度お試しください。",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section - FV */}
      <Section id="hero" className="pt-16 sm:pt-24 bg-white">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-gray-900">
              不動産業者の「大丈夫」を信じるな。<br />物件URLを貼るだけで、隠れたリスクを「値切り材料」に変える。
            </h1>
            <p className="mt-6 text-base sm:text-lg text-gray-700 leading-relaxed">
              表面利回りに騙されない。法的瑕疵・災害リスク・再建築不可をAIが瞬時にスコアリング。<br className="hidden sm:block" />
              あなたの投資を「ギャンブル」から「確実な仕入れ」へ。
            </p>
            
            {/* 体験デモフォーム */}
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
                <label className="block mb-3 text-gray-900 font-bold text-lg text-left">
                  物件情報のURLをここにペースト
                </label>
                <p className="text-xs text-gray-600 mb-4 text-left">
                  ※健美家（kenbiya.com）の物件URLに対応
                </p>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://www.kenbiya.com/pp2/k/shiga/maibara-shi/re_41560789kq/"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={async () => {
                    if (!urlInput.trim()) {
                      waitForPostHog(() => {
                        if (window.posthog) {
                          window.posthog.capture('heroclick', { page: 'revealprop', target: '#beta', button: 'beta', has_url: false });
                          if (typeof window.posthog.flush === 'function') {
                            window.posthog.flush();
                          }
                        }
                      });
                      window.location.href = '#beta';
                      return;
                    }

                    const urls = urlInput.trim().split('\n').filter(url => url.trim());
                    
                    if (urls.length === 0) {
                      setSubmitStatus({
                        type: "error",
                        message: "URLを入力してください。",
                      });
                      return;
                    }

                    setIsSubmitting(true);
                    setSubmitStatus({ type: null, message: "" });

                    try {
                      waitForPostHog(() => {
                        if (window.posthog) {
                          window.posthog.capture('url_submit', { 
                            page: 'revealprop', 
                            url_count: urls.length,
                            has_url: true
                          });
                          if (typeof window.posthog.flush === 'function') {
                            window.posthog.flush();
                          }
                        }
                      });

                      const targetUrl = urls[0];

                      // Cloud RunのAPI URLを使用（環境変数で上書き可能）
                      // ローカル開発時は .env.local に NEXT_PUBLIC_API_URL=http://localhost:8000 を設定
                      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://revealprop-api-kupzzphjna-an.a.run.app';
                      const apiUrl = `${apiBaseUrl}/v1/url-score`;

                      const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          url: targetUrl,
                        }),
                      });

                      const data = await response.json();

                      if (response.ok) {
                        waitForPostHog(() => {
                          if (window.posthog) {
                            window.posthog.capture('url_score_success', {
                              page: 'revealprop',
                              url_count: urls.length,
                              processed_count: 1,
                            });
                            if (typeof window.posthog.flush === 'function') {
                              window.posthog.flush();
                            }
                          }
                        });

                        setScoreResult(data as ScoreResult);
                        setProcessedUrl(targetUrl);
                        
                        if (urls.length > 1) {
                          setSubmitStatus({
                            type: "success",
                            message: `${urls.length}件のURLを入力されましたが、現在は1件ずつの判定のみ対応しています。最初のURLの判定が完了しました。`,
                          });
                        } else {
                          setSubmitStatus({
                            type: "success",
                            message: "物件の判定が完了しました。",
                          });
                        }
                        
                        setTimeout(() => {
                          const resultSection = document.getElementById('score-result');
                          if (resultSection) {
                            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }, 100);
                        
                      } else {
                        waitForPostHog(() => {
                          if (window.posthog) {
                            window.posthog.capture('url_score_error', {
                              page: 'revealprop',
                              error: data.error || 'APIエラー',
                              url_count: urls.length,
                            });
                            if (typeof window.posthog.flush === 'function') {
                              window.posthog.flush();
                            }
                          }
                        });

                        setSubmitStatus({
                          type: "error",
                          message: data.error || "判定に失敗しました。しばらくしてから再度お試しください。",
                        });
                      }
                    } catch (error) {
                      console.error('API呼び出しエラー:', error);
                      
                      waitForPostHog(() => {
                        if (window.posthog) {
                          window.posthog.capture('url_score_error', {
                            page: 'revealprop',
                            error: 'ネットワークエラー',
                            error_message: error instanceof Error ? error.message : 'Unknown error',
                          });
                          if (typeof window.posthog.flush === 'function') {
                            window.posthog.flush();
                          }
                        }
                      });

                      setSubmitStatus({
                        type: "error",
                        message: "ネットワークエラーが発生しました。接続を確認して再度お試しください。",
                      });
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  disabled={isSubmitting}
                  className="w-full mt-4 rounded-lg bg-red-600 text-white px-6 py-3 text-base font-bold hover:bg-red-700 shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> 解析中...
                    </>
                  ) : (
                    <>
                      この物件の「値引き材料」を抽出する
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
                {submitStatus.type && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}>
                    <div className="flex items-center gap-2">
                      {submitStatus.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">{submitStatus.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 結果表示セクション */}
      {scoreResult && (
        <Section id="score-result" className="bg-white py-16 border-t-4 border-red-600">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-black leading-tight text-gray-900 mb-4">
                  値引き材料抽出結果
                </h2>
                {processedUrl && (
                  <p className="text-sm text-gray-600 break-all">
                    <LinkIcon className="h-4 w-4 inline mr-1" />
                    {processedUrl}
                  </p>
                )}
              </div>
              
              {/* リスクスコア表示 */}
              <Card className="mb-6 border-2 border-red-600 bg-white">
                <div className="text-center mb-6">
                  <div className="text-6xl font-black mb-4" style={{
                    color: scoreResult.risk_score >= 80 ? '#059669' : 
                           scoreResult.risk_score >= 60 ? '#ea580c' : 
                           '#dc2626'
                  }}>
                    {scoreResult.risk_score}
                  </div>
                  <div className="text-2xl font-black text-gray-900 mb-4">値引き材料スコア</div>
                  <div className={`inline-block px-6 py-3 rounded-lg text-base font-bold border-2 ${
                    scoreResult.risk_score >= 80 ? 'bg-green-50 border-green-600 text-green-900' : 
                    scoreResult.risk_score >= 60 ? 'bg-orange-50 border-orange-600 text-orange-900' : 
                    'bg-red-50 border-red-600 text-red-900'
                  }`}>
                    {scoreResult.risk_score >= 80 ? '値引き材料少' : 
                     scoreResult.risk_score >= 60 ? '値引き材料中' : 
                     '値引き材料多'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 pt-6 border-t-2 border-gray-300">
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-2 font-medium">想定修繕費（中央値）</div>
                    <div className="text-2xl font-black text-gray-900">
                      ¥{scoreResult.p50_cost.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600 mb-2 font-medium">想定修繕費（90%tile）</div>
                    <div className="text-2xl font-black text-gray-900">
                      ¥{scoreResult.p90_cost.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>

              {/* 値引き材料（リスク項目） */}
              <Card className="border-2 border-gray-300 bg-white">
                <h3 className="text-2xl font-black mb-6 text-gray-900 border-b-4 border-red-600 pb-3">
                  値引き材料（発見されたリスク）
                </h3>
                <p className="text-sm text-gray-700 mb-4 font-medium">
                  これらのリスクを指摘することで、値引き交渉が可能になります。リスクスコアが高いほど、より強く値引きを主張できます。
                </p>
                <div className="space-y-4">
                  {scoreResult.factors.age_score && (
                    <div className="p-5 bg-gray-50 rounded-lg border-l-4 border-red-600">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-lg">築年数リスク</span>
                        <span className="text-xl font-black text-red-600">{scoreResult.factors.age_score.value}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{scoreResult.factors.age_score.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.structure_score && (
                    <div className="p-5 bg-gray-50 rounded-lg border-l-4 border-red-600">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-lg">構造リスク</span>
                        <span className="text-xl font-black text-red-600">{scoreResult.factors.structure_score.value}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{scoreResult.factors.structure_score.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.reform_adjustment && (
                    <div className="p-5 bg-gray-50 rounded-lg border-l-4 border-red-600">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-lg">リフォーム状況</span>
                        <span className="text-xl font-black text-red-600">{scoreResult.factors.reform_adjustment.value}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{scoreResult.factors.reform_adjustment.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.equipment_adjustment && (
                    <div className="p-5 bg-gray-50 rounded-lg border-l-4 border-red-600">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-lg">設備リスク</span>
                        <span className="text-xl font-black text-red-600">{scoreResult.factors.equipment_adjustment.value}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{scoreResult.factors.equipment_adjustment.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.region_score && (
                    <div className="p-5 bg-gray-50 rounded-lg border-l-4 border-red-600">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-lg">地域リスク</span>
                        <span className="text-xl font-black text-red-600">{scoreResult.factors.region_score.value}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{scoreResult.factors.region_score.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.keyword_score && (
                    <div className="p-5 bg-gray-50 rounded-lg border-l-4 border-red-600">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-lg">危険キーワード検出</span>
                        <span className="text-xl font-black text-red-600">{scoreResult.factors.keyword_score.value}</span>
                      </div>
                      {scoreResult.factors.keyword_score.hits !== undefined && (
                        <p className="text-sm text-gray-700 leading-relaxed">
                          検出数: {scoreResult.factors.keyword_score.hits}件
                          {scoreResult.factors.keyword_score.keywords && scoreResult.factors.keyword_score.keywords.length > 0 && (
                            <span className="ml-2 font-bold">（{scoreResult.factors.keyword_score.keywords.join('、')}）</span>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {scoreResult.factors.area_adjustment && (
                    <div className="p-5 bg-gray-50 rounded-lg border-l-4 border-red-600">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900 text-lg">面積リスク</span>
                        <span className="text-xl font-black text-red-600">{scoreResult.factors.area_adjustment.value}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{scoreResult.factors.area_adjustment.note}</p>
                    </div>
                  )}
                  
                  <div className="p-6 bg-red-50 rounded-lg border-4 border-red-600 mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-gray-900 text-xl">総合リスクスコア</span>
                      <span className="text-4xl font-black text-red-600">{scoreResult.factors.final_risk_score}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3 font-bold">
                      上記のリスクを指摘することで、「このリスクがあるから、値引きしてください」と交渉できます。
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      リスクスコアが高いほど、値引き交渉の材料として強く主張できます。
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
                  バージョン: {scoreResult.version} | 物件ID: {scoreResult.property_id}
                </div>
              </Card>
            </div>
          </Container>
        </Section>
      )}

      {/* 問題提起（The Problem） */}
      <Section id="problem" className="bg-gray-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8">
              なぜ、安くて利回りの良い物件ほど、購入後に「地獄」を見るのか？
            </h2>
            <div className="space-y-6 mt-10">
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">業者はリスクを隠す</h3>
                <p className="text-gray-700 leading-relaxed">
                  「DIYでなんとかなりますよ」という言葉の裏には、構造的な欠陥が隠れている。
                </p>
              </div>
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">見えない法的制限</h3>
                <p className="text-gray-700 leading-relaxed">
                  接道義務、セットバック、用途地域... 素人が気づかない「再建築不可」の罠。
                </p>
              </div>
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">出口のない恐怖</h3>
                <p className="text-gray-700 leading-relaxed">
                  買ったはいいが、売ることも貸すこともできない「負動産」化するリスク。
                </p>
              </div>
            </div>
            <div className="mt-10 text-center">
              <p className="text-lg font-bold text-gray-900">
                目利きの甘い投資家が、業者の在庫処分に使われています。
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 解決策（The Solution） */}
      <Section id="solution" className="bg-white py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8">
              AIが、その物件を「丸裸」にします。
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
                <div className="text-4xl font-black text-red-600 mb-4">1</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">URLを貼るだけ</h3>
                <p className="text-sm text-gray-600">
                  面倒な住所入力や謄本確認は不要。3秒で解析。
                </p>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
                <div className="text-4xl font-black text-red-600 mb-4">2</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">リスクの可視化</h3>
                <p className="text-sm text-gray-600">
                  災害、法令、市場価値など、人間が見落とすリスクを数値化。
                </p>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6 text-center">
                <div className="text-4xl font-black text-red-600 mb-4">3</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">指値の根拠提示</h3>
                <p className="text-sm text-gray-600">
                  「このリスクがあるから、あと200万下げられる」という交渉カードを提供。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ベネフィット（The Future） */}
      <Section id="benefits" className="bg-gray-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8">
              もう、ババを引く恐怖におびえる必要はありません。
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-600 mb-3">【防御】</h3>
                <p className="text-gray-700 leading-relaxed">
                  買ってはいけない「即死物件」を回避する。
                </p>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-600 mb-3">【攻撃】</h3>
                <p className="text-gray-700 leading-relaxed">
                  リスクを指摘し、強気な指値（値引き）を通す。
                </p>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-600 mb-3">【効率】</h3>
                <p className="text-gray-700 leading-relaxed">
                  1件1時間の調査時間を、3秒に短縮。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 権威性・開発ストーリー（Trust） */}
      <Section id="trust" className="bg-white py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8">
              私自身が、無知ゆえに「負動産」を買わされた被害者です。
            </h2>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 mt-10">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-gray-900">秋田の戸建てを売却しようとして絶望しました。</strong>再建築不可、修繕地獄、需要ゼロ。知識さえあれば、手を出さなかったのに...。
                </p>
                <p>
                  同じ悲劇を繰り返さないために、そして「負動産」を市場から浄化するために、私はエンジニアとしてこのツールを開発しました。
                </p>
                <p className="font-bold text-gray-900">
                  これは単なるツールではありません。不動産業界の情報の非対称性に立ち向かうための武器です。
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-300">
                <p className="text-sm font-bold text-gray-900">開発者 Saeli</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* オファー＆CTA */}
      <Section id="beta" className="bg-white py-16 sm:py-24 border-t-4 border-red-600">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black leading-tight text-gray-900 mb-6">
                まずは無料で、気になっている物件を「透視」してください。
              </h2>
              <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-4">オファー内容</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>基本機能は無料。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span>会員登録で詳細レポートが見放題。</span>
                  </li>
                </ul>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mb-8 font-medium">
                良い物件は一瞬で消えます。しかし、悪い物件をつかめば一生の後悔です。<br className="hidden sm:block" />
                契約書に判子を押す前に、必ず一度チェックしてください。
              </p>
            </div>
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">会員登録</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">お名前 <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="山田 太郎"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">メールアドレス <span className="text-red-600">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="taro@example.co.jp"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-gray-700 font-medium">試したいこと（任意）</label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border-2 border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="例）現在検討中の物件URLを判定したい、判定結果を参考にしたい など"
                  />
                </div>
                {submitStatus.type && (
                  <div className={`md:col-span-2 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}>
                    <div className="flex items-center gap-2">
                      {submitStatus.type === "success" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                      <span className="text-sm font-medium">{submitStatus.message}</span>
                    </div>
                  </div>
                )}
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-red-600 text-white px-6 py-4 text-base font-bold hover:bg-red-700 shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> 送信中...
                      </>
                    ) : (
                      <>
                        無料で今すぐリスク診断を始める
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </Section>


      {/* Footer */}
      <Footer />
    </div>
  );
}
