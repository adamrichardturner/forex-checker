export const FRANKFURTER_BASE_URL =
  process.env.NEXT_PUBLIC_FRANKFURTER_BASE_URL ?? 'https://api.frankfurter.dev/v2'

export const POPULAR_CURRENCIES = ['USD', 'EUR', 'GBP'] as const

export const COMPARE_CURRENCIES = [
  'EUR',
  'GBP',
  'JPY',
  'CHF',
  'CAD',
  'AUD',
  'INR',
  'CNY',
  'BDT',
] as const
