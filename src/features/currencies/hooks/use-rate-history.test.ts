import { waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { APP_TIMEZONE } from '../model/timezone.constants'
import { renderHookWithProviders } from '../../../../tests/utils/render'
import { useRateHistory } from './use-rate-history'

describe('useRateHistory', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(DateTime.fromISO('2026-07-28T12:00:00', { zone: APP_TIMEZONE }).toJSDate())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('filters to the requested quote and computes open/last/change', async () => {
    const { result } = renderHookWithProviders(() => useRateHistory('EUR', 'USD', '1M'))

    await waitFor(() => {
      expect(result.current.data?.points.length).toBeGreaterThan(0)
    })

    const history = result.current.data
    expect(history).toBeDefined()

    if (!history) {
      return
    }

    const dates = history.points.map((point) => point.date)
    expect(dates).toEqual([...dates].sort((a, b) => a.localeCompare(b)))
    expect(history.open).toBe(history.points[0]?.value)
    expect(history.last).toBe(history.points.at(-1)?.value)
    expect(history.change).toBeCloseTo(history.last - history.open)
    expect(history.changePct).toBeCloseTo(((history.last - history.open) / history.open) * 100)
  })

  it('keeps previous data while a new range loads', async () => {
    const { result, rerender } = renderHookWithProviders(
      ({ range }) => useRateHistory('EUR', 'USD', range),
      {
        initialProps: { range: '1M' as const },
      },
    )

    await waitFor(() => {
      expect(result.current.data?.points.length).toBeGreaterThan(0)
    })

    const firstPoints = result.current.data?.points

    rerender({ range: '1W' as const })

    expect(result.current.isPlaceholderData).toBe(true)
    expect(result.current.data?.points).toEqual(firstPoints)

    await waitFor(() => {
      expect(result.current.isPlaceholderData).toBe(false)
    })
  })
})
