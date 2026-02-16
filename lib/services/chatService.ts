import { requestInfiniCompletion, UpstreamAIError } from '@/lib/ai/infiniClient'
import { SYSTEM_PROMPT } from '@/lib/ai/systemPrompt'
import { getAppConfig, MissingEnvError } from '@/lib/config/env'

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export { MissingEnvError, UpstreamAIError }

export function normalizeUserMessage(message: unknown): string {
  if (typeof message !== 'string' || message.trim().length === 0) {
    throw new ValidationError('message 字段不能为空')
  }

  return message.trim()
}

export async function generateAssistantReply(message: string): Promise<string> {
  const config = getAppConfig()

  return requestInfiniCompletion({
    apiKey: config.apiKey,
    apiUrl: config.apiUrl,
    model: config.aiModel,
    systemPrompt: SYSTEM_PROMPT,
    userMessage: message,
  })
}
