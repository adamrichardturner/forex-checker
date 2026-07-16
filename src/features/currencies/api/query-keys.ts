export const currencyKeys = {
  all: ['currencies'] as const,
  list: () => [...currencyKeys.all, 'list'] as const,
  latest: (base: string) => ['rates', 'latest', base] as const,
  timeSeries: (base: string, quote: string, start: string, end: string) =>
    ['rates', 'series', base, quote, start, end] as const,
}
