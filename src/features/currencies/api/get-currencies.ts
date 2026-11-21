import { FRANKFURTER_BASE_URL } from '../model/currency.constants'
import type { CurrenciesResponse } from '../model/currency.types'
import { FIAT_CURRENCY_TYPE, frankfurterCurrenciesSchema } from '../model/frankfurter.schemas'

export async function getCurrencies(): Promise<CurrenciesResponse> {
  const response = await fetch(`${FRANKFURTER_BASE_URL}/currencies`)

  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.status} ${response.statusText}`)
  }

  const data: unknown = await response.json()

  // This is a forex checker: hide precious metals and crypto assets that v2 now lists.
  return frankfurterCurrenciesSchema
    .parse(data)
    .filter((currency) => currency.type === undefined || currency.type === FIAT_CURRENCY_TYPE)
}
