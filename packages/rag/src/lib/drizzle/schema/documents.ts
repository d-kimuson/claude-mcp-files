import {
  text,
  varchar,
  timestamp,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core"
import { createSelectSchema } from "drizzle-zod"
import { nanoid } from "nanoid"
import type { z } from "zod"
import { projectsTable } from "./projects"

/**
 * ドキュメント（Markdown, 企画書, 仕様書など想定）
 *  - プロジェクトIDで紐づく
 *  - タイトルや記事本文などを保持
 */
export const documentsTable = pgTable(
  "documents",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    projectId: varchar("project_id", { length: 191 })
      .references(() => projectsTable.id)
      .notNull(),
    filePath: varchar("file_path", { length: 1024 }).notNull(),
    content: text("content").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [uniqueIndex("filePathProjectId").on(t.filePath, t.projectId)]
)

// Schema for documents - used to validate API requests
export const insertDocumentSchema = createSelectSchema(documentsTable)
  .extend({})
  .omit({
    id: true,
    updatedAt: true,
  })

// Type for documents - used to type API request params and within Components
export type NewDocumentParams = z.infer<typeof insertDocumentSchema>
