import { act, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderHookWithProviders } from '../../../../tests/utils/render'
import { useConversionLogs } from './use-conversion-logs'

const sampleLog = {
  base: 'USD',
  quote: 'EUR',
  sendAmount: 1000,
  receiveAmount: 917,
  rate: 0.917,
}

describe('useConversionLogs', () => {
  it('loads an empty list and settles isLoading', async () => {
    const { result } = renderHookWithProviders(() => useConversionLogs(), {
      withPersistence: false,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.logs).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('logs, removes, and clears conversions newest-first', async () => {
    const { result } = renderHookWithProviders(() => useConversionLogs(), {
      withPersistence: false,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.logConversion(sampleLog)
    })

    await act(async () => {
      await result.current.logConversion({
        ...sampleLog,
        sendAmount: 500,
        receiveAmount: 458.5,
      })
    })

    expect(result.current.logs).toHaveLength(2)
    expect(result.current.logs[0]?.sendAmount).toBe(500)

    const firstId = result.current.logs[0]?.id
    expect(firstId).toEqual(expect.any(Number))

    if (firstId === undefined) {
      return
    }

    await act(async () => {
      await result.current.removeLog(firstId)
    })

    expect(result.current.logs).toHaveLength(1)

    await act(async () => {
      await result.current.clearLogs()
    })

    expect(result.current.logs).toEqual([])
  })

  it('populates error when the repository rejects on load', async () => {
    const listSpy = vi.spyOn(
      await import('../persistence/conversion-logs-repository'),
      'listConversionLogs',
    )
    listSpy.mockRejectedValueOnce(new Error('idb unavailable'))

    const { result } = renderHookWithProviders(() => useConversionLogs(), {
      withPersistence: false,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.error?.message).toBe('idb unavailable')
    listSpy.mockRestore()
  })
})
