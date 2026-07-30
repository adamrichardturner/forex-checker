import { describe, expect, it } from 'vitest'
import { favouritePairId } from './persistence.types'

describe('favouritePairId', () => {
  it('formats base and quote as a stable id', () => {
    expect(favouritePairId('USD', 'EUR')).toBe('USD-EUR')
  })

  it('is order-sensitive', () => {
    expect(favouritePairId('USD', 'EUR')).not.toBe(favouritePairId('EUR', 'USD'))
  })
})
