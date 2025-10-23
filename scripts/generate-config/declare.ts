import { resolve } from "node:path"
import { createGenerateConfig, defineMcpServer, dirs } from "./helper"
import * as v from "valibot"
import { homedir } from "node:os"

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
  MCP_OPENAI_API_KEY: v.string(),
  MCP_RAG_PROJECTS: v.optional(v.string(), ""),
} as const

/**
 * Thinking
 */

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

const modularMcpServer = defineMcpServer(
  "modular-mcp",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: [
      "-y",
      "@kimuson/modular-mcp@latest",
      `${homedir()}/dotfiles/modular-mcp.json`,
    ],
  })
)

const mcpServers = [
  // thinking
  thinkServer,

  // development
  filesystemServer,

  // others
  modularMcpServer,
] as const

export type McpServerName = (typeof mcpServers)[number]["name"]

export const generateConfig = createGenerateConfig(
  v.object({
    MCP_DISABLE: envSchemas.MCP_DISABLE,
    MCP_GLOBAL_SHORTCUT: envSchemas.MCP_GLOBAL_SHORTCUT,
  }),
  mcpServers
)
