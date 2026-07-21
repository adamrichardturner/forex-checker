'use client'

import { useCallback, useState } from 'react'
import { Currency } from '../model/currency.types'
import { useQuery } from '@tanstack/react-query'
import { currenciesQueryOptions, latestExchangeRatesPairQueryOptions } from '../api/query-options'

export function useCurrencyExchange() {
  const [sendCurrency, setSendCurrency] = useState<Currency['iso_code']>('USD')
  const [receiveCurrency, setReceiveCurrency] = useState<Currency['iso_code']>('EUR')
  const [sendAmount, setSendAmount] = useState<number>(1000)
  const [receiveAmount, setReceiveAmount] = useState<number>(0)

  const onEnterSendAmount = useCallback(
    (amount: number) => {
      setSendAmount(amount)
    },
    [setSendAmount],
  )

  const onEnterReceiveAmount = useCallback(
    (amount: number) => {
      setReceiveAmount(amount)
    },
    [setReceiveAmount],
  )

  const onSetSendCurrency = useCallback(
    (currency: Currency['iso_code']) => {
      setSendCurrency(currency)
    },
    [setSendCurrency],
  )

  const onSetReceiveCurrency = useCallback(
    (currency: Currency['iso_code']) => {
      setReceiveCurrency(currency)
    },
    [setReceiveCurrency],
  )

  const {
    data: [baseRate, quoteRate] = [],
    isPending,
    isError,
  } = useQuery({
    ...latestExchangeRatesPairQueryOptions(sendCurrency, receiveCurrency),
  })

  const { data: currencies } = useQuery({
    ...currenciesQueryOptions,
  })

  return {
    currencies,
    baseRate,
    quoteRate,
    isPending,
    isError,
    sendAmount,
    receiveAmount,
    onEnterSendAmount,
    onEnterReceiveAmount,
    sendCurrency,
    receiveCurrency,
    onSetSendCurrency,
    onSetReceiveCurrency,
  }
}
