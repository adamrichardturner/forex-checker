import { expect, test, type Page } from '@playwright/test'

export const MOCK_API_ORIGIN = 'http://127.0.0.1:4010'

export async function resetMockApi(): Promise<void> {
  await fetch(`${MOCK_API_ORIGIN}/__test/reset`, { method: 'POST' })
}

export async function setMockApiErrors(options: {
  rates?: boolean
  currencies?: boolean
}): Promise<void> {
  await fetch(`${MOCK_API_ORIGIN}/__test/errors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options),
  })
}

/** Reset shared mock error flags before every test to avoid cross-worker pollution. */
export function installMockApiReset(): void {
  test.beforeEach(async () => {
    await resetMockApi()
  })
}

export async function waitForDashboard(page: Page): Promise<void> {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Check the rate' })).toBeVisible()
  await expect(page.getByLabel('Send amount')).toBeVisible()
  await expect(page.getByText(/1 USD = /)).toBeVisible({ timeout: 15_000 })
  await expect(page.getByLabel(/Add pair to favourites|Remove pair from favourites/)).toBeVisible({
    timeout: 15_000,
  })
}

export async function openCurrencyPicker(page: Page, which: 'send' | 'receive'): Promise<void> {
  const buttons = page.getByRole('button', { name: /^(USD|EUR|GBP|JPY|CHF|CAD|AUD)$/ })
  const index = which === 'send' ? 0 : 1
  await buttons.nth(index).click()
  await expect(page.getByPlaceholder('Search currencies...')).toBeVisible()
}

export async function openNavigationTab(
  page: Page,
  name: 'History' | 'Compare' | 'Favourites' | 'Log',
): Promise<void> {
  const desktopTab = page.getByRole('tab', { name: new RegExp(`^${name}`) })

  if (await desktopTab.isVisible()) {
    await desktopTab.click()
    return
  }

  // Avoid matching the rate-checker "Favourited" button via a loose text filter.
  const mobileTrigger = page.locator('[class*="mobileTrigger"]:visible').first()
  await mobileTrigger.click()

  const option = page
    .getByRole('menuitemradio', { name: new RegExp(name) })
    .or(page.getByRole('radio', { name: new RegExp(name) }))
    .or(page.locator('[role="menuitem"], [role="option"]').filter({ hasText: name }))

  await option.first().click()
}

export async function clickVisibleSwap(page: Page): Promise<void> {
  await page
    .getByLabel('Swap send and receive currencies')
    .and(page.locator(':visible'))
    .first()
    .click()
}
