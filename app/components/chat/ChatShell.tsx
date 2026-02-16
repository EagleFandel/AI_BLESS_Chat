'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { Composer } from '@/app/components/chat/Composer'
import { MessageList } from '@/app/components/chat/MessageList'
import { QuickPrompts } from '@/app/components/chat/QuickPrompts'
import type {
  ChatResponseBody,
  ErrorResponseBody,
  Message,
  SaveMessagesResponseBody,
} from '@/lib/types/chat'

interface Notice {
  type: 'error' | 'info'
  text: string
}

function isMessage(value: unknown): value is Message {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const maybeMessage = value as Partial<Message>
  return (
    typeof maybeMessage.id === 'string' &&
    (maybeMessage.role === 'user' || maybeMessage.role === 'assistant') &&
    typeof maybeMessage.content === 'string' &&
    typeof maybeMessage.timestamp === 'number' &&
    Number.isFinite(maybeMessage.timestamp)
  )
}

function createMessage(role: Message['role'], content: string): Message {
  const timestamp = Date.now()
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${timestamp}-${Math.random().toString(16).slice(2)}`

  return { id, role, content, timestamp }
}

function parseError(data: unknown, fallback: string): string {
  if (typeof data !== 'object' || data === null) {
    return fallback
  }

  const body = data as Partial<ErrorResponseBody>
  return typeof body.error === 'string' && body.error.trim().length > 0
    ? body.error
    : fallback
}

export function ChatShell() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)

  const welcomeNote = useMemo(
    () => ({
      type: 'info' as const,
      text: '支持 Markdown 与 LaTeX，建议一次提一个清晰问题。',
    }),
    []
  )

  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/messages')
      const data = (await response.json()) as unknown

      if (!response.ok || !Array.isArray(data)) {
        throw new Error('加载历史记录失败')
      }

      setMessages(data.filter(isMessage))
      setNotice(welcomeNote)
    } catch {
      setMessages([])
      setNotice({
        type: 'error',
        text: '历史消息加载失败，已切换为新会话。',
      })
    }
  }, [welcomeNote])

  useEffect(() => {
    void loadMessages()
  }, [loadMessages])

  const persistMessages = useCallback(async (items: Message[]) => {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: items }),
    })

    const body = (await response.json()) as SaveMessagesResponseBody | ErrorResponseBody
    if (!response.ok || !('success' in body) || body.success !== true) {
      throw new Error(parseError(body, '消息保存失败'))
    }
  }, [])

  const sendMessage = useCallback(
    async (rawContent?: string) => {
      const content = (rawContent ?? input).trim()
      if (!content || loading) {
        return
      }

      const userMessage = createMessage('user', content)
      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setLoading(true)
      setNotice(null)

      try {
        const chatResponse = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: content }),
        })
        const chatBody = (await chatResponse.json()) as ChatResponseBody | ErrorResponseBody

        if (!chatResponse.ok || !('content' in chatBody)) {
          throw new Error(parseError(chatBody, '请求失败，请稍后重试'))
        }

        const assistantMessage = createMessage('assistant', chatBody.content)
        setMessages((prev) => [...prev, assistantMessage])
        await persistMessages([userMessage, assistantMessage])
        setNotice(welcomeNote)
      } catch (error) {
        setNotice({
          type: 'error',
          text: error instanceof Error ? error.message : '发送失败，请稍后重试',
        })
      } finally {
        setLoading(false)
      }
    },
    [input, loading, persistMessages, welcomeNote]
  )

  return (
    <main className="watch-app">
      <section className="chat-shell">
        <header className="chat-header">
          <p className="chat-kicker">BLESSED STUDY CORE</p>
          <h1 className="chat-title">Apple Watch AI Tutor</h1>
          <p className="chat-subtitle">
            高考答疑、翻译、作文与公式讲解。保持专注，用更短时间学得更深。
          </p>
        </header>

        <QuickPrompts onSendPrompt={(prompt) => void sendMessage(prompt)} disabled={loading} />

        <MessageList messages={messages} loading={loading} />

        {notice ? (
          <p className={`system-notice ${notice.type === 'error' ? 'is-error' : ''}`}>
            {notice.text}
          </p>
        ) : null}

        <Composer
          value={input}
          disabled={loading}
          onValueChange={setInput}
          onSubmit={() => void sendMessage()}
        />
      </section>
    </main>
  )
}
