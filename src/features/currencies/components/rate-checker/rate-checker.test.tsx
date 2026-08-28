import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { DateTime } from 'luxon'
import { http, HttpResponse } from 'msw'
import { createUserWithFakeTimers, renderWithProviders } from '../../../../../tests/utils/render'
import { LATEST_RATES_EUR } from '../../../../../tests/fixtures/frankfurter'
import { server } from '../../../../../tests/msw/server'
import { APP_TIMEZONE } from '../../model/timezone.constants'
import { useCurrencyExchange } from '../../hooks/use-currency-exchange'
import * as favouritesRepository from '../../persistence/favourites-repository'
import { RateChecker } from './index'

function RateCheckerHarness() {
  const exchange = useCurrencyExchange()
  return <RateChecker {...exchange} />
}

describe('RateChecker', () => {
  describe('loading conversion rates', () => {
    it('disables send amount and shows a rate skeleton until fetch completes', async () => {
      server.use(
        http.get('*/rates', async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 50)
          })
          return HttpResponse.json([...LATEST_RATES_EUR])
        }),
      )

      renderWithProviders(<RateCheckerHarness />)

      const sendInput = screen.getByRole('textbox', { name: 'Send amount' })
      expect(sendInput).toBeDisabled()
      expect(screen.getByLabelText('Loading exchange rate')).toBeInTheDocument()

      await waitFor(() => {
        expect(sendInput).toBeEnabled()
      })

      expect(screen.queryByLabelText('Loading exchange rate')).not.toBeInTheDocument()
      expect(screen.getByText(/1 USD = 0\.9091 EUR/)).toBeInTheDocument()
    })
  })

  describe('amount and swap interactions', () => {
    beforeEach(() => {
      vi.useFakeTimers({ shouldAdvanceTime: true })
      vi.setSystemTime(DateTime.fromISO('2026-07-28T12:00:00', { zone: APP_TIMEZONE }).toJSDate())
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('updates receive amount and rate label when send amount changes', async () => {
      const user = createUserWithFakeTimers()

      renderWithProviders(<RateCheckerHarness />)

      await waitFor(() => {
        expect(screen.getByText('909.09')).toBeInTheDocument()
      })

      expect(screen.getByText(/1 USD = 0\.9091 EUR/)).toBeInTheDocument()

      const sendInput = screen.getByRole('textbox', { name: 'Send amount' })
      await user.clear(sendInput)
      await user.type(sendInput, '2000')
      vi.advanceTimersByTime(300)

      await waitFor(() => {
        expect(screen.getByText('1,818.18')).toBeInTheDocument()
      })

      expect(screen.getByText(/1 USD = 0\.9091 EUR/)).toBeInTheDocument()
    })

    it('swaps send and receive currencies', async () => {
      const user = createUserWithFakeTimers()

      renderWithProviders(<RateCheckerHarness />)

      await waitFor(() => {
        expect(screen.getByText('909.09')).toBeInTheDocument()
      })

      const swapButtons = screen.getAllByRole('button', {
        name: 'Swap send and receive currencies',
      })
      await user.click(swapButtons[0] as HTMLElement)

      await waitFor(() => {
        expect(screen.getByText(/1 EUR = 1\.1000 USD/)).toBeInTheDocument()
      })
    })

    it('keeps log button disabled when send amount is zero', async () => {
      const user = createUserWithFakeTimers()

      renderWithProviders(<RateCheckerHarness />)

      await waitFor(() => {
        expect(screen.getByText('909.09')).toBeInTheDocument()
      })

      const sendInput = screen.getByRole('textbox', { name: 'Send amount' })
      await user.clear(sendInput)
      vi.advanceTimersByTime(300)

      const logButton = screen.getByRole('button', { name: 'Log conversion' })

      await waitFor(() => {
        expect(logButton).toBeDisabled()
      })
    })
  })

  describe('log conversion', () => {
    it('shows success state then re-enables after the timeout', async () => {
      const { user } = renderWithProviders(<RateCheckerHarness />)

      const logButton = await screen.findByRole('button', { name: 'Log conversion' })

      await waitFor(() => {
        expect(logButton).not.toBeDisabled()
      })

      await user.click(logButton)

      await waitFor(() => {
        expect(logButton).toHaveAccessibleName('Conversion logged')
      })
      expect(logButton).toBeDisabled()

      await waitFor(
        () => {
          expect(logButton).toHaveAccessibleName('Log conversion')
          expect(logButton).not.toBeDisabled()
        },
        { timeout: 3_000 },
      )
    })
  })

  describe('favourite interactions', () => {
    it('reflects favourite pressed state after loading', async () => {
      const { user } = renderWithProviders(<RateCheckerHarness />)

      const favouriteButton = await screen.findByRole('button', { name: 'Add pair to favourites' })

      await waitFor(() => {
        expect(favouriteButton).not.toHaveAttribute('data-pending')
      })

      expect(favouriteButton).toHaveAttribute('aria-pressed', 'false')

      await user.click(favouriteButton)

      await waitFor(() => {
        expect(favouriteButton).toHaveAttribute('aria-pressed', 'true')
      })
      expect(favouriteButton).toHaveAccessibleName('Remove pair from favourites')
    })

    it('reverts optimistic favourite state when toggle rejects', async () => {
      vi.spyOn(favouritesRepository, 'addFavouritePair').mockRejectedValueOnce(
        new Error('Failed to save favourite'),
      )

      const { user } = renderWithProviders(<RateCheckerHarness />)

      const favouriteButton = await screen.findByRole('button', {
        name: /Add pair to favourites|Remove pair from favourites/,
      })

      await waitFor(() => {
        expect(favouriteButton).not.toHaveAttribute('data-pending')
      })

      if (favouriteButton.getAttribute('aria-pressed') === 'true') {
        await user.click(favouriteButton)
        await waitFor(() => {
          expect(favouriteButton).toHaveAttribute('aria-pressed', 'false')
        })
      }

      await user.click(favouriteButton)

      await waitFor(() => {
        expect(favouriteButton).toHaveAttribute('aria-pressed', 'false')
      })
      expect(favouriteButton).toHaveAccessibleName('Add pair to favourites')
    })
  })
})
