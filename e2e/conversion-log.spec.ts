import { expect, test } from '@playwright/test'
import { installMockApiReset, openNavigationTab, waitForDashboard } from './helpers'

installMockApiReset()

test.describe('conversion log', () => {
  test('logs a conversion, persists, deletes one entry, and clears all', async ({ page }) => {
    await waitForDashboard(page)

    await page.getByLabel('Log conversion').click()
    await expect(page.getByLabel('Conversion logged')).toBeVisible()

    await openNavigationTab(page, 'Log')
    await expect(page.getByText('Conversion Log')).toBeVisible()
    await expect(page.getByText('1 LOGGED', { exact: true })).toBeVisible()

    await page.reload()
    await waitForDashboard(page)
    await openNavigationTab(page, 'Log')
    await expect(page.getByText('1 LOGGED', { exact: true })).toBeVisible()

    await page.getByLabel('Delete USD to EUR conversion log').click()
    await expect(page.getByText('No conversions logged yet')).toBeVisible({ timeout: 10_000 })

    await openNavigationTab(page, 'History')
    await page.getByLabel('Send amount').fill('')
    await page.getByLabel('Send amount').fill('500')
    await expect(page.getByText(/1 USD = /)).toBeVisible({ timeout: 10_000 })
    await page.getByLabel('Log conversion').click()
    await expect(page.getByLabel('Conversion logged')).toBeVisible()

    await openNavigationTab(page, 'Log')
    await expect(page.getByText('1 LOGGED', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Clear all' }).click()
    await expect(page.getByRole('heading', { name: 'Clear conversion log?' })).toBeVisible()
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(page.getByText('1 LOGGED', { exact: true })).toBeVisible()

    await page.getByRole('button', { name: 'Clear all' }).click()
    await page.getByRole('dialog').getByRole('button', { name: 'Clear all' }).click()
    await expect(page.getByText('No conversions logged yet')).toBeVisible({ timeout: 10_000 })
  })
})
