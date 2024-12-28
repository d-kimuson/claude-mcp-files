# Claude MCP Preset

Claude MCPサーバー用の設定・MCP管理リポジトリ

## セットアップ

```bash
$ git clone --recursive git@github.com:d-kimuson/claude-mcp-preset.git
$ cd claude-mcp-preset

$ pnpm i --recursive
$ pnpm build

$ pnpm generate:env
$ cp .env.personal.template .env.personal
```

## 設定ファイルの生成

.env.personal に端末・用途に合わせて環境変数を設定する

```bash
$ pnpm generate:config
```

## ディレクトリ構造

- `mcps/`: clone が必要な MCP の submodule
- `packages/`: カスタムMCPの実装

## カスタムMCPの追加

1. `packages` に新規ディレクトリを作成
2. MCPの実装
3. `claude_desktop_config.json` に設定を追加

## 共通MCPの追加

```bash
$ git submodule add [repo-url] mcps/[name]
```
