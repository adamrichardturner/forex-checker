import { expect, test, type Locator, type Page } from '@playwright/test'
import {
  expectWithinHorizontally,
  getPageOverflow,
  installMockApiReset,
  isClipped,
  openNavigationTab,
  selectCurrency,
  setSendAmount,
  waitForDashboard,
} from './helpers'

installMockApiReset()

// 100,000 USD -> KRW is the longest result the fixtures produce (EUR/KRW 1500, EUR/USD 1.1).
const LARGE_RECEIVE_AMOUNT = '136,363,636.36'
const LARGE_RATE = '1,363.6364'

const SMALLEST_PHONE = { width: 320, height: 568 }
const PHONE = { width: 375, height: 667 }
const NARROW_TABLET = { width: 800, height: 900 }
const DESKTOP = { width: 1280, height: 800 }

async function convertLargeAmount(page: Page): Promise<Locator> {
  await waitForDashboard(page)
  await selectCurrency(page, 'receive', 'KRW', 'South Korean Won')
  await setSendAmount(page, '100000')

  const received = page.getByText(LARGE_RECEIVE_AMOUNT, { exact: true }).first()
  await expect(received).toBeVisible({ timeout: 10_000 })

  return received
}

async function getFontSize(locator: Locator): Promise<number> {
  return locator.evaluate((element) => parseFloat(getComputedStyle(element).fontSize))
}

async function getLineCount(locator: Locator): Promise<number> {
  return locator.evaluate((element) => {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight)

    return Math.round(element.getBoundingClientRect().height / lineHeight)
  })
}

