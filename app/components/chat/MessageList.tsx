import { useEffect, useMemo, useRef } from 'react'

import { MessageGroup } from '@/app/components/chat/MessageGroup'
import type { Message } from '@/lib/types/chat'

interface MessageListProps {
  messages: Message[]
  loading?: boolean
}

interface GroupedMessages {
  key: string
  label: string
  items: Message[]
}

function buildDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function formatGroupLabel(date: Date): string {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  )

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return '今天'
  }

  if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return '昨天'
  }

  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  })
}

function groupMessagesByDate(messages: Message[]): GroupedMessages[] {
  const groupedMap = new Map<string, GroupedMessages>()

  for (const message of messages) {
    const date = new Date(message.timestamp)
    const key = buildDateKey(date)
    const existingGroup = groupedMap.get(key)

    if (existingGroup) {
      existingGroup.items.push(message)
      continue
    }

    groupedMap.set(key, {
      key,
      label: formatGroupLabel(date),
      items: [message],
    })
  }

  return Array.from(groupedMap.values())
}

export function MessageList({ messages, loading }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null)

  const groups = useMemo(() => groupMessagesByDate(messages), [messages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [groups, loading])

  return (
    <section className="message-list" aria-live="polite" role="log">
      {groups.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">开始你的 AI 学习对话</p>
          <p className="empty-state-desc">
            可以直接提问，或点击上方快捷模板一键发送。
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <MessageGroup key={group.key} label={group.label} messages={group.items} />
        ))
      )}

      {loading ? <p className="typing-indicator">老师正在思考中...</p> : null}
      <div ref={endRef} />
    </section>
  )
}
