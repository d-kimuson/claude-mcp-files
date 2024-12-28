import { execSync } from "node:child_process"
import { writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import * as v from "valibot"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "..")
const homeDir = execSync("echo $HOME", { encoding: "utf-8" }).trim()

const envSchemas = {
  MCP_BRAVE_API_KEY: v.string(),
  MCP_NODE_PATH: v.optional(v.string(), "node"),
  MCP_NPX_PATH: v.optional(v.string(), "npx"),
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
} as const

type McpServer = {
  command: string
  args?: ReadonlyArray<string>
}

const defineMcpServer = <
  const N extends string,
  const T extends v.BaseSchema<any, any, any>,
  const Declare extends McpServer,
>(
  name: N,
  requiredEnvSchema: T,
  cb: (context: { env: v.InferOutput<T> }) => Declare | Promise<Declare>
) => {
  return {
    name,
    generateConfig: async () =>
      await cb({ env: v.parse(requiredEnvSchema, process.env) }),
  } as const
}

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
        path.replace("$HOME", homeDir).replace("~", homeDir)
      ),
    ],
  })
)

const braveSearchServer = defineMcpServer(
  "brave-search",
  v.object({
    MCP_NPX_PATH: envSchemas.MCP_NPX_PATH,
    MCP_BRAVE_API_KEY: envSchemas.MCP_BRAVE_API_KEY,
  }),
  ({ env }) => ({
    command: env.MCP_NPX_PATH,
    args: ["-y", "@modelcontextprotocol/server-brave-search"],
    env: {
      MCP_BRAVE_API_KEY: env.MCP_BRAVE_API_KEY,
    },
  })
)

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

const commandExecutorServer = defineMcpServer(
  "command-executor",
  v.object({
    MCP_NODE_PATH: envSchemas.MCP_NODE_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_NODE_PATH,
    args: [resolve(repoRoot, "command-executor-mcp", "build", "index.js")],
  })
)

const esaServer = defineMcpServer(
  "esa",
  v.object({
    MCP_NODE_PATH: envSchemas.MCP_NODE_PATH,
  }),
  ({ env }) => ({
    command: env.MCP_NODE_PATH,
    args: [resolve(repoRoot, "packages", "esa-mcp", "dist", "index.js")],
  })
)

const mcpServers = [
  filesystemServer,
  braveSearchServer,
  sequentialThinkingServer,
  commandExecutorServer,
  esaServer,
] as const

const generateConfig = async () => {
  const env = v.parse(
    v.object({
      MCP_DISABLE: envSchemas.MCP_DISABLE,
    }),
    process.env
  )
  const disables = env.MCP_DISABLE.split(",")

  const configs = await Promise.all(
    mcpServers.map(async ({ name, generateConfig }) => {
      if (disables.includes(name)) return null

      return {
        name,
        config: await generateConfig(),
      }
    })
  )

  return configs
    .filter((config) => config !== null)
    .reduce(
      (s, t) => ({
        ...s,
        [t.name]: t.config,
      }),
      {}
    )
}

const main = async () => {
  const config = await generateConfig()

  console.log("Configuration generated.", config)

  const outputPath = resolve(repoRoot, "claude_desktop_config.json")
  writeFileSync(outputPath, JSON.stringify(config, null, 2))
  console.log("Configuration file written to", outputPath)

  execSync(
    `cd '${homeDir}/Library/Application Support/Claude' && ln -f -s '${outputPath}' ./claude_desktop_config.json`,
    { stdio: "inherit" }
  )
  console.log("Configuration file linked to Claude Config.")
}

await main()
  .then(() => {
    console.log("Done")
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
