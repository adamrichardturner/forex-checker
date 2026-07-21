import { z } from 'zod'
import {
  frankfurterCurrenciesSchema,
  frankfurterCurrencySchema,
  frankfurterLatestRatesSchema,
  frankfurterRateSchema,
  frankfurterTimeSeriesSchema,
} from './frankfurter.schemas'

export type Currency = z.infer<typeof frankfurterCurrencySchema>

export type CurrenciesResponse = z.infer<typeof frankfurterCurrenciesSchema>

export type FrankfurterRate = z.infer<typeof frankfurterRateSchema>

export type FrankfurterLatestRates = z.infer<typeof frankfurterLatestRatesSchema>

export type FrankfurterTimeSeries = z.infer<typeof frankfurterTimeSeriesSchema>
