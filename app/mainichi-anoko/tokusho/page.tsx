import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - 毎日あの子",
  description: "毎日あの子（合同会社SAELI）の特定商取引法に基づく表記。",
  alternates: { canonical: "/tokusho" },
};

type Row = { label: string; value: React.ReactNode };

const rows: Row[] = [
  { label: "販売業者", value: "合同会社SAELI" },
  { label: "運営統括責任者", value: "福田一朗" },
  {
    label: "所在地",
    value: (
      <>
        〒107-0061
        <br />
        東京都港区北青山１丁目３－３三橋ビル３階
      </>
    ),
  },
  {
    label: "電話番号",
    value: (
      <>
        お電話でのお問い合わせには対応しておりません。
        <br />
        <span className="text-sm text-stone-500">
          ※サービスに関するお問い合わせは、記録保持の観点からメールにて承っております。
        </span>
      </>
    ),
  },
  {
    label: "メールアドレス",
    value: (
      <a
        href="mailto:hello@saeli.org"
        className="underline underline-offset-4 hover:text-stone-900"
      >
        hello@saeli.org
      </a>
    ),
  },
  {
    label: "販売価格",
    value: (
      <>
        【アプリ内サブスクリプション】
        <br />
        ・月額プラン：1,480円／月（7日間の無料お試し付き）
        <br />
        ・年額プラン：9,800円／年
        <br />
        ・買い切りプラン：39,800円（永続利用）
        <br />
        <br />
        【物理商品】
        <br />
        ・フォトブック（ハードカバー、30ページ）：6,800円／冊（送料込み）
        <br />
        <span className="text-sm text-stone-500">
          ※購入画面に表示される価格が適用されます。
        </span>
      </>
    ),
  },
  {
    label: "商品代金以外の必要料金",
    value: (
      <>
        アプリのダウンロードおよび利用時にかかる通信料（パケット代等）はお客様の負担となります。
        <br />
        フォトブックの送料は商品価格に含まれます。
      </>
    ),
  },
  {
    label: "お支払い方法",
    value: (
      <>
        【サブスクリプション】App Store または Google Play
        が提供する決済手段（クレジットカード、キャリア決済等）
        <br />
        【フォトブック】KOMOJU（株式会社DEGICA）を通じたクレジットカード決済
      </>
    ),
  },
  {
    label: "お支払い時期",
    value: (
      <>
        【サブスクリプション】初回は購入手続き完了時に課金され、以降は所定の期間ごとに自動更新され課金されます。
        <br />
        【フォトブック】ご注文時にお支払いが完了します。
      </>
    ),
  },
  {
    label: "引渡し時期",
    value: (
      <>
        【サブスクリプション】購入手続き完了後、直ちにご利用いただけます。
        <br />
        【フォトブック】ご注文・ご入金確認後、14日以内に発送いたします。
      </>
    ),
  },
];

export default function TokushoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FAF6EF] to-[#F5EFDF] text-stone-800">
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-24">
        <h1 className="text-3xl font-semibold tracking-tight">
          特定商取引法に基づく表記
        </h1>
        <p className="mt-4 text-stone-700 leading-loose">
          毎日あの子（合同会社SAELI）におけるサービスおよび物理商品の販売に関して、特定商取引法に基づき以下のとおり表示いたします。
        </p>

        <div className="mt-10 overflow-hidden rounded-2xl border border-stone-200/80 bg-white/70 backdrop-blur">
          <table className="w-full text-sm sm:text-base">
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={
                    i !== rows.length - 1 ? "border-b border-stone-200/60" : ""
                  }
                >
                  <th className="w-32 sm:w-44 align-top text-left p-4 sm:p-5 bg-stone-50/60 text-stone-600 font-medium">
                    {row.label}
                  </th>
                  <td className="align-top p-4 sm:p-5 leading-relaxed">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">
            返品・解約について
          </h2>

          <h3 className="mt-8 text-lg font-semibold">
            1. フォトブック（物理商品）
          </h3>
          <ul className="mt-3 space-y-2 list-disc list-inside text-stone-700 leading-loose">
            <li>
              印刷物の性質上、お客様都合による返品・交換はお受けしておりません。
            </li>
            <li>
              商品に不良がある場合は、商品到着後5日以内に
              {" "}
              <a
                href="mailto:hello@saeli.org"
                className="underline underline-offset-4 hover:text-stone-900"
              >
                hello@saeli.org
              </a>
              {" "}
              までご連絡ください。良品と交換いたします。
            </li>
          </ul>

          <h3 className="mt-8 text-lg font-semibold">2. サブスクリプション</h3>
          <ul className="mt-3 space-y-2 list-disc list-inside text-stone-700 leading-loose">
            <li>
              デジタルコンテンツの性質上、購入確定後の返金は一切お受けしておりません。
            </li>
            <li>
              サブスクリプション期間終了の<strong>24時間前まで</strong>
              に解約手続きを行わない場合、契約は自動更新されます。
            </li>
            <li>
              解約はアプリの削除やログアウトでは完了しません。お使いの端末の設定（Apple
              IDまたはGoogle Playのサブスクリプション管理画面）から手続きを行ってください。
            </li>
            <li>
              期間の途中で解約された場合でも、その期間満了までは有料機能をご利用いただけるとともに、日割り計算による返金は行われません。
            </li>
          </ul>

          <h3 className="mt-8 text-lg font-semibold">解約方法の詳細</h3>
          <h4 className="mt-4 font-medium">iOSの場合（iPhone / iPad）</h4>
          <ol className="mt-2 space-y-1 list-decimal list-inside text-stone-700 leading-loose">
            <li>「設定」アプリを開く</li>
            <li>最上部のApple IDをタップ</li>
            <li>「サブスクリプション」をタップ</li>
            <li>「毎日あの子」を選択</li>
            <li>「サブスクリプションをキャンセルする」をタップ</li>
          </ol>

          <h4 className="mt-6 font-medium">Androidの場合</h4>
          <ol className="mt-2 space-y-1 list-decimal list-inside text-stone-700 leading-loose">
            <li>Google Playストアアプリを開く</li>
            <li>右上のプロフィールアイコンをタップ</li>
            <li>「お支払いと定期購入」→「定期購入」をタップ</li>
            <li>「毎日あの子」を選択</li>
            <li>「定期購入を解約」をタップ</li>
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">お問い合わせ</h2>
          <p className="mt-3 text-stone-700 leading-loose">
            特定商取引法に関するお問い合わせ、その他サービスに関するご質問は、以下のフォームまたはメールアドレスよりご連絡ください。
          </p>
          <p className="mt-3">
            <a
              href="/contact"
              className="inline-flex items-center rounded-full bg-stone-800 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700 transition"
            >
              お問い合わせフォームはこちら
            </a>
          </p>
          <p className="mt-3 text-sm text-stone-600">
            メールでのご連絡：
            {" "}
            <a
              href="mailto:hello@saeli.org"
              className="underline underline-offset-4 hover:text-stone-900"
            >
              hello@saeli.org
            </a>
          </p>
        </section>

        <p className="mt-16 text-sm text-stone-500">
          制定日：2026年5月28日
        </p>
      </section>
    </main>
  );
}
