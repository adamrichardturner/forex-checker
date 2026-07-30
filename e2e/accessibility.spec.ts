import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { installMockApiReset, waitForDashboard } from './helpers'

installMockApiReset()

test.describe('accessibility', () => {
  test('dashboard has no critical axe violations after load', async ({ page }) => {
    await waitForDashboard(page)
    // Wait for loading skeletons (which use aria-label on plain divs) to settle.
    await expect(page.getByLabel('Loading markets ticker')).toHaveCount(0, { timeout: 15_000 })
    await expect(page.getByLabel('Loading rate history')).toHaveCount(0, { timeout: 15_000 })

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const critical = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    )

    expect(critical).toEqual([])
  })

  test('supports a keyboard-only conversion amount update', async ({ page }) => {
    await waitForDashboard(page)

    const amount = page.getByLabel('Send amount')
    await amount.focus()
    await amount.fill('1500')
    await expect(page.getByText('1,363.64')).toBeVisible({ timeout: 10_000 })
  })
})
