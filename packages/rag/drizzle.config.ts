import type { Config } from "drizzle-kit"

export default {
  schema: "./src/lib/drizzle/schema",
  dialect: "postgresql",
  out: "./drizzle/migrations",
} satisfies Config
