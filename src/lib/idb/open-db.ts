const DB_NAME = 'forex-checker'
const DB_VERSION = 1

export const FAVOURITE_PAIRS_STORE = 'favouritePairs'
export const CONVERSION_LOGS_STORE = 'conversionLogs'
export const CONVERSION_LOGS_BY_CREATED_AT_INDEX = 'byCreatedAt'

let dbPromise: Promise<IDBDatabase> | null = null

function assertBrowser(): void {
  if (typeof indexedDB === 'undefined') {
    throw new Error('IndexedDB is only available in the browser')
  }
}

export function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(request.error ?? new Error('IndexedDB request failed'))
    }
  })
}

export function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve()
    }

    transaction.onerror = () => {
      reject(transaction.error ?? new Error('IndexedDB transaction failed'))
    }

    transaction.onabort = () => {
      reject(transaction.error ?? new Error('IndexedDB transaction aborted'))
    }
  })
}

function createObjectStores(db: IDBDatabase): void {
  if (!db.objectStoreNames.contains(FAVOURITE_PAIRS_STORE)) {
    db.createObjectStore(FAVOURITE_PAIRS_STORE, { keyPath: 'id' })
  }

  if (!db.objectStoreNames.contains(CONVERSION_LOGS_STORE)) {
    const store = db.createObjectStore(CONVERSION_LOGS_STORE, {
      keyPath: 'id',
      autoIncrement: true,
    })
    store.createIndex(CONVERSION_LOGS_BY_CREATED_AT_INDEX, 'createdAt')
  }
}

export function openDb(): Promise<IDBDatabase> {
  assertBrowser()

  if (dbPromise) {
    return dbPromise
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      createObjectStores(request.result)
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      dbPromise = null
      reject(request.error ?? new Error('Failed to open IndexedDB'))
    }
  })

  return dbPromise
}

/** Clears the cached DB promise so tests can rebuild IndexedDB between cases. */
export function resetOpenDbCache(): void {
  dbPromise = null
}
