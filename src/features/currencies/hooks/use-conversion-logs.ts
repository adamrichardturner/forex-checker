'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ConversionLog, NewConversionLog } from '../model/persistence.types'
import {
  addConversionLog,
  clearConversionLogs,
  deleteConversionLog,
  listConversionLogs,
} from '../persistence/conversion-logs-repository'

export function useConversionLogs() {
  const [logs, setLogs] = useState<ConversionLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    void listConversionLogs()
      .then((nextLogs) => {
        if (cancelled) {
          return
        }

        setLogs(nextLogs)
        setError(null)
      })
      .catch((caught: unknown) => {
        if (cancelled) {
          return
        }

        if (caught instanceof Error) {
          setError(caught)
          return
        }

        setError(new Error('Failed to load conversion logs'))
      })
      .finally(() => {
        if (cancelled) {
          return
        }

        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const logConversion = useCallback(async (input: NewConversionLog) => {
    const log = await addConversionLog(input)
    setLogs((current) => [log, ...current])
    return log
  }, [])

  const removeLog = useCallback(async (id: number) => {
    await deleteConversionLog(id)
    setLogs((current) => current.filter((log) => log.id !== id))
  }, [])

  const clearLogs = useCallback(async () => {
    await clearConversionLogs()
    setLogs([])
  }, [])

  return {
    logs,
    isLoading,
    error,
    logConversion,
    removeLog,
    clearLogs,
  }
}
