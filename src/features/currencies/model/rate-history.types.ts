export type RangePreset = '1W' | '1M' | '3M' | '6M' | '1Y' | '5Y'

export type RateHistoryPoint = {
  date: string
  value: number
}

export type RateHistory = {
  points: RateHistoryPoint[]
  open: number
  last: number
  change: number
  changePct: number
}
