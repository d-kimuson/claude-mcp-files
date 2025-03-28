import { z } from "zod"

const envSchema = z
  .object({
    OPENAI_API_KEY: z.string(),
  })
  .partial()

type Env = z.infer<typeof envSchema>

export const envUtils = (() => {
  let env: Env | null = null

  return {
    getEnv: <K extends keyof Env>(key: K): NonNullable<Env[K]> => {
      env ??= envSchema.parse(process.env)

      const value = env[key]
      if (value === undefined) {
        throw new Error(`Environment variable ${String(key)} is required`)
      }

      return value
    },
  }
})()
