import { describe, it, expect } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import CurrencyButton from './currency-button'

describe('CurrencyButton', () => {
  it('renders the currency code and label', () => {
    render(
      <CurrencyButton selectedCode="USD" currencies={{ USD: 'US Dollar' }} onSelect={() => {}} />,
    )
    expect(screen.getByText('USD')).toBeTruthy()
    expect(screen.getByText('US Dollar')).toBeTruthy()
  })
})
