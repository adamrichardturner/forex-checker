import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'
import { resetOpenDbCache } from '@/lib/idb/open-db'

/**
 * Resets IndexedDB between tests and clears the cached `openDb()` promise.
 */
export function resetIndexedDb(): void {
  resetOpenDbCache()
  // Replace the global factory so subsequent opens use a fresh store.
  // eslint-disable-next-line no-global-assign -- intentional test isolation
  indexedDB = new IDBFactory()
}

export async function deleteForexCheckerDb(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase('forex-checker')

    request.onsuccess = () => {
      resolve()
    }

    request.onerror = () => {
      reject(request.error ?? new Error('Failed to delete forex-checker database'))
    }

    request.onblocked = () => {
      resolve()
    }
  })
}
