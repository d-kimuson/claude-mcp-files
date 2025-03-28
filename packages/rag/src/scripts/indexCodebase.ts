import { createContext } from "../context/createContext"
import { indexCodebase } from "../core/indexCodebase"
import { runMigrate } from "../lib/drizzle/runMigrate"
import { logger } from "../lib/logger"

const main = async () => {
  logger.setRuntime("cli")

  const [_node, _script, directory] = process.argv
  if (directory === undefined) {
    throw new Error("Directory is required")
  }

  const ctx = await createContext()
  await indexCodebase(ctx)(directory)
}

await main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
