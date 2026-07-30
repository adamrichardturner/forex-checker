'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import type { ConversionLog } from '../../model/persistence.types'
import { formatConvertedAmount } from '../../utils/amount-input'
import { formatLogAge } from '../../utils/format-log-age'
import styles from './conversion-history.module.scss'

type ConversionLogRowProps = {
  log: ConversionLog
  onRemove: (id: number) => Promise<void>
}

export function ConversionLogRow({ log, onRemove }: ConversionLogRowProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isRemoving, setIsRemoving] = useState(false)
  const logId = log.id

  const handleRemove = async () => {
    if (logId === undefined || isRemoving) {
      return
    }

    setIsRemoving(true)

    try {
      await onRemove(logId)
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <motion.li
      layout={prefersReducedMotion ? false : 'position'}
      className={styles.conversionHistoryItem}
      style={{ width: '100%' }}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        prefersReducedMotion
          ? undefined
          : {
              opacity: 0,
              x: 28,
              scale: 0.97,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              layout: { type: 'spring', stiffness: 480, damping: 38, mass: 0.75 },
              opacity: { duration: 0.2 },
              y: { type: 'spring', stiffness: 480, damping: 34 },
              scale: { type: 'spring', stiffness: 480, damping: 34 },
            }
      }
    >
      <div className={styles.conversionHistoryMeta}>
        <p className={styles.conversionHistoryAge}>{formatLogAge(log.createdAt)}</p>
        <p className={styles.conversionHistoryPair}>
          <span>{log.base}</span>
          <Image
            src="/ArrowIcon.svg"
            alt=""
            width={11}
            height={11}
            className={styles.conversionHistoryPairArrow}
            aria-hidden="true"
          />
          <span>{log.quote}</span>
        </p>
      </div>

      <div className={styles.conversionHistoryAmounts}>
        <p className={styles.conversionHistorySendAmount}>
          {formatConvertedAmount(log.sendAmount)}
        </p>
        <p className={styles.conversionHistoryReceiveAmount}>
          {formatConvertedAmount(log.receiveAmount)}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className={styles.conversionHistoryDeleteButton}
        onClick={() => {
          void handleRemove()
        }}
        disabled={logId === undefined || isRemoving}
        aria-label={`Delete ${log.base} to ${log.quote} conversion log`}
      >
        <Trash2 />
      </Button>
    </motion.li>
  )
}
