# 上方日本酒ワールド 2026

上方日本酒ワールド 2026 のイベント公式サイトです。Astro で構築された静的サイトです。

## 技術スタック

- [Astro](https://astro.build/) - 静的サイトジェネレーター
- SCSS - スタイリング
- TypeScript
- PapaParser - CSV パース

## コマンド

| コマンド          | 内容                                    |
| :---------------- | :-------------------------------------- |
| `npm install`     | 依存パッケージのインストール            |
| `npm run dev`     | 開発サーバー起動 (`localhost:4321`)     |
| `npm run build`   | 本番用ビルド (`./dist/` に出力)         |
| `npm run preview` | ビルド結果のプレビュー                  |

## ディレクトリ構成

```
src/
├── assets/
│   └── images/
│       ├── cuisine/        # 料理画像 ([slug].jpg)
│       └── store/          # 店舗写真 ([slug]-[連番].jpg)
├── components/             # 共通コンポーネント
├── data/                   # ローカル CSV（参照・バックアップ用）
│   ├── store.csv           # 参加店舗データ
│   ├── consignment_2026.csv # チケット購入可能店舗
│   └── area_master.csv     # エリアマスター
├── layouts/
│   └── Layout.astro
└── pages/
    ├── index.astro          # トップページ
    ├── [slug].astro         # 参加店舗 詳細ページ（動的ルーティング）
    └── consignment.astro    # チケット購入可能店舗一覧ページ
```

## 環境変数

`.env` ファイルをプロジェクトルートに作成し、以下を設定してください。

```env
PUBLIC_GTM_KEY=GTM-XXXXXXX
CONSIGNMENT_SPREADSHEET_ID=スプレッドシートのID
CONSIGNMENT_SPREADSHEET_GID=チケット購入可能店舗シートのGID
CONSIGNMENT_SPREADSHEET_GID_AREAMASTER=エリアマスターシートのGID
CONSIGNMENT_SPREADSHEET_GID_STORE=参加店舗シートのGID
```

## データソース（Google スプレッドシート）

ビルド時に Google スプレッドシートから CSV エクスポートでデータを取得します。スプレッドシートは **リンクを知っている全員が閲覧可能** に設定してください。

取得 URL のフォーマット:
```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv&gid={GID}
```

### シート構成

| 環境変数 | シート内容 | 使用ページ |
| :------- | :--------- | :--------- |
| `CONSIGNMENT_SPREADSHEET_GID_STORE` | 参加店舗データ | `[slug].astro` |
| `CONSIGNMENT_SPREADSHEET_GID` | チケット購入可能店舗 | `consignment.astro`（※1） |
| `CONSIGNMENT_SPREADSHEET_GID_AREAMASTER` | エリアマスター | `consignment.astro`（※1） |

> ※1: `consignment.astro` は現在ローカル CSV (`src/data/consignment_2026.csv`, `area_master.csv`) から読み込んでいます。

### 参加店舗シート（`CONSIGNMENT_SPREADSHEET_GID_STORE`）のカラム仕様

| カラム名 | 内容 |
| :------- | :--- |
| `slug` | URL スラグ（英小文字、ページの識別子） |
| `cuisineImage` | 料理画像ファイル名 |
| `title` | 店舗名 |
| `storeAddress` | 店舗住所 |
| `representative` | 代表者名 |
| `tel` | 電話番号 |
| `storeDescription` | 店舗紹介 |
| `initiatives` | 料理・日本酒への取り組み |
| `brewery` | 酒蔵紹介 |
| `storeMessage` | 飲食店からお客様へのメッセージ |
| `storeX` | 飲食店 X（旧 Twitter）アカウント名 |
| `storeInstagram` | 飲食店 Instagram アカウント名 |
| `storeFacebook` | 飲食店 Facebook アカウント名 |
| `breweryName` | 酒蔵名 |
| `sakePref` | 酒蔵の都道府県 |
| `representativeBrand` | 代表銘柄 |
| `sakeAddress` | 酒蔵住所 |
| `breweryMan` | 杜氏・蔵人名 |
| `breweryDescription` | 酒蔵説明 |
| `breweryThoughts` | 酒造りの想い |
| `aboutRestaurants` | 飲食店についての酒蔵コメント |
| `breweryMessage` | 酒蔵からお客様へのメッセージ |
| `sakeX` | 酒蔵 X アカウント名 |
| `sakeInstagram` | 酒蔵 Instagram アカウント名 |
| `sakeFacebook` | 酒蔵 Facebook アカウント名 |
| `cuisine` | 料理名 |
| `cuisineDescription` | 料理説明 |
| `sakeName` | 提供酒銘柄名 |
| `cuisinePrice` | 料理価格（円） |
| `sakePrice` | お酒価格（円） |
| `setPrice` | セット価格（円、任意） |
| `sakeTemp` | 提供温度（カンマ区切り例: `冷酒,お燗`） |

## 画像管理

画像は `src/assets/images/` 以下に配置し、`import.meta.glob` で一括読み込みされます。ファイルを追加するだけで自動的にページに反映されます。

### 料理画像

- ディレクトリ: `src/assets/images/cuisine/`
- 命名規則: `[slug].jpg`
- 例: `kajinoba.jpg`

### 店舗写真

- ディレクトリ: `src/assets/images/store/`
- 命名規則: `[slug]-[連番].jpg`（連番は 1 始まり）
- 例: `kajinoba-1.jpg`, `kajinoba-2.jpg`
- 複数枚対応（連番ファイルをフォルダに追加するだけで表示枚数が増えます）

## 新しい参加店舗を追加する手順

1. スプレッドシートの参加店舗シートに行を追加
2. `slug` は英小文字で一意に設定
3. `src/assets/images/cuisine/[slug].jpg` に料理画像を配置
4. `src/assets/images/store/[slug]-1.jpg`（以降 `-2`, `-3`…）に店舗写真を配置
5. `npm run build` でビルド
