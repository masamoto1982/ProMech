# ProMech 設計ドラフト

## 1) ディレクトリ構成案（main / renderer 分離）

```text
ProMech/
├─ package.json
├─ tsconfig.json
├─ docs/
│  └─ architecture.md
├─ src/
│  ├─ main/
│  │  ├─ index.ts                  # Electron main process
│  │  ├─ taxCalculator.ts          # 独立 Tax Engine
│  │  └─ db/
│  │     ├─ database.ts            # userData配下DBの自動生成・初期化
│  │     └─ schema.ts              # DDL定義
│  └─ renderer/
│     ├─ index.html
│     ├─ styles.css
│     ├─ app.ts
│     └─ components/
│        └─ flexibleCombo.ts       # datalistベースの自由入力コンボ
└─ dist/                           # ビルド成果物
```

## 2) SQLite初期化（better-sqlite3）

- 初回起動時に `app.getPath('userData')/promech_db.sqlite` を生成。
- `Karte`, `PrescriptionItem`, `SecondhandLedger`, `TaxConfiguration` を含むDDLを実行。
- 税設定は `TaxConfiguration` に履歴保持し、明細には `tax_rate_percent` を保存して再発行時の再計算を防止。

## 3) Tax Engine（インボイス ON/OFF）

- `TaxEngineConfig.mode` で `invoice` / `non_invoice` を切替。
- インボイスモード:
  - 税率ごとに課税対象額を集計し、税額を率別に端数処理。
  - `printableRegistrationNumber` としてT番号を帳票へ渡せる。
- 非インボイスモード:
  - 税率横断で合算した簡易税計算を実施し、表示を簡素化。

## 4) 自由入力可能コンボボックス

- `<input list="...">` + `<datalist>` を使ったUI。
- 候補選択も任意入力も両立。
- 「範囲」「作業または部品」「備考」「単位」を独立コンポーネントで描画。

## 補足: パッケージング要件

- `package.json` に `electron-builder` を設定。
- Windows向けに `nsis` と `portable` を併記し、ワンクリック導入または単一exeを選べる。
- Electronアプリとして配布することで、通常起動時にコンソールウィンドウを伴わないGUI体験を実現。
