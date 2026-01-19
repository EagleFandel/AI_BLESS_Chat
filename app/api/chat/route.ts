import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const url = 'https://cloud.infini-ai.com/maas/v1/chat/completions'
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-v3.2',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ]
      })
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || '请求失败')
    }

    return NextResponse.json({
      content: data.choices[0].message.content
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: '请求失败，请稍后重试' },
      { status: 500 }
    )
  }
}
