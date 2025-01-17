import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { getV1TeamsTeamNamePosts } from "./generated/esa-api/esaAPI"
import { zodToJsonSchema } from "zod-to-json-schema"
import { version } from "../package.json"

const env = z
  .object({
    ESA_API_KEY: z.string(),
    DEFAULT_ESA_TEAM: z.string(),
  })
  .parse(process.env)

const server = new Server(
  {
    name: "esa-server",
    version: version,
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
)

const searchPostsSchema = z.object({
  query: z.string(),
  order: z.union([z.literal("asc"), z.literal("desc")]).default("desc"),
  sort: z
    .union([
      z.literal("created"),
      z.literal("updated"),
      z.literal("number"),
      z.literal("stars"),
      z.literal("comments"),
      z.literal("best_match"),
    ])
    .default("best_match")
    .optional(),
  page: z.number().optional(),
  perPage: z.number().optional().default(10),
})

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_esa_posts",
        description: "Search posts in esa.io. Response is paginated.",
        inputSchema: zodToJsonSchema(searchPostsSchema),
      },
    ],
  }
})

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params

    switch (name) {
      case "search_esa_posts":
        const parsed = searchPostsSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid arguments for search_posts: ${parsed.error}`)
        }

        const response = await getV1TeamsTeamNamePosts(
          env.DEFAULT_ESA_TEAM,
          {
            q: parsed.data.query,
            order: parsed.data.order,
            sort: parsed.data.sort,
            page: parsed.data.page,
            per_page: parsed.data.perPage,
          },
          {
            headers: {
              Authorization: `Bearer ${env.ESA_API_KEY}`,
            },
          }
        )

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                posts: response.data.posts ?? [],
                nextPage: response.data.next_page,
              }),
            },
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
