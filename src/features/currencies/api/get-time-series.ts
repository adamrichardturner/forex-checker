import { FRANKFURTER_BASE_URL } from '../model/currency.constants'
import type { FrankfurterTimeSeries } from '../model/currency.types'
import { frankfurterTimeSeriesSchema } from '../model/frankfurter.schemas'

type TimeSeriesArgs = {
  base: string
  quote: string
  start: string
  end: string
}

export async function getTimeSeries({
  base,
  quote,
  start,
  end,
}: TimeSeriesArgs): Promise<FrankfurterTimeSeries> {
  const params = new URLSearchParams({
    base,
    quotes: quote,
    from: start,
    to: end,
  })

  const response = await fetch(`${FRANKFURTER_BASE_URL}/rates?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch time series: ${response.status} ${response.statusText}`)
  }

  const data: unknown = await response.json()

  return frankfurterTimeSeriesSchema.parse(data)
}
