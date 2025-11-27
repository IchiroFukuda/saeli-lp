"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ArrowRight, Shield, AlertTriangle, Calculator, Clock, BarChart3, Users, CheckCircle2, Loader2, TrendingUp, Building2, FileText, Zap, Target, Award } from "lucide-react";
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

// 修繕費見積もり計算器の定数データ
const COST_RATES = {
  EQUIPMENT: 0.55, // 設備系：値引率が高い（定価の約5〜6割が相場）
  CONSTRUCTION: 0.85, // 建築・労務系：値引率が低い（人件費メインなので8〜9割が相場）
};

interface RepairItem {
  id: string;
  category: string;
  label: string;
  basePrice: number;
  rateType: 'EQUIPMENT' | 'CONSTRUCTION';
  unit: string;
  note?: string;
}

const REPAIR_ITEMS: RepairItem[] = [
  { id: 'unit_bath', category: 'bath', label: 'ユニットバス交換（1216サイズ）', basePrice: 1072000, rateType: 'EQUIPMENT', unit: '式', note: '解体・撤去・処分費含む' },
  { id: 'water_heater', category: 'bath', label: '給湯器交換（16号・追焚付）', basePrice: 438000, rateType: 'EQUIPMENT', unit: '台' },
  { id: 'wash_basin', category: 'sanitary', label: '洗面化粧台交換（W600）', basePrice: 244000, rateType: 'EQUIPMENT', unit: '台' },
  { id: 'wallpaper', category: 'interior', label: 'クロス張替え（量産品）', basePrice: 1400, rateType: 'CONSTRUCTION', unit: 'm²' },
  { id: 'floor_cf', category: 'interior', label: 'CFシート張替え', basePrice: 4500, rateType: 'CONSTRUCTION', unit: 'm²' },
  { id: 'kitchen_block', category: 'kitchen', label: 'キッチン交換（公団型・W1800）', basePrice: 180000, rateType: 'EQUIPMENT', unit: '台', note: 'プロパンガス会社貸与なら無料になる可能性あり' },
  { id: 'toilet_washlet', category: 'toilet', label: '温水洗浄便座本体＋設置', basePrice: 60000, rateType: 'EQUIPMENT', unit: '台', note: '便器ごとの交換ではなく便座のみ' },
  { id: 'tatami', category: 'interior', label: '畳 表替え', basePrice: 6000, rateType: 'CONSTRUCTION', unit: '枚', note: '6畳間＝6枚' },
  { id: 'ac_new', category: 'aircon', label: 'エアコン新品設置（6畳用）', basePrice: 90000, rateType: 'EQUIPMENT', unit: '台' },
  { id: 'cleaning', category: 'cleaning', label: 'ルームクリーニング（一式）', basePrice: 45000, rateType: 'CONSTRUCTION', unit: '式', note: '2DK〜3DK想定' },
  { id: 'exterior_painting', category: 'exterior', label: '外壁・屋根塗装（一式）', basePrice: 1100000, rateType: 'CONSTRUCTION', unit: '式' },
];

const getEstimatedPrice = (item: RepairItem): number => {
  const rate = COST_RATES[item.rateType];
  return Math.floor((item.basePrice * rate) / 100) * 100;
};

