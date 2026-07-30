import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import { createUserWithFakeTimers, renderWithProviders } from '../../../../../tests/utils/render'
import { APP_TIMEZONE } from '../../model/timezone.constants'
import { Dashboard } from './dashboard'

describe('Dashboard', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(DateTime.fromISO('2026-07-28T12:00:00', { zone: APP_TIMEZONE }).toJSDate())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders ticker, rate checker, and navigation tabs', async () => {
    renderWithProviders(<Dashboard />, { withPersistence: false })

    expect(screen.getByLabelText('Loading markets ticker')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Check the rate' })).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByLabelText('Live markets ticker')).toBeInTheDocument()
    })

    expect(screen.getByRole('tab', { name: /History/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Compare/i })).toBeInTheDocument()
  })

  it('propagates currency changes from rate checker into compare tab', async () => {
    const user = createUserWithFakeTimers()

    renderWithProviders(<Dashboard />, { withPersistence: false })

    await waitFor(() => {
      expect(screen.getByText('909.09')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('tab', { name: /Compare/i }))

    await waitFor(() => {
      expect(screen.getByText(/1,000 from USD/i)).toBeInTheDocument()
    })

    const sendCurrencyButton = screen.getAllByRole('button', { name: /USD/i })[0] as HTMLElement
    await user.click(sendCurrencyButton)
    await user.click(screen.getByRole('button', { name: /British Pound/i }))

    await waitFor(() => {
      expect(screen.getByText(/1,000 from GBP/i)).toBeInTheDocument()
    })
  })
})
