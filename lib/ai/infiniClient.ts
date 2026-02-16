interface InfiniChatRequest {
  apiKey: string
  apiUrl: string
  model: string
  systemPrompt: string
  userMessage: string
}

interface InfiniChatResponse {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message?: string }
}

export class UpstreamAIError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'UpstreamAIError'
    this.status = status
  }
}

export async function requestInfiniCompletion(
  params: InfiniChatRequest
): Promise<string> {
  let response: Response

  try {
    response = await fetch(params.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userMessage },
        ],
      }),
    })
  } catch {
    throw new UpstreamAIError('无法连接上游模型服务')
  }

  let data: InfiniChatResponse | null = null
  try {
    data = (await response.json()) as InfiniChatResponse
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.error?.message ?? `上游请求失败（${response.status}）`
    throw new UpstreamAIError(message, response.status)
  }

  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new UpstreamAIError('上游返回内容为空', response.status)
  }

  return content
}
