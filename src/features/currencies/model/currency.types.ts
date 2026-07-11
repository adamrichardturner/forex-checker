import type { z } from 'zod'
import type { currenciesResponseSchema, currencySchema } from './currency.schemas'

export type CurrencyCode = string
export type CurrenciesResponse = z.infer<typeof currenciesResponseSchema>
export type Currency = z.infer<typeof currencySchema>
