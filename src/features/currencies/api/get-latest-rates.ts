import { FRANKFURTER_BASE_URL } from '../model/currency.constants'
import type { LatestRatesResponse } from '../model/currency.types'
import { frankfurterLatestRatesSchema } from '../model/frankfurter.schemas'

export async function getLatestRates(base: string): Promise<LatestRatesResponse> {
  const params = new URLSearchParams({
    base,
  })

  const response = await fetch(`${FRANKFURTER_BASE_URL}/rates?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch latest rates: ${response.status} ${response.statusText}`)
  }

  const data: unknown = await response.json()

  return frankfurterLatestRatesSchema.parse(data)
}
