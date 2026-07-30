import { describe, expect, it } from 'vitest'
import {
  MAX_SEND_AMOUNT,
  clampSendAmountInput,
  countRawCharacters,
  formatAmountInput,
  formatConvertedAmount,
  formatExchangeRate,
  isValidAmountInput,
  mapRawCaretToFormattedIndex,
  parseAmountInput,
  stripAmountFormatting,
  toSwapAmountInput,
} from './amount-input'

describe('stripAmountFormatting', () => {
  it('removes commas', () => {
    expect(stripAmountFormatting('1,000.50')).toBe('1000.50')
  })
})

describe('isValidAmountInput', () => {
  it('accepts empty input (current behaviour)', () => {
    expect(isValidAmountInput('')).toBe(true)
  })

  it('accepts partial decimal input', () => {
    expect(isValidAmountInput('.')).toBe(true)
    expect(isValidAmountInput('1000.')).toBe(true)
  })

  it('rejects non-numeric characters', () => {
    expect(isValidAmountInput('12a')).toBe(false)
    expect(isValidAmountInput('1.2.3')).toBe(false)
  })

  it('rejects amounts above the max send amount', () => {
    expect(isValidAmountInput(String(MAX_SEND_AMOUNT + 1))).toBe(false)
  })

  it('accepts the max send amount', () => {
    expect(isValidAmountInput(String(MAX_SEND_AMOUNT))).toBe(true)
  })
})

describe('formatAmountInput', () => {
  it('returns empty string for empty input', () => {
    expect(formatAmountInput('')).toBe('')
  })

  it('adds thousands separators', () => {
    expect(formatAmountInput('1000')).toBe('1,000')
    expect(formatAmountInput('1000000')).toBe('1,000,000')
  })

  it('preserves trailing decimals', () => {
    expect(formatAmountInput('1000.')).toBe('1,000.')
    expect(formatAmountInput('1000.5')).toBe('1,000.5')
  })

  it('strips existing commas before reformatting', () => {
    expect(formatAmountInput('1,000')).toBe('1,000')
  })
})

describe('parseAmountInput', () => {
  it('returns NaN for empty and bare decimal', () => {
    expect(parseAmountInput('')).toBeNaN()
    expect(parseAmountInput('.')).toBeNaN()
  })

  it('parses formatted amounts', () => {
    expect(parseAmountInput('1,000.50')).toBe(1000.5)
  })
})

describe('caret mapping', () => {
  it('counts raw characters skipping commas', () => {
    expect(countRawCharacters('1,000', 3)).toBe(2)
    expect(countRawCharacters('1,000', 5)).toBe(4)
  })

  it('maps a raw caret back into formatted text', () => {
    expect(mapRawCaretToFormattedIndex('1,000', 0)).toBe(0)
    expect(mapRawCaretToFormattedIndex('1,000', 1)).toBe(1)
    expect(mapRawCaretToFormattedIndex('1,000', 2)).toBe(3)
    expect(mapRawCaretToFormattedIndex('1,000', 4)).toBe(5)
  })

  it('clamps past-end raw carets to the formatted length', () => {
    expect(mapRawCaretToFormattedIndex('1,000', 99)).toBe(5)
  })
})

describe('formatConvertedAmount and formatExchangeRate', () => {
  it('formats converted amounts to two decimals', () => {
    expect(formatConvertedAmount(1234.5)).toBe('1,234.50')
  })

  it('formats exchange rates to four decimals', () => {
    expect(formatExchangeRate(1.23456)).toBe('1.2346')
  })
})

describe('clampSendAmountInput and toSwapAmountInput', () => {
  it('clamps values above the max', () => {
    expect(clampSendAmountInput(String(MAX_SEND_AMOUNT + 50))).toBe('100,000')
  })

  it('formats finite values under the max', () => {
    expect(clampSendAmountInput('2500.5')).toBe('2,500.5')
  })

  it('formats non-finite input without clamping', () => {
    expect(clampSendAmountInput('.')).toBe('.')
  })

  it('converts a swapped receive amount into a clamped send input', () => {
    expect(toSwapAmountInput(1234.567)).toBe('1,234.57')
  })
})
