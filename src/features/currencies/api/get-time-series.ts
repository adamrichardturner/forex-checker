import { FRANKFURTER_BASE_URL } from '../model/currency.constants'
import { frankfurterTimeSeriesSchema } from './frankfurter.schemas'
import type { FrankfurterTimeSeries } from './frankfurter.schemas'

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
  const url = `${FRANKFURTER_BASE_URL}/${start}..${end}?from=${base}&to=${quote}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch time series: ${response.statusText}`)
  }
  const data: unknown = await response.json()
  return frankfurterTimeSeriesSchema.parse(data)
}
