'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useFavouritePairs } from '../hooks/use-favourite-pairs'
import { useConversionLogs } from '../hooks/use-conversion-logs'

type FavouritePairsContextValue = ReturnType<typeof useFavouritePairs>
type ConversionLogsContextValue = ReturnType<typeof useConversionLogs>

const FavouritePairsContext = createContext<FavouritePairsContextValue | null>(null)
const ConversionLogsContext = createContext<ConversionLogsContextValue | null>(null)

export function CurrencyPersistenceProvider({ children }: { children: ReactNode }) {
  const favouritePairs = useFavouritePairs()
  const conversionLogs = useConversionLogs()

  return (
    <FavouritePairsContext.Provider value={favouritePairs}>
      <ConversionLogsContext.Provider value={conversionLogs}>
        {children}
      </ConversionLogsContext.Provider>
    </FavouritePairsContext.Provider>
  )
}

export function useFavouritePairsContext(): FavouritePairsContextValue {
  const value = useContext(FavouritePairsContext)

  if (!value) {
    throw new Error('useFavouritePairsContext must be used within CurrencyPersistenceProvider')
  }

  return value
}

export function useConversionLogsContext(): ConversionLogsContextValue {
  const value = useContext(ConversionLogsContext)

  if (!value) {
    throw new Error('useConversionLogsContext must be used within CurrencyPersistenceProvider')
  }

  return value
}
