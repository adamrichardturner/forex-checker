export type TickerPair = {
  base: string
  quote: string
}

export type TickerItem = TickerPair & {
  rate: number
  previousRate: number | null
  change: number | null
  changePct: number | null
  direction: 'up' | 'down' | 'flat'
  date: string
}
