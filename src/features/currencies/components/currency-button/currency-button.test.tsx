import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { CURRENCIES_FIXTURE } from '../../../../../tests/fixtures/frankfurter'
import { renderWithProviders } from '../../../../../tests/utils/render'
import CurrencyButton from './currency-button'

describe('CurrencyButton', () => {
  it('renders the selected currency code on the trigger', () => {
    renderWithProviders(
      <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
    )

    expect(screen.getByRole('button', { name: /USD/i })).toBeInTheDocument()
  })

  it('opens the popover and lists popular and other currencies', async () => {
    const { user } = renderWithProviders(
      <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: /USD/i }))

    expect(screen.getByPlaceholderText('Search currencies...')).toBeInTheDocument()
    expect(screen.getByText('POPULAR')).toBeInTheDocument()
    expect(screen.getByText('OTHER CURRENCIES')).toBeInTheDocument()
  })

  it('filters currencies by ISO code and name', async () => {
    const { user } = renderWithProviders(
      <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: /USD/i }))

    const search = screen.getByPlaceholderText('Search currencies...')
    await user.type(search, 'yen')

    expect(screen.getByRole('button', { name: /JPY/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /GBP/i })).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'swiss')

    expect(screen.getByRole('button', { name: /CHF/i })).toBeInTheDocument()
  })

  it('caps other currencies at four items while showing the full match count', async () => {
    const { user } = renderWithProviders(
      <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: /USD/i }))

    const otherHeader = screen.getByText('OTHER CURRENCIES').closest('p')
    expect(otherHeader).not.toBeNull()

    const countSpan = within(otherHeader as HTMLElement).getByText('24')
    expect(countSpan).toBeInTheDocument()

    const otherSection = otherHeader?.closest('section')
    expect(otherSection).not.toBeNull()

    const otherItems = within(otherSection as HTMLElement).getAllByRole('button')
    expect(otherItems).toHaveLength(4)
  })

  it('disables the opposite currency in the list', async () => {
    const { user } = renderWithProviders(
      <CurrencyButton
        selectedCode="USD"
        disabledCode="EUR"
        currencies={CURRENCIES_FIXTURE}
        onSelect={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /USD/i }))

    const eurButton = screen.getByRole('button', { name: /EUR/i })
    expect(eurButton).toBeDisabled()
    expect(eurButton).toHaveAttribute('aria-disabled', 'true')
  })

  it('clears search when the popover closes', async () => {
    const { user } = renderWithProviders(
      <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: /USD/i }))

    const search = screen.getByPlaceholderText('Search currencies...')
    await user.type(search, 'jpy')
    expect(search).toHaveValue('jpy')

    await user.keyboard('{Escape}')

    await user.click(screen.getByRole('button', { name: /USD/i }))
    expect(screen.getByPlaceholderText('Search currencies...')).toHaveValue('')
  })

  it('calls onSelect and closes when a currency is chosen', async () => {
    const onSelect = vi.fn()
    const { user } = renderWithProviders(
      <CurrencyButton
        selectedCode="USD"
        disabledCode="EUR"
        currencies={CURRENCIES_FIXTURE}
        onSelect={onSelect}
      />,
    )

    await user.click(screen.getByRole('button', { name: /USD/i }))
    await user.click(screen.getByRole('button', { name: /GBP/i }))

    expect(onSelect).toHaveBeenCalledWith('GBP')
    expect(screen.queryByPlaceholderText('Search currencies...')).not.toBeInTheDocument()
  })

  it('supports keyboard selection after filtering', async () => {
    const onSelect = vi.fn()
    const { user } = renderWithProviders(
      <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={onSelect} />,
    )

    await user.click(screen.getByRole('button', { name: /USD/i }))

    const search = screen.getByPlaceholderText('Search currencies...')
    await user.type(search, 'cad')
    await user.keyboard('{Enter}')

    expect(onSelect).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /CAD/i }))
    expect(onSelect).toHaveBeenCalledWith('CAD')
  })

  it('shows an empty state when nothing matches the search', async () => {
    const { user } = renderWithProviders(
      <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
    )

    await user.click(screen.getByRole('button', { name: /USD/i }))
    await user.type(screen.getByPlaceholderText('Search currencies...'), 'zzz')

    expect(screen.getByRole('status')).toHaveTextContent('No currencies match')
    expect(screen.queryByText('POPULAR')).not.toBeInTheDocument()
  })

  describe('on small viewports', () => {
    beforeEach(() => {
      vi.mocked(window.matchMedia).mockImplementation(
        (query: string) =>
          ({
            matches: query.includes('max-width'),
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as unknown as MediaQueryList,
      )
    })

    it('opens the selector as a labelled dialog', async () => {
      const { user } = renderWithProviders(
        <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
      )

      await user.click(screen.getByRole('button', { name: /USD/i }))

      const dialog = screen.getByRole('dialog', { name: 'Select currency' })
      expect(within(dialog).getByPlaceholderText('Search currencies...')).toBeInTheDocument()
    })

    it('lists every other currency instead of capping at four', async () => {
      const { user } = renderWithProviders(
        <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
      )

      await user.click(screen.getByRole('button', { name: /USD/i }))

      const otherSection = screen.getByText('OTHER CURRENCIES').closest('section')
      expect(within(otherSection as HTMLElement).getAllByRole('button')).toHaveLength(24)
    })

    it('closes from the close button and clears the search', async () => {
      const { user } = renderWithProviders(
        <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={vi.fn()} />,
      )

      await user.click(screen.getByRole('button', { name: /USD/i }))
      await user.type(screen.getByPlaceholderText('Search currencies...'), 'jpy')
      await user.click(screen.getByRole('button', { name: 'Close currency selector' }))

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /USD/i }))
      expect(screen.getByPlaceholderText('Search currencies...')).toHaveValue('')
    })

    it('selects a currency and closes the dialog', async () => {
      const onSelect = vi.fn()
      const { user } = renderWithProviders(
        <CurrencyButton selectedCode="USD" currencies={CURRENCIES_FIXTURE} onSelect={onSelect} />,
      )

      await user.click(screen.getByRole('button', { name: /USD/i }))
      await user.click(screen.getByRole('button', { name: /GBP/i }))

      expect(onSelect).toHaveBeenCalledWith('GBP')
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      })
    })
  })
})
