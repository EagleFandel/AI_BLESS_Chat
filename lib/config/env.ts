const DEFAULT_API_URL = 'https://cloud.infini-ai.com/maas/v1/chat/completions'
const DEFAULT_AI_MODEL = 'deepseek-v3.2'
const DEFAULT_CHAT_DB_PATH = 'data/chat.db'

export interface OptionalAppConfig {
  apiKey?: string
  apiUrl: string
  aiModel: string
  chatDbPath: string
}

export interface AppConfig extends OptionalAppConfig {
  apiKey: string
}

export class MissingEnvError extends Error {
  readonly key: string

  constructor(key: string) {
    super(`Missing required environment variable: ${key}`)
    this.name = 'MissingEnvError'
    this.key = key
  }
}

function readEnv(name: string): string | undefined {
  const value = process.env[name]
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function getOptionalAppConfig(): OptionalAppConfig {
  return {
    apiKey: readEnv('API_KEY'),
    apiUrl: readEnv('API_URL') ?? DEFAULT_API_URL,
    aiModel: readEnv('AI_MODEL') ?? DEFAULT_AI_MODEL,
    chatDbPath: readEnv('CHAT_DB_PATH') ?? DEFAULT_CHAT_DB_PATH,
  }
}

export function getAppConfig(): AppConfig {
  const config = getOptionalAppConfig()
  if (!config.apiKey) {
    throw new MissingEnvError('API_KEY')
  }

  return {
    ...config,
    apiKey: config.apiKey,
  }
}

export const ENV_DEFAULTS = {
  apiUrl: DEFAULT_API_URL,
  aiModel: DEFAULT_AI_MODEL,
  chatDbPath: DEFAULT_CHAT_DB_PATH,
}
