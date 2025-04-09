import { resolve } from "node:path"
import { generateConfig } from "./declare"
import { dirs } from "./helper"
import { existsSync, writeFileSync } from "node:fs"
import { execSync } from "node:child_process"
import * as v from "valibot"
import { readFile } from "node:fs/promises"

const localConfigFile = resolve(dirs.root, "local.mcp.json")

const main = async () => {
  const config = await generateConfig()
  console.log("Configuration generated.", config)

  const merged = {
    ...config,
    mcpServers: {
      ...config.mcpServers,
      ...(existsSync(localConfigFile)
        ? JSON.parse(await readFile(localConfigFile, { encoding: "utf-8" }))[
            "mcpServers"
          ]
        : {}),
    },
  }

  const outputPath = resolve(dirs.root, "claude_desktop_config.json")
  writeFileSync(outputPath, JSON.stringify(merged, null, 2))
  console.log("Configuration file written to", outputPath)

  execSync(
    `ln -s -f '${outputPath}' '${dirs.home}/Library/Application Support/Claude/claude_desktop_config.json'`,
    { stdio: "inherit" }
  )
  console.log("Configuration file copied to Claude Config.")
}

await main()
  .then(() => {
    console.log("Done")
  })
  .catch((error) => {
    if (error instanceof v.ValiError) {
      for (const issue of error.issues) {
        console.error("ValidationError", {
          keys: issue.path.map(({ key }) => key),
          message: issue.message,
          expected: issue.expected,
          received: issue.received,
        })
      }
    } else {
      console.error(error)
    }

    process.exit(1)
  })
