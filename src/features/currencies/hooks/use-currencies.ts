'use client'

import { useEffect, useState } from 'react'
import { CurrenciesResponse, Currency } from '../model/currency.types'

export function useCurrencies({ currencies }: { currencies: CurrenciesResponse }) {
  const [currenciesMap, setCurrenciesMap] = useState<Map<Currency['iso_code'], Currency>>(new Map())
  const [selectedCurrency, setSelectedCurrency] = useState<Currency['iso_code']>('USD')

  useEffect(() => {
    const map = new Map(currencies.map((currency) => [currency.iso_code, currency]))
    setCurrenciesMap(map)
  }, [currencies])

  const getCurrency = (isoCode: Currency['iso_code']) => {
    return currenciesMap.get(isoCode)
  }

  return {
    currenciesMap,
    selectedCurrency,
    setSelectedCurrency,
    getCurrency,
  }
}
