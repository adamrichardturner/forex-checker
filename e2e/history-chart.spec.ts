import { expect, test } from '@playwright/test'
import { installMockApiReset, waitForDashboard } from './helpers'

installMockApiReset()

test.describe('history chart', () => {
  test('cycles range presets and renders chart stats', async ({ page }) => {
    await waitForDashboard(page)

    await expect(page.getByText('Open')).toBeVisible()
    await expect(page.getByText('Last')).toBeVisible()
    const rangeGroup = page.getByRole('group', { name: 'History range' })
    await expect(rangeGroup).toBeVisible()

    for (const range of ['1D', '1W', '1M', '3M', '1Y', '5Y']) {
      await rangeGroup.getByRole('button', { name: range, exact: true }).click()
      await expect(rangeGroup.getByRole('button', { name: range, exact: true })).toHaveAttribute(
        'aria-pressed',
        'true',
      )
    }

    await expect(page.getByText('USD/EUR')).toBeVisible()
    await expect(page.locator('.recharts-surface, svg').first()).toBeVisible({ timeout: 15_000 })
  })
})
