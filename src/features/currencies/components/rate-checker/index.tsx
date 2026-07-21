'use client'

import { Input } from '@/components/ui/input'
import { Currency, CurrencyButton } from '../..'
import { useCurrencyExchange } from '../../hooks/use-currency-exchange'
import styles from './rate-checker.module.scss'
import { BaseCard } from '@/components/layout/base-card'

export function RateChecker() {
  const {
    baseRate,
    quoteRate,
    isPending,
    isError,
    onSetSendCurrency,
    onSetReceiveCurrency,
    currencies,
    sendCurrency,
    sendAmount,
    onEnterSendAmount,
  } = useCurrencyExchange()
  return (
    <div className={styles.rateChecker}>
      <h2 className={styles.rateCheckerTitle}>Check the rate</h2>
      <BaseCard level="level-1">
        {/* Send */}

        <div className={styles.rateCheckerCard}>
          <h3 className={styles.rateCheckerCardTitle}>Send</h3>
          <div>
            <Input
              className={styles.rateCheckerCardInput}
              type="number"
              value={sendAmount}
              onChange={(e) => onEnterSendAmount(Number(e.target.value))}
            />
            <CurrencyButton
              selectedCode={sendCurrency}
              currencies={currencies ?? []}
              onSelect={onSetSendCurrency}
            />
          </div>
        </div>

        {/* Receive */}
      </BaseCard>
    </div>
  )
}
