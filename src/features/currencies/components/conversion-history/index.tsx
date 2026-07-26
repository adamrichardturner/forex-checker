'use client'

import { BaseCard } from '@/components/layout/base-card'
import { useConversionLogsContext } from '../../persistence/currency-persistence-provider'
import { formatConvertedAmount, formatExchangeRate } from '../../utils/amount-input'
import styles from './conversion-history.module.scss'

function formatLoggedAt(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function ConversionHistory() {
  const { logs, isLoading, error } = useConversionLogsContext()

  return (
    <div className={styles.conversionHistory}>
      <h2 className={styles.conversionHistoryTitle}>Conversion history</h2>
      <BaseCard level="level-1" className={styles.conversionHistoryBaseCard}>
        {isLoading ? (
          <p className={styles.conversionHistoryEmpty}>Loading conversion history…</p>
        ) : null}
        {error ? (
          <p className={styles.conversionHistoryEmpty}>Failed to load conversion history</p>
        ) : null}
        {!isLoading && !error && logs.length === 0 ? (
          <p className={styles.conversionHistoryEmpty}>
            Log a conversion from the rate checker to build your history.
          </p>
        ) : null}
        {!isLoading && !error && logs.length > 0 ? (
          <ul className={styles.conversionHistoryList}>
            {logs.map((log) => (
              <li
                key={log.id ?? `${log.base}-${log.quote}-${log.createdAt}`}
                className={styles.conversionHistoryItem}
              >
                <div className={styles.conversionHistoryItemMain}>
                  <p className={styles.conversionHistoryPair}>
                    {log.base} → {log.quote}
                  </p>
                  <p className={styles.conversionHistoryAmounts}>
                    {formatConvertedAmount(log.sendAmount)} {log.base} →{' '}
                    {formatConvertedAmount(log.receiveAmount)} {log.quote}
                  </p>
                  <p className={styles.conversionHistoryMeta}>
                    Rate: 1 {log.base} = {formatExchangeRate(log.rate)} {log.quote}
                  </p>
                  <p className={styles.conversionHistoryMeta}>
                    Logged: {formatLoggedAt(log.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </BaseCard>
    </div>
  )
}
