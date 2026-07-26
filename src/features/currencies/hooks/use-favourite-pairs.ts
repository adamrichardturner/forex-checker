'use client'

import { useCallback, useEffect, useState } from 'react'
import { favouritePairId, type FavouritePair } from '../model/persistence.types'
import {
  addFavouritePair,
  listFavouritePairs,
  removeFavouritePair,
} from '../persistence/favourites-repository'

export function useFavouritePairs() {
  const [pairs, setPairs] = useState<FavouritePair[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    void listFavouritePairs()
      .then((nextPairs) => {
        if (cancelled) {
          return
        }

        setPairs(nextPairs)
        setError(null)
      })
      .catch((caught: unknown) => {
        if (cancelled) {
          return
        }

        if (caught instanceof Error) {
          setError(caught)
          return
        }

        setError(new Error('Failed to load favourite pairs'))
      })
      .finally(() => {
        if (cancelled) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const isFavourite = useCallback(
    (base: string, quote: string) => {
      const id = favouritePairId(base, quote)
      return pairs.some((pair) => pair.id === id)
    },
    [pairs],
  )

  const addFavourite = useCallback(async (base: string, quote: string) => {
    const pair = await addFavouritePair(base, quote)
    setPairs((current) => {
      const withoutExisting = current.filter((item) => item.id !== pair.id)
      return [pair, ...withoutExisting]
    })
    return pair
  }, [])

  const removeFavourite = useCallback(async (base: string, quote: string) => {
    await removeFavouritePair(base, quote)
    const id = favouritePairId(base, quote)
    setPairs((current) => current.filter((pair) => pair.id !== id))
  }, [])

  const toggleFavourite = useCallback(
    async (base: string, quote: string) => {
      if (isFavourite(base, quote)) {
        await removeFavourite(base, quote)
        return false
      }

      await addFavourite(base, quote)
      return true
    },
    [addFavourite, isFavourite, removeFavourite],
  )

  return {
    pairs,
    isLoading,
    error,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
  }
}
