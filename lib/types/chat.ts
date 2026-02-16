export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: number
}

export interface ChatRequestBody {
  message: string
}

export interface ChatResponseBody {
  content: string
}

export interface ErrorResponseBody {
  error: string
}

export interface SaveMessagesRequestBody {
  messages: Message[]
}

export interface SaveMessagesResponseBody {
  success: true
}
