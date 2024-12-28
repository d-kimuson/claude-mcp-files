# 設定ファイルリファレンス

## 基本構造

```typescript
interface Config {
  version: string
  mcps: {
    [key: string]: {
      path: string
      enabled: boolean
    }
  }
  settings: {
    defaultTimeout: number
    maxConcurrentExecutions: number
    logLevel: string
  }
}
```

## MCPの設定

- `path`: MCPの実装パス
- `enabled`: MCPの有効/無効
- 追加のMCP固有設定が可能

## グローバル設定

- `defaultTimeout`: デフォルトのタイムアウト時間(ms)
- `maxConcurrentExecutions`: 同時実行数の上限
- `logLevel`: ログレベル(debug/info/warn/error)

## 設定の更新方法

1. `scripts/generate-config.js`を編集
2. `pnpm generate:config`を実行
3. 生成された設定をレビュー
