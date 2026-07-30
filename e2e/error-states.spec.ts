import { expect, test } from '@playwright/test'
import { installMockApiReset, resetMockApi, setMockApiErrors, waitForDashboard } from './helpers'

// Shared mock error flags must not race with other workers.
test.describe.configure({ mode: 'serial' })
installMockApiReset()

test.describe('error states', () => {
  test.afterEach(async () => {
    await resetMockApi()
  })

  test('shows chart empty state when rate history fails', async ({ page }) => {
    await waitForDashboard(page)
    await setMockApiErrors({ rates: true })

    await page
      .getByRole('group', { name: 'History range' })
      .getByRole('button', { name: '1W' })
      .click()
    await expect(page.getByText('No chart data available')).toBeVisible({ timeout: 15_000 })
  })

  test('shows ticker error messaging when markets fail to load', async ({ page }) => {
    await setMockApiErrors({ rates: true })
    await page.goto('/')

    await expect(
      page.getByText(/Unable to load markets|No market data|Check the rate/),
    ).toBeVisible({
      timeout: 15_000,
    })
  })
})
