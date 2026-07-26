import {
  FAVOURITE_PAIRS_STORE,
  openDb,
  requestToPromise,
  transactionToPromise,
} from '@/lib/idb/open-db'
import { favouritePairId, type FavouritePair } from '../model/persistence.types'

export async function listFavouritePairs(): Promise<FavouritePair[]> {
  const db = await openDb()
  const tx = db.transaction(FAVOURITE_PAIRS_STORE, 'readonly')
  const store = tx.objectStore(FAVOURITE_PAIRS_STORE)
  const pairs: FavouritePair[] = await requestToPromise(store.getAll())
  await transactionToPromise(tx)

  return pairs.toSorted((a, b) => b.createdAt - a.createdAt)
}

export async function addFavouritePair(base: string, quote: string): Promise<FavouritePair> {
  const pair: FavouritePair = {
    id: favouritePairId(base, quote),
    base,
    quote,
    createdAt: Date.now(),
  }

  const db = await openDb()
  const tx = db.transaction(FAVOURITE_PAIRS_STORE, 'readwrite')
  const store = tx.objectStore(FAVOURITE_PAIRS_STORE)
  await requestToPromise(store.put(pair))
  await transactionToPromise(tx)

  return pair
}

export async function removeFavouritePair(base: string, quote: string): Promise<void> {
  const db = await openDb()
  const tx = db.transaction(FAVOURITE_PAIRS_STORE, 'readwrite')
  const store = tx.objectStore(FAVOURITE_PAIRS_STORE)
  await requestToPromise(store.delete(favouritePairId(base, quote)))
  await transactionToPromise(tx)
}

export async function isFavouritePair(base: string, quote: string): Promise<boolean> {
  const db = await openDb()
  const tx = db.transaction(FAVOURITE_PAIRS_STORE, 'readonly')
  const store = tx.objectStore(FAVOURITE_PAIRS_STORE)
  const pair: FavouritePair | undefined = await requestToPromise(
    store.get(favouritePairId(base, quote)),
  )
  await transactionToPromise(tx)

  return pair !== undefined
}
