'use client'

import { useLayoutEffect, useRef, type ChangeEvent } from 'react'
import { ArrowLeftRight, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CurrencyButton } from '../..'
import { useCurrencyExchange } from '../../hooks/use-currency-exchange'
import {
  countRawCharacters,
  formatAmountInput,
  isValidAmountInput,
  mapRawCaretToFormattedIndex,
  stripAmountFormatting,
} from '../../utils/amount-input'
import styles from './rate-checker.module.scss'
import { BaseCard } from '@/components/layout/base-card'

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
  } = useCurrencyExchange()

  const sendInputRef = useRef<HTMLInputElement>(null)
  const caretRef = useRef<number | null>(null)

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

  return (
    <div className={styles.rateChecker}>
      <h2 className={styles.rateCheckerTitle}>Check the rate</h2>
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
  )
}
