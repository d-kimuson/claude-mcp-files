import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import {
  getV1TeamsTeamNamePosts,
  getV1TeamsTeamNamePostsPostNumber,
} from "./generated/esa-api/esaAPI"
import { zodToJsonSchema } from "zod-to-json-schema"
import { version } from "../package.json"
import { Post } from "./generated/esa-api/esaAPI.schemas"

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

const sortSchema = z
  .union([
    z.literal("created"),
    z.literal("updated"),
    z.literal("number"),
    z.literal("stars"),
    z.literal("comments"),
    z.literal("best_match"),
  ])
  .default("best_match")

const searchPostsSchema = z.object({
  query: z.string(),
  order: z.union([z.literal("asc"), z.literal("desc")]).default("desc"),
  sort: sortSchema,
  page: z.number().default(1),
  perPage: z.number().default(200),
})

const readEsaPostSchema = z.object({
  postNumber: z.number(),
})

const readEsaMultiplePostsSchema = z.object({
  postNumbers: z.array(z.number()),
})

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_esa_posts",
        description: "Search posts in esa.io. Response is paginated.",
        inputSchema: zodToJsonSchema(searchPostsSchema),
      },
      {
        name: "read_esa_post",
        description: "Read a post in esa.io.",
        inputSchema: zodToJsonSchema(readEsaPostSchema),
      },
      {
        name: "read_esa_multiple_posts",
        description: "Read multiple posts in esa.io.",
        inputSchema: zodToJsonSchema(readEsaMultiplePostsSchema),
      },
    ],
  }
})

const fetchPostsRecursively = async (
  query: string,
  order: "asc" | "desc",
  sort: z.infer<typeof sortSchema>,
  currentPage: number,
  endPage: number
): Promise<Omit<Post, "body_html" | "body_md">[]> => {
  const response = await getV1TeamsTeamNamePosts(
    env.DEFAULT_ESA_TEAM,
    {
      q: query,
      order: order,
      sort: sort,
      page: currentPage,
      per_page: 10,
    },
    {
      headers: {
        Authorization: `Bearer ${env.ESA_API_KEY}`,
      },
    }
  )

  // esa 的には取ってきちゃうが、LLM が呼むのに全文は大きすぎるので外す
  const posts = (response.data.posts ?? []).map(
    ({ body_html, body_md, ...others }) => others
  )

  const nextPage = currentPage + 1

  if (nextPage === endPage) {
    return posts
  } else {
    return [
      ...posts,
      ...(await fetchPostsRecursively(query, order, sort, nextPage, endPage)),
    ]
  }
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params

    switch (name) {
      case "search_esa_posts":
        const parsed = searchPostsSchema.safeParse(args)
        if (!parsed.success) {
          throw new Error(`Invalid arguments for search_posts: ${parsed.error}`)
        }

        const startPage =
          (parsed.data.page - 1) * (parsed.data.perPage / 10) + 1
        const endPage = parsed.data.page * (parsed.data.perPage / 10)
        const nextPage = endPage + 1

        const posts = await fetchPostsRecursively(
          parsed.data.query,
          parsed.data.order,
          parsed.data.sort,
          startPage,
          endPage
        )

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                posts: posts,
                nextPage: nextPage,
              }),
            },
          ],
        }

      case "read_esa_post":
        const parsedRead = readEsaPostSchema.safeParse(args)
        if (!parsedRead.success) {
          throw new Error(
            `Invalid arguments for read_esa_post: ${parsedRead.error}`
          )
        }

        const response = await getV1TeamsTeamNamePostsPostNumber(
          env.DEFAULT_ESA_TEAM,
          parsedRead.data.postNumber,
          {},
          {
            headers: {
              Authorization: `Bearer ${env.ESA_API_KEY}`,
            },
          }
        )
        const { body_html, ...others } = response.data

        return {
          content: [{ type: "text", text: JSON.stringify(others) }],
        }

      case "read_esa_multiple_posts":
        const parsedReadMultiple = readEsaMultiplePostsSchema.safeParse(args)
        if (!parsedReadMultiple.success) {
          throw new Error(
            `Invalid arguments for read_esa_multiple_posts: ${parsedReadMultiple.error}`
          )
        }

        const multiplePosts = await Promise.all(
          parsedReadMultiple.data.postNumbers.map(async (postNumber) => {
            const response = await getV1TeamsTeamNamePostsPostNumber(
              env.DEFAULT_ESA_TEAM,
              postNumber,
              {},
              {
                headers: {
                  Authorization: `Bearer ${env.ESA_API_KEY}`,
                },
              }
            )
            const { body_html, ...others } = response.data

            return others
          })
        )

        return {
          content: [{ type: "text", text: JSON.stringify(multiplePosts) }],
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
