const QUICK_PROMPTS = [
  '请用三步讲解这道数学题的思路',
  '把这段英文翻译成自然中文并解释语法',
  '写一篇高考英语作文，主题是科技与学习',
  '总结本周复习重点，给我一个30分钟计划',
]

interface QuickPromptsProps {
  onSendPrompt: (prompt: string) => void
  disabled?: boolean
}

export function QuickPrompts({ onSendPrompt, disabled }: QuickPromptsProps) {
  return (
    <section className="quick-prompts" aria-label="快捷提问模板">
      {QUICK_PROMPTS.map((prompt) => (
        <button
          key={prompt}
          type="button"
          className="quick-prompt-chip"
          onClick={() => onSendPrompt(prompt)}
          disabled={disabled}
        >
          {prompt}
        </button>
      ))}
    </section>
  )
}
