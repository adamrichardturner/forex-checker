import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'

describe('favourites-repository', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory()
    vi.resetModules()
  })

  async function loadRepository() {
    return import('./favourites-repository')
  }

  it('adds, lists, and removes favourite pairs', async () => {
    const repo = await loadRepository()

    const pair = await repo.addFavouritePair('USD', 'EUR')
    expect(pair).toMatchObject({
      id: 'USD-EUR',
      base: 'USD',
      quote: 'EUR',
    })

    await repo.addFavouritePair('GBP', 'USD')
    const listed = await repo.listFavouritePairs()

    expect(listed.map((item) => item.id)).toEqual(['GBP-USD', 'USD-EUR'])
    expect(await repo.isFavouritePair('USD', 'EUR')).toBe(true)

    await repo.removeFavouritePair('USD', 'EUR')
    expect(await repo.isFavouritePair('USD', 'EUR')).toBe(false)
    expect((await repo.listFavouritePairs()).map((item) => item.id)).toEqual(['GBP-USD'])
  })

  it('is idempotent when re-adding the same pair id', async () => {
    const repo = await loadRepository()

    await repo.addFavouritePair('USD', 'EUR')
    await repo.addFavouritePair('USD', 'EUR')

    expect(await repo.listFavouritePairs()).toHaveLength(1)
  })

  it('persists across a simulated module reload', async () => {
    const first = await loadRepository()
    await first.addFavouritePair('USD', 'EUR')

    vi.resetModules()
    const second = await loadRepository()

    expect((await second.listFavouritePairs()).map((item) => item.id)).toEqual(['USD-EUR'])
  })
})
