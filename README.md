# FEPass - 基本情報技術者試験 学習アプリ

🌐 **公開URL**: https://sikimu.github.io/FEPass/

基本情報技術者試験（FE）の合格を目指すWebアプリケーションです。APIキー不要で完全動作します。

## 機能

- **四択問題演習** - 100問以上の過去問レベル問題をランダムまたは分野別に出題
- **記述問題演習** - 長文・記述式問題で実践力を養成（自己採点機能付き）
- **分野別シラバス** - 基本情報技術者試験のシラバスに沿った学習進捗管理
- **弱点分析** - レーダーチャートと棒グラフで苦手分野を可視化
- **学習モード** - 各分野の解説テキストで基礎知識を確認
- **ダークモード** - 目に優しい暗い配色に対応
- **AIに質問（オプション）** - Claude APIキーを設定することでAIに質問可能

## 技術スタック

- React 19 + Vite
- Tailwind CSS v4
- Recharts（レーダーチャート・棒グラフ）
- localStorage（進捗・設定の保存）

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## デプロイ方法

### GitHub Pages

1. リポジトリをGitHubにプッシュ
2. `vite.config.js` の `base` をリポジトリ名に変更（例：`base: '/FEPass/'`）
3. GitHub Actions または手動で `npm run build` を実行
4. `dist` フォルダの内容を `gh-pages` ブランチにプッシュ

または `gh-pages` パッケージを使う場合：

```bash
npm install -D gh-pages
```

`package.json` に追加：
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

```bash
npm run deploy
```

### Netlify

1. [netlify.com](https://netlify.com) でアカウント作成
2. GitHubリポジトリと連携
3. ビルド設定：
   - Build command: `npm run build`
   - Publish directory: `dist`

### Vercel

1. [vercel.com](https://vercel.com) でアカウント作成
2. GitHubリポジトリをインポート
3. Framework Preset: Vite を選択
4. デプロイ

## データ構成

```
src/data/
├── syllabus.json                    # シラバス構造定義
├── questions/
│   ├── technology_algorithm.json    # アルゴリズム・数値理論（12問）
│   ├── technology_computer.json     # コンピュータ構成・システム（12問）
│   ├── technology_os.json           # OS・開発技術（12問）
│   ├── technology_network.json      # ネットワーク（12問）
│   ├── technology_security.json     # セキュリティ（12問）
│   ├── technology_database.json     # データベース（12問）
│   ├── management.json              # マネジメント系（12問）
│   └── strategy.json               # ストラテジ系（12問）
└── long_questions/
    ├── technology_long.json         # テクノロジ系 記述問題
    ├── management_long.json         # マネジメント系 記述問題
    └── strategy_long.json           # ストラテジ系 記述問題
```

## Claude API 設定（オプション）

設定画面で Anthropic API キーを入力すると、問題の解説画面で「AIに詳しく聞く」機能が有効になります。

- 使用モデル: `claude-sonnet-4-20250514`
- APIキーは `localStorage` に保存されます
- **共有PCや公共の場所では使用しないでください**

APIキーの取得: [console.anthropic.com](https://console.anthropic.com)

## localStorage のキー

| キー | 内容 |
|------|------|
| `fe_study_progress` | 分野別学習ステータス |
| `fe_quiz_history` | 問題回答履歴（最大500件） |
| `fe_study_streaks` | 連続学習日数 |
| `fe_claude_api_key` | Claude APIキー |
| `fe_settings` | アプリ設定（ダークモード等） |

## ライセンス

MIT
