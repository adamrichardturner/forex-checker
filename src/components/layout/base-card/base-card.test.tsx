import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BaseCard } from './index'

describe('BaseCard', () => {
  it('renders children inside the card content', () => {
    render(
      <BaseCard>
        <p>Card body</p>
      </BaseCard>,
    )

    expect(screen.getByText('Card body')).toBeInTheDocument()
  })

  it('renders an optional title in the card header', () => {
    render(
      <BaseCard title="Exchange rates">
        <p>Card body</p>
      </BaseCard>,
    )

    expect(screen.getByText('Exchange rates')).toBeInTheDocument()
    expect(screen.getByText('Card body')).toBeInTheDocument()
  })
})
