import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { z } from "zod"
import { zodToJsonSchema } from "zod-to-json-schema"
import { version } from "../package.json"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const env = z
  .object({
    KNOWLEDGE_JSON_PATH: z
      .string()
      .default(resolve(".", "stored_knowledge.json"))
      .transform((path) => resolve(path)),
  })
  .parse(process.env)

const server = new Server(
  {
    name: "stored-knowledge-server",
    version: version,
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
)

const saveKnowledgeSchema = z.object({
  referenceKey: z.string(),
  contentMd: z.string(),
})

const getReferenceKeysSchema = z.object({})

const referenceKnowledgeSchema = z.object({
  referenceKeys: z.array(z.string()),
})

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "save_knowledge",
        description:
          "Store knowledge that should be preserved while performing tasks. The stored knowledge can be referenced when performing other similar tasks.Since the specified data is appended rather than overwritten, there is no need to provide previous knowledge again. Only provide the knowledge you want to add for the current task.Please provide the knowledge in markdown format.",
        inputSchema: zodToJsonSchema(saveKnowledgeSchema),
      },
      {
        name: "get_reference_keys",
        description:
          "Retrieve a list of reference keys for knowledge from similarly performed tasks.",
        inputSchema: zodToJsonSchema(getReferenceKeysSchema),
      },
      {
        name: "reference_knowledge",
        description:
          "Reference knowledge from previously performed similar tasks. Reference keys are required to retrieve knowledge. Multiple reference keys can be specified, and it is recommended to get a list using get_reference_keys first and then specify all potentially relevant keys.",
        inputSchema: zodToJsonSchema(referenceKnowledgeSchema),
      },
    ],
  }
})

const knowledgeJsonSchema = z.array(
  z.object({
    referenceKey: z.string(),
    contentMd: z.string(),
  })
)

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params

    const rawFileContent = (() => {
      try {
        return readFileSync(env.KNOWLEDGE_JSON_PATH, { encoding: "utf-8" })
      } catch (error: unknown) {
        console.error(error)
        const initContent = JSON.stringify([])
        writeFileSync(env.KNOWLEDGE_JSON_PATH, initContent, {
          encoding: "utf-8",
        })
        return initContent
      }
    })()

    const knowledge = knowledgeJsonSchema.parse(JSON.parse(rawFileContent))

    switch (name) {
      case "save_knowledge":
        const parsed = saveKnowledgeSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid arguments for search_posts: ${parsed.error}`)
        }

        const index = knowledge.findIndex(
          (k) => k.referenceKey === parsed.data.referenceKey
        )

        if (index === -1) {
          knowledge.push(parsed.data)
        } else {
          knowledge[index].contentMd =
            knowledge[index].contentMd + "\n\n" + parsed.data.contentMd
        }

        return {
          content: [{ type: "text", text: "success" }],
        }

      case "get_reference_keys":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(knowledge.map((k) => k.referenceKey)),
            },
          ],
        }

      case "reference_knowledge":
        const parsedReference = referenceKnowledgeSchema.safeParse(args)
        if (!parsedReference.success) {
          throw new Error(
            `Invalid arguments for reference_knowledge: ${parsedReference.error}`
          )
        }

        const referenceKeys = parsedReference.data.referenceKeys

        const referencedKnowledge = knowledge.filter((k) =>
          referenceKeys.includes(k.referenceKey)
        )

        return {
          content: [
            { type: "text", text: JSON.stringify(referencedKnowledge) },
          ],
        }
      default:
        throw new Error(`Unknown tool: ${name}`)
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return {
      content: [{ type: "text", text: `Error: ${errorMessage}` }],
      isError: true,
    }
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
