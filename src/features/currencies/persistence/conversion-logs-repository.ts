import {
  CONVERSION_LOGS_BY_CREATED_AT_INDEX,
  CONVERSION_LOGS_STORE,
  openDb,
  requestToPromise,
  transactionToPromise,
} from '@/lib/idb/open-db'
import type { ConversionLog, NewConversionLog } from '../model/persistence.types'

export async function addConversionLog(input: NewConversionLog): Promise<ConversionLog> {
  const log: ConversionLog = {
    ...input,
    createdAt: Date.now(),
  }

  const db = await openDb()
  const tx = db.transaction(CONVERSION_LOGS_STORE, 'readwrite')
  const store = tx.objectStore(CONVERSION_LOGS_STORE)
  const key = await requestToPromise(store.add(log))
  await transactionToPromise(tx)

  if (typeof key !== 'number') {
    throw new Error('Expected auto-incremented numeric conversion log id')
  }

  return {
    ...log,
    id: key,
  }
}

export async function listConversionLogs(): Promise<ConversionLog[]> {
  const db = await openDb()
  const tx = db.transaction(CONVERSION_LOGS_STORE, 'readonly')
  const store = tx.objectStore(CONVERSION_LOGS_STORE)
  const index = store.index(CONVERSION_LOGS_BY_CREATED_AT_INDEX)
  const logs: ConversionLog[] = await requestToPromise(index.getAll())
  await transactionToPromise(tx)

  return logs.toSorted((a, b) => b.createdAt - a.createdAt)
}
