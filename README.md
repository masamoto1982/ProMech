# ProMech

自動車補修・販売業（板金塗装、車検、車販）向けのローカル完結型 Electron デスクトップアプリの設計・実装ベースです。

## セットアップ

```bash
npm install
npm run build
npm start
```

## 実装済みベース

- Electron main / renderer 分離構成
- `better-sqlite3` による初回DB自動生成とDDL実行
- 税ロジックを独立した `TaxEngine` モジュールに分離
- `<datalist>` ベースの「選択＋自由入力」コンボUI
- `electron-builder` による NSIS / Portable 出力設定

詳細は `docs/architecture.md` を参照してください。
