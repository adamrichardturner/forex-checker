import { FRANKFURTER_BASE_URL } from '../model/currency.constants'
import { frankfurterTimeSeriesSchema } from '../model/frankfurter.schemas'
import type { FrankfurterTimeSeries } from '../model/currency.types'

type GetTickerRatesArgs = {
  base: string
  start: string
  end: string
}

export async function getTickerRates({
  base,
  start,
  end,
}: GetTickerRatesArgs): Promise<FrankfurterTimeSeries> {
  const params = new URLSearchParams({
    base,
    from: start,
    to: end,
  })

  const response = await fetch(`${FRANKFURTER_BASE_URL}/rates?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch ticker rates: ${response.status} ${response.statusText}`)
  }

  const data: unknown = await response.json()

  return frankfurterTimeSeriesSchema.parse(data)
}
