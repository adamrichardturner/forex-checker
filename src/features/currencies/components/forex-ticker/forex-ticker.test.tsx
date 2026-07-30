import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../tests/utils/render'
import { ForexTicker } from './index'

describe('ForexTicker', () => {
  it('shows loading skeleton then live market pairs', async () => {
    renderWithProviders(<ForexTicker />)

    expect(screen.getByLabelText('Loading markets ticker')).toHaveAttribute('aria-busy', 'true')

    await waitFor(() => {
      expect(screen.getByLabelText('Live markets ticker')).toBeInTheDocument()
    })

    expect(screen.queryByLabelText('Loading markets ticker')).not.toBeInTheDocument()
    expect(screen.getByText('Live markets')).toBeInTheDocument()
    expect(screen.getAllByText('EUR/USD').length).toBeGreaterThan(0)
    expect(screen.getAllByText('USD/JPY').length).toBeGreaterThan(0)
  })
})
