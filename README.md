# Claude MCP Preset

Claude MCPサーバー用の設定・MCP管理リポジトリ

## Requirements

- Node.js (specified [.node-version](./.node-version))
- [pnpm](https://pnpm.io/)
- [uv](https://docs.astral.sh/uv/)
- [1Password CLI](https://developer.1password.com/docs/cli/)
- [direnv](https://github.com/direnv/direnv)

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

## MCP 実行の自動承認

`Command + Shift + Option + i` で Developer Tool が開ける。
開いたら [auto_approve_snippet.js](./auto_approve_snippet.js) をコピーして Console に貼り付けることで自動承認ができる。
スクリプト内に自動承認するツール名の配列が存在するので必要に応じて更新する。

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

## 共通MCPの削除

```bash
$ git submodule deinit -f mcps/[name]
$ git rm -f mcps/[name]
$ rm -rf .git/modules/mcps/[name]
```
