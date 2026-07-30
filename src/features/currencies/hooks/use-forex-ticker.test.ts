import { waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { APP_TIMEZONE } from '../model/timezone.constants'
import { frankfurterErrorHandlers } from '../../../../tests/msw/handlers'
import { server } from '../../../../tests/msw/server'
import { renderHookWithProviders } from '../../../../tests/utils/render'
import { useForexTicker } from './use-forex-ticker'

describe('useForexTicker', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(DateTime.fromISO('2026-07-28T12:00:00', { zone: APP_TIMEZONE }).toJSDate())
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('builds ticker items with day-over-day direction', async () => {
    const { result } = renderHookWithProviders(() => useForexTicker())

    await waitFor(() => {
      expect(result.current.data?.length).toBeGreaterThan(0)
    })

    const eurUsd = result.current.data?.find((item) => item.base === 'EUR' && item.quote === 'USD')

    expect(eurUsd?.date).toBe('2026-07-28')
    expect(eurUsd?.rate).toBeCloseTo(1.1)
    expect(eurUsd?.changePct).not.toBeNull()
    expect(['up', 'down', 'flat']).toContain(eurUsd?.direction)
  })

  it('returns an empty array for an empty series', async () => {
    server.use(frankfurterErrorHandlers.ratesEmpty)

    const { result } = renderHookWithProviders(() => useForexTicker())

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual([])
  })

  it('skips pairs that cannot be priced from the series', async () => {
    server.use(
      http.get('*/rates', () => {
        return HttpResponse.json([
          { date: '2026-07-28', base: 'EUR', quote: 'USD', rate: 1.1 },
          { date: '2026-07-25', base: 'EUR', quote: 'USD', rate: 1.09 },
        ])
      }),
    )

    const { result } = renderHookWithProviders(() => useForexTicker())

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data?.every((item) => item.quote === 'USD' || item.base === 'USD')).toBe(
      true,
    )
    expect(result.current.data?.some((item) => item.base === 'EUR' && item.quote === 'USD')).toBe(
      true,
    )
  })
})
