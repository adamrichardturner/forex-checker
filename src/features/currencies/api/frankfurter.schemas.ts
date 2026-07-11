import { z } from 'zod'

export const frankfurterCurrenciesSchema = z.record(z.string(), z.string())

export const frankfurterLatestRatesSchema = z.object({
  amount: z.number(),
  base: z.string(),
  date: z.string(),
  rates: z.record(z.string(), z.number()),
})

export type FrankfurterCurrencies = z.infer<typeof frankfurterCurrenciesSchema>
export type FrankfurterLatestRates = z.infer<typeof frankfurterLatestRatesSchema>
