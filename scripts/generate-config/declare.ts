import { resolve } from "node:path"
import { createGenerateConfig, defineMcpServer, dirs } from "./helper"
import * as v from "valibot"

const envSchemas = {
  MCP_ESA_API_KEY: v.string(),
  MCP_ESA_DEFAULT_TEAM: v.string(),
  MCP_EXA_API_KEY: v.string(),
  MCP_FIGMA_API_KEY: v.string(),
  MCP_NODE_PATH: v.optional(v.string(), "node"),
  MCP_NPX_PATH: v.optional(v.string(), "npx"),
  MCP_UVX_PATH: v.optional(v.string(), "uvx"),
  MCP_CLAUDE_PATH: v.optional(v.string(), "claude"),
  /**
   * @example ""
   * @example "~/Apps,~/Playground"
   */
  MCP_APP_DIRS: v.optional(v.string(), "~"),
  MCP_GLOBAL_SHORTCUT: v.optional(v.string(), ""),
  /**
   * @example ""
   * @example "~/Apps,~/Playground"
   */
  MCP_DISABLE: v.optional(v.string(), ""),
  MCP_GITHUB_TOKEN: v.string(),
  MCP_SLACK_BOT_TOKEN: v.string(),
  MCP_SLACK_TEAM_ID: v.string(),
} as const

/**
 * Thinking
 */

const sequentialThinkingServer = defineMcpServer(
  "sequential-thinking",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
  })
)

const thinkServer = defineMcpServer(
  "think",
  v.object({
    MCP_NODE_PATH: envSchemas.MCP_NODE_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_NODE_PATH,
    args: [resolve(process.cwd(), "packages", "think", "dist", "index.js")],
  })
)

/**
 * Research
 */

const exaMcpServer = defineMcpServer(
  "exa",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
    MCP_EXA_API_KEY: envSchemas.MCP_EXA_API_KEY,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["-y", "exa-mcp-server"],
    env: {
      EXA_API_KEY: env.MCP_EXA_API_KEY,
    },
  })
)

const fetchServer = defineMcpServer(
  "fetch",
  v.object({
    MCP_UVX_PATH: envSchemas.MCP_UVX_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_UVX_PATH,
    args: ["mcp-server-fetch"],
  })
)

/**
 * Development
 */

const filesystemServer = defineMcpServer(
  "filesystem",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
    MCP_APP_DIRS: envSchemas.MCP_APP_DIRS,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      ...env.MCP_APP_DIRS.split(",").map((path) =>
        path.replace("$HOME", dirs.home).replace("~", dirs.home)
      ),
    ],
  })
)

const mcpServerCommandsServer = defineMcpServer(
  "mcp-server-commands",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["mcp-server-commands"],
  })
)

const githubServer = defineMcpServer(
  "github",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
    MCP_GITHUB_TOKEN: envSchemas.MCP_GITHUB_TOKEN,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["-y", "@modelcontextprotocol/server-github"],
    env: {
      GITHUB_PERSONAL_ACCESS_TOKEN: env.MCP_GITHUB_TOKEN,
    },
  })
)

/**
 * SaaS
 */

const slackServer = defineMcpServer(
  "slack",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
    MCP_SLACK_BOT_TOKEN: envSchemas.MCP_SLACK_BOT_TOKEN,
    MCP_SLACK_TEAM_ID: envSchemas.MCP_SLACK_TEAM_ID,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["-y", "@modelcontextprotocol/server-slack"],
    env: {
      SLACK_BOT_TOKEN: env.MCP_SLACK_BOT_TOKEN,
      SLACK_TEAM_ID: env.MCP_SLACK_TEAM_ID,
    },
  })
)

const esaServer = defineMcpServer(
  "esa-mcp-server",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
    MCP_ESA_API_KEY: envSchemas.MCP_ESA_API_KEY,
    MCP_ESA_DEFAULT_TEAM: envSchemas.MCP_ESA_DEFAULT_TEAM,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["-y", "esa-mcp-server"],
    env: {
      ESA_API_KEY: env.MCP_ESA_API_KEY,
      DEFAULT_ESA_TEAM: env.MCP_ESA_DEFAULT_TEAM,
    },
  })
)

const figmaServer = defineMcpServer(
  "figma-developer-mcp",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
    MCP_FIGMA_API_KEY: envSchemas.MCP_FIGMA_API_KEY,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["-y", "figma-developer-mcp", "--stdio"],
    env: {
      FIGMA_API_KEY: env.MCP_FIGMA_API_KEY,
    },
  })
)

/**
 * Others
 */

const timeServer = defineMcpServer(
  "time",
  v.object({
    MCP_UVX_PATH: envSchemas.MCP_UVX_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_UVX_PATH,
    args: ["mcp-server-time"],
  })
)

const playwrightServer = defineMcpServer(
  "playwright",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["-y", "@playwright/mcp@latest"],
  })
)

const mcpServers = [
  // thinking
  thinkServer,
  sequentialThinkingServer,

  // research
  exaMcpServer,
  fetchServer,

  // development
  filesystemServer,
  mcpServerCommandsServer,
  githubServer,
  slackServer,
  esaServer,
  figmaServer,

  // others
  timeServer,
  playwrightServer,
] as const

export type McpServerName = (typeof mcpServers)[number]["name"]

export const generateConfig = createGenerateConfig(
  v.object({
    MCP_DISABLE: envSchemas.MCP_DISABLE,
    MCP_GLOBAL_SHORTCUT: envSchemas.MCP_GLOBAL_SHORTCUT,
  }),
  mcpServers
)
