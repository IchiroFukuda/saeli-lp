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

#### カスタムドメイン設定（GrantsAIgent用）
1. Vercelダッシュボードでプロジェクトを選択
2. **Settings** → **Domains**
3. **Add Domain** で `grantsaigent.com` を追加
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

#### カスタムドメイン設定（SAELI用）
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

## 問い合わせフォーム（SendGrid）の設定

`app/grantsaigent/page.tsx` の問い合わせフォームは、SendGridを使用してメール送信を行います。

### 1. SendGridアカウントの作成
1. [SendGrid](https://sendgrid.com) でアカウントを作成
2. 無料プランでも月100通まで送信可能

### 2. APIキーの取得
1. SendGridダッシュボードにログイン
2. **Settings** → **API Keys** に移動
3. **Create API Key** をクリック
4. 名前を入力（例：`SAELI Contact Form`）
5. **Full Access** または **Restricted Access**（Mail Send権限のみ）を選択
6. APIキーをコピー（表示されるのは一度だけなので注意）

### 3. 送信元メールアドレスの認証
1. SendGridダッシュボードで **Settings** → **Sender Authentication** に移動
2. **Single Sender Verification** または **Domain Authentication** を設定
   - **Single Sender Verification**: 簡単だが、1つのメールアドレスのみ
   - **Domain Authentication**: ドメイン全体で送信可能（推奨）

### 4. 環境変数の設定

#### ローカル開発環境
1. プロジェクトルートに `.env.local` ファイルを作成
2. `.env.example` を参考に環境変数を設定：
```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=hello@saeli.org
SENDGRID_FROM_EMAIL=noreply@saeli.org
```

#### Vercelでの設定
1. Vercelダッシュボードでプロジェクトを選択
2. **Settings** → **Environment Variables** に移動
3. 以下の環境変数を追加：
   - `SENDGRID_API_KEY`: SendGridのAPIキー
   - `CONTACT_EMAIL`: 問い合わせを受け取るメールアドレス（デフォルト: `hello@saeli.org`）
   - `SENDGRID_FROM_EMAIL`: 送信元メールアドレス（SendGridで認証済みのもの）

#### Netlifyでの設定
1. Netlifyダッシュボードでサイトを選択
2. **Site settings** → **Environment variables** に移動
3. 上記と同じ環境変数を追加

### 5. 動作確認
1. 開発サーバーを起動：`npm run dev`
2. `http://localhost:3000/grantsaigent` にアクセス
3. 問い合わせフォームから送信
4. 設定した `CONTACT_EMAIL` にメールが届くことを確認

## GrantsAIgent MVP デプロイ手順

### Vercelでデプロイして https://grantsaigent.com で公開

1. **Vercelにプロジェクトをインポート**
   - [Vercel](https://vercel.com) にログイン
   - "Import Project" でGitHubリポジトリを選択
   - Framework Preset: **Next.js** を選択
   - Root Directory: `.` (デフォルト)
   - Build Command: `npm run build` (自動検出)
   - Output Directory: `.next` (自動検出)

2. **環境変数の設定**
   - **Settings** → **Environment Variables** に移動
   - 以下の環境変数を追加：
     - `SENDGRID_API_KEY`: SendGridのAPIキー
     - `CONTACT_EMAIL`: 問い合わせを受け取るメールアドレス
     - `SENDGRID_FROM_EMAIL`: 送信元メールアドレス（SendGridで認証済み）

3. **カスタムドメインの設定**
   - **Settings** → **Domains** に移動
   - **Add Domain** で `grantsaigent.com` を追加
   - Vercelが表示するDNS設定をドメインのDNS設定に追加：
     - Type: `A` レコード（ルートドメイン用）
     - Type: `CNAME` レコード（wwwサブドメイン用）
   - DNS設定が反映されるまで数分〜数時間かかる場合があります
   - SSL証明書は自動で適用されます

4. **デプロイの確認**
   - デプロイが完了したら `https://grantsaigent.com` にアクセス
   - ルートパス（/）でGrantsAIgentのランディングページが表示されることを確認
   - 問い合わせフォームが正常に動作することを確認

## ライセンス
パブリックドメイン相当（CC0）。商用・改変・再配布ご自由にどうぞ。
