import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/tanstack-query/get-query-client'
import {
  currenciesQueryOptions,
  latestRatesQueryOptions,
} from '@/features/currencies/api/query-options'
import { Dashboard } from '@/features/currencies/components/dashboard'
import { Currency, FrankfurterLatestRates } from '@/features/currencies/model/currency.types'
import { TopBar } from '@/components/layout/top-bar'

export default async function HomePage() {
  const queryClient = getQueryClient()
  await Promise.all([
    queryClient.prefetchQuery(currenciesQueryOptions),
    queryClient.prefetchQuery(latestRatesQueryOptions('EUR')),
  ])
  const currencies: Currency[] = await queryClient.fetchQuery(currenciesQueryOptions)
  const latestRates: FrankfurterLatestRates = await queryClient.fetchQuery(
    latestRatesQueryOptions('EUR'),
  )

  console.log(latestRates)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TopBar currencyCount={currencies.length} />
      <Dashboard currencies={currencies} />
    </HydrationBoundary>
  )
}
