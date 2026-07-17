import { useState } from 'react'
import { Currency } from '../model/currency.types'

export function useCurrencyButton({
  currencyMap,
}: {
  currencyMap: Map<Currency['iso_code'], Currency>
}) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  return {
    searchTerm,
    setSearchTerm,
  }
}
