'use client'

import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const SYSTEM_PROMPT = `你是一位经验丰富的高中老师，专门帮助学生解决高考相关问题。

你的职责：
1. 解答高考题目：给出完整答案和详细解析
2. 翻译：提供准确的中英文翻译
3. 范文：提供高质量的作文范文
4. 公式：讲解数学、物理、化学等学科公式

回答要求：
- 答案准确、解析清晰
- 使用 Markdown 格式
- 数学公式使用 LaTeX 格式（行内公式用 $...$ ，独立公式用 $$...$$）
- 语言简洁明了`

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    try {
      const res = await fetch('/api/messages')
      const data = await res.json()
      setMessages(data)
    } catch (error) {
      console.error('加载消息失败:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim() })
      })

      const data = await res.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
      
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [userMessage, assistantMessage] })
      })
    } catch (error) {
      console.error('发送失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* 消息列表 */}
      <div style={{ 
        height: 'calc(100vh - 80px)',
        overflowY: 'scroll',
        WebkitOverflowScrolling: 'touch' as any,
        padding: '8px'
      }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            marginBottom: '8px',
            padding: '6px 8px',
            background: msg.role === 'user' ? '#1a1a1a' : '#0a0a0a',
            borderRadius: '8px',
            borderLeft: msg.role === 'assistant' ? '2px solid #0a84ff' : 'none'
          }}>
            <div style={{ 
              fontSize: '16px', 
              color: '#666',
              marginBottom: '3px'
            }}>
              {msg.role === 'user' ? '我' : '老师'}
            </div>
            {msg.role === 'assistant' ? (
              <ReactMarkdown
                className="markdown-content"
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {msg.content}
              </ReactMarkdown>
            ) : (
              <div style={{ fontSize: '19px' }}>{msg.content}</div>
            )}
          </div>
        ))}
        {loading && (
          <div style={{ 
            padding: '6px 8px',
            color: '#666',
            fontSize: '19px'
          }}>
            思考中...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div style={{ 
        padding: '8px',
        background: '#0a0a0a',
        borderTop: '1px solid #1a1a1a'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="输入问题..."
            disabled={loading}
            style={{
              flex: 1,
              padding: '8px',
              background: '#1a1a1a',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '19px',
              outline: 'none'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: '10px 16px',
              background: loading || !input.trim() ? '#333' : '#0a84ff',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '20px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            发送
          </button>
        </div>
      </div>
    </>
  )
}
