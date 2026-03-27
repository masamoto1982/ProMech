# ProMech

自動車補修・販売業（板金塗装、車検、車販）向けのローカル完結型 Electron デスクトップアプリの設計・実装ベースです。

## セットアップ

```bash
npm install
npm run build
npm start
```

## EXEファイルの入手方法（Windows）

### 1. GitHub Releases から入手（利用者向け）
1. リポジトリの **Releases** ページを開く
2. 最新版の Assets から以下をダウンロード
   - `ProMech Setup x.x.x.exe`（ワンクリックインストーラー）
   - `ProMech x.x.x.exe`（ポータブル単体実行版）

### 2. 自分でビルドして入手（開発者向け）

```bash
npm install
npm run dist:win
```

- 生成先: `dist/` または `release/` 配下（electron-builder の設定に依存）
- インストーラー版（NSIS）とポータブル版（単体 `.exe`）の両方が出力されます。

## 実装済みベース

- Electron main / renderer 分離構成
- `better-sqlite3` による初回DB自動生成とDDL実行
- 税ロジックを独立した `TaxEngine` モジュールに分離
- `<datalist>` ベースの「選択＋自由入力」コンボUI
- `electron-builder` による NSIS / Portable 出力設定

詳細は `docs/architecture.md` を参照してください。


## 自動配布（GitHub Actions）

`main` / `master` / `release/**` への push 時に、GitHub Actions が Windows 向け EXE をビルドし、
`nightly` Release に自動添付します。

- ワークフロー: `.github/workflows/windows-release-on-push.yml`
- 添付対象: `dist/*.exe`（NSISインストーラー / Portable）
- Release は push ごとに上書き更新されます（最新成果物を常に取得可能）

## トラブルシュート

- **Windows CI で `cp` / `mkdir -p` エラーになる場合**
  - `copy:renderer` は Node.js スクリプト (`scripts/copy-renderer.mjs`) に置き換え済みです。
- **`npm ci` が lockfile 不在で失敗する場合**
  - CI は `npm install` を利用するよう設定しています。
