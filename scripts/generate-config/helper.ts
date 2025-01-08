import { execSync } from "node:child_process"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import * as v from "valibot"

const __dirname = dirname(fileURLToPath(import.meta.url))

export const dirs = {
  root: resolve(__dirname, "..", ".."),
  home: execSync("echo $HOME", { encoding: "utf-8" }).trim(),
} as const

type McpServer = {
  command: string
  args?: ReadonlyArray<string>
  env?: Record<string, string>
}

type McpDeclare = {
  name: string
  generateConfig: () => Promise<McpServer>
}

export const defineMcpServer = <
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
  } as const satisfies McpDeclare
}

export const createGenerateConfig =
  <S extends v.BaseSchema<any, any, any>>(
    envSchemas: S,
    mcpServers: ReadonlyArray<McpDeclare>
  ) =>
  async () => {
    const env = v.parse(envSchemas, process.env)
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

    return {
      mcpServers: configs
        .filter((config) => config !== null)
        .reduce(
          (s, t) => ({
            ...s,
            [t.name]: t.config,
          }),
          {}
        ),
      globalShortcut: env.MCP_GLOBAL_SHORTCUT,
    }
  }
