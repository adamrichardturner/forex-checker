import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { LATEST_RATES_EUR } from '../../../../tests/fixtures/frankfurter'
import { frankfurterErrorHandlers } from '../../../../tests/msw/handlers'
import { server } from '../../../../tests/msw/server'
import { createTestQueryClient, renderHookWithProviders } from '../../../../tests/utils/render'
import { latestRatesQueryOptions } from '../api/query-options'
import { useConversion } from './use-conversion'

describe('useConversion', () => {
  it('derives EUR-based and non-EUR cross rates', async () => {
    const { result: eurToUsd } = renderHookWithProviders(() => useConversion('EUR', 'USD', 1000))
    const { result: usdToGbp } = renderHookWithProviders(() => useConversion('USD', 'GBP', 1000))

    await waitFor(() => {
      expect(eurToUsd.current.data?.rate).toBeCloseTo(1.1)
      expect(eurToUsd.current.data?.converted).toBeCloseTo(1100)
    })

    await waitFor(() => {
      expect(usdToGbp.current.data?.rate).toBeCloseTo(0.85 / 1.1)
      expect(usdToGbp.current.data?.converted).toBeCloseTo(1000 * (0.85 / 1.1))
    })
  })

  it('leaves converted undefined when the amount is NaN', async () => {
    const { result } = renderHookWithProviders(() => useConversion('EUR', 'USD', Number.NaN))

    await waitFor(() => {
      expect(result.current.data?.rate).toBeCloseTo(1.1)
    })

    expect(result.current.data?.converted).toBeUndefined()
  })

  it('surfaces an unknown currency as an error via select throw', async () => {
    const { result } = renderHookWithProviders(() => useConversion('EUR', 'ZZZ', 100))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })

  it('does not show prefetched latest rates until a fetch completes after mount', async () => {
    server.use(
      http.get('*/rates', async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 50)
        })
        return HttpResponse.json([...LATEST_RATES_EUR])
      }),
    )

    const queryClient = createTestQueryClient()
    queryClient.setQueryData(latestRatesQueryOptions('EUR').queryKey, [
      { date: '2026-07-28', base: 'EUR', quote: 'USD', rate: 2 },
    ])

    const { result } = renderHookWithProviders(() => useConversion('USD', 'EUR', 1000), {
      queryClient,
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)

    await waitFor(() => {
      expect(result.current.data?.converted).toBeCloseTo(1000 / 1.1)
    })
  })

  it('surfaces rate fetch failures as errors', async () => {
    server.use(frankfurterErrorHandlers.ratesServerError)

    const { result } = renderHookWithProviders(() => useConversion('EUR', 'USD', 100))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})
