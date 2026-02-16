import { NextRequest, NextResponse } from 'next/server'

import {
  MissingEnvError,
  UpstreamAIError,
  ValidationError,
  generateAssistantReply,
  normalizeUserMessage,
} from '@/lib/services/chatService'
import type {
  ChatRequestBody,
  ChatResponseBody,
  ErrorResponseBody,
} from '@/lib/types/chat'

export async function POST(request: NextRequest) {
  let body: Partial<ChatRequestBody>

  try {
    body = (await request.json()) as Partial<ChatRequestBody>
  } catch {
    return NextResponse.json<ErrorResponseBody>(
      { error: '请求体必须为 JSON 格式' },
      { status: 400 }
    )
  }

  try {
    const message = normalizeUserMessage(body.message)
    const content = await generateAssistantReply(message)
    return NextResponse.json<ChatResponseBody>({ content })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json<ErrorResponseBody>(
        { error: error.message },
        { status: 400 }
      )
    }

    if (error instanceof MissingEnvError) {
      console.error('chat_config_error', {
        key: error.key,
        message: error.message,
      })

      return NextResponse.json<ErrorResponseBody>(
        { error: '服务配置缺失，请联系管理员' },
        { status: 500 }
      )
    }

    if (error instanceof UpstreamAIError) {
      console.error('chat_upstream_error', {
        status: error.status,
        message: error.message,
      })

      return NextResponse.json<ErrorResponseBody>(
        { error: '请求失败，请稍后重试' },
        { status: 500 }
      )
    }

    console.error('chat_unknown_error', error)
    return NextResponse.json<ErrorResponseBody>(
      { error: '请求失败，请稍后重试' },
      { status: 500 }
    )
  }
}
