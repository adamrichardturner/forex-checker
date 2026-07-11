import { z } from 'zod'

export const currenciesResponseSchema = z.record(z.string(), z.string())

export const currencySchema = z.object({
  code: z.string(),
  label: z.string(),
})
