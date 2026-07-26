export type FavouritePair = {
  id: string
  base: string
  quote: string
  createdAt: number
}

export type ConversionLog = {
  id?: number
  base: string
  quote: string
  sendAmount: number
  receiveAmount: number
  rate: number
  createdAt: number
}

export type NewConversionLog = Omit<ConversionLog, 'id' | 'createdAt'>

export function favouritePairId(base: string, quote: string): string {
  return `${base}-${quote}`
}
