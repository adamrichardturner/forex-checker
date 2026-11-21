import { expect, test } from '@playwright/test'
import {
  installMockApiReset,
  openCurrencyPicker,
  openNavigationTab,
  waitForDashboard,
} from './helpers'

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

test.describe('large amounts on small screens', () => {
  const VIEWPORTS = [
    { width: 320, height: 568 },
    { width: 375, height: 667 },
    { width: 800, height: 900 },
  ]

  for (const viewport of VIEWPORTS) {
    test(`shows the full converted amount at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await waitForDashboard(page)

      await openCurrencyPicker(page, 'receive')
      await page.getByPlaceholder('Search currencies...').fill('KRW')
      await page.getByRole('button', { name: /South Korean Won/ }).click()

      const amount = page.getByLabel('Send amount')
      await amount.fill('')
      await amount.fill('100000')

      const received = page.getByText('136,363,636.36', { exact: true })
      await expect(received).toBeVisible({ timeout: 10_000 })

      // On one line, and not wider than the space it has been given.
      const metrics = await received.evaluate((element) => {
        const style = getComputedStyle(element)

        return {
          clipped: element.scrollWidth > element.clientWidth,
          lines: Math.round(element.getBoundingClientRect().height / parseFloat(style.lineHeight)),
        }
      })
      expect(metrics.clipped).toBe(false)
      expect(metrics.lines).toBe(1)

      // The send input shows its whole value too.
      expect(await amount.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
        false,
      )

      for (const tab of ['Compare', 'Log', 'Favourites', 'History'] as const) {
        await openNavigationTab(page, tab)

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow, `${tab} tab overflows horizontally`).toBeLessThanOrEqual(0)
      }
    })
  }
})
