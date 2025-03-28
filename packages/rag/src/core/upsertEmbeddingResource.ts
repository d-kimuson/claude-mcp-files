import { eq, inArray } from "drizzle-orm/sql"
import type { NewResourceParams } from "../lib/drizzle/schema/resources"
import { documentEmbeddingsTable } from "../lib/drizzle/schema/documentEmbeddings"
import { documentsTable } from "../lib/drizzle/schema/documents"
import { embeddingsTable } from "../lib/drizzle/schema/embeddings"
import { resourcesTable } from "../lib/drizzle/schema/resources"
import { resolveEmbeddingAdapter } from "./adapter/resolver"
import { withContext } from "../context/withContext"
import { logger } from "../lib/logger"
import { stat } from "fs/promises"

const documentExtensions = [".md", ".txt", ".mdx", ".mdc"]

export const upsertEmbeddingResource = withContext(
  (ctx) =>
    async ({ projectId, filePath, content }: NewResourceParams) => {
      try {
        const stats = await stat(filePath)

        const adapter = resolveEmbeddingAdapter(ctx)
        const embeddings = await adapter.generateFileEmbeddings(
          content,
          filePath
        )

        let documentId: string | undefined

        if (documentExtensions.some((ext) => filePath.endsWith(ext))) {
          // Store in document knowledge
          // clear past embeddings
          const pastDocument = await ctx.db.query.documents.findFirst({
            where: eq(documentsTable.filePath, filePath),
          })

          if (pastDocument !== undefined) {
            documentId = pastDocument.id
            if (pastDocument.updatedAt.getTime() === stats.mtime.getTime()) {
              logger.info(`Skipped: ${filePath}. Reason: not modified.`)
              return "Resource already exists and is up to date."
            }

            await ctx.db
              .delete(documentEmbeddingsTable)
              .where(eq(documentEmbeddingsTable.documentId, pastDocument.id))

            await ctx.db
              .update(documentsTable)
              .set({
                content,
                updatedAt: stats.mtime,
              })
              .where(eq(documentsTable.filePath, filePath))
          } else {
            // insert document and embeddings
            const [document] = await ctx.db
              .insert(documentsTable)
              .values({ projectId, filePath, content })
              .returning()

            if (document === undefined) {
              logger.warn(
                `Failed to insert document. skipping embeddings. ${filePath}`
              )
              return
            }

            documentId = document.id
          }

          await ctx.db.insert(documentEmbeddingsTable).values(
            embeddings.map((embedding) => ({
              documentId: documentId!,
              content: embedding.content,
              embedding: embedding.embedding,
              metadata: {
                filePath,
                startLine: embedding.startLine,
                endLine: embedding.endLine,
              },
            }))
          )
        } else {
          let resourceId: string | undefined

          // Store in resources
          // clear past embeddings
          const pastResource = await ctx.db.query.resources.findFirst({
            where: eq(resourcesTable.filePath, filePath),
          })

          if (pastResource !== undefined) {
            resourceId = pastResource.id
            if (pastResource.updatedAt.getTime() === stats.mtime.getTime()) {
              logger.info(`Skipped (not modified): ${filePath}`)
              return "Resource already exists and is up to date."
            }

            await ctx.db
              .delete(embeddingsTable)
              .where(eq(embeddingsTable.resourceId, pastResource.id))

            await ctx.db
              .update(resourcesTable)
              .set({
                content,
                updatedAt: stats.mtime,
              })
              .where(eq(resourcesTable.filePath, filePath))
          } else {
            // insert resource and embeddings
            const [resource] = await ctx.db
              .insert(resourcesTable)
              .values({ projectId, filePath, content })
              .returning()

            if (resource === undefined) {
              logger.warn(
                `Failed to insert resource. skipping embeddings. ${filePath}`
              )
              return
            }

            resourceId = resource.id
          }

          await ctx.db.insert(embeddingsTable).values(
            embeddings.map((embedding) => ({
              resourceId: resourceId!,
              content: embedding.content,
              embedding: embedding.embedding,
              metadata: {
                filePath,
                startLine: embedding.startLine,
                endLine: embedding.endLine,
              },
            }))
          )

          logger.info(`Indexed: ${filePath}`)
        }

        return "Resource successfully created and embedded."
      } catch (e) {
        if (e instanceof Error)
          return e.message.length > 0 ? e.message : "Error, please try again."
      }
    }
)
