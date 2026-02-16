import fs from 'node:fs'
import path from 'node:path'

import Database from 'better-sqlite3'

import { getOptionalAppConfig } from '@/lib/config/env'

export function resolveDbPath(dbPath?: string): string {
  const configuredPath = dbPath ?? getOptionalAppConfig().chatDbPath
  if (path.isAbsolute(configuredPath)) {
    return configuredPath
  }

  return path.join(process.cwd(), configuredPath)
}

export function createDb(dbPath?: string): Database.Database {
  const resolvedPath = resolveDbPath(dbPath)
  fs.mkdirSync(path.dirname(resolvedPath), { recursive: true })
  return new Database(resolvedPath)
}
