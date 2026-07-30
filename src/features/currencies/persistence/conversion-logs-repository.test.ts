import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'

const sampleLog = {
  base: 'USD',
  quote: 'EUR',
  sendAmount: 1000,
  receiveAmount: 909.09,
  rate: 0.90909,
}

describe('conversion-logs-repository', () => {
  beforeEach(() => {
    indexedDB = new IDBFactory()
    vi.resetModules()
  })

  async function loadRepository() {
    return import('./conversion-logs-repository')
  }

  it('assigns autoincrement ids and lists newest first', async () => {
    const repo = await loadRepository()

    const first = await repo.addConversionLog(sampleLog)
    const second = await repo.addConversionLog({
      ...sampleLog,
      sendAmount: 500,
    })

    expect(first.id).toEqual(expect.any(Number))
    expect(second.id).toEqual(expect.any(Number))
    expect(second.id).not.toBe(first.id)

    const listed = await repo.listConversionLogs()
    expect(listed.map((log) => log.sendAmount)).toEqual([500, 1000])
  })

  it('deletes a single log and clears all logs', async () => {
    const repo = await loadRepository()

    const first = await repo.addConversionLog(sampleLog)
    await repo.addConversionLog({
      ...sampleLog,
      sendAmount: 250,
    })

    if (first.id === undefined) {
      throw new Error('Expected conversion log id')
    }

    await repo.deleteConversionLog(first.id)
    expect(await repo.listConversionLogs()).toHaveLength(1)

    await repo.clearConversionLogs()
    expect(await repo.listConversionLogs()).toEqual([])
  })
})
