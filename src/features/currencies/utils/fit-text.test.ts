import { describe, expect, it } from 'vitest'
import { fitTextStyle } from './fit-text'

describe('fitTextStyle', () => {
  it('exposes the character count of the value, separators included', () => {
    expect(fitTextStyle('11,984,924,793,000,000.00')).toEqual({ '--fit-chars': 25 })
  })

  it('never reports fewer than one character', () => {
    expect(fitTextStyle('')).toEqual({ '--fit-chars': 1 })
    expect(fitTextStyle(null)).toEqual({ '--fit-chars': 1 })
    expect(fitTextStyle(undefined)).toEqual({ '--fit-chars': 1 })
  })
})
