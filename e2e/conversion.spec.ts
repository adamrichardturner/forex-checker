import { expect, test } from '@playwright/test'
import { clickVisibleSwap, installMockApiReset, openCurrencyPicker, waitForDashboard } from './helpers'

installMockApiReset()

test.describe('conversion flow', () => {
  test('loads a prefetched USD to EUR conversion without a blank flash', async ({ page }) => {
    await waitForDashboard(page)

    await expect(page.getByLabel('Send amount')).toHaveValue('1,000')
    await expect(page.getByText('909.09')).toBeVisible()
    await expect(page.getByText(/1 USD = 0\.9091 EUR/)).toBeVisible()
  })

  test('updates conversion when the send amount changes', async ({ page }) => {
    await waitForDashboard(page)

    const amount = page.getByLabel('Send amount')
    await amount.fill('')
    await amount.fill('2000')
    await expect(page.getByText('1,818.18')).toBeVisible({ timeout: 10_000 })
  })

  test('swaps send and receive currencies', async ({ page }) => {
    await waitForDashboard(page)

    await clickVisibleSwap(page)



    await expect(page.getByText(/1 EUR = 1\.1000 USD/)).toBeVisible({ timeout: 10_000 })
    await expect(page.getByLabel('Send amount')).toHaveValue('909.09')
  })

  test('changes currencies through the picker', async ({ page }) => {
    await waitForDashboard(page)

    await openCurrencyPicker(page, 'receive')
    await page.getByPlaceholder('Search currencies...').fill('GBP')
    await page.getByRole('button', { name: /GBP.*British Pound|British Pound/ }).click()

    await expect(page.getByText(/1 USD = .* GBP/)).toBeVisible({ timeout: 10_000 })
  })
})
