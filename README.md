# Claude MCP Preset

Claude MCPサーバー用の設定・MCP管理リポジトリ

## 機能

- MCPサーバー設定の一元管理
- カスタムMCPの実装と管理
- 共通MCPのgit submodule管理

## セットアップ

```bash
# リポジトリのクローン
git clone --recursive [repo-url]
cd claude-mcp-preset

# 依存関係のインストール
pnpm install

# 設定ファイルの生成
pnpm generate:config
```

## ディレクトリ構造

- `mcps/`: 共通MCPのsubmodules
- `packages/`: カスタムMCPの実装
- `scripts/`: 設定生成スクリプト
- `docs/`: ドキュメント

## 設定ファイル

\`claude_desktop_config.json\`には以下の設定が含まれます:

- MCPのパス設定
- 実行時の基本設定
- タイムアウトなどの動作設定

## カスタムMCPの追加

1. \`packages/\`に新規ディレクトリを作成
2. MCPの実装
3. \`claude_desktop_config.json\`に設定を追加

## 共通MCPの追加

```bash
git submodule add [repo-url] mcps/[name]
```

## 開発

```bash
# コードのフォーマット
pnpm format
```

## ライセンス

MIT