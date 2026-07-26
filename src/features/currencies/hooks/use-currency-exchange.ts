'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash.debounce'
import { Currency } from '../model/currency.types'
import { currenciesQueryOptions } from '../api/query-options'
import { useConversion } from './use-conversion'
import {
  formatAmountInput,
  formatConvertedAmount,
  formatExchangeRate,
  isValidAmountInput,
  parseAmountInput,
  stripAmountFormatting,
  toSwapAmountInput,
} from '../utils/amount-input'

const DEBOUNCE_MS = 300
const DEFAULT_SEND_AMOUNT = formatAmountInput('1000')

export function useCurrencyExchange() {
  const [sendCurrency, setSendCurrency] = useState<Currency['iso_code']>('USD')
  const [receiveCurrency, setReceiveCurrency] = useState<Currency['iso_code']>('EUR')
  const [sendAmount, setSendAmount] = useState<string>(DEFAULT_SEND_AMOUNT)
  const [debouncedSendAmount, setDebouncedSendAmount] = useState<number>(
    parseAmountInput(DEFAULT_SEND_AMOUNT),
  )

  const debouncedUpdateAmountRef = useRef(
    debounce((amount: string) => {
      setDebouncedSendAmount(parseAmountInput(amount))
    }, DEBOUNCE_MS),
  )

  useEffect(() => {
    const debouncedUpdateAmount = debouncedUpdateAmountRef.current

    return () => {
      debouncedUpdateAmount.cancel()
    }
  }, [])

  const onEnterSendAmount = useCallback((amount: string) => {
    if (!isValidAmountInput(amount)) {
      return
    }

    const rawAmount = stripAmountFormatting(amount)
    const formattedAmount = formatAmountInput(rawAmount)

    setSendAmount(formattedAmount)
    debouncedUpdateAmountRef.current(rawAmount)
  }, [])

  const onSetSendCurrency = useCallback((currency: Currency['iso_code']) => {
    setSendCurrency(currency)
  }, [])

  const onSetReceiveCurrency = useCallback((currency: Currency['iso_code']) => {
    setReceiveCurrency(currency)
  }, [])

  const {
    data: conversion,
    isPending,
    isError,
  } = useConversion(sendCurrency, receiveCurrency, debouncedSendAmount)

  const { data: currencies } = useQuery({
    ...currenciesQueryOptions,
  })

  const receiveAmount =
    conversion?.converted !== undefined ? formatConvertedAmount(conversion.converted) : ''

  const exchangeRateLabel = conversion
    ? `1 ${sendCurrency} = ${formatExchangeRate(conversion.rate)} ${receiveCurrency}`
    : ''

  const canLogConversion =
    Number.isFinite(debouncedSendAmount) &&
    debouncedSendAmount > 0 &&
    conversion?.rate !== undefined &&
    Number.isFinite(conversion.rate) &&
    conversion.converted !== undefined &&
    Number.isFinite(conversion.converted)

  const onSwapCurrencies = useCallback(() => {
    const nextSendAmount =
      conversion?.converted !== undefined ? toSwapAmountInput(conversion.converted) : sendAmount

    setSendCurrency(receiveCurrency)
    setReceiveCurrency(sendCurrency)
    setSendAmount(nextSendAmount)
    debouncedUpdateAmountRef.current.cancel()
    setDebouncedSendAmount(parseAmountInput(nextSendAmount))
  }, [conversion, receiveCurrency, sendAmount, sendCurrency])

  return {
    currencies,
    isPending,
    isError,
    sendAmount,
    receiveAmount,
    exchangeRateLabel,
    onEnterSendAmount,
    sendCurrency,
    receiveCurrency,
    onSetSendCurrency,
    onSetReceiveCurrency,
    onSwapCurrencies,
    canLogConversion,
    conversionSnapshot:
      canLogConversion && conversion?.converted !== undefined && conversion.rate !== undefined
        ? {
            sendAmount: debouncedSendAmount,
            receiveAmount: conversion.converted,
            rate: conversion.rate,
          }
        : null,
  }
}
