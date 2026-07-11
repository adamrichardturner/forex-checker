import { FRANKFURTER_BASE_URL } from '../model/currency.constants'
import { frankfurterCurrenciesSchema } from './frankfurter.schemas'
import type { CurrenciesResponse } from '../model/currency.types'

export async function getCurrencies(): Promise<CurrenciesResponse> {
  const response = await fetch(`${FRANKFURTER_BASE_URL}/currencies`)

  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.statusText}`)
  }

  const data: unknown = await response.json()
  return frankfurterCurrenciesSchema.parse(data)
}
