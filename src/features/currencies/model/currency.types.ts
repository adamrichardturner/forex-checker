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

export type RateResponse = z.infer<typeof frankfurterRateSchema>

export type LatestRatesResponse = z.infer<typeof frankfurterLatestRatesSchema>

export type LatestRatesTimeSeries = z.infer<typeof frankfurterTimeSeriesSchema>
