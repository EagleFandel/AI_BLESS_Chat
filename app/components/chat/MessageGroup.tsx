import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'

import type { Message } from '@/lib/types/chat'

interface MessageGroupProps {
  label: string
  messages: Message[]
}

export function MessageGroup({ label, messages }: MessageGroupProps) {
  return (
    <section className="message-group">
      <p className="message-group-label">{label}</p>
      <div className="message-group-items">
        {messages.map((message) => (
          <article
            key={message.id}
            className={`message-card ${message.role === 'user' ? 'user' : 'assistant'}`}
          >
            <p className="message-role">{message.role === 'user' ? '我' : '老师'}</p>
            {message.role === 'assistant' ? (
              <ReactMarkdown
                className="message-markdown"
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="message-plain">{message.content}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
