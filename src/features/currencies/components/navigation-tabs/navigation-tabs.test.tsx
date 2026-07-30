import { describe, expect, it } from 'vitest'
import { act, screen, waitFor, within } from '@testing-library/react'
import { renderHookWithProviders, renderWithProviders } from '../../../../../tests/utils/render'
import {
  useConversionLogsContext,
  useFavouritePairsContext,
} from '../../persistence/currency-persistence-provider'
import { NavigationTabs } from './index'

describe('NavigationTabs', () => {
  it('renders four tabs with history selected by default', () => {
    renderWithProviders(
      <NavigationTabs base="EUR" quote="USD" amount={1000} formattedAmount="1,000" />,
    )

    expect(screen.getByRole('tab', { name: /History/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Compare/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Favourites/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Log/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /History/i })).toHaveAttribute('aria-selected', 'true')
  })

  it('shows badge counts for favourites and log tabs', async () => {
    const favouritesHook = renderHookWithProviders(() => useFavouritePairsContext())
    const logsHook = renderHookWithProviders(() => useConversionLogsContext())

    await waitFor(() => {
      expect(favouritesHook.result.current.isLoading).toBe(false)
      expect(logsHook.result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await favouritesHook.result.current.addFavourite('USD', 'GBP')
    })
    await act(async () => {
      await logsHook.result.current.logConversion({
        base: 'USD',
        quote: 'EUR',
        sendAmount: 1000,
        receiveAmount: 909.09,
        rate: 0.9091,
      })
    })

    favouritesHook.unmount()
    logsHook.unmount()

    renderWithProviders(
      <NavigationTabs base="EUR" quote="USD" amount={1000} formattedAmount="1,000" />,
    )

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /Favourites/i })).toHaveTextContent('1')
    })

    expect(screen.getByRole('tab', { name: /Log/i })).toHaveTextContent('1')
  })

  it('switches tab panels when a tab is clicked', async () => {
    const { user } = renderWithProviders(
      <NavigationTabs base="EUR" quote="USD" amount={1000} formattedAmount="1,000" />,
    )

    await user.click(screen.getByRole('tab', { name: /Compare/i }))

    await waitFor(() => {
      expect(screen.getByText(/Multi-currency/i)).toBeInTheDocument()
    })
  })

  it('supports mobile dropdown tab selection', async () => {
    const { user } = renderWithProviders(
      <NavigationTabs base="EUR" quote="USD" amount={1000} formattedAmount="1,000" />,
    )

    const mobileTriggers = screen.getAllByText('History')
    const mobileTrigger = mobileTriggers[mobileTriggers.length - 1]?.closest('button')
    expect(mobileTrigger).not.toBeNull()

    await user.click(mobileTrigger as HTMLElement)

    const menu = await screen.findByRole('menu')
    await user.click(within(menu).getByRole('menuitemradio', { name: /Compare/i }))

    await waitFor(() => {
      expect(screen.getByText(/Multi-currency/i)).toBeInTheDocument()
    })
  })
})
