import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../tests/utils/render'
import { Compare } from './index'

function expectComparePairCount(count: number) {
  const header = document.querySelector('.compareHeaderCount')
  expect(header).toHaveTextContent(`${count} pairs`)
}

describe('Compare', () => {
  it('shows empty state when amount is zero', () => {
    renderWithProviders(<Compare base="USD" quote="EUR" amount={0} formattedAmount="" />)

    expect(screen.getByRole('status')).toHaveTextContent('No comparison available')
    expect(
      screen.getByText(/Enter an amount in SEND above to see what your money is worth/i),
    ).toBeInTheDocument()
  })

  it('excludes base and quote currencies from comparison rows', async () => {
    renderWithProviders(<Compare base="USD" quote="EUR" amount={1000} formattedAmount="1,000" />)

    await waitFor(() => {
      expectComparePairCount(8)
    })

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Add USD to GBP to favourites' }),
      ).toBeInTheDocument()
    })

    expect(
      screen.queryByRole('button', { name: 'Add USD to EUR to favourites' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Add USD to USD to favourites' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add USD to JPY to favourites' })).toBeInTheDocument()
  })

  it('displays the formatted amount and pair count in the header', async () => {
    renderWithProviders(<Compare base="USD" quote="EUR" amount={1000} formattedAmount="1,000" />)

    await waitFor(() => {
      expect(screen.getByText(/1,000 from USD/i)).toBeInTheDocument()
    })

    expectComparePairCount(8)
  })

  it('toggles favourite state from a comparison row', async () => {
    const { user } = renderWithProviders(
      <Compare base="USD" quote="EUR" amount={1000} formattedAmount="1,000" />,
    )

    const favouriteButton = await screen.findByRole('button', {
      name: 'Add USD to GBP to favourites',
    })

    expect(favouriteButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(favouriteButton)

    await waitFor(() => {
      expect(favouriteButton).toHaveAttribute('aria-pressed', 'true')
    })
    expect(favouriteButton).toHaveAccessibleName('Remove USD to GBP from favourites')
  })
})
