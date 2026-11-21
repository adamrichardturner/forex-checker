import { describe, expect, it } from 'vitest'
import {
  MAX_SEND_AMOUNT,
  clampSendAmountInput,
  countRawCharacters,
  formatAmountInput,
  formatAxisRate,
  formatConvertedAmount,
  formatExchangeRate,
  finalizeAmountInput,
  isValidAmountInput,
  normalizeAmountInput,
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

describe('amount precision and length limits', () => {
  it('accepts up to two decimal places', () => {
    expect(isValidAmountInput('1000.9')).toBe(true)
    expect(isValidAmountInput('1,000.99')).toBe(true)
  })

  it('rejects more than two decimal places', () => {
    expect(isValidAmountInput('1000.999')).toBe(false)
    expect(isValidAmountInput('1000.999999999999999')).toBe(false)
    expect(isValidAmountInput('0.001')).toBe(false)
  })

  it('rejects over-long integer parts, including padded zeros', () => {
    expect(isValidAmountInput('1000000')).toBe(false)
    expect(isValidAmountInput('0000001')).toBe(false)
  })

  it('rejects signs, exponents and whitespace', () => {
    expect(isValidAmountInput('-5')).toBe(false)
    expect(isValidAmountInput('1e3')).toBe(false)
    expect(isValidAmountInput('1 000')).toBe(false)
  })
})

describe('normalizeAmountInput', () => {
  it('strips redundant leading zeros', () => {
    expect(normalizeAmountInput('007')).toBe('7')
    expect(normalizeAmountInput('00.5')).toBe('0.5')
    expect(normalizeAmountInput('0,050')).toBe('50')
  })

  it('keeps a single zero and ordinary values', () => {
    expect(normalizeAmountInput('0')).toBe('0')
    expect(normalizeAmountInput('0.5')).toBe('0.5')
    expect(normalizeAmountInput('1,000.5')).toBe('1000.5')
    expect(normalizeAmountInput('')).toBe('')
  })
})

describe('finalizeAmountInput', () => {
  it('drops a dangling decimal point', () => {
    expect(finalizeAmountInput('1,000.')).toBe('1,000')
  })

  it('adds a leading zero to bare fractions', () => {
    expect(finalizeAmountInput('.5')).toBe('0.5')
  })

  it('clears a lone decimal point and leaves complete values alone', () => {
    expect(finalizeAmountInput('.')).toBe('')
    expect(finalizeAmountInput('')).toBe('')
    expect(finalizeAmountInput('1,000.50')).toBe('1,000.50')
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

describe('formatAxisRate', () => {
  it('keeps four decimals for rates under 1,000', () => {
    expect(formatAxisRate(0.90909)).toBe('0.9091')
    expect(formatAxisRate(157.23)).toBe('157.2300')
  })

  it('drops to two decimals for rates in the thousands', () => {
    expect(formatAxisRate(1470.254)).toBe('1,470.25')
  })

  it('abbreviates large rates so they fit the axis gutter', () => {
    expect(formatAxisRate(28361)).toBe('28.36K')
    expect(formatAxisRate(1935975.976)).toBe('1.936M')
    expect(formatAxisRate(119849247929.6941)).toBe('119.8B')
  })

  it('never exceeds eight characters', () => {
    const samples = [0.000017751, 0.9091, 999.99999, 1000, 9999.999, 10000, 2127444, 1.2e16]

    for (const sample of samples) {
      expect(formatAxisRate(sample).length).toBeLessThanOrEqual(8)
    }
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
