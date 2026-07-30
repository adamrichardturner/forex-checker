import { describe, expect, it } from 'vitest'
import { formatChange, formatRate, getChangeClassName, getChangePrefix } from './ticker-utils'
import styles from '../forex-ticker.module.scss'

describe('formatRate', () => {
  it('uses two decimals for rates of 100 or more', () => {
    expect(formatRate(160)).toBe('160.00')
    expect(formatRate(99.999)).toBe('99.9990')
  })

  it('uses four decimals below 100', () => {
    expect(formatRate(1.23456)).toBe('1.2346')
  })
})

describe('formatChange', () => {
  it('returns an em dash for null', () => {
    expect(formatChange(null)).toBe('—')
  })

  it('prefixes positive changes with a plus sign', () => {
    expect(formatChange(1.234)).toBe('+1.23%')
    expect(formatChange(-0.5)).toBe('-0.50%')
    expect(formatChange(0)).toBe('0.00%')
  })
})

describe('getChangeClassName and getChangePrefix', () => {
  it('maps directions to class names', () => {
    expect(getChangeClassName('up')).toBe(styles.forexTickerChangeUp)
    expect(getChangeClassName('down')).toBe(styles.forexTickerChangeDown)
    expect(getChangeClassName('flat')).toBe(styles.forexTickerChangeFlat)
  })

  it('maps directions to arrow prefixes', () => {
    expect(getChangePrefix('up')).toBe('▲ ')
    expect(getChangePrefix('down')).toBe('▼ ')
    expect(getChangePrefix('flat')).toBe('')
  })
})
