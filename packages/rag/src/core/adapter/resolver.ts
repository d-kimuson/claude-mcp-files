import { openai } from "@ai-sdk/openai"

import { aiSdkEmbeddingAdapter } from "./aiSdkAdapter"
import { withContext } from "../../context/withContext"

export const resolveEmbeddingAdapter = withContext(({ provider }) => {
  switch (provider.type) {
    case "openai": {
      const model = openai.embedding(provider.model, {
        user: provider.apiKey,
      })
      return aiSdkEmbeddingAdapter(model)
    }
    default:
      throw new Error(
        `Unsupported embedding provider: ${String(provider.type)}`
      )
  }
})
