import { queryOptions } from '@tanstack/react-query'
import { getCurrencies } from './get-currencies'

export const currenciesQueryOptions = queryOptions({
  queryKey: ['currencies'],
  queryFn: getCurrencies,
})
