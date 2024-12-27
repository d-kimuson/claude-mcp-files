import { Server } from "@modelcontextprotocol/sdk/server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";
import axios from "axios";

const AccessTokenSchema = z.object({
  accessToken: z.string(),
  teamName: z.string(),
});

export class EsaMCPServer extends Server {
  private accessToken?: string;
  private teamName?: string;
  private baseUrl = "https://api.esa.io/v1";

  constructor() {
    super(
      {
        name: "esa-mcp",
        version: "0.1.0",
      },
      {
        capabilities: {
          resources: {},
          prompts: {},
        },
      }
    );

    this.setRequestHandler("resources/list", async () => {
      const posts = await this.listPosts();
      return {
        resources: posts.map(post => ({
          uri: `esa://${this.teamName}/posts/${post.number}`,
          name: post.name,
          description: `Category: ${post.category || 'None'}, Tags: ${post.tags.join(', ')}`,
        })),
      };
    });

    this.setRequestHandler("resources/read", async (request) => {
      const uri = request.params.uri as string;
      const match = uri.match(/^esa:\/\/([^/]+)\/posts\/(\d+)$/);
      if (!match) throw new Error("Invalid URI format");

      const [, team, postNumber] = match;
      if (team !== this.teamName) throw new Error("Team mismatch");

      const post = await this.getPost(parseInt(postNumber));
      return {
        contents: [
          {
            uri: request.params.uri,
            mimeType: "text/markdown",
            text: post.body_md,
          },
        ],
      };
    });

    this.setRequestHandler("prompts/init", async (request) => {
      const { accessToken, teamName } = AccessTokenSchema.parse(request.params);
      this.accessToken = accessToken;
      this.teamName = teamName;
      return { success: true };
    });
  }

  private async listPosts() {
    if (!this.accessToken || !this.teamName) throw new Error("Not initialized");

    const response = await axios.get(`${this.baseUrl}/teams/${this.teamName}/posts`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });

    return response.data.posts;
  }

  private async getPost(number: number) {
    if (!this.accessToken || !this.teamName) throw new Error("Not initialized");

    const response = await axios.get(
      `${this.baseUrl}/teams/${this.teamName}/posts/${number}`,
      {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      }
    );

    return response.data;
  }
}

if (require.main === module) {
  const server = new EsaMCPServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}