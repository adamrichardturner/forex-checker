import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import CurrencyFlag from './currency-flag'

describe('CurrencyFlag', () => {
  it('renders the country code for a known currency', () => {
    render(<CurrencyFlag currencyCode="USD" />)
    expect(screen.getByText('US')).toBeTruthy()
  })

  it('falls back to the currency code for an unknown currency', () => {
    render(<CurrencyFlag currencyCode="XYZ" />)
    expect(screen.getByText('XYZ')).toBeTruthy()
  })
})
