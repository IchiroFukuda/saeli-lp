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
  <div className={`rounded-2xl border border-indigo-100 bg-white shadow-md hover:shadow-lg transition-shadow p-6 ${className}`}>{children}</div>
);

const Feature = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <Card className="h-full">
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-2 shadow-md"><Icon className="h-5 w-5" /></div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
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
  const [showPricing, setShowPricing] = useState(false);
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50/30 text-gray-900 selection:bg-indigo-600 selection:text-white">
      {/* Hero Section */}
      <Section id="hero" className="pt-24 sm:pt-32 bg-gradient-to-b from-indigo-600 via-indigo-500 to-white">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
              買ってはいけない物件だけ、<br /><span className="text-indigo-100">教えます。</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-indigo-50 leading-relaxed drop-shadow-md">
              ポータルは「買わせるための情報」を並べる。
              <br className="hidden sm:block" />
              私たちは、その中から<strong className="text-white">「将来あなたのキャッシュフローを壊す物件」</strong>だけをあぶり出す。
              <br className="hidden sm:block" />
              <br className="hidden sm:block" />
              <strong className="text-white">物件URLを貼るだけで</strong>、負動産リスクを数値化し、即「外すべき候補」を判断できます。
            </p>
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
                <label className="block mb-2 text-gray-900 font-semibold text-lg">
                  物件URLを貼り付けてください
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  物件のURLを入力してください
                </p>
                <textarea
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://suumo.jp/chintai/jnc_00012345678/&#10;https://athome.jp/chintai/234-567890/"
                  rows={4}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none font-mono text-sm"
                />
                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!urlInput.trim()) {
                        // URLが入力されていない場合は登録ページに遷移
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

                        // 複数のURLがある場合は、最初の1つのみを処理する
                        // TODO: 将来的に複数URLの一括処理に対応する場合は実装を変更
                        const targetUrl = urls[0];

                        const response = await fetch('http://localhost:8000/v1/url-score', {
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
                          // 成功時の処理
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

                          // 結果を保存
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
                          
                          // 結果表示セクションにスクロール
                          setTimeout(() => {
                            const resultSection = document.getElementById('score-result');
                            if (resultSection) {
                              resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }
                          }, 100);
                          
                        } else {
                          // エラー時の処理
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
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 text-base font-semibold hover:from-indigo-700 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> 判定中...
                      </>
                    ) : (
                      <>
                        負動産スコアを判定
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  <a
                    href="#beta"
                    onClick={() => {
                      waitForPostHog(() => {
                        if (window.posthog) {
                          window.posthog.capture('heroclick', { page: 'revealprop', target: '#beta', button: 'beta', has_url: false });
                          if (typeof window.posthog.flush === 'function') {
                            window.posthog.flush();
                          }
                        }
                      });
                    }}
                    className="rounded-xl bg-white text-indigo-600 px-6 py-3 text-base font-semibold hover:bg-indigo-50 inline-flex items-center justify-center gap-2 shadow-lg border-2 border-indigo-200 transition-all hover:shadow-xl"
                  >
                    登録する
                  </a>
                </div>
                {submitStatus.type && (
                  <div className={`mt-4 p-4 rounded-xl ${
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
        <Section id="score-result" className="bg-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900 text-center mb-4">
                  判定結果
                </h2>
                {processedUrl && (
                  <p className="text-sm text-gray-600 text-center break-all">
                    <LinkIcon className="h-4 w-4 inline mr-1" />
                    {processedUrl}
                  </p>
                )}
              </div>
              
              <Card className="mb-6 border-2 border-indigo-300">
                <div className="text-center mb-6">
                  <div className="text-5xl font-extrabold mb-2" style={{
                    color: scoreResult.risk_score >= 80 ? '#16a34a' : 
                           scoreResult.risk_score >= 60 ? '#ea580c' : 
                           '#dc2626'
                  }}>
                    {scoreResult.risk_score}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">負動産スコア</div>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    scoreResult.risk_score >= 80 ? 'bg-green-100 text-green-800' : 
                    scoreResult.risk_score >= 60 ? 'bg-orange-100 text-orange-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {scoreResult.risk_score >= 80 ? '構造的な大きな地雷要素は少ない（要詳細確認）' : 
                     scoreResult.risk_score >= 60 ? '注意。特定のリスク要因あり（条件次第ではアウト）' : 
                     '負動産候補（原則として検討から外すことを推奨）'}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">想定修繕費（中央値）</div>
                    <div className="text-xl font-bold text-gray-900">
                      ¥{scoreResult.p50_cost.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">想定修繕費（90%tile）</div>
                    <div className="text-xl font-bold text-gray-900">
                      ¥{scoreResult.p90_cost.toLocaleString()}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-indigo-200">
                <h3 className="text-xl font-bold mb-4 text-gray-900">スコア詳細</h3>
                <div className="space-y-4">
                  {scoreResult.factors.age_score && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">築年数スコア</span>
                        <span className="text-lg font-bold text-indigo-600">{scoreResult.factors.age_score.value}</span>
                      </div>
                      <p className="text-sm text-gray-600">{scoreResult.factors.age_score.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.structure_score && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">構造スコア</span>
                        <span className="text-lg font-bold text-indigo-600">{scoreResult.factors.structure_score.value}</span>
                      </div>
                      <p className="text-sm text-gray-600">{scoreResult.factors.structure_score.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.reform_adjustment && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">リフォーム調整</span>
                        <span className="text-lg font-bold text-indigo-600">{scoreResult.factors.reform_adjustment.value}</span>
                      </div>
                      <p className="text-sm text-gray-600">{scoreResult.factors.reform_adjustment.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.equipment_adjustment && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">設備調整</span>
                        <span className="text-lg font-bold text-indigo-600">{scoreResult.factors.equipment_adjustment.value}</span>
                      </div>
                      <p className="text-sm text-gray-600">{scoreResult.factors.equipment_adjustment.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.region_score && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">地域スコア</span>
                        <span className="text-lg font-bold text-indigo-600">{scoreResult.factors.region_score.value}</span>
                      </div>
                      <p className="text-sm text-gray-600">{scoreResult.factors.region_score.note}</p>
                    </div>
                  )}
                  
                  {scoreResult.factors.keyword_score && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">キーワードスコア</span>
                        <span className="text-lg font-bold text-indigo-600">{scoreResult.factors.keyword_score.value}</span>
                      </div>
                      {scoreResult.factors.keyword_score.hits !== undefined && (
                        <p className="text-sm text-gray-600">
                          ヒット数: {scoreResult.factors.keyword_score.hits}
                          {scoreResult.factors.keyword_score.keywords && scoreResult.factors.keyword_score.keywords.length > 0 && (
                            <span className="ml-2">（{scoreResult.factors.keyword_score.keywords.join(', ')}）</span>
                          )}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {scoreResult.factors.area_adjustment && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-gray-900">面積調整</span>
                        <span className="text-lg font-bold text-indigo-600">{scoreResult.factors.area_adjustment.value}</span>
                      </div>
                      <p className="text-sm text-gray-600">{scoreResult.factors.area_adjustment.note}</p>
                    </div>
                  )}
                  
                  <div className="p-4 bg-indigo-50 rounded-lg border-2 border-indigo-200">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-900">最終リスクスコア</span>
                      <span className="text-2xl font-bold text-indigo-600">{scoreResult.factors.final_risk_score}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">
                  バージョン: {scoreResult.version} | 物件ID: {scoreResult.property_id}
                </div>
              </Card>
            </div>
          </Container>
        </Section>
      )}

      {/* Section 1: 対象ユーザー（絞り込み） */}
      <Section id="target" className="bg-indigo-50/50">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
                こんな人のためのツールです
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-indigo-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-md">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">プロの投資家</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      すでに1棟・複数戸を保有しており、次の一手を慎重に選びたい投資家様
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="border-indigo-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-md">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">不動産投資を検討中の方</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      修繕・空室・出口リスクを事前に診断し、失敗リスクを最小化したい投資家様
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="border-indigo-200 hover:border-indigo-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 shadow-md">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900">プロフェッショナル</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      顧客に物件提案する立場として、「地雷を避ける根拠」が欲しいプロの仲介・コンサル様
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-700 font-medium">
                不動産をおすすめするツールではありません。
                <br />
                <strong className="text-indigo-600">「失敗する物件を見極めたい」方だけに向けたフィルターです。</strong>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 2: 提供価値（What you get） */}
      <Section id="value" className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
                RevealProp がやることは一つだけ
              </h2>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                気になっている物件の中から、
                <br className="hidden sm:block" />
                <strong className="text-indigo-600">「将来マイナスを生む可能性が高い候補」を先に落とす。</strong>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              <Card className="text-center border-indigo-200">
                <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
                  <Layers className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-gray-900">URL判定</h4>
                <p className="text-sm text-gray-600">物件URLを貼って、即座に判定</p>
              </Card>
              <Card className="text-center border-indigo-200">
                <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-gray-900">負動産スコア</h4>
                <p className="text-sm text-gray-600">各物件の負動産スコア（0〜100）</p>
              </Card>
              <Card className="text-center border-indigo-200">
                <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-gray-900">危険シグナル一覧</h4>
                <p className="text-sm text-gray-600">スコア項目ごとの詳細な危険フラグ</p>
              </Card>
              <Card className="text-center border-indigo-200">
                <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2 text-gray-900">判定コメント</h4>
                <p className="text-sm text-gray-600">「検討中止」または「追加確認事項」の簡潔な判定</p>
              </Card>
            </div>
            <div className="mt-12 text-center">
              <p className="text-lg text-gray-700 leading-relaxed">
                良い物件を探す作業ではなく、
                <br className="hidden sm:block" />
                <strong className="text-indigo-600">悪い物件を避けるフィルターを提供します。</strong>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 3: 使い方（シンプル 3 ステップ） */}
      <Section id="howto" className="bg-gradient-to-b from-indigo-50 to-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
                使い方（シンプル 3 ステップ）
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card className="border-indigo-200">
                <div className="text-center mb-4">
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center shadow-md">
                    <Layers className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-900">物件URLを貼る</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    ポータルや販売資料から気になっている物件のURLを、<strong className="font-semibold text-gray-900">入力</strong>するだけで、即座に判定できます。
                  </p>
                </div>
              </Card>
              <Card className="border-indigo-200">
                <div className="text-center mb-4">
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center shadow-md">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-900">数秒で負動産スコアと危険フラグを返す</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    公開情報と一般的な修繕・運営データをもとに、<strong className="font-semibold text-gray-900">即座に分析</strong>。判定結果をすぐに確認できます。
                  </p>
                </div>
              </Card>
              <Card className="border-indigo-200">
                <div className="text-center mb-4">
                  <div className="rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 w-14 h-14 mx-auto mb-4 flex items-center justify-center shadow-md">
                    <Filter className="h-7 w-7 text-white" />
                  </div>
                  <h4 className="font-semibold mb-2 text-gray-900">判定結果から検討継続を判断</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    負動産スコアを<strong className="font-semibold text-gray-900">確認</strong>。一定以下の物件は検討から除外し、高スコアの物件のみ詳細確認に進みます。
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 4: 既存ツールとの違い */}
      <Section id="difference" className="bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
                既存ツールとの違い
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-gray-300">
                <h4 className="font-semibold mb-4 text-gray-900 text-lg">他サービス</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">利回りシミュレーション</p>
                    <p className="text-sm text-gray-600">利回りは見えるが、どれを買うべきでないかは見えづらい</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">インスペクション</p>
                    <p className="text-sm text-gray-600">深いが高い・遅い。候補が絞れてからの最終確認用</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">売り手・金融機関のAI</p>
                    <p className="text-sm text-gray-600">自社都合が混ざる</p>
                  </div>
                </div>
              </Card>
              <Card className="border-2 border-indigo-500 bg-gradient-to-br from-indigo-100 via-indigo-50 to-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/30 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative">
                  <h4 className="font-semibold mb-4 text-gray-900 text-lg flex items-center gap-2">
                    <div className="rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 p-1.5 shadow-md">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">RevealProp</span>
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">簡易判定</p>
                      <p className="text-sm text-gray-600">URLを貼るだけで即座に判定。手間が不要</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">買い手専用判定</p>
                      <p className="text-sm text-gray-600">広告・仲介と利害を持たない<strong className="text-indigo-600">「買い手専用」判定</strong></p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">厳しめのスコア</p>
                      <p className="text-sm text-gray-600">スコアは厳しめ。赤なら「検討から外す前提」で作る</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 5: 負動産スコアの軸（MVP版） */}
      <Section id="score" className="bg-indigo-50/50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900">
                負動産スコアの軸（MVP版）
              </h2>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                負動産スコアは、公開情報と一般的な修繕・運営データをもとに以下を評価します。
                <br className="hidden sm:block" />
                <span className="text-sm text-gray-600">（初期MVP想定）</span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Feature icon={TrendingDown} title="表面利回りの罠">
                想定経費率が明らかに低すぎるケース。固定費（管理費・共用電気・清掃）を踏まえた実質利回り乖離を検出。
              </Feature>
              <Feature icon={Building2} title="築年数 × 構造 × 将来CAPEX">
                木造・軽量鉄骨の築古、大規模修繕時期が近いRC、エレベーター・屋上防水・配管など高額修繕のカウントダウンを評価。
              </Feature>
              <Feature icon={Users} title="戸数・スケール">
                極端に戸数が少ない一棟もの、固定費に対して戸数が支えきれない構造を検出。
              </Feature>
              <Feature icon={MapPin} title="エリア賃料相場との乖離">
                提示賃料が相場より不自然に高い、想定家賃下落を織り込むとCFが即死するケースを判定。
              </Feature>
              <Feature icon={X} title="空室・募集履歴">
                常時多数空室・長期掲載、写真・間取りから見える「決まりにくい要因」を分析。
              </Feature>
              <Feature icon={Calculator} title="管理・積立情報">
                管理費・修繕積立金が明らかに不足気味、共用部の負債を将来背負わされるリスク（区分）を評価。
              </Feature>
              <Feature icon={AlertTriangle} title="出口リスク">
                流通性の低いエリア・間取り・特殊仕様、売却時に買い手がつきにくい要因を検出。
              </Feature>
            </div>
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 text-center">スコア例</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-green-300 bg-green-50/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-700 mb-2">80〜100</div>
                    <p className="text-sm text-gray-700 font-medium">構造的な大きな地雷要素は少ない</p>
                    <p className="text-xs text-gray-600 mt-2">（要詳細確認）</p>
                  </div>
                </Card>
                <Card className="border-orange-300 bg-orange-50/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-700 mb-2">60〜79</div>
                    <p className="text-sm text-gray-700 font-medium">注意。特定のリスク要因あり</p>
                    <p className="text-xs text-gray-600 mt-2">（条件次第ではアウト）</p>
                  </div>
                </Card>
                <Card className="border-red-300 bg-red-50/30">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-700 mb-2">0〜59</div>
                    <p className="text-sm text-gray-700 font-medium">負動産候補</p>
                    <p className="text-xs text-gray-600 mt-2">（原則として検討から外すことを推奨）</p>
                  </div>
                </Card>
              </div>
              <p className="mt-6 text-sm text-gray-600 text-center">
                ※MVP段階では「参考指標」。将来は実データと連動してモデル精度を継続改善。
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Section 6: 先行登録セクション */}
      <Section id="beta" className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 text-white relative overflow-hidden">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold leading-tight drop-shadow-lg">
                今すぐ試す
              </h2>
              <p className="mt-6 text-lg text-indigo-50 leading-relaxed drop-shadow-md">
                個人投資家・不動産買取事業者・不動産コンサル様向けに、
                <br className="hidden sm:block" />
                負動産スコアを無料で提供します。
                <br className="hidden sm:block" />
                実際に試してみたい方はこちらからご登録ください。
              </p>
            </div>
            <Card className="border-indigo-300 bg-white text-gray-900 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">参加する</h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">お名前 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="山田 太郎"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">メールアドレス <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
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
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="例）現在検討中の物件URLを判定したい、判定結果を参考にしたい など"
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
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-6 py-3 font-semibold hover:from-indigo-700 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" /> 送信中...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-5 w-5" /> 参加する
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Section 7: 料金プラン */}
      <Section id="pricing" className="bg-indigo-50/50">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900 mb-6">
              料金プラン
            </h2>
            {!showPricing ? (
              <>
                <Card className="border-indigo-200 shadow-lg mb-6">
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    期間中は<strong className="text-indigo-600">無料でご利用いただけます</strong>（件数制限あり）。
                    <br className="hidden sm:block" />
                    本提供時も、ご利用規模に応じたシンプルな月額制のみを予定しています。
                  </p>
                  <button
                    onClick={() => {
                      waitForPostHog(() => {
                        if (window.posthog) {
                          window.posthog.capture('ctaclick', { page: 'revealprop', target: 'pricing', button: 'show_pricing' });
                          if (typeof window.posthog.flush === 'function') {
                            window.posthog.flush();
                          }
                        }
                      });
                      setShowPricing(true);
                    }}
                    className="rounded-xl bg-white text-indigo-600 px-8 py-4 text-base font-semibold hover:bg-indigo-50 inline-flex items-center justify-center gap-2 shadow-xl transition-all hover:shadow-2xl hover:scale-105"
                  >
                    料金プランを見る
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Card>
              </>
            ) : (
              <Card className="border-indigo-200 shadow-lg">
                <p className="text-lg text-gray-700 leading-relaxed">
                  料金表は現在準備中です
                </p>
              </Card>
            )}
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
