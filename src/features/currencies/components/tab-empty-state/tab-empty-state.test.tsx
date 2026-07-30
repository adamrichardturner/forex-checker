import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TabEmptyState } from './index'

describe('TabEmptyState', () => {
  it('renders title and description with status role', () => {
    render(
      <TabEmptyState
        title="Nothing here yet"
        description="Try adding an item to populate this tab."
      />,
    )

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Nothing here yet')
    expect(status).toHaveTextContent('Try adding an item to populate this tab.')
  })
})
