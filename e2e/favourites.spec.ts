import { expect, test } from '@playwright/test'
import { installMockApiReset, openNavigationTab, waitForDashboard } from './helpers'

installMockApiReset()

test.describe('favourites', () => {
  test('stars a pair, shows it under Favourites, and persists after reload', async ({ page }) => {
    await waitForDashboard(page)

    await page.getByLabel('Add pair to favourites').click()
    await expect(page.getByLabel('Remove pair from favourites')).toBeVisible()

    await openNavigationTab(page, 'Favourites')
    await expect(page.getByText('Pinned Pairs')).toBeVisible()
    await expect(page.getByText('1 pair')).toBeVisible()
    await expect(page.getByLabel('Remove USD to EUR from favourites')).toBeVisible()

    await page.reload()
    await waitForDashboard(page)
    await openNavigationTab(page, 'Favourites')
    await expect(page.getByLabel('Remove USD to EUR from favourites')).toBeVisible()
  })

  test('unpins from the Favourites tab and can star from Compare', async ({ page }) => {
    await waitForDashboard(page)

    await page.getByLabel('Add pair to favourites').click()
    await openNavigationTab(page, 'Favourites')
    await page.getByLabel('Remove USD to EUR from favourites').click()
    await expect(page.getByText('No pinned pairs yet')).toBeVisible({ timeout: 10_000 })

    await openNavigationTab(page, 'Compare')
    await expect(page.getByText(/from USD/)).toBeVisible({ timeout: 10_000 })

    await page
      .getByLabel(/Add USD to .+ to favourites/)
      .first()
      .click()

    await openNavigationTab(page, 'Favourites')
    await expect(page.getByText('Pinned Pairs')).toBeVisible()
    await expect(page.getByText('1 pair')).toBeVisible()
  })
})
