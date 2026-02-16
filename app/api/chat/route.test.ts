// @vitest-environment node

import { afterEach, describe, expect, it, vi } from 'vitest'

import { POST } from '@/app/api/chat/route'

const originalEnv = { ...process.env }

function buildRequest(payload: unknown): Request {
  return new Request('http://localhost/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

afterEach(() => {
  process.env = { ...originalEnv }
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('chat route', () => {
  it('returns content when upstream succeeds', async () => {
    process.env.API_KEY = 'demo-key'
    process.env.API_URL = 'https://example.test/chat'
    process.env.AI_MODEL = 'demo-model'

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: 'assistant answer' } }],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )
    vi.stubGlobal('fetch', fetchMock)

    const response = await POST(buildRequest({ message: 'hi' }) as never)
    const body = (await response.json()) as { content: string }

    expect(response.status).toBe(200)
    expect(body.content).toBe('assistant answer')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns 400 when message is missing', async () => {
    process.env.API_KEY = 'demo-key'
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const response = await POST(buildRequest({ message: '' }) as never)
    const body = (await response.json()) as { error: string }

    expect(response.status).toBe(400)
    expect(body.error).toContain('message')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns 500 when API_KEY is not configured', async () => {
    delete process.env.API_KEY
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    const response = await POST(buildRequest({ message: 'hello' }) as never)
    const body = (await response.json()) as { error: string }

    expect(response.status).toBe(500)
    expect(body.error).toContain('配置')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns 500 when upstream request fails', async () => {
    process.env.API_KEY = 'demo-key'

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: { message: 'upstream failed' },
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      )
    )
    vi.stubGlobal('fetch', fetchMock)

    const response = await POST(buildRequest({ message: 'hello' }) as never)
    const body = (await response.json()) as { error: string }

    expect(response.status).toBe(500)
    expect(body.error).toContain('请求失败')
  })
})
