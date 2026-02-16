// @vitest-environment node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { GET, POST } from '@/app/api/messages/route'

const originalEnv = { ...process.env }
const tempDirs: string[] = []

function createTempDbPath(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-bless-route-msg-'))
  tempDirs.push(dir)
  return path.join(dir, 'chat.db')
}

function buildJsonRequest(payload: unknown): Request {
  return new Request('http://localhost/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

afterEach(() => {
  process.env = { ...originalEnv }

  while (tempDirs.length > 0) {
    const dir = tempDirs.pop()
    if (!dir) {
      continue
    }

    fs.rmSync(dir, { recursive: true, force: true })
  }
})

describe('messages route', () => {
  it('returns empty list before inserts', async () => {
    process.env.CHAT_DB_PATH = createTempDbPath()

    const response = await GET()
    const body = (await response.json()) as unknown[]

    expect(response.status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(0)
  })

  it('stores and reads back messages', async () => {
    process.env.CHAT_DB_PATH = createTempDbPath()

    const postResponse = await POST(
      buildJsonRequest({
        messages: [
          { id: 'u1', role: 'user', content: 'hello', timestamp: 10 },
          { id: 'a1', role: 'assistant', content: 'world', timestamp: 11 },
        ],
      }) as never
    )

    expect(postResponse.status).toBe(200)
    expect(await postResponse.json()).toEqual({ success: true })

    const getResponse = await GET()
    const rows = (await getResponse.json()) as Array<{ id: string }>
    expect(rows.map((row) => row.id)).toEqual(['u1', 'a1'])
  })

  it('rejects invalid payload shape', async () => {
    process.env.CHAT_DB_PATH = createTempDbPath()

    const response = await POST(
      buildJsonRequest({
        messages: [{ id: 'u1', role: 'bad', content: 'x', timestamp: 1 }],
      }) as never
    )
    const body = (await response.json()) as { error: string }

    expect(response.status).toBe(400)
    expect(body.error).toContain('messages')
  })
})
