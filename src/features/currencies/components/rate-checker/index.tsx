'use client'

import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent } from 'react'
import { ArrowLeftRight, ArrowUpDown, Check, NotebookPen, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { BaseCard } from '@/components/layout/base-card'
import { cn } from '@/lib/utils'
import { CurrencyButton } from '../..'
import type { useCurrencyExchange } from '../../hooks/use-currency-exchange'
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

const LOG_SUCCESS_MS = 2000

type RateCheckerProps = ReturnType<typeof useCurrencyExchange>

export function RateChecker({
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
}: RateCheckerProps) {
  const {
    isFavourite,
    isLoading: isFavouritesLoading,
    toggleFavourite,
  } = useFavouritePairsContext()
  const { logConversion } = useConversionLogsContext()
  const [isLogging, setIsLogging] = useState(false)
  const [loggedConversionKey, setLoggedConversionKey] = useState<string | null>(null)
  const [isTogglingFavourite, setIsTogglingFavourite] = useState(false)
  const [optimisticFavourite, setOptimisticFavourite] = useState<{
    pairKey: string
    value: boolean
  } | null>(null)

  const sendInputRef = useRef<HTMLInputElement>(null)
  const caretRef = useRef<number | null>(null)
  const logSuccessTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pairKey = `${sendCurrency}-${receiveCurrency}`
  const conversionKey = `${pairKey}-${sendAmount}`
  const persistedFavourite = isFavourite(sendCurrency, receiveCurrency)
  const pairIsFavourite =
    optimisticFavourite?.pairKey === pairKey ? optimisticFavourite.value : persistedFavourite
  const justLogged = loggedConversionKey === conversionKey

  let favouriteAriaLabel = 'Add pair to favourites'
  if (isFavouritesLoading) {
    favouriteAriaLabel = 'Loading favourite state'
  } else if (pairIsFavourite) {
    favouriteAriaLabel = 'Remove pair from favourites'
  }

  useEffect(() => {
    return () => {
      if (logSuccessTimeoutRef.current === null) {
        return
      }

      clearTimeout(logSuccessTimeoutRef.current)
    }
  }, [])

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

    const nextFavourite = !pairIsFavourite
    setOptimisticFavourite({
      pairKey,
      value: nextFavourite,
    })
    setIsTogglingFavourite(true)

    try {
      await toggleFavourite(sendCurrency, receiveCurrency)
    } catch {
      setOptimisticFavourite(null)
    } finally {
      setIsTogglingFavourite(false)
      setOptimisticFavourite(null)
    }
  }

  const handleLogConversion = async () => {
    if (!canLogConversion || !conversionSnapshot || isLogging || justLogged) {
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

      setLoggedConversionKey(conversionKey)

      if (logSuccessTimeoutRef.current !== null) {
        clearTimeout(logSuccessTimeoutRef.current)
      }

      logSuccessTimeoutRef.current = setTimeout(() => {
        setLoggedConversionKey(null)
        logSuccessTimeoutRef.current = null
      }, LOG_SUCCESS_MS)
    } finally {
      setIsLogging(false)
    }
  }

  return (
    <div className={styles.rateChecker}>
      <div className={styles.rateCheckerHeader}>
        <h2 className={styles.rateCheckerTitle}>Check the rate</h2>
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
                  disabledCode={receiveCurrency}
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
                  disabledCode={sendCurrency}
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
            <div className={styles.rateCheckerActions}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={styles.rateCheckerFavouriteButton}
                onClick={() => {
                  void handleToggleFavourite()
                }}
                disabled={isFavouritesLoading || isTogglingFavourite}
                aria-pressed={isFavouritesLoading ? undefined : pairIsFavourite}
                aria-busy={isFavouritesLoading}
                aria-label={favouriteAriaLabel}
                data-pending={isFavouritesLoading || undefined}
              >
                <span
                  className={styles.rateCheckerButtonContent}
                  data-active={!isFavouritesLoading && pairIsFavourite ? true : undefined}
                >
                  <span className={styles.rateCheckerButtonLabel}>
                    <span className={styles.rateCheckerButtonLabelIcon}>
                      <Star />
                    </span>
                    Favourite
                  </span>
                  <span className={styles.rateCheckerButtonLabelActive}>
                    <span className={styles.rateCheckerButtonLabelIcon}>
                      <Star fill="currentColor" />
                    </span>
                    Favourited
                  </span>
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  styles.rateCheckerLogButton,
                  justLogged && styles.rateCheckerLogButtonSuccess,
                )}
                onClick={() => {
                  void handleLogConversion()
                }}
                disabled={!canLogConversion || isLogging || justLogged}
                aria-label={justLogged ? 'Conversion logged' : 'Log conversion'}
              >
                <span
                  className={styles.rateCheckerButtonContent}
                  data-active={justLogged || undefined}
                >
                  <span className={styles.rateCheckerButtonLabel}>
                    <NotebookPen />
                    Log conversion
                  </span>
                  <span className={styles.rateCheckerButtonLabelActive}>
                    <Check />
                    Logged conversion
                  </span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  )
}
