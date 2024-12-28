import { defineConfig } from "orval"

export default defineConfig({
  petstore: {
    output: {
      mode: "split",
      target: "./src/generated/esa-api",
      client: "fetch",
      baseUrl: "https://api.esa.io",
      mock: true,
    },
    input: {
      target: "./openapi-spec/openapi.json",
    },
  },
})
