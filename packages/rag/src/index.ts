import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { version } from "../package.json"
import { createContext } from "./context/createContext"
import { indexCodebase } from "./core/indexCodebase"
import { findRelevantDocuments } from "./core/findRelevantDocuments"
import { findRelevantResources } from "./core/findRelevantResources"
import { formatRagContents } from "./core/formatRagContents"

const [_node, _file, name, targetDirectory] = process.argv

if (targetDirectory === undefined || name === undefined) {
  throw new Error("target directory and name are required")
}

const ctx = await createContext()

const server = new McpServer({
  name: `rag-codebase-${name}`,
  version: version,
})

server.tool(
  `${name}-find-relevant-documents`,
  "Find relevant documents from the codebase.",
  {
    question: z.string().describe("A question to ask."),
  },
  async ({ question }) => {
    const ctx = await createContext()
    const documents = await findRelevantDocuments(ctx)(question)
    return {
      content: [{ type: "text", text: formatRagContents(documents) }],
    }
  }
)

server.tool(
  `${name}-find-relevant-resources`,
  "Find relevant resources from the codebase.",
  {
    question: z.string().describe("A question to ask."),
  },
  async ({ question }) => {
    const ctx = await createContext()
    const resources = await findRelevantResources(ctx)(question)
    return {
      content: [{ type: "text", text: formatRagContents(resources) }],
    }
  }
)

await indexCodebase(ctx)(targetDirectory)

const transport = new StdioServerTransport()
await server.connect(transport)
