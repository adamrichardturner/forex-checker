import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'
import {
  CONVERSION_LOGS_BY_CREATED_AT_INDEX,
  CONVERSION_LOGS_STORE,
  FAVOURITE_PAIRS_STORE,
  openDb,
  requestToPromise,
  transactionToPromise,
} from './open-db'

describe('openDb', () => {
  beforeEach(() => {
    // eslint-disable-next-line no-global-assign -- intentional test isolation
    indexedDB = new IDBFactory()
    vi.resetModules()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates object stores and the createdAt index on upgrade', async () => {
    const { openDb: freshOpenDb } = await import('./open-db')
    const db = await freshOpenDb()

    expect(db.objectStoreNames.contains(FAVOURITE_PAIRS_STORE)).toBe(true)
    expect(db.objectStoreNames.contains(CONVERSION_LOGS_STORE)).toBe(true)

    const tx = db.transaction(CONVERSION_LOGS_STORE, 'readonly')
    const store = tx.objectStore(CONVERSION_LOGS_STORE)
    expect(store.indexNames.contains(CONVERSION_LOGS_BY_CREATED_AT_INDEX)).toBe(true)
  })

  it('caches the database promise across concurrent opens', async () => {
    const { openDb: freshOpenDb } = await import('./open-db')
    const [first, second] = await Promise.all([freshOpenDb(), freshOpenDb()])

    expect(first).toBe(second)
  })

  it('throws when IndexedDB is unavailable', async () => {
    const original = globalThis.indexedDB
    // @ts-expect-error — simulate a non-browser environment
    delete globalThis.indexedDB

    try {
      const { openDb: freshOpenDb } = await import('./open-db')

      await expect(async () => {
        await freshOpenDb()
      }).rejects.toThrow('IndexedDB is only available in the browser')
    } finally {
      globalThis.indexedDB = original
    }
  })
})

describe('requestToPromise and transactionToPromise', () => {
  it('resolves successful requests and transactions', async () => {
    const db = await openDb()
    const tx = db.transaction(FAVOURITE_PAIRS_STORE, 'readwrite')
    const store = tx.objectStore(FAVOURITE_PAIRS_STORE)

    await requestToPromise(
      store.put({
        id: 'USD-EUR',
        base: 'USD',
        quote: 'EUR',
        createdAt: Date.now(),
      }),
    )
    await transactionToPromise(tx)

    const readTx = db.transaction(FAVOURITE_PAIRS_STORE, 'readonly')
    const value = await requestToPromise(readTx.objectStore(FAVOURITE_PAIRS_STORE).get('USD-EUR'))
    await transactionToPromise(readTx)

    expect(value).toMatchObject({ id: 'USD-EUR' })
  })
})
