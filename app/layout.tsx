import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 学习助手',
  description: 'Apple Watch AI Chat',
  viewport: 'width=396, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
