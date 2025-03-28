import { existsSync } from "node:fs"
import { readFile, readdir, stat } from "node:fs/promises"
import path from "node:path"
import { eq } from "drizzle-orm"
import ignore from "ignore"
import { projectsTable } from "../lib/drizzle/schema/projects"
import { upsertEmbeddingResource } from "./upsertEmbeddingResource"
import { logger } from "../lib/logger"
import { withContext } from "../context/withContext"

/**
 * Reads the .gitignore file and returns an ignore instance
 * @param rootDir Root directory where .gitignore is located
 * @returns Ignore instance containing .gitignore rules
 */
const getGitIgnore = async (rootDir: string): Promise<ignore.Ignore> => {
  const ig = ignore()

  try {
    const gitignorePath = path.join(rootDir, ".gitignore")
    if (existsSync(gitignorePath)) {
      const gitignoreContent = await readFile(gitignorePath, {
        encoding: "utf8",
      })
      ig.add(gitignoreContent)
    }
  } catch (error) {
    logger.error("Error reading .gitignore file:", error)
  }

  return ig
}

const blackList = [".git", ".DS_Store"]

/**
 * Recursively traverses the directory and indexes all code files
 * @param projectId ID of the project to associate resources with
 * @param rootDir Root directory to start traversal
 * @param currentDir Current directory being traversed (used for recursion)
 * @param gitIgnore Ignore instance containing .gitignore rules
 * @returns Promise that resolves when all files are indexed
 */
const traverseDirectory = withContext(
  (ctx) =>
    async (
      projectId: string,
      rootDir: string,
      currentDir: string = rootDir,
      gitIgnoresRec: {
        baseDir: string
        ignore: ignore.Ignore
      }[] = []
    ): Promise<string[]> => {
      const results: string[] = []
      const gitIgnores = [
        ...gitIgnoresRec,
        {
          baseDir: currentDir,
          ignore: await getGitIgnore(currentDir),
        },
      ]

      try {
        const entries = await readdir(currentDir, { withFileTypes: true })

        await Promise.all(
          entries.map(async (entry) => {
            const entryPath = path.join(currentDir, entry.name)

            // Skip if entry is ignored
            if (
              gitIgnores.some(({ ignore, baseDir }) =>
                ignore.ignores(path.relative(baseDir, entryPath))
              ) ||
              blackList.includes(entry.name)
            ) {
              return
            }

            if (entry.isDirectory()) {
              // Recursively traverse subdirectory
              const subResults = await traverseDirectory(ctx)(
                projectId,
                rootDir,
                entryPath,
                gitIgnores
              )
              results.push(...subResults)
            } else if (entry.isFile()) {
              try {
                // Read file content
                const content = await readFile(entryPath, {
                  encoding: "utf8",
                })

                // Create resource and generate embeddings
                await upsertEmbeddingResource(ctx)({
                  projectId,
                  filePath: entryPath,
                  content,
                })

                results.push(entryPath)
              } catch (error) {
                logger.error(`Error indexing file ${entryPath}:`, error)
              }
            }
          })
        )
      } catch (error) {
        logger.error(`Error traversing directory ${currentDir}:`, error)
      }

      return results
    }
)

/**
 * Indexes all code files in a directory, excluding paths specified in .gitignore
 * @param directoryPath Path to the directory to index
 * @returns Promise that resolves with an array of indexed file paths
 */
export const indexCodebase = withContext(
  (ctx) =>
    async (directoryPath: string): Promise<string[]> => {
      try {
        // Resolve absolute path
        const absolutePath = directoryPath.startsWith("/")
          ? directoryPath
          : path.resolve(process.cwd(), directoryPath)

        // Check if directory exists
        if (
          !existsSync(absolutePath) ||
          !(await stat(absolutePath)).isDirectory()
        ) {
          throw new Error(`Directory not found: ${absolutePath}`)
        }

        // Get or create project
        const projects = await ctx.db
          .select()
          .from(projectsTable)
          .where(eq(projectsTable.name, absolutePath))
          .limit(1)

        let project = projects[0]

        if (!project) {
          const [newProject] = await ctx.db
            .insert(projectsTable)
            .values({ name: absolutePath })
            .returning()
          project = newProject
        }

        if (!project) {
          throw new Error(`Failed to create or find project: ${absolutePath}`)
        }

        // Traverse directory and index all code files
        logger.info(`Starting indexing of codebase at: ${absolutePath}`)
        const indexedFiles = await traverseDirectory(ctx)(
          project.id,
          absolutePath,
          absolutePath,
          []
        )
        logger.info(`Indexing complete. Indexed ${indexedFiles.length} files.`)

        return indexedFiles
      } catch (error) {
        logger.error("Error indexing codebase:", error)
        throw error
      }
    }
)
