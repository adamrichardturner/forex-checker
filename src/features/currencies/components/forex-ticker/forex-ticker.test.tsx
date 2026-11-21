import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import { APP_TIMEZONE } from '../../model/timezone.constants'
import { renderWithProviders } from '../../../../../tests/utils/render'
import { ForexTicker } from './index'

describe('ForexTicker', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(DateTime.fromISO('2026-07-28T12:00:00', { zone: APP_TIMEZONE }).toJSDate())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows loading skeleton then live market pairs', async () => {
    renderWithProviders(<ForexTicker />)

    expect(screen.getByLabelText('Loading markets ticker')).toHaveAttribute('aria-busy', 'true')

    await waitFor(() => {
      expect(screen.getByLabelText('Live markets ticker')).toBeInTheDocument()
    })

    expect(screen.queryByLabelText('Loading markets ticker')).not.toBeInTheDocument()
    expect(screen.getByText('Live markets')).toBeInTheDocument()
    expect(screen.getAllByText('EUR/USD').length).toBeGreaterThan(0)
    expect(screen.getAllByText('USD/JPY').length).toBeGreaterThan(0)
  })
})
