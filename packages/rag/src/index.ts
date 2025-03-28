import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { version } from "../package.json"
import { createContext } from "./context/createContext"
import { indexCodebase } from "./core/indexCodebase"

const server = new McpServer({
  name: "rag",
  version: version,
})

server.tool(
  "rag",
  "TBD",
  {
    question: z.string().describe("A question to ask."),
  },
  async () => {
    return {
      content: [{ type: "text", text: "success" }],
    }
  }
)

const [_node, _file, targetDirectory] = process.argv

if (targetDirectory === undefined) {
  throw new Error("target directory is required")
}

const ctx = await createContext()
await indexCodebase(ctx)(targetDirectory)

const transport = new StdioServerTransport()
await server.connect(transport)
