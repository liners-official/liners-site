# liners-site

静的サイト（GitHub Pages 公開）用のリポジトリです。

- Sass のエントリーポイント: `src/scss/style.scss`
- ビルド後の CSS 出力先: `assets/css/style.css`
- HTML 側は `assets/css/style.css` を読み込みます（`index.html`）。
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

## ビルド（本番用）

```bash
npm run build
```

- 圧縮した CSS を `assets/css/style.css` に出力します。

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
│   │   └── style.css
│   └── js/
│       └── main.js
└── src/
    └── scss/
        └── style.scss
```
