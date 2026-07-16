import { FRANKFURTER_BASE_URL } from '../model/currency.constants'
import { frankfurterLatestRatesSchema } from './frankfurter.schemas'
import type { FrankfurterLatestRates } from './frankfurter.schemas'

export async function getLatestRates(base: string): Promise<FrankfurterLatestRates> {
  const response = await fetch(`${FRANKFURTER_BASE_URL}/latest?from=${base}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch latest rates: ${response.statusText}`)
  }
  const data: unknown = await response.json()
  return frankfurterLatestRatesSchema.parse(data)
}
