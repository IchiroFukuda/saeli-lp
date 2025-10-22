"use client";

import React, { useState } from "react";
import { Check, Sparkles, FolderOpen, Search, Cpu, Shield, Gauge, ChevronRight, Mail, FileSearch, Layers, Database, Lock, ArrowRight } from "lucide-react";

// NOTE: This file is a single-file React landing page for the "図面Google" concept.
// Styling assumes TailwindCSS is available. shadcn/ui components are mimicked with simple wrappers.

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
);

const Section = ({ id, className = "", children }: { id: string; className?: string; children: React.ReactNode }) => (
  <section id={id} className={`py-16 sm:py-24 ${className}`}>{children}</section>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide backdrop-blur bg-white/70 text-gray-700">{children}</span>
);

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border bg-white/80 backdrop-blur shadow-sm p-6 ${className}`}>{children}</div>
);

const Pill = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm shadow-md">
    {children}
  </div>
);

const Feature = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <Card className="h-full">
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-black text-white p-2"><Icon className="h-5 w-5" /></div>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{children}</p>
      </div>
    </div>
  </Card>
);

const PricingItem = ({ tier, price, features }: { tier: string; price: number; features: string[] }) => (
  <Card>
    <div className="flex items-baseline justify-between">
      <h4 className="text-xl font-semibold">{tier}</h4>
      <div className="text-right">
        <div className="text-3xl font-bold">¥{price.toLocaleString()}</div>
        <div className="text-xs text-gray-500">/ 月 (税別)</div>
      </div>
    </div>
    <ul className="mt-6 space-y-2">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
          <Check className="h-4 w-4 mt-1 text-green-600" /> {f}
        </li>
      ))}
    </ul>
    <button className="mt-6 w-full rounded-xl bg-black text-white py-2.5 text-sm font-semibold hover:opacity-90">
      相談して始める
    </button>
  </Card>
);

export default function CADSearchLandingPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, connect to a form backend (e.g., Tally/Formspark/Google Forms/Zapier Webhook)
    console.log("Waitlist:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 selection:bg-black selection:text-white">
      {/* Hero */}
      <Section id="hero" className="pt-24 sm:pt-32">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <Badge>
                <Sparkles className="h-4 w-4 mr-2" /> 製造業の"眠る資産"を検索可能に
              </Badge>
              <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                図面Google（仮）
                <span className="block mt-2 text-gray-600 font-semibold text-2xl sm:text-3xl">CAD図面を自然言語で検索・再利用・比較</span>
              </h1>
              <p className="mt-6 text-gray-600 leading-relaxed">
                フォルダに散在したDXF/STEPなどのCAD資産を自動で解析・タグ付け。<br className="hidden sm:block" />
                「φ8 ピン」「ステンレス スリーブ」などの自然言語で瞬時に検索し、過去図面の再利用率を最大化します。
              </p>
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="仕事用メールアドレス"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full sm:w-80 rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 ring-black/10"
                />
                <button type="submit" className="rounded-xl bg-black text-white px-5 py-3 text-sm font-semibold hover:opacity-90 inline-flex items-center gap-2">
                  {submitted ? "登録完了" : "早期アクセスに申し込む"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
              <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
                <Shield className="h-4 w-4" /> 企業向け：NDA対応・オンプレ相談可
              </div>
            </div>

            {/* Visual mock */}
            <Card className="lg:ml-8">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <Pill><FolderOpen className="h-4 w-4" /> フォルダ連携</Pill>
                <Pill><Database className="h-4 w-4" /> 自動インデックス</Pill>
                <Pill><Search className="h-4 w-4" /> 自然言語検索</Pill>
              </div>
              <div className="mt-4 rounded-xl bg-gray-900 text-gray-100 p-4 text-sm font-mono overflow-hidden">
                <div className="opacity-80">$ connect "/mnt/share/CAD/"</div>
                <div className="opacity-80">▶︎ 10,284 files found … DXF/STEP/IGES</div>
                <div className="opacity-80">▶︎ Extracting metadata … size/material/tolerance</div>
                <div className="opacity-80">▶︎ Building vector index … done</div>
                <div className="mt-3">query: 「φ8 ステンレス スリーブ 類似図面」</div>
                <div className="mt-2 text-green-300">→ 12 matches · best 3 shown</div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[0,1,2].map(i => (
                  <div key={i} className="rounded-xl border bg-white overflow-hidden">
                    <div className="h-28 bg-gradient-to-br from-gray-100 to-gray-200" />
                    <div className="p-3 text-xs">
                      <div className="font-semibold">SLV-φ8-SS-{i+1}.dxf</div>
                      <div className="text-gray-500">材質: SUS304 / 公差: ±0.02</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Value props */}
      <Section id="value">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Feature icon={FileSearch} title="図面の意味で探せる">
              ファイル名やフォルダ名ではなく、<b>寸法・材質・注釈</b>などの内容理解で検索。ベテラン依存の「勘」をデータ化します。
            </Feature>
            <Feature icon={Layers} title="再利用率の最大化">
              類似図面を自動推薦。再設計の手戻りと見積工数を削減し、<b>設計リードタイムを20–40%短縮</b>。
            </Feature>
            <Feature icon={Shield} title="企業要件にフィット">
              SSO・アクセス権限・NDA対応。<b>オンプレミス/専用VPC</b>もご相談可能です。
            </Feature>
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section id="how" className="bg-gray-50/70">
        <Container>
          <div className="mb-8">
            <h3 className="text-2xl font-bold">仕組み</h3>
            <p className="text-gray-600 mt-2">3ステップで、散在するCAD資産が"検索可能な知識ベース"に。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="flex items-center gap-3 text-sm font-semibold"><FolderOpen className="h-4 w-4"/> 1. フォルダ連携</div>
              <p className="text-gray-600 mt-2 text-sm">NAS/ファイルサーバ上のDXF/STEP/IGES等を自動クロール。</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 text-sm font-semibold"><Cpu className="h-4 w-4"/> 2. 解析・タグ付け</div>
              <p className="text-gray-600 mt-2 text-sm">寸法/材質/注釈/レイヤー情報を抽出し、ベクトル化して索引化。</p>
            </Card>
            <Card>
              <div className="flex items-center gap-3 text-sm font-semibold"><Search className="h-4 w-4"/> 3. 自然言語検索</div>
              <p className="text-gray-600 mt-2 text-sm">「φ8 ステンレス スリーブ」のような言葉で、最適な過去図面を即時提示。</p>
            </Card>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm text-gray-600">
            <Lock className="h-4 w-4"/> データは暗号化保存。アクセス権限は部門/案件単位で制御可能。
          </div>
        </Container>
      </Section>

      {/* Formats */}
      <Section id="formats">
        <Container>
          <div className="mb-8">
            <h3 className="text-2xl font-bold">対応フォーマット（MVP）</h3>
            <p className="text-gray-600 mt-2">まずは現場で最も扱いやすい標準形式から。</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["DXF","STEP","IGES","DWG(一部)","PDF図面(テキスト可)","CSV/BOM","画像プレビュー(SVG)","将来: 3D/属性"].map((t,i)=> (
              <Card key={i} className="text-center py-6"><div className="text-sm font-semibold">{t}</div></Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Pricing */}
      <Section id="pricing" className="bg-gray-50/70">
        <Container>
          <div className="mb-8">
            <h3 className="text-2xl font-bold">価格</h3>
            <p className="text-gray-600 mt-2">導入しやすい月額制。PoC/オンプレは個別見積り。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PricingItem tier="Starter" price={100000} features={["図面解析・タグ付け","自然言語検索","基本プレビュー","メールサポート"]} />
            <PricingItem tier="Pro" price={200000} features={["類似図面の自動推薦","検索履歴/再利用レポート","SSO/権限管理","優先サポート"]} />
            <PricingItem tier="Enterprise" price={300000} features={["API連携・VPC/オンプレ","監査ログ・監査証跡","カスタム辞書・社内規格照合","SLA/専任サポート"]} />
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section id="cta">
        <Container>
          <Card className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="text-sm font-semibold text-gray-600">まずは無料デモから</div>
              <h3 className="text-2xl font-bold mt-1">フォルダを指定するだけで、過去図面が"知識"に変わる。</h3>
              <p className="text-gray-600 mt-2 text-sm">NDA対応の上、サンプルデータでの評価も可能です。</p>
            </div>
            <a href="#contact" className="rounded-xl bg-black text-white px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
              デモを依頼する <ChevronRight className="h-4 w-4"/>
            </a>
          </Card>
        </Container>
      </Section>

      {/* Contact */}
      <Section id="contact" className="bg-gray-50/70">
        <Container>
          <div className="mb-8">
            <h3 className="text-2xl font-bold">お問い合わせ</h3>
            <p className="text-gray-600 mt-2">要件・導入形態・PoCのご相談はこちらから。</p>
          </div>
          <Card>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block mb-1 text-gray-700">会社名</label>
                <input className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-black/10" placeholder="例）○○工業株式会社" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">お名前</label>
                <input className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-black/10" placeholder="山田 太郎" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-gray-700">メールアドレス</label>
                <input className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-black/10" placeholder="taro@example.co.jp" />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-gray-700">ご相談内容</label>
                <textarea rows={4} className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 ring-black/10" placeholder="現状の課題や導入イメージなど" />
              </div>
              <div className="md:col-span-2">
                <button className="rounded-xl bg-black text-white px-6 py-3 font-semibold hover:opacity-90 inline-flex items-center gap-2">
                  <Mail className="h-4 w-4"/> 送信
                </button>
              </div>
            </form>
          </Card>
        </Container>
      </Section>

      <footer className="py-12">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <div>© {new Date().getFullYear()} 図面Google（仮） / CAD Intelligence</div>
            <div className="flex items-center gap-4">
              <a className="hover:text-gray-700" href="#pricing">価格</a>
              <a className="hover:text-gray-700" href="#how">仕組み</a>
              <a className="hover:text-gray-700" href="#contact">お問い合わせ</a>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

