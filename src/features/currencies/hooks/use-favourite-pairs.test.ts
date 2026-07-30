import { act, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderHookWithProviders } from '../../../../tests/utils/render'
import { useFavouritePairs } from './use-favourite-pairs'

describe('useFavouritePairs', () => {
  it('loads an empty list and settles isLoading', async () => {
    const { result } = renderHookWithProviders(() => useFavouritePairs(), {
      withPersistence: false,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.pairs).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('adds, toggles, and removes favourites with newest-first ordering', async () => {
    const { result } = renderHookWithProviders(() => useFavouritePairs(), {
      withPersistence: false,
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.addFavourite('USD', 'EUR')
    })

    await act(async () => {
      await result.current.addFavourite('GBP', 'USD')
    })

    expect(result.current.pairs.map((pair) => pair.id)).toEqual(['GBP-USD', 'USD-EUR'])
    expect(result.current.isFavourite('USD', 'EUR')).toBe(true)

    await act(async () => {
      await result.current.toggleFavourite('USD', 'EUR')
    })

    expect(result.current.isFavourite('USD', 'EUR')).toBe(false)

    await act(async () => {
      await result.current.toggleFavourite('USD', 'EUR')
    })

    expect(result.current.isFavourite('USD', 'EUR')).toBe(true)

    await act(async () => {
      await result.current.removeFavourite('GBP', 'USD')
    })

    expect(result.current.pairs.map((pair) => pair.id)).toEqual(['USD-EUR'])
  })

  it('does not update state after unmount', async () => {
    const listSpy = vi.spyOn(
      await import('../persistence/favourites-repository'),
      'listFavouritePairs',
    )

    listSpy.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve([])
          }, 50)
        }),
    )

    const { unmount } = renderHookWithProviders(() => useFavouritePairs(), {
      withPersistence: false,
    })

    unmount()

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 80)
      })
    })

    listSpy.mockRestore()
  })
})
