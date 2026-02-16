import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { QuickPrompts } from '@/app/components/chat/QuickPrompts'

describe('QuickPrompts', () => {
  it('fires callback with selected prompt', async () => {
    const user = userEvent.setup()
    const onSendPrompt = vi.fn()

    render(<QuickPrompts onSendPrompt={onSendPrompt} />)

    const firstButton = screen.getAllByRole('button')[0]
    const promptText = firstButton.textContent ?? ''
    await user.click(firstButton)

    expect(onSendPrompt).toHaveBeenCalledTimes(1)
    expect(onSendPrompt).toHaveBeenCalledWith(promptText)
  })
})
