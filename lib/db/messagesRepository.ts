import type Database from 'better-sqlite3'

import { createDb } from '@/lib/db/connection'
import { runMigrations } from '@/lib/db/migrations'
import type { Message } from '@/lib/types/chat'

interface MessagesRepositoryOptions {
  dbPath?: string
  db?: Database.Database
}

export class MessagesRepository {
  private readonly db: Database.Database
  private readonly ownsConnection: boolean

  constructor(options: MessagesRepositoryOptions = {}) {
    if (options.db) {
      this.db = options.db
      this.ownsConnection = false
    } else {
      this.db = createDb(options.dbPath)
      this.ownsConnection = true
    }

    runMigrations(this.db)
  }

  listMessages(): Message[] {
    return this.db
      .prepare(
        `
        SELECT id, role, content, timestamp
        FROM messages
        ORDER BY timestamp ASC
        `
      )
      .all() as Message[]
  }

  saveMessages(messages: Message[]): void {
    if (!messages.length) {
      return
    }

    const insert = this.db.prepare(`
      INSERT OR REPLACE INTO messages (id, role, content, timestamp)
      VALUES (?, ?, ?, ?)
    `)

    const transaction = this.db.transaction((items: Message[]) => {
      for (const item of items) {
        insert.run(item.id, item.role, item.content, item.timestamp)
      }
    })

    transaction(messages)
  }

  close(): void {
    if (this.ownsConnection) {
      this.db.close()
    }
  }
}
