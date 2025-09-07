// 合同会社SAELI 設定ファイル
// このファイルでメールアドレスやその他の設定を一元管理

const CONFIG = {
  // 会社情報
  COMPANY_NAME: "合同会社SAELI",
  COMPANY_NAME_SHORT: "SAELI",
  
  // 連絡先
  EMAIL: "hello@saeli.org",
  
  // ウェブサイト情報
  WEBSITE_URL: "https://saeli.org",
  
  // その他の設定
  ESTABLISHED_YEAR: "2025",
  LOCATION: "東京都（詳細はお問い合わせ時に開示）"
};

// 設定をグローバルに公開
window.CONFIG = CONFIG;
