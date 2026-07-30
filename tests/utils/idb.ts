import 'fake-indexeddb/auto'
import { IDBFactory } from 'fake-indexeddb'

/**
 * Resets IndexedDB between tests.
 *
 * `openDb()` caches `dbPromise` at module scope, so callers that need a clean
 * database after a reset must also call `vi.resetModules()` and re-import.
 */
export function resetIndexedDb(): void {
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
