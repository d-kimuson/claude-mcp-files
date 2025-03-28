import { createDbClient } from "../lib/drizzle"
import { constraints } from "../utils/constraints"
import { envUtils } from "../utils/envUtils"
import type { Context } from "./interface"

export const createContext = async (): Promise<Context> => {
  const { db } = createDbClient(constraints.database.url)

  return {
    db,
    databaseUrl: constraints.database.url,
    provider: {
      type: "openai",
      model: "text-embedding-ada-002",
      apiKey: envUtils.getEnv("OPENAI_API_KEY"),
    },
  }
}
