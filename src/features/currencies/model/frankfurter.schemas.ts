import { z } from 'zod'

export const currencyCodeSchema = z
  .string()
  .regex(/^[A-Z]{3}$/, 'Expected a three-letter currency code')

export const dateSchema = z.iso.date()

export const frankfurterCurrencySchema = z.object({
  iso_code: currencyCodeSchema,
  iso_numeric: z.string().nullable().optional(),
  name: z.string().min(1),
  symbol: z.string().nullable().optional(),
  start_date: dateSchema.nullable().optional(),
  end_date: dateSchema.nullable().optional(),
})

export const frankfurterCurrenciesSchema = z.array(frankfurterCurrencySchema)

export const frankfurterRateSchema = z.object({
  date: dateSchema,
  base: currencyCodeSchema,
  quote: currencyCodeSchema,
  rate: z.number().positive(),
})

export const frankfurterLatestRatesSchema = z.array(frankfurterRateSchema)

export const frankfurterTimeSeriesSchema = z.array(frankfurterRateSchema)
