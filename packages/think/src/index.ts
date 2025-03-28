import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { version } from "../package.json"

const server = new McpServer({
  name: "think",
  version: version,
})

server.tool(
  "think",
  "Use the tool to think about something. It will not obtain new information or change the database, but just append the thought to the log. Use it when complex reasoning or some cache memory is needed.",
  {
    thought: z.string().describe("A thought to think about."),
  },
  async () => {
    return {
      content: [{ type: "text", text: "success" }],
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
