import type { Metadata, Viewport } from 'next'

import 'katex/dist/katex.min.css'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI_BLESS Chat',
  description: 'Apple Watch optimized AI tutor chat experience.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  maximumScale: 1,
  userScalable: false,
  themeColor: '#04070f',
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
