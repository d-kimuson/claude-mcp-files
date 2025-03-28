import { createContext } from "../context/createContext"
import { runMigrate } from "../lib/drizzle/runMigrate"
import { logger } from "../lib/logger"

const main = async () => {
  logger.setRuntime("cli")
  const ctx = await createContext()
  await runMigrate(ctx)
}

await main()
  .then(() => {
    process.exit(0)
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
