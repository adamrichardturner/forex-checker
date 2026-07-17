export const currencyKeys = {
  all: ['currencies'] as const,

  list: () => [...currencyKeys.all, 'list'] as const,

  rates: ['rates'] as const,

  latest: (base: string) => [...currencyKeys.rates, 'latest', base] as const,

  timeSeries: (base: string, quote: string, start: string, end: string) =>
    [...currencyKeys.rates, 'series', base, quote, start, end] as const,
}
