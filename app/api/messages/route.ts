import { NextRequest, NextResponse } from 'next/server'

import { MessagesRepository } from '@/lib/db/messagesRepository'
import type {
  ErrorResponseBody,
  Message,
  SaveMessagesRequestBody,
  SaveMessagesResponseBody,
} from '@/lib/types/chat'

function isValidMessage(value: unknown): value is Message {
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

export async function GET() {
  const repository = new MessagesRepository()

  try {
    return NextResponse.json(repository.listMessages())
  } catch (error) {
    console.error('messages_get_error', error)
    return NextResponse.json([])
  } finally {
    repository.close()
  }
}

export async function POST(request: NextRequest) {
  let body: Partial<SaveMessagesRequestBody>

  try {
    body = (await request.json()) as Partial<SaveMessagesRequestBody>
  } catch {
    return NextResponse.json<ErrorResponseBody>(
      { error: '请求体必须为 JSON 格式' },
      { status: 400 }
    )
  }

  const messages = body.messages
  if (!Array.isArray(messages) || !messages.every(isValidMessage)) {
    return NextResponse.json<ErrorResponseBody>(
      { error: 'messages 字段格式不正确' },
      { status: 400 }
    )
  }

  const repository = new MessagesRepository()

  try {
    repository.saveMessages(messages)
    return NextResponse.json<SaveMessagesResponseBody>({ success: true })
  } catch (error) {
    console.error('messages_save_error', error)
    return NextResponse.json<ErrorResponseBody>(
      { error: '保存失败' },
      { status: 500 }
    )
  } finally {
    repository.close()
  }
}
