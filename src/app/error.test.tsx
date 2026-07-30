import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ExchangeErrorPage from './error'

describe('ExchangeErrorPage', () => {
  it('renders the error message and calls reset when Try again is clicked', async () => {
    const reset = vi.fn()
    const error = new Error('Rates unavailable')

    render(<ExchangeErrorPage error={error} reset={reset} />)

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByText('Rates unavailable')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})
