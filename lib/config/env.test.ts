// @vitest-environment node

import { afterEach, describe, expect, it } from 'vitest'

import { ENV_DEFAULTS, MissingEnvError, getAppConfig, getOptionalAppConfig } from '@/lib/config/env'

const originalEnv = { ...process.env }

afterEach(() => {
  process.env = { ...originalEnv }
})

describe('getOptionalAppConfig', () => {
  it('returns defaults when optional values are absent', () => {
    delete process.env.API_KEY
    delete process.env.API_URL
    delete process.env.AI_MODEL
    delete process.env.CHAT_DB_PATH

    const config = getOptionalAppConfig()
    expect(config.apiKey).toBeUndefined()
    expect(config.apiUrl).toBe(ENV_DEFAULTS.apiUrl)
    expect(config.aiModel).toBe(ENV_DEFAULTS.aiModel)
    expect(config.chatDbPath).toBe(ENV_DEFAULTS.chatDbPath)
  })

  it('prefers explicit environment variables', () => {
    process.env.API_KEY = 'test-key'
    process.env.API_URL = 'https://example.com/chat'
    process.env.AI_MODEL = 'model-x'
    process.env.CHAT_DB_PATH = 'tmp/custom.db'

    const config = getOptionalAppConfig()
    expect(config.apiKey).toBe('test-key')
    expect(config.apiUrl).toBe('https://example.com/chat')
    expect(config.aiModel).toBe('model-x')
    expect(config.chatDbPath).toBe('tmp/custom.db')
  })
})

describe('getAppConfig', () => {
  it('throws MissingEnvError when API_KEY is missing', () => {
    delete process.env.API_KEY
    expect(() => getAppConfig()).toThrowError(MissingEnvError)
  })

  it('returns required config when API_KEY exists', () => {
    process.env.API_KEY = 'demo'
    const config = getAppConfig()
    expect(config.apiKey).toBe('demo')
  })
})
