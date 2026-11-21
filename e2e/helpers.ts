import { expect, test, type Locator, type Page } from '@playwright/test'

export const MOCK_API_ORIGIN = 'http://127.0.0.1:4010'

/**
 * The mock API serves fixtures with fixed dates (see tests/fixtures/frankfurter.ts), but
 * the app requests history relative to "today". Pin the browser clock to a weekday inside
 * the fixture window so the suite does not start failing once real time moves past it.
 * The clock keeps ticking from this instant, so debounces and animations still run.
 */
export const E2E_NOW = new Date('2026-07-30T12:00:00Z')

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

/**
 * Reset shared mock error flags before every test to avoid cross-worker pollution, and
 * pin the browser clock to the fixture window.
 */
export function installMockApiReset(): void {
  test.beforeEach(async ({ page }) => {
    await resetMockApi()
    await page.clock.install({ time: E2E_NOW })
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

/** Pick a currency in the send or receive picker by searching for its code. */
export async function selectCurrency(
  page: Page,
  which: 'send' | 'receive',
  code: string,
  name: string,
): Promise<void> {
  await openCurrencyPicker(page, which)
  await page.getByPlaceholder('Search currencies...').fill(code)
  await page.getByRole('button', { name: new RegExp(name) }).click()
}

export async function setSendAmount(page: Page, amount: string): Promise<void> {
  const input = page.getByLabel('Send amount')
  await input.fill('')
  await input.fill(amount)
}

/** Horizontal overflow of the page itself, in CSS pixels (0 when there is none). */
export async function getPageOverflow(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
}

/** True when the element's content is wider than the element, i.e. it would be cut off. */
export async function isClipped(locator: Locator): Promise<boolean> {
  return locator.evaluate((element) => element.scrollWidth > element.clientWidth)
}

/** Asserts `inner` sits within the left and right edges of `outer`. */
export async function expectWithinHorizontally(inner: Locator, outer: Locator): Promise<void> {
  const innerBox = await inner.boundingBox()
  const outerBox = await outer.boundingBox()

  expect(innerBox, 'inner element should be rendered').not.toBeNull()
  expect(outerBox, 'outer element should be rendered').not.toBeNull()

  if (!innerBox || !outerBox) {
    return
  }

  const tolerance = 0.5
  expect(innerBox.x).toBeGreaterThanOrEqual(outerBox.x - tolerance)
  expect(innerBox.x + innerBox.width).toBeLessThanOrEqual(outerBox.x + outerBox.width + tolerance)
}