test.describe('large amounts in the rate checker', () => {
  for (const viewport of [SMALLEST_PHONE, PHONE, NARROW_TABLET, DESKTOP]) {
    test(`shows the full converted amount at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const received = await convertLargeAmount(page)

      expect(await isClipped(received)).toBe(false)
      expect(await getLineCount(received)).toBe(1)
      expect(await isClipped(page.getByLabel('Send amount'))).toBe(false)
      expect(await getPageOverflow(page)).toBeLessThanOrEqual(0)
    })
  }

  test('shrinks a long amount to fit but keeps it legible', async ({ page }) => {
    // On desktop the amount shares its row with the picker and is set at 40px, so the
    // fixture's longest result has to scale down to fit.
    await page.setViewportSize(DESKTOP)
    await waitForDashboard(page)

    const shortAmount = page.getByText('909.09', { exact: true })
    await expect(shortAmount).toBeVisible()
    const shortFontSize = await getFontSize(shortAmount)

    const received = await convertLargeAmount(page)
    const longFontSize = await getFontSize(received)

    expect(longFontSize).toBeLessThan(shortFontSize)
    expect(longFontSize).toBeGreaterThanOrEqual(12)
    expect(await isClipped(received)).toBe(false)
  })

  test('never shrinks the send input below 16px', async ({ page }) => {
    await page.setViewportSize(SMALLEST_PHONE)
    await waitForDashboard(page)
    await setSendAmount(page, '99999.123456789')

    // Inputs under 16px make iOS Safari zoom the page on focus.
    expect(await getFontSize(page.getByLabel('Send amount'))).toBeGreaterThanOrEqual(16)
    expect(await getPageOverflow(page)).toBeLessThanOrEqual(0)
  })

  test('moves the currency picker above the amount on narrow cards only', async ({ page }) => {
    await page.setViewportSize(SMALLEST_PHONE)
    const received = await convertLargeAmount(page)
    const receivePicker = page.getByRole('button', { name: 'KRW', exact: true })

    const narrowAmount = await received.boundingBox()
    const narrowPicker = await receivePicker.boundingBox()
    expect(narrowAmount).not.toBeNull()
    expect(narrowPicker).not.toBeNull()
    // Stacked: the picker ends before the amount starts.
    expect(narrowPicker!.y + narrowPicker!.height).toBeLessThanOrEqual(narrowAmount!.y)

    await page.setViewportSize(DESKTOP)
    await expect(received).toBeVisible()

    const wideAmount = await received.boundingBox()
    const widePicker = await receivePicker.boundingBox()
    // Side by side: the picker sits to the right of the amount, on the same row.
    expect(widePicker!.x).toBeGreaterThanOrEqual(wideAmount!.x + wideAmount!.width)
    expect(widePicker!.y).toBeLessThan(wideAmount!.y + wideAmount!.height)
    expect(widePicker!.y + widePicker!.height).toBeGreaterThan(wideAmount!.y)
  })

  test('keeps the exchange rate label inside the card', async ({ page }) => {
    await page.setViewportSize(SMALLEST_PHONE)
    await convertLargeAmount(page)

    const rateLabel = page.getByText(`1 USD = ${LARGE_RATE} KRW`)
    await expect(rateLabel).toBeVisible()
    expect(await isClipped(rateLabel)).toBe(false)
    await expectWithinHorizontally(rateLabel, page.locator('[class*="rateCheckerFooter"]'))
  })

  test('fits the currency picker popover on the smallest screen', async ({ page }) => {
    await page.setViewportSize(SMALLEST_PHONE)
    await waitForDashboard(page)

    await page.getByRole('button', { name: 'EUR', exact: true }).click()
    const search = page.getByPlaceholder('Search currencies...')
    await expect(search).toBeVisible()

    const popover = page.locator('[class*="popover"]').filter({ has: search })
    const box = await popover.boundingBox()
    expect(box).not.toBeNull()
    expect(box!.x).toBeGreaterThanOrEqual(0)
    expect(box!.x + box!.width).toBeLessThanOrEqual(SMALLEST_PHONE.width)
  })
})

test.describe('large amounts in the tabs', () => {
  for (const viewport of [SMALLEST_PHONE, PHONE]) {
    test(`keeps compare amounts inside their rows at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await convertLargeAmount(page)
      await openNavigationTab(page, 'Compare')
      await expect(page.getByText(/from USD/)).toBeVisible({ timeout: 10_000 })

      const rows = page.locator('[class*="compareItem"]')
      await expect(rows.first()).toBeVisible()
      const count = await rows.count()
      expect(count).toBeGreaterThan(0)

      for (let index = 0; index < count; index++) {
        const row = rows.nth(index)
        const amount = row.locator('[class*="compareAmount"]')

        expect(await isClipped(amount)).toBe(false)
        await expectWithinHorizontally(amount, row)
        await expectWithinHorizontally(row.getByRole('button'), row)
      }

      expect(await getPageOverflow(page)).toBeLessThanOrEqual(0)
    })

    test(`keeps logged amounts inside their row at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await convertLargeAmount(page)

      await page.getByLabel('Log conversion').click()
      await expect(page.getByLabel('Conversion logged')).toBeVisible()
      await openNavigationTab(page, 'Log')
      await expect(page.getByText('1 LOGGED', { exact: true })).toBeVisible()

      const row = page.locator('[class*="conversionHistoryItem"]').first()
      const logged = row.getByText(LARGE_RECEIVE_AMOUNT, { exact: true })
      await expect(logged).toBeVisible()
      expect(await isClipped(logged)).toBe(false)
      await expectWithinHorizontally(logged, row)
      await expectWithinHorizontally(row.getByText('100,000.00', { exact: true }), row)
      await expectWithinHorizontally(row.getByRole('button'), row)
      expect(await getPageOverflow(page)).toBeLessThanOrEqual(0)
    })

    test(`keeps a favourite's rate inside its row at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await convertLargeAmount(page)

      await page.getByLabel('Add pair to favourites').click()
      await expect(page.getByLabel('Remove pair from favourites')).toBeVisible()
      await openNavigationTab(page, 'Favourites')

      const row = page.locator('[class*="favouritesItem"]').first()
      const rate = row.locator('[class*="favouritesRate"]')
      // Served by the time-series endpoint, which rounds the cross rate slightly differently.
      await expect(rate).toHaveText(/^1,363\.\d{4}$/, { timeout: 10_000 })
      expect(await isClipped(rate)).toBe(false)
      await expectWithinHorizontally(rate, row)
      await expectWithinHorizontally(row.getByRole('button'), row)
      expect(await getPageOverflow(page)).toBeLessThanOrEqual(0)
    })

    test(`keeps history stats and axis labels readable at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await convertLargeAmount(page)
      await expect(page.locator('[class*="historyChartsPair"]')).toHaveText('USD/KRW', {
        timeout: 15_000,
      })

      const tiles = page.locator('[class*="historyChartsStat"]:has(> p)')
      await expect(tiles).toHaveCount(4)

      for (let index = 0; index < 4; index++) {
        const tile = tiles.nth(index)
        const value = tile.locator('[class*="historyChartsStatValue"]')

        await expect(value).not.toBeEmpty()
        expect(await isClipped(value)).toBe(false)
        expect(await getLineCount(value)).toBe(1)
        await expectWithinHorizontally(value, tile)
      }

      // Axis labels are abbreviated and the axis is sized to them, so none start
      // outside the chart.
      const plot = page.locator('[class*="historyChartsPlot"]')
      const ticks = plot.locator('.recharts-yAxis-tick-labels text')
      await expect(ticks.first()).toBeVisible({ timeout: 15_000 })
      const tickCount = await ticks.count()

      for (let index = 0; index < tickCount; index++) {
        const tick = ticks.nth(index)

        expect((await tick.textContent())?.length ?? 0).toBeLessThanOrEqual(8)
        await expectWithinHorizontally(tick, plot)
      }

      expect(await getPageOverflow(page)).toBeLessThanOrEqual(0)
    })
  }
})
