import type { TickerPair } from './currency-ticker.types'

/**
 * Liquid pairs commonly shown on institutional forex tickers.
 * Ordered: majors first, then G10 crosses, then USD vs other liquid currencies.
 */
export const TICKER_PAIRS = [
  // Majors
  { base: 'EUR', quote: 'USD' },
  { base: 'USD', quote: 'JPY' },
  { base: 'GBP', quote: 'USD' },
  { base: 'USD', quote: 'CHF' },
  { base: 'AUD', quote: 'USD' },
  { base: 'USD', quote: 'CAD' },
  { base: 'NZD', quote: 'USD' },

  // EUR crosses
  { base: 'EUR', quote: 'GBP' },
  { base: 'EUR', quote: 'JPY' },
  { base: 'EUR', quote: 'CHF' },
  { base: 'EUR', quote: 'AUD' },
  { base: 'EUR', quote: 'CAD' },
  { base: 'EUR', quote: 'NZD' },
  { base: 'EUR', quote: 'SEK' },
  { base: 'EUR', quote: 'NOK' },
  { base: 'EUR', quote: 'PLN' },

  // GBP crosses
  { base: 'GBP', quote: 'JPY' },
  { base: 'GBP', quote: 'CHF' },
  { base: 'GBP', quote: 'AUD' },
  { base: 'GBP', quote: 'CAD' },
  { base: 'GBP', quote: 'NZD' },

  // AUD / NZD / CAD crosses
  { base: 'AUD', quote: 'JPY' },
  { base: 'AUD', quote: 'NZD' },
  { base: 'AUD', quote: 'CAD' },
  { base: 'AUD', quote: 'CHF' },
  { base: 'NZD', quote: 'JPY' },
  { base: 'NZD', quote: 'CAD' },
  { base: 'CAD', quote: 'JPY' },
  { base: 'CHF', quote: 'JPY' },

  // USD vs other liquid currencies
  { base: 'USD', quote: 'SEK' },
  { base: 'USD', quote: 'NOK' },
  { base: 'USD', quote: 'DKK' },
  { base: 'USD', quote: 'PLN' },
  { base: 'USD', quote: 'HKD' },
  { base: 'USD', quote: 'SGD' },
  { base: 'USD', quote: 'CNY' },
  { base: 'USD', quote: 'ZAR' },
  { base: 'USD', quote: 'MXN' },
  { base: 'USD', quote: 'TRY' },
  { base: 'USD', quote: 'INR' },
  { base: 'USD', quote: 'BRL' },
  { base: 'USD', quote: 'KRW' },
  { base: 'USD', quote: 'THB' },
  { base: 'USD', quote: 'ILS' },
  { base: 'USD', quote: 'CZK' },
  { base: 'USD', quote: 'HUF' },
] as const satisfies readonly TickerPair[]
