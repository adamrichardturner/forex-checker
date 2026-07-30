import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { frankfurterErrorHandlers } from '../../../../tests/msw/handlers'
import { server } from '../../../../tests/msw/server'
import { renderHookWithProviders } from '../../../../tests/utils/render'
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

  it('surfaces rate fetch failures as errors', async () => {
    server.use(frankfurterErrorHandlers.ratesServerError)

    const { result } = renderHookWithProviders(() => useConversion('EUR', 'USD', 100))

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})
