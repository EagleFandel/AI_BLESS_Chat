// @vitest-environment node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { MessagesRepository } from '@/lib/db/messagesRepository'
import type { Message } from '@/lib/types/chat'

const tempDirs: string[] = []

function createTempDbPath(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-bless-db-'))
  tempDirs.push(dir)
  return path.join(dir, 'chat.db')
}

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()
    if (!dir) {
      continue
    }

    fs.rmSync(dir, { recursive: true, force: true })
  }
})

describe('MessagesRepository', () => {
  it('saves and reads messages in ascending timestamp order', () => {
    const repo = new MessagesRepository({ dbPath: createTempDbPath() })
    const payload: Message[] = [
      { id: '2', role: 'assistant', content: 'B', timestamp: 200 },
      { id: '1', role: 'user', content: 'A', timestamp: 100 },
    ]

    repo.saveMessages(payload)
    const rows = repo.listMessages()
    repo.close()

    expect(rows).toHaveLength(2)
    expect(rows.map((row) => row.id)).toEqual(['1', '2'])
  })

  it('updates existing message records with INSERT OR REPLACE', () => {
    const repo = new MessagesRepository({ dbPath: createTempDbPath() })
    repo.saveMessages([{ id: '1', role: 'user', content: 'old', timestamp: 100 }])
    repo.saveMessages([
      { id: '1', role: 'assistant', content: 'new', timestamp: 150 },
    ])

    const rows = repo.listMessages()
    repo.close()

    expect(rows).toHaveLength(1)
    expect(rows[0].role).toBe('assistant')
    expect(rows[0].content).toBe('new')
    expect(rows[0].timestamp).toBe(150)
  })
})
