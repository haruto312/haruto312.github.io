# Tokyo Next Trains

現在地から半径1km以内にある首都圏の駅を検索し、各駅の次の発車時刻を表示するスマホ対応PWAです。

現時点の駅・発車時刻はモックデータです。実データ取得部分は `src/lib/stations` と `src/lib/departures` に抽象化してあり、ODPT API、GTFS、駅データ.jp などへ差し替えやすい構成です。

## 主な機能

- ブラウザ Geolocation API による現在地取得
- 半径1km以内の駅検索と距離順表示
- 駅ごとの次発時刻、路線名、行先表示
- 30秒ごとの自動更新と手動更新
- localStorage によるお気に入り保存
- ダークモード対応
- PWA manifest と Service Worker
- Next.js App Router、Server Components、Loading UI、Error Boundary

## ディレクトリ構成

```txt
src/
  app/
    error.tsx
    globals.css
    layout.tsx
    loading.tsx
    page.tsx
  components/
  hooks/
  lib/
    departures/
    geolocation/
    stations/
    railService.ts
  types/
public/
  icons/
  manifest.webmanifest
  sw.js
```

## セットアップ

```bash
pnpm install
pnpm dev
```

ブラウザで `http://localhost:3000` を開きます。位置情報を使うため、スマホ実機または HTTPS/localhost 環境での確認を推奨します。

## 検証

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## 環境変数

`.env.example` をコピーして `.env.local` を作成します。

```bash
cp .env.example .env.local
```

```env
ODPT_API_KEY=
NEXT_PUBLIC_STATION_PROVIDER=mock
NEXT_PUBLIC_DEPARTURE_PROVIDER=mock
```

## 実データ接続の方針

`StationProvider` と `DepartureProvider` を実装することで、UI側を変更せずにデータ取得元を差し替えられます。

- `src/lib/stations/stationProvider.ts`
- `src/lib/departures/departureProvider.ts`
- `src/lib/railService.ts`

ODPT API を使う場合は、API Route または Server Action 側で API キーを扱い、クライアントへ秘密情報を渡さない構成にしてください。

## Vercel デプロイ

1. GitHub にリポジトリを push
2. Vercel で New Project を作成
3. Framework Preset は Next.js を選択
4. 必要に応じて `ODPT_API_KEY` などの環境変数を設定
5. Deploy

無料運用を優先する場合、最初は静的な駅データと必要最小限の API 呼び出しに抑え、実データ接続時はキャッシュや更新間隔を調整してください。
