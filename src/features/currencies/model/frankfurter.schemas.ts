import { z } from 'zod'

/**
 * Frankfurter v2 returns fiat currencies alongside precious metals (XAU, XAG, …)
 * and crypto assets whose codes are not three letters (USDT, AAVE, …). Accept any
 * upper-case alphanumeric asset code so a new asset never breaks the whole response.
 */
export const currencyCodeSchema = z
  .string()
  .regex(/^[A-Z0-9]{2,10}$/, 'Expected an upper-case asset code')

export const dateSchema = z.iso.date()

export const FIAT_CURRENCY_TYPE = 'currency'

export const frankfurterCurrencySchema = z.object({
  iso_code: currencyCodeSchema,
  iso_numeric: z.string().nullable().optional(),
  name: z.string().min(1),
  symbol: z.string().nullable().optional(),
  /** `currency` | `metal` | `crypto` — kept as a string so new asset classes don't fail parsing. */
  type: z.string().optional(),
  start_date: dateSchema.nullable().optional(),
  end_date: dateSchema.nullable().optional(),
})

/**
 * Parses an array item by item, dropping rows that don't match `item` instead of
 * rejecting the whole payload. Upstream additions (new fields, new asset classes)
 * should degrade gracefully rather than take the app offline. A non-empty payload
 * with no valid rows at all is still treated as malformed.
 */
function lenientArray<T extends z.ZodType>(item: T) {
  return z.array(z.unknown()).transform((rows, ctx) => {
    const parsed = rows.flatMap((row): z.output<T>[] => {
      const result = item.safeParse(row)

      return result.success ? [result.data] : []
    })

    if (rows.length > 0 && parsed.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Response contained no valid rows',
        input: rows,
      })

      return z.NEVER
    }

    return parsed
  })
}

export const frankfurterCurrenciesSchema = lenientArray(frankfurterCurrencySchema)

export const frankfurterRateSchema = z.object({
  date: dateSchema,
  base: currencyCodeSchema,
  quote: currencyCodeSchema,
  rate: z.number().positive(),
})

export const frankfurterLatestRatesSchema = lenientArray(frankfurterRateSchema)

export const frankfurterTimeSeriesSchema = lenientArray(frankfurterRateSchema)