// 修繕費見積もり計算器コンポーネント
function RepairCostEstimatorSection() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
      const newQuantities = { ...quantities };
      delete newQuantities[itemId];
      setQuantities(newQuantities);
    } else {
      newSelected.add(itemId);
      setQuantities({ ...quantities, [itemId]: 1 });
    }
    setSelectedItems(newSelected);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    setQuantities({ ...quantities, [itemId]: quantity });
  };

  const calculateTotal = (): number => {
    let total = 0;
    selectedItems.forEach(itemId => {
      const item = REPAIR_ITEMS.find(i => i.id === itemId);
      if (item) {
        const quantity = quantities[itemId] || 1;
        const unitPrice = getEstimatedPrice(item);
        total += unitPrice * quantity;
      }
    });
    return total;
  };

  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString()}`;
  };

  const itemsByCategory = REPAIR_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as { [key: string]: RepairItem[] });

  const categoryLabels: { [key: string]: string } = {
    bath: '浴室・給湯',
    sanitary: '衛生設備',
    kitchen: 'キッチン',
    toilet: 'トイレ',
    interior: '内装',
    aircon: '空調設備',
    cleaning: 'クリーニング',
    exterior: '外装工事',
  };

  return (
    <Section id="calculator" className="bg-gray-50 py-16 sm:py-24">
      <Container>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              修繕費見積もり計算器
            </h2>
            <p className="text-lg text-gray-600">
              修繕項目を選択すると、ざっくりとした修繕費が表示されます
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 修繕項目一覧 */}
            <div className="lg:col-span-2 bg-white rounded-lg border-2 border-gray-300 p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                修繕項目を選択
              </h3>
              
              <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
                {Object.entries(itemsByCategory).map(([category, items]) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-3">
                      {categoryLabels[category] || category}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {items.map((item) => {
                        const isSelected = selectedItems.has(item.id);
                        const estimatedPrice = getEstimatedPrice(item);
                        
                        return (
                          <div
                            key={item.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-red-600 bg-red-50 shadow-md'
                                : 'border-gray-300 bg-gray-50 hover:border-red-400 hover:bg-red-50/50'
                            }`}
                            onClick={() => toggleItem(item.id)}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleItem(item.id)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                              />
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900 text-sm">{item.label}</div>
                                {item.note && (
                                  <div className="text-xs text-gray-600 mt-1">{item.note}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-baseline gap-2 pt-3 border-t border-gray-200">
                              <span className="text-xs text-gray-600">見積価格:</span>
                              <span className="text-lg font-bold text-red-600">{formatCurrency(estimatedPrice)}</span>
                              <span className="text-xs text-gray-500">/{item.unit}</span>
                            </div>
                            {isSelected && (
                              <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                                <label className="block text-xs text-gray-600 mb-2 font-medium">数量:</label>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    className="w-8 h-8 border border-gray-300 bg-white rounded text-red-600 font-bold hover:bg-red-600 hover:text-white transition-colors"
                                    onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) - 1)}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    className="w-16 h-8 border border-gray-300 rounded text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={quantities[item.id] || 1}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                    min="1"
                                  />
                                  <button
                                    type="button"
                                    className="w-8 h-8 border border-gray-300 bg-white rounded text-red-600 font-bold hover:bg-red-600 hover:text-white transition-colors"
                                    onClick={() => updateQuantity(item.id, (quantities[item.id] || 1) + 1)}
                                  >
                                    +
                                  </button>
                                  <span className="text-xs text-gray-600 ml-1">{item.unit}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 見積もり結果 */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="bg-white rounded-lg border-2 border-red-600 p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b-2 border-gray-200">
                  見積もり合計
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 mb-2">合計金額</div>
                  <div className="text-3xl font-bold text-red-600">{formatCurrency(calculateTotal())}</div>
                </div>
                
                {selectedItems.size > 0 ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">内訳</h4>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {Array.from(selectedItems).map(itemId => {
                        const item = REPAIR_ITEMS.find(i => i.id === itemId);
                        if (!item) return null;
                        const quantity = quantities[itemId] || 1;
                        const unitPrice = getEstimatedPrice(item);
                        const subtotal = unitPrice * quantity;
                        
                        return (
                          <div key={itemId} className="flex justify-between items-center bg-gray-50 rounded p-3">
                            <div className="flex-1 text-sm text-gray-700">
                              {item.label} × {quantity}{item.unit}
                            </div>
                            <div className="text-sm font-semibold text-gray-900 ml-2">
                              {formatCurrency(subtotal)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    修繕項目を選択してください
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default function RevealPropProLandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const pageViewSentRef = useRef(false);

  // PostHogが初期化されるまで待つヘルパー関数
  const waitForPostHog = (callback: () => void, maxAttempts = 150) => {
    if (typeof window === 'undefined') return;
    
    let attempts = 0;
    const checkPostHog = () => {
      attempts++;
      const posthog = window.posthog;
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
        setTimeout(checkPostHog, 100);
      } else {
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
    if (pageViewSentRef.current) return;
    
    waitForPostHog(() => {
      if (pageViewSentRef.current) return;
      
      pageViewSentRef.current = true;
      if (window.posthog) {
        window.posthog.capture('pageview', { page: 'revealprop-pro' });
        
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
          companyName: formData.company,
          name: formData.name,
          email: formData.email,
          message: `【RevealProp Pro β版登録】
会社名: ${formData.company || "未記入"}`,
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
            window.posthog.capture('revealprop_pro_signup', {
              page: 'revealprop-pro',
              company: formData.company || '未記入',
              email: formData.email,
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
          company: "",
        });
      } else {
        waitForPostHog(() => {
          if (window.posthog) {
            window.posthog.capture('revealprop_pro_signup_error', {
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
      
      waitForPostHog(() => {
        if (window.posthog) {
          window.posthog.capture('revealprop_pro_signup_error', {
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
      <Section id="hero" className="pt-16 sm:pt-24 bg-gradient-to-br from-slate-900 via-slate-800 to-red-900 text-white">
        <Container>
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_8px_rgba(0,0,0,0.9)]">
              「修繕費がわからない」という理由での<span className="text-lime-400 drop-shadow-[0_0_20px_rgba(132,204,22,0.8)] [text-shadow:_0_0_30px_rgba(132,204,22,0.9)]">失注を、ゼロにする。</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl lg:text-2xl text-red-50/90 leading-relaxed font-medium">
              築古戸建ての「リフォーム費用」と「投資利回り」を、現場で30秒で算出。<br className="hidden sm:block" />
              感覚に頼らない数字の力で、顧客の決断を後押しするクロージング支援ツール。
            </p>
            
            {/* CTAボタン */}
            <div className="mt-10">
              <a
                href="#cta"
                onClick={(e) => {
                  e.preventDefault();
                  const ctaSection = document.getElementById('cta');
                  if (ctaSection) {
                    ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                  waitForPostHog(() => {
                    if (window.posthog) {
                      window.posthog.capture('hero_cta_click', { page: 'revealprop-pro' });
                      if (typeof window.posthog.flush === 'function') {
                        window.posthog.flush();
                      }
                    }
                  });
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-8 py-4 text-lg font-bold hover:bg-red-700 shadow-lg hover:shadow-xl transition-all"
              >
                今すぐ無料で試す
                <ArrowRight className="h-5 w-5" />
              </a>
            </div>

            {/* ビジュアル */}
            <div className="mt-12 max-w-4xl mx-auto">
              <div className="rounded-lg overflow-hidden shadow-2xl border-4 border-white/20">
                <img 
                  src="/images/revealprop-pro/25112701.png" 
                  alt="RevealProp Pro - 修繕費見積もりツールの画面" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 課題提起（Pain） */}
      <Section id="pain" className="bg-gray-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8">
              その中古物件、本当は「売れていた」のではありませんか？
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-10">
              内見までは行くのに、なぜか決まらない。その最大の原因は「顧客の不安」です。
            </p>
            
            <div className="space-y-6 mt-10">
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">「これ、直したらいくらかかるの？」</h3>
                <p className="text-gray-700 leading-relaxed">
                  顧客が一番知りたいのは修繕費。でも、正確な見積もりを出すには工務店に依頼する必要があり、時間がかかります。
                </p>
              </div>
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">「思ったより高額になったらどうしよう…」</h3>
                <p className="text-gray-700 leading-relaxed">
                  見積もりが出るまでの間、顧客の不安は増大します。「もっと安い物件があるかも」と他社に流れる可能性も。
                </p>
              </div>
              <div className="bg-white border-l-4 border-red-600 p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-900 mb-2">「工務店の見積もりが出るまで1週間待ってください」</h3>
                <p className="text-gray-700 leading-relaxed">
                  この<strong className="text-red-600">「検討の空白期間」</strong>に、顧客の熱は冷め、案件は流れてしまいます。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 解決策（Solution） */}
      <Section id="solution" className="bg-white py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8">
              もう、見積もり待ちで客を逃がさない。<br />
              スマホひとつで、その場で見積もり・その場で提案。
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <Card>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white text-2xl font-black mb-4">
                    30秒
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">30秒で概算算出</h3>
                  <p className="text-gray-700 leading-relaxed">
                    項目（キッチン、風呂、クロス等）を選ぶだけ。経験の浅い新人でも、ベテラン並みの精度で即答可能。
                  </p>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">根拠あるデータ</h3>
                  <p className="text-gray-700 leading-relaxed">
                    業界標準の『積算資料』をベースに、投資家向けの実勢価格へ独自補正。説得力が違います。
                  </p>
                </div>
              </Card>
              
              <Card>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 text-white mb-4">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">「未来」を見せるROIシミュレーション</h3>
                  <p className="text-gray-700 leading-relaxed">
                    「いくらかかるか（コスト）」だけでなく、「直せばいくら儲かるか（リターン）」を提示。ネガティブな修繕費を、ポジティブな投資材料に変えます。
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* 導入メリット（Benefit） */}
      <Section id="benefits" className="bg-gray-50 py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8">
              御社の営業力が、システムで標準化されます。
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              <Feature icon={Users} title="新人教育コストの削減">
                相場感を教え込むのに数年かける必要はありません。このツールが先生です。
              </Feature>
              
              <Feature icon={Clock} title="事務作業の短縮">
                事務所に戻ってエクセルを叩く時間はゼロに。PDF見積書もワンタップで発行。
              </Feature>
              
              <Feature icon={TrendingUp} title="成約率（CVR）の向上">
                数字で納得させるから、指値交渉やクロージングがスムーズに決まります。
              </Feature>
            </div>
          </div>
        </Container>
      </Section>

      {/* 信頼性・権威性（Authority） */}
      <Section id="authority" className="bg-white py-16 sm:py-24">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-8">
              プロが使える精度を追求。
            </h2>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-8 mt-10">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  建築業界のバイブル<strong className="text-gray-900">『積算ポケット手帳』</strong>等のデータを基準に、実際の賃貸リフォーム相場（分離発注価格）を反映したハイブリッド単価を採用。
                </p>
                <p className="font-bold text-gray-900 text-lg">
                  「高すぎる定価」でも「安すぎるDIY価格」でもない、<span className="text-red-600">「現場で通るリアルな数字」</span>を弾き出します。
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 修繕費見積もり計算器 */}
      <RepairCostEstimatorSection />

      {/* クロージング（CTA Area） */}
      <Section id="cta" className="bg-gradient-to-br from-red-50 to-gray-50 py-16 sm:py-24 border-t-4 border-red-600">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black leading-tight text-gray-900 mb-6">
                まずは、現場で一度使ってみてください。<br />
                その「スピード」と「威力」を実感できるはずです。
              </h2>
              
              <div className="bg-white border-2 border-red-600 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-red-600 mb-4">現在、β版につき全機能【完全無料】で公開中</h3>
                <p className="text-sm text-gray-600">
                  ※予告なく有料化する場合があります。今のうちにご登録ください。
                </p>
              </div>
            </div>
            
            <div className="bg-white border-2 border-gray-300 rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">RevealPropを無料で始める</h3>
              <p className="text-center text-sm text-gray-600 mb-6">Googleアカウントで3秒登録</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">会社名（任意）</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="株式会社○○不動産"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700 font-medium">お名前 <span className="text-red-600">*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
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
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    placeholder="taro@example.co.jp"
                  />
                </div>
                
                {submitStatus.type && (
                  <div className={`p-4 rounded-lg ${
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
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-red-600 text-white px-6 py-4 text-lg font-bold hover:bg-red-700 shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> 送信中...
                    </>
                  ) : (
                    <>
                      RevealPropを無料で始める
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
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
