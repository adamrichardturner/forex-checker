import { expect, test } from '@playwright/test'
import { installMockApiReset, openNavigationTab, waitForDashboard } from './helpers'

installMockApiReset()

test.describe('tabs and responsive layout', () => {
  test('uses desktop tabs on a wide viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await waitForDashboard(page)

    await expect(page.getByRole('tab', { name: 'History' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Compare' })).toBeVisible()
    await openNavigationTab(page, 'Compare')
    await expect(page.getByText(/from USD/)).toBeVisible({ timeout: 10_000 })
  })

  test('uses the mobile dropdown on a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await waitForDashboard(page)

    await expect(page.getByLabel('Swap send and receive currencies').last()).toBeVisible()

    await openNavigationTab(page, 'Compare')
    await expect(page.getByText(/from USD/)).toBeVisible({ timeout: 10_000 })
  })
})



