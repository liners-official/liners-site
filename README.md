# liners-site

静的サイト（GitHub Pages 公開）用のリポジトリです。

- Sass のエントリーポイント: `src/scss/style.scss`
- Sass のエントリーポイント: `src/scss/style.scss`, `src/scss/information.scss`, `src/scss/blog.scss`
- ビルド後の CSS 出力先: `assets/css/style.css`, `assets/css/information.css`, `assets/css/blog.css`
- HTML 側は必要な CSS を読み込みます（例: `index.html` は `assets/css/style.css`）。
- JavaScript: `assets/js/main.js`（`index.html` から読み込み）
- 独自ドメインを使う場合は `CNAME` を利用します。

## 必要環境

- Node.js（npm）

## セットアップ

```bash
npm install
```

## 開発（Sass 監視）

```bash
npm run watch
```

- `src/scss/style.scss` を監視し、`assets/css/style.css` に出力します。
- あわせて `src/scss/information.scss` → `assets/css/information.css`、`src/scss/blog.scss` → `assets/css/blog.css` も監視・出力します。

## ビルド（本番用）

```bash
npm run build
```

- 圧縮した CSS を `assets/css/style.css` に出力します。
- あわせて `assets/css/information.css` / `assets/css/blog.css` も圧縮して出力します。

## GitHub Pages への公開について

GitHub Pages は、このリポジトリ内のファイルをそのまま配信します（Sass のコンパイルは自動では走りません）。

JavaScript（`assets/js/main.js`）はビルド不要で、そのまま配信されます。

そのため、公開内容に反映するには以下のどちらかが必要です。

1. ローカルで `npm run build` を実行して、生成された `assets/css/style.css` をコミットして push する

2. （必要になったら）GitHub Actions 等でビルドして成果物を Pages にデプロイする

まずは 1) の運用が最小構成です。

## ディレクトリ構成

```text
.
├── index.html
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   ├── information.css
│   │   └── blog.css
│   └── js/
│       └── main.js
└── src/
    └── scss/
    ├── style.scss
    ├── information.scss
    └── blog.scss
```

## ソフトボール紹介ページ

- `/ladies/`：レディースソフトボールとは（`ladies/index.html`）
- `/elder/`：エルダーソフトボールとは（`elder/index.html`）
- 共通スタイル：`src/scss/softball.scss` → `assets/css/softball.css`

トップページを第1階層、各紹介ページを第2階層とした構成です。
`npm run watch` または `npm run dev` で既存SCSSと共通SCSSを監視します。
`npm run build` で共通CSSも本番用に圧縮出力します。
紹介文は各HTML、スタイルは共通SCSSを編集してください。

## メンバーインタビュー

TOPの一覧から、`interview/am/`、`interview/miu/`、`interview/non/`、`interview/natsumi/` に遷移します。
詳細ページは `src/scss/softball.scss` と `assets/js/softball.js` を共用します。
インタビュー本文は各ディレクトリの `index.html` で編集します。

`interview/index.html` はメンバー一覧です。共通の `softball.scss` を使用し、詳細ページのパンくず・一覧へ戻るリンクと接続しています。

## 公開ファイルとセキュリティ

GitHub Pagesには、TOP・robots.txt・sitemap.xml・CNAME（存在する場合）と、assets / ladies / elder / interview / liners 内のHTML・CSS・JavaScript・画像・MP4のみをコピーします。隠しファイル、ソースマップ、開発用設定は配信しません。

GitHub ActionsはコミットSHAで固定し、書き込み権限はデプロイjobだけに付与しています。Action更新時は公式リポジトリのSHAを確認してください。jQuery・canvas-confettiはSRIを設定しているため、URLやバージョンを変える際は検証ハッシュも更新してください。Google Analytics・Instagram・天気ウィジェットなど、内容が変わる外部サービスのスクリプトは引き続き利用しています。

