'use client'

import { useLayoutEffect, useRef, useState, type ChangeEvent } from 'react'
import { ArrowLeftRight, ArrowUpDown, Bookmark, BookmarkCheck, NotebookPen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CurrencyButton } from '../..'
import { useCurrencyExchange } from '../../hooks/use-currency-exchange'
import {
  useConversionLogsContext,
  useFavouritePairsContext,
} from '../../persistence/currency-persistence-provider'
import {
  countRawCharacters,
  formatAmountInput,
  isValidAmountInput,
  mapRawCaretToFormattedIndex,
  stripAmountFormatting,
} from '../../utils/amount-input'
import styles from './rate-checker.module.scss'
import { BaseCard } from '@/components/layout/base-card'
import { NavigationTabs } from '../navigation-tabs'

export function RateChecker() {
  const {
    currencies,
    sendCurrency,
    receiveCurrency,
    sendAmount,
    receiveAmount,
    exchangeRateLabel,
    onEnterSendAmount,
    onSetSendCurrency,
    onSetReceiveCurrency,
    onSwapCurrencies,
    canLogConversion,
    conversionSnapshot,
  } = useCurrencyExchange()
  const { isFavourite, toggleFavourite } = useFavouritePairsContext()
  const { logConversion } = useConversionLogsContext()
  const [isLogging, setIsLogging] = useState(false)
  const [isTogglingFavourite, setIsTogglingFavourite] = useState(false)

  const sendInputRef = useRef<HTMLInputElement>(null)
  const caretRef = useRef<number | null>(null)
  const pairIsFavourite = isFavourite(sendCurrency, receiveCurrency)

  useLayoutEffect(() => {
    if (caretRef.current === null || !sendInputRef.current) {
      return
    }

    sendInputRef.current.setSelectionRange(caretRef.current, caretRef.current)
    caretRef.current = null
  }, [sendAmount])

  const handleSendAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionStart } = event.target
    const rawAmount = stripAmountFormatting(value)

    if (!isValidAmountInput(rawAmount)) {
      return
    }

    const formattedAmount = formatAmountInput(rawAmount)
    const rawCaret = countRawCharacters(value, selectionStart ?? 0)

    caretRef.current = mapRawCaretToFormattedIndex(formattedAmount, rawCaret)
    onEnterSendAmount(value)
  }

  const handleToggleFavourite = async () => {
    if (isTogglingFavourite) {
      return
    }

    setIsTogglingFavourite(true)

    try {
      await toggleFavourite(sendCurrency, receiveCurrency)
    } finally {
      setIsTogglingFavourite(false)
    }
  }

  const handleLogConversion = async () => {
    if (!canLogConversion || !conversionSnapshot || isLogging) {
      return
    }

    setIsLogging(true)

    try {
      await logConversion({
        base: sendCurrency,
        quote: receiveCurrency,
        sendAmount: conversionSnapshot.sendAmount,
        receiveAmount: conversionSnapshot.receiveAmount,
        rate: conversionSnapshot.rate,
      })
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <div className={styles.rateChecker}>
      <div className={styles.rateCheckerMain}>
        <div className={styles.rateCheckerHeader}>
          <h2 className={styles.rateCheckerTitle}>Check the rate</h2>
          <div className={styles.rateCheckerActions}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={styles.rateCheckerActionButton}
              onClick={() => {
                void handleToggleFavourite()
              }}
              disabled={isTogglingFavourite}
              aria-pressed={pairIsFavourite}
              aria-label={
                pairIsFavourite ? 'Remove pair from favourites' : 'Add pair to favourites'
              }
            >
              {pairIsFavourite ? <BookmarkCheck /> : <Bookmark />}
              {pairIsFavourite ? 'Favourited' : 'Favourite'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={styles.rateCheckerActionButton}
              onClick={() => {
                void handleLogConversion()
              }}
              disabled={!canLogConversion || isLogging}
              aria-label="Log conversion"
            >
              <NotebookPen />
              {isLogging ? 'Logging…' : 'Log conversion'}
            </Button>
          </div>
        </div>
        <BaseCard level="level-1" className={styles.rateCheckerBaseCard}>
          <div className={styles.rateCheckerBody}>
            <div className={styles.rateCheckerPanels}>
              <div className={styles.rateCheckerCard}>
                <h3 className={styles.rateCheckerCardTitle}>Send</h3>
                <div className={styles.rateCheckerCardInputContainer}>
                  <Input
                    ref={sendInputRef}
                    className={`h-auto ${styles.rateCheckerCardInput}`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    value={sendAmount}
                    onChange={handleSendAmountChange}
                    aria-label="Send amount"
                  />
                  <CurrencyButton
                    selectedCode={sendCurrency}
                    currencies={currencies ?? []}
                    onSelect={onSetSendCurrency}
                  />
                </div>
              </div>

              <div className="hidden md:block">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={styles.rateCheckerSwapButton}
                  onClick={onSwapCurrencies}
                  aria-label="Swap send and receive currencies"
                >
                  <ArrowLeftRight />
                </Button>
              </div>

              <div className="block flex w-full justify-center md:hidden">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={styles.rateCheckerSwapButton}
                  onClick={onSwapCurrencies}
                  aria-label="Swap send and receive currencies"
                >
                  <ArrowUpDown />
                </Button>
              </div>

              <div className={styles.rateCheckerCard}>
                <h3 className={styles.rateCheckerCardTitle}>Receive</h3>
                <div className={styles.rateCheckerCardInputContainer}>
                  <p className={styles.rateCheckerReceiveAmount} aria-live="polite">
                    {receiveAmount}
                  </p>
                  <CurrencyButton
                    selectedCode={receiveCurrency}
                    currencies={currencies ?? []}
                    onSelect={onSetReceiveCurrency}
                  />
                </div>
              </div>
            </div>
            <div className={styles.rateCheckerFooter}>
              {exchangeRateLabel ? (
                <p className={styles.rateCheckerRate}>{exchangeRateLabel}</p>
              ) : null}
            </div>
          </div>
        </BaseCard>
      </div>
      <NavigationTabs base={sendCurrency} quote={receiveCurrency} />
    </div>
  )
}
