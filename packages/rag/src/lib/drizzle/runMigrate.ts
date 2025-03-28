import { resolve } from "node:path"
import { sql } from "drizzle-orm"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import { logger } from "../logger"
import { serializeError } from "../../utils/serializeError"
import { withContext } from "../../context/withContext"

export const runMigrate = withContext(async ({ db }) => {
  try {
    logger.info("⏳ Running migrations...")

    const start = Date.now()

    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS vector;`)
    await migrate(db, {
      migrationsFolder: resolve(process.cwd(), "drizzle", "migrations"),
    })

    const end = Date.now()

    logger.info(`✅ Migrations completed in ${end - start}ms`)
  } catch (error) {
    logger.error("Failed to runMigrations", {
      error: serializeError(error),
    })
  }
})
