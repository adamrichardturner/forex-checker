import type { TickerPair } from './currency-ticker.types'

export const TICKER_PAIRS = [
  { base: 'USD', quote: 'JPY' },
  { base: 'GBP', quote: 'USD' },
  { base: 'USD', quote: 'CHF' },
  { base: 'EUR', quote: 'GBP' },
  { base: 'AUD', quote: 'USD' },
  { base: 'USD', quote: 'CAD' },
] as const satisfies readonly TickerPair[]
