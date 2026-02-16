import { FormEvent } from 'react'

interface ComposerProps {
  value: string
  disabled?: boolean
  onValueChange: (value: string) => void
  onSubmit: () => void
}

export function Composer({
  value,
  disabled,
  onValueChange,
  onSubmit,
}: ComposerProps) {
  const isDisabled = Boolean(disabled) || value.trim().length === 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <label htmlFor="message-input" className="sr-only">
        输入问题
      </label>
      <input
        id="message-input"
        className="composer-input"
        type="text"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder="输入问题..."
        disabled={disabled}
      />
      <button className="composer-send" type="submit" disabled={isDisabled}>
        发送
      </button>
    </form>
  )
}
