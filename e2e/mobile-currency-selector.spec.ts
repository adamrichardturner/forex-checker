import { expect, test } from '@playwright/test'
import { installMockApiReset, openCurrencyPicker, setSendAmount, waitForDashboard } from './helpers'

installMockApiReset()

test.describe('Mobile currency selector', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('opens as a full-screen dialog that fits the viewport', async ({ page }) => {
    await waitForDashboard(page)
    await openCurrencyPicker(page, 'send')

    const dialog = page.getByRole('dialog', { name: 'Select currency' })
    await expect(dialog).toBeVisible()

    // Wait for the open animation to settle before measuring.
    await expect
      .poll(async () => (await dialog.boundingBox())?.width)
      .toBe(page.viewportSize()?.width)

    const box = await dialog.boundingBox()
    expect(box).toEqual({ x: 0, y: 0, width: 375, height: 667 })

    await expect(page.getByRole('button', { name: 'Close currency selector' })).toBeInViewport()
    await expect(page.getByPlaceholder('Search currencies...')).toBeInViewport()
    await expect(dialog.getByText('POPULAR')).toBeInViewport()
  })

  test('lists every currency and scrolls inside the dialog', async ({ page }) => {
    await waitForDashboard(page)
    await openCurrencyPicker(page, 'send')

    const dialog = page.getByRole('dialog', { name: 'Select currency' })
    const lastCurrency = dialog.getByRole('button', { name: /ZAR/ })

    await lastCurrency.scrollIntoViewIfNeeded()
    await expect(lastCurrency).toBeInViewport()
    // The header stays pinned while the list scrolls.
    await expect(page.getByRole('button', { name: 'Close currency selector' })).toBeInViewport()
  })

  test('closes from the close button and from Escape', async ({ page }) => {
    await waitForDashboard(page)

    await openCurrencyPicker(page, 'send')
    await page.getByRole('button', { name: 'Close currency selector' }).click()
    await expect(page.getByRole('dialog')).toBeHidden()

    await openCurrencyPicker(page, 'send')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('selects a searched currency and closes', async ({ page }) => {
    await waitForDashboard(page)
    await openCurrencyPicker(page, 'receive')

    await page.getByPlaceholder('Search currencies...').fill('GBP')
    await page.getByRole('button', { name: /British Pound/ }).click()

    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page.getByText(/1 USD = .* GBP/)).toBeVisible()
  })

  test('shows an empty state when the search matches nothing', async ({ page }) => {
    await waitForDashboard(page)
    await openCurrencyPicker(page, 'send')

    await page.getByPlaceholder('Search currencies...').fill('zzz')
    await expect(page.getByText(/No currencies match/)).toBeVisible()
  })
})

test.describe('Send amount limits', () => {
  test('rejects more than two decimal places', async ({ page }) => {
    await waitForDashboard(page)

    const amount = page.getByLabel('Send amount')
    await amount.fill('')
    await amount.pressSequentially('1000.999999999999999')

    await expect(amount).toHaveValue('1,000.99')
  })

  test('ignores non-numeric input and strips leading zeros', async ({ page }) => {
    await waitForDashboard(page)

    const amount = page.getByLabel('Send amount')
    await amount.fill('')
    await amount.pressSequentially('00-12e.5')

    await expect(amount).toHaveValue('12.5')
  })

  test('tidies a dangling decimal point on blur', async ({ page }) => {
    await waitForDashboard(page)

    await setSendAmount(page, '250.')
    await page.getByLabel('Send amount').blur()

    await expect(page.getByLabel('Send amount')).toHaveValue('250')
  })
})
