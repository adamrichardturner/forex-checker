import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopBar } from './index'

vi.mock('next/image', () => ({
  default: (props: { alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- lightweight stand-in for next/image in unit tests
    <img alt={props.alt} />
  ),
}))

describe('TopBar', () => {
  it('shows loading skeleton when currency count is missing', () => {
    render(<TopBar />)

    expect(screen.getByLabelText('Loading top bar')).toHaveAttribute('aria-busy', 'true')
  })

  it('renders logo and currency count when data is available', () => {
    render(<TopBar currencyCount={28} />)

    expect(screen.getAllByAltText('Forex Checker Logo')).toHaveLength(2)
    expect(screen.getByText('28 currencies')).toBeInTheDocument()
    expect(screen.getByText(/EOD · ECB DATA/i)).toBeInTheDocument()
  })
})
