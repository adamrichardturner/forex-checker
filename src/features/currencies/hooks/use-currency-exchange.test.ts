import { act, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHookWithProviders } from '../../../../tests/utils/render'
import { useCurrencyExchange } from './use-currency-exchange'

describe('useCurrencyExchange', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces send amount updates by 300ms', async () => {
    const { result } = renderHookWithProviders(() => useCurrencyExchange())

    await waitFor(() => {
      expect(result.current.receiveAmount).not.toBe('')
    })

    act(() => {
      result.current.onEnterSendAmount('2000')
    })

    expect(result.current.sendAmount).toBe('2,000')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299)
    })

    // Default 1000 USD→EUR still reflected until the debounce fires.
    expect(result.current.receiveAmount).toBe('909.09')

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1)
    })

    await waitFor(() => {
      expect(result.current.receiveAmount).toBe('1,818.18')
    })
  })

  it('rejects invalid amount input without updating state', async () => {
    const { result } = renderHookWithProviders(() => useCurrencyExchange())

    await waitFor(() => {
      expect(result.current.sendAmount).toBe('1,000')
    })

    act(() => {
      result.current.onEnterSendAmount('12a')
    })

    expect(result.current.sendAmount).toBe('1,000')
  })

  it('ignores selecting a currency equal to the opposite side', async () => {
    const { result } = renderHookWithProviders(() => useCurrencyExchange())

    await waitFor(() => {
      expect(result.current.sendCurrency).toBe('USD')
    })

    act(() => {
      result.current.onSetSendCurrency('EUR')
      result.current.onSetReceiveCurrency('USD')
    })

    expect(result.current.sendCurrency).toBe('USD')
    expect(result.current.receiveCurrency).toBe('EUR')
  })

  it('swaps currencies and applies the converted amount synchronously', async () => {
    const { result } = renderHookWithProviders(() => useCurrencyExchange())

    await waitFor(() => {
      expect(result.current.canLogConversion).toBe(true)
    })

    const previousReceive = result.current.receiveAmount

    act(() => {
      result.current.onSwapCurrencies()
    })

    expect(result.current.sendCurrency).toBe('EUR')
    expect(result.current.receiveCurrency).toBe('USD')
    expect(result.current.sendAmount).toBe(previousReceive)
  })

  it('exposes canLogConversion and conversionSnapshot only when loggable', async () => {
    const { result } = renderHookWithProviders(() => useCurrencyExchange())

    await waitFor(() => {
      expect(result.current.canLogConversion).toBe(true)
      expect(result.current.conversionSnapshot).not.toBeNull()
    })

    act(() => {
      result.current.onEnterSendAmount('0')
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300)
    })

    await waitFor(() => {
      expect(result.current.canLogConversion).toBe(false)
      expect(result.current.conversionSnapshot).toBeNull()
    })
  })

  it('cancels the pending debounce on unmount', async () => {
    const { result, unmount } = renderHookWithProviders(() => useCurrencyExchange())

    await waitFor(() => {
      expect(result.current.receiveAmount).not.toBe('')
    })

    act(() => {
      result.current.onEnterSendAmount('2500')
    })

    unmount()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })
  })
})
