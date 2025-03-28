import { DB } from "../lib/drizzle"

export type Context = {
  provider: {
    type: "openai"
    model: string
    apiKey: string
  }
  db: DB
  databaseUrl: string
}
