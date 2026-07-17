import { queryOptions } from '@tanstack/react-query'
import { getCurrencies } from './get-currencies'
import { getLatestRates } from './get-latest-rates'
import { getTimeSeries } from './get-time-series'
import { currencyKeys } from './query-keys'
import { msUntilNextEcbPublish } from '../utils/ecb-schedule'

const DAY_MS = 24 * 60 * 60 * 1000

export const currenciesQueryOptions = queryOptions({
  queryKey: currencyKeys.list(),
  queryFn: getCurrencies,
  staleTime: Infinity,
  gcTime: 7 * DAY_MS,
})

export const latestRatesQueryOptions = (base: string) =>
  queryOptions({
    queryKey: currencyKeys.latest(base),
    queryFn: () => getLatestRates(base),
    staleTime: msUntilNextEcbPublish(),
    gcTime: DAY_MS,
  })

type TimeSeriesParams = {
  base: string
  quote: string
  start: string
  end: string
  includesToday: boolean
}

export const timeSeriesQueryOptions = ({
  base,
  quote,
  start,
  end,
  includesToday,
}: TimeSeriesParams) =>
  queryOptions({
    queryKey: currencyKeys.timeSeries(base, quote, start, end),
    queryFn: () =>
      getTimeSeries({
        base,
        quote,
        start,
        end,
      }),
    staleTime: includesToday ? msUntilNextEcbPublish() : Infinity,
    gcTime: 7 * DAY_MS,
  })
