import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CurrencyFlag from './currency-flag'

describe('CurrencyFlag', () => {
  it('renders the country code for a known currency', () => {
    render(<CurrencyFlag currencyCode="USD" />)
    expect(screen.getByText('US')).toBeInTheDocument()
  })

  it('falls back to the currency code for an unknown currency', () => {
    render(<CurrencyFlag currencyCode="XYZ" />)
    expect(screen.getByText('XYZ')).toBeInTheDocument()
  })

  it('falls back to the currency code for commodity codes without flags', () => {
    render(<CurrencyFlag currencyCode="XAU" />)
    expect(screen.getByText('XAU')).toBeInTheDocument()
  })

  it('falls back to the currency code for empty or unmapped regional codes', () => {
    render(<CurrencyFlag currencyCode="ZZZ" />)
    expect(screen.getByText('ZZZ')).toBeInTheDocument()
  })

  it('renders mapped country codes for multi-country currencies', () => {
    render(<CurrencyFlag currencyCode="XAF" />)
    expect(screen.getByText('CF')).toBeInTheDocument()
  })
})
