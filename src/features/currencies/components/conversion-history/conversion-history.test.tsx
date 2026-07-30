import { useEffect, useRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '../../../../../tests/utils/render'
import { useConversionLogsContext } from '../../persistence/currency-persistence-provider'
import { ConversionHistory } from './index'

type SeedLog = {
  base: string
  quote: string
  sendAmount: number
  receiveAmount: number
  rate: number
}

type SeedLogsProps = {
  logs: SeedLog[]
}

function ConversionHistoryWithSeededLogs({ logs }: SeedLogsProps) {
  const { logConversion, isLoading } = useConversionLogsContext()
  const [ready, setReady] = useState(false)
  const seededRef = useRef(false)
  const logsRef = useRef(logs)
  logsRef.current = logs

  useEffect(() => {
    if (isLoading || seededRef.current) {
      return
    }

    let cancelled = false
    seededRef.current = true

    void (async () => {
      for (const log of logsRef.current) {
        await logConversion(log)
      }

      if (!cancelled) {
        setReady(true)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isLoading, logConversion])

  if (!ready) {
    return null
  }

  return <ConversionHistory />
}

describe('ConversionHistory', () => {
  it('shows empty state when no conversions are logged', async () => {
    renderWithProviders(<ConversionHistory />)

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('No conversions logged yet')
    })

    expect(screen.getByText(/Every conversion is recorded here automatically/i)).toBeInTheDocument()
  })

  it('opens clear dialog, cancels without clearing, then confirms clear', async () => {
    const { user } = renderWithProviders(
      <ConversionHistoryWithSeededLogs
        logs={[
          {
            base: 'USD',
            quote: 'EUR',
            sendAmount: 1000,
            receiveAmount: 909.09,
            rate: 0.9091,
          },
        ]}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('1 LOGGED')).toBeInTheDocument()
    })

    const clearButtons = screen.getAllByRole('button', { name: 'Clear all' })
    await user.click(clearButtons[0] as HTMLElement)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Clear conversion log?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(screen.getByText('1 LOGGED')).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Clear all' })[0] as HTMLElement)

    const confirmButtons = screen.getAllByRole('button', { name: 'Clear all' })
    const confirmButton = confirmButtons[confirmButtons.length - 1] as HTMLElement
    await user.click(confirmButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('No conversions logged yet')
    })
  })

  it('lists logged conversions and supports deleting a row', async () => {
    const { user } = renderWithProviders(
      <ConversionHistoryWithSeededLogs
        logs={[
          {
            base: 'USD',
            quote: 'EUR',
            sendAmount: 1000,
            receiveAmount: 909.09,
            rate: 0.9091,
          },
          {
            base: 'GBP',
            quote: 'USD',
            sendAmount: 500,
            receiveAmount: 647.06,
            rate: 1.2941,
          },
        ]}
      />,
    )

    await waitFor(() => {
      expect(screen.getByText('2 LOGGED')).toBeInTheDocument()
    })

    const deleteButton = screen.getByRole('button', {
      name: 'Delete USD to EUR conversion log',
    })

    await user.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('1 LOGGED')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Delete USD to EUR conversion log' })).toBeNull()
    })
  })
})
