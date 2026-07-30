import { describe, expect, it, afterEach, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import { server } from '../../../../../tests/msw/server'
import { frankfurterErrorHandlers } from '../../../../../tests/msw/handlers'
import { APP_TIMEZONE } from '../../model/timezone.constants'
import { renderWithProviders } from '../../../../../tests/utils/render'
import { HistoryCharts } from './index'

describe('HistoryCharts', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(DateTime.fromISO('2026-07-28T12:00:00', { zone: APP_TIMEZONE }).toJSDate())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a loading skeleton with aria-busy', () => {
    renderWithProviders(<HistoryCharts base="EUR" quote="USD" />)

    expect(screen.getByLabelText('Loading rate history')).toHaveAttribute('aria-busy', 'true')
  })

  it('renders stats and chart data after loading', async () => {
    renderWithProviders(<HistoryCharts base="EUR" quote="USD" />)

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading rate history')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Open')).toBeInTheDocument()
    expect(screen.getByText('Last')).toBeInTheDocument()
    expect(screen.getByText('Change')).toBeInTheDocument()
    expect(screen.getByText('% Change')).toBeInTheDocument()
    expect(screen.getByText('EUR/USD')).toBeInTheDocument()
  })

  it('marks the active range button with aria-pressed', async () => {
    const { user } = renderWithProviders(<HistoryCharts base="EUR" quote="USD" />)

    await waitFor(() => {
      expect(screen.queryByLabelText('Loading rate history')).not.toBeInTheDocument()
    })

    const oneMonth = screen.getByRole('button', { name: '1M' })
    expect(oneMonth).toHaveAttribute('aria-pressed', 'true')

    await user.click(screen.getByRole('button', { name: '1W' }))

    expect(screen.getByRole('button', { name: '1W' })).toHaveAttribute('aria-pressed', 'true')
    expect(oneMonth).toHaveAttribute('aria-pressed', 'false')
  })

  it('shows empty state when rate history fails to load', async () => {
    server.use(frankfurterErrorHandlers.ratesServerError)

    renderWithProviders(<HistoryCharts base="EUR" quote="USD" />)

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('No chart data available')
    })

    expect(
      screen.getByText(/We couldn't load rate history for EUR\/USD right now/i),
    ).toBeInTheDocument()
  })
})
