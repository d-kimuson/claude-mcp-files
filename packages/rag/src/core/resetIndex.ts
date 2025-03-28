import { eq, inArray } from "drizzle-orm"
import { embeddingsTable } from "../lib/drizzle/schema/embeddings"
import { projectsTable } from "../lib/drizzle/schema/projects"
import { resourcesTable } from "../lib/drizzle/schema/resources"
import { withContext } from "../context/withContext"
import { logger } from "../lib/logger"

export const resetIndex = withContext(
  async (ctx) => async (projectDirectory: string) => {
    const [project] = await ctx.db
      .select()
      .from(projectsTable)
      .where(eq(projectsTable.name, projectDirectory))
      .limit(1)
    if (project === undefined) {
      return
    }

    const resources = await ctx.db
      .select()
      .from(resourcesTable)
      .where(eq(resourcesTable.projectId, project.id))

    await ctx.db.delete(embeddingsTable).where(
      inArray(
        embeddingsTable.resourceId,
        resources.map((r) => r.id)
      )
    )
    await ctx.db
      .delete(resourcesTable)
      .where(eq(resourcesTable.projectId, project.id))

    logger.info(`Index for ${projectDirectory} is successfully deleted.`)
  }
)
