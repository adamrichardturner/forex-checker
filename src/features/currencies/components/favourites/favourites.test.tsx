import { useEffect, useRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../tests/utils/render'
import { useFavouritePairsContext } from '../../persistence/currency-persistence-provider'
import { Favourites } from './index'

type SeedPairsProps = {
  pairs: Array<[string, string]>
}

function FavouritesWithSeededPairs({ pairs }: SeedPairsProps) {
  const { addFavourite, isLoading } = useFavouritePairsContext()
  const [ready, setReady] = useState(false)
  const seededRef = useRef(false)
  const pairsRef = useRef(pairs)
  pairsRef.current = pairs

  useEffect(() => {
    if (isLoading || seededRef.current) {
      return
    }

    let cancelled = false
    seededRef.current = true

    void (async () => {
      for (const [base, quote] of pairsRef.current) {
        await addFavourite(base, quote)
      }

      if (!cancelled) {
        setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [addFavourite, isLoading])

  if (!ready) {
    return null
  }

  return <Favourites />
}

describe('Favourites', () => {
  it('shows empty state when no pairs are pinned', async () => {
    renderWithProviders(<Favourites />)

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('No pinned pairs yet')
    })

    expect(screen.getByText(/Pin a pair to track its rate here/i)).toBeInTheDocument()
  })

  it('renders pinned rows with plural count label', async () => {
    renderWithProviders(
      <FavouritesWithSeededPairs
        pairs={[
          ['USD', 'EUR'],
          ['GBP', 'JPY'],
        ]}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('2 pairs')).toBeInTheDocument()
    })

    expect(screen.getByText('Pinned Pairs')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Remove USD to EUR from favourites' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Remove GBP to JPY from favourites' }),
    ).toBeInTheDocument()
  })

  it('unpins a pair and shows a singular count label', async () => {
    const { user } = renderWithProviders(
      <FavouritesWithSeededPairs
        pairs={[
          ['USD', 'EUR'],
          ['GBP', 'JPY'],
        ]}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('2 pairs')).toBeInTheDocument()
    })

    const removeButton = screen.getByRole('button', {
      name: 'Remove USD to EUR from favourites',
    })

    await user.click(removeButton)

    await waitFor(() => {
      expect(screen.getByText('1 pair')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Remove USD to EUR from favourites' })).toBeNull()
    })
  })
})
