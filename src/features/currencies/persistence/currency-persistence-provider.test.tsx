import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderHookWithProviders } from '../../../../tests/utils/render'
import {
  useConversionLogsContext,
  useFavouritePairsContext,
} from './currency-persistence-provider'

describe('CurrencyPersistenceProvider', () => {
  it('throws when favourite context is used outside the provider', () => {
    expect(() => renderHook(() => useFavouritePairsContext())).toThrow(
      'useFavouritePairsContext must be used within CurrencyPersistenceProvider',
    )
  })

  it('throws when conversion logs context is used outside the provider', () => {
    expect(() => renderHook(() => useConversionLogsContext())).toThrow(
      'useConversionLogsContext must be used within CurrencyPersistenceProvider',
    )
  })

  it('shares one instance of each hook within the provider', async () => {
    const favourites = renderHookWithProviders(() => useFavouritePairsContext())
    const logs = renderHookWithProviders(() => useConversionLogsContext())

    await waitFor(() => {
      expect(favourites.result.current.isLoading).toBe(false)
      expect(logs.result.current.isLoading).toBe(false)
    })

    expect(typeof favourites.result.current.toggleFavourite).toBe('function')
    expect(typeof logs.result.current.logConversion).toBe('function')
  })
})
