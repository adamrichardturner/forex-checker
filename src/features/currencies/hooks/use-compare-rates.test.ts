import { waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderHookWithProviders } from '../../../../tests/utils/render'
import { useCompareRates } from './use-compare-rates'

describe('useCompareRates', () => {
  it('does not fetch when amount is non-positive or quotes are empty', async () => {
    const emptyQuotes = renderHookWithProviders(() => useCompareRates('USD', 1000, []))
    const zeroAmount = renderHookWithProviders(() => useCompareRates('USD', 0, ['GBP', 'JPY']))

    expect(emptyQuotes.result.current.fetchStatus).toBe('idle')
    expect(zeroAmount.result.current.fetchStatus).toBe('idle')
  })

  it('returns per-quote rows with converted amounts', async () => {
    const { result } = renderHookWithProviders(() =>
      useCompareRates('USD', 1000, ['GBP', 'JPY', 'ZZZ']),
    )

    await waitFor(() => {
      expect(result.current.data).toBeDefined()
    })

    const gbp = result.current.data?.find((row) => row.quote === 'GBP')
    const jpy = result.current.data?.find((row) => row.quote === 'JPY')
    const missing = result.current.data?.find((row) => row.quote === 'ZZZ')

    expect(gbp?.rate).toBeCloseTo(0.85 / 1.1)
    expect(gbp?.converted).toBeCloseTo(1000 * (0.85 / 1.1))
    expect(jpy?.rate).toBeCloseTo(160 / 1.1)
    expect(missing?.rate).toBeNull()
    expect(missing?.converted).toBeNull()
  })
})
