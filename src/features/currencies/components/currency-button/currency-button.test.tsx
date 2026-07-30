import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CurrencyButton from './currency-button'

describe('CurrencyButton', () => {
  it('renders the currency code', () => {
    render(
      <CurrencyButton
        selectedCode="USD"
        currencies={[{ iso_code: 'USD', name: 'US Dollar' }]}
        onSelect={vi.fn()}
      />,
    )

    expect(screen.getByText('USD')).toBeInTheDocument()
  })
})
