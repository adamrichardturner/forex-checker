'use client'

import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BaseCard } from '@/components/layout/base-card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useConversionLogsContext } from '../../persistence/currency-persistence-provider'
import { TabEmptyState } from '../tab-empty-state'
import { ConversionLogRow } from './conversion-log-row'
import styles from './conversion-history.module.scss'

export function ConversionHistory() {
  const { logs, isLoading, error, removeLog, clearLogs } = useConversionLogsContext()
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const loggedLabel = `${logs.length} LOGGED`
  const hasLogs = logs.length > 0

  const handleConfirmClear = async () => {
    if (isClearing) {
      return
    }

    setIsClearing(true)

    try {
      await clearLogs()
      setIsClearDialogOpen(false)
    } finally {
      setIsClearing(false)
    }
  }

  if (!isLoading && !error && !hasLogs) {
    return (
      <TabEmptyState
        title="No conversions logged yet"
        description="Every conversion is recorded here automatically when you tap LOG CONVERSION. Your log is private to this session and this browser."
      />
    )
  }

  return (
    <div className={styles.conversionHistory}>
      <BaseCard level="level-1" className={styles.conversionHistoryBaseCard}>
        <div className={styles.conversionHistoryHeader}>
          <p className={styles.conversionHistoryHeaderTitle}>Conversion Log</p>
          <div className={styles.conversionHistoryHeaderActions}>
            <p className={styles.conversionHistoryHeaderCount}>{loggedLabel}</p>
            <Button
              type="button"
              variant="outline"
              className={styles.conversionHistoryClearButton}
              disabled={!hasLogs || isLoading}
              onClick={() => {
                setIsClearDialogOpen(true)
              }}
            >
              Clear all
            </Button>
          </div>
        </div>

        {isLoading ? (
          <p className={styles.conversionHistoryEmpty}>Loading conversion history…</p>
        ) : null}
        {error ? (
          <p className={styles.conversionHistoryEmpty}>Failed to load conversion history</p>
        ) : null}

        {!isLoading && !error && hasLogs ? (
          <div className={styles.conversionHistoryContent}>
            <ul className={styles.conversionHistoryList}>
              <AnimatePresence initial={false} mode="popLayout">
                {logs.map((log) => (
                  <ConversionLogRow
                    key={log.id ?? `${log.base}-${log.quote}-${log.createdAt}`}
                    log={log}
                    onRemove={removeLog}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </div>
        ) : null}
      </BaseCard>

      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent className={styles.clearDialog} showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className={styles.clearDialogTitle}>Clear conversion log?</DialogTitle>
            <DialogDescription className={styles.clearDialogDescription}>
              This will permanently delete all {logs.length} logged conversions. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className={styles.clearDialogFooter}>
            <DialogClose
              render={<Button variant="outline" className={styles.clearDialogCancelButton} />}
            >
              Cancel
            </DialogClose>
            <Button
              type="button"
              className={styles.clearDialogConfirmButton}
              disabled={isClearing}
              onClick={() => {
                void handleConfirmClear()
              }}
            >
              {isClearing ? 'Clearing…' : 'Clear all'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
