import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  version: '1.0.0',
  mcps: {
    filesystem: {
      path: './mcps/filesystem-mcp',
      enabled: true,
    },
    'command-executor': {
      path: './mcps/command-executor-mcp',
      enabled: true,
    },
    brave: {
      path: './mcps/brave-mcp',
      enabled: true,
    },
    sequentialthinking: {
      path: './mcps/sequentialthinking-mcp',
      enabled: true,
    },
  },
  settings: {
    defaultTimeout: 30000,
    maxConcurrentExecutions: 4,
    logLevel: 'info',
  },
}

const outputPath = join(__dirname, '..', 'claude_desktop_config.json')
writeFileSync(outputPath, JSON.stringify(config, null, 2))
console.log(`Config generated at ${outputPath}`)