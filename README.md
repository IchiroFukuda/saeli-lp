# 合同会社SAELI – 海の光をテーマにしたランディングページ

- `index.html` … 会社概要・お問い合わせ（メール起動フォーム）
- `privacy.html` … プライバシーポリシー（Google Play の「プライバシーポリシーURL」に指定）
- `style.css` … 海の光をテーマにしたスタイル
- `config.js` … 環境変数設定ファイル

## 使い方（超速）

### 1. GitHubリポジトリの設定
```bash
# リポジトリをクローン
git clone git@github.com:IchiroFukuda/saeli-lp.git
cd saeli-lp

# 設定を変更
# config.js 内の設定を自社情報に変更
# - EMAIL: メールアドレス
# - COMPANY_NAME: 会社名  
# - WEBSITE_URL: ウェブサイトURL
# - その他の設定項目

# コミット&プッシュ
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercelでデプロイ（推奨）

#### 基本デプロイ
1. [Vercel](https://vercel.com) にログイン
2. "Import Project" でGitHubリポジトリ `IchiroFukuda/saeli-lp` を選択
3. 自動で `https://saeli-lp.vercel.app` にデプロイ

#### カスタムドメイン設定
1. Vercelダッシュボードでプロジェクトを選択
2. **Settings** → **Domains**
3. **Add Domain** で `saeli.org` を追加
4. DNS設定で以下を追加：
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.19.61
   ```
5. SSL証明書が自動で適用される

#### Netlify
1. [Netlify](https://netlify.com) にログイン
2. "New site from Git" でGitHubリポジトリ `IchiroFukuda/saeli-lp` を選択
3. 自動で `https://random-name.netlify.app` にデプロイ

### 3. カスタムドメイン設定
- ドメインを購入（例：`saeli.org`）
- 各ホスティングサービスの設定でカスタムドメインを追加
- DNS設定でドメインをホスティングサービスに接続

### 4. Google Play Console設定
- サポートメール：`config.js`で設定したメールアドレス
- サポートURL： `https://your-domain/`
- プライバシーポリシーURL： `https://your-domain/privacy.html`

## 設定の変更方法
`config.js` ファイルを編集するだけで、すべてのページで統一された設定が適用されます：
- メールアドレス
- 会社名
- ウェブサイトURL
- 設立年
- 所在地

### Vercel（最短）
- プロジェクトを作成 → `Add New...` → `Other` → `Upload` でこのフォルダをドラッグ&ドロップ

### 連絡フォームを「送信API」に変えたい場合
- 現状は **メール起動型**（バックエンド不要）です。
- SaaS を使うなら **Formspree / Formsubmit / Basin** などのエンドポイントを `index.html` に追加するだけで運用可能です。

## ライセンス
パブリックドメイン相当（CC0）。商用・改変・再配布ご自由にどうぞ。
