import { dehydrate } from '@tanstack/react-query'
import { getQueryClient } from '@/lib/tanstack-query/get-query-client'
import { HydrationBoundary } from '@/lib/tanstack-query/hydration-boundary'
import { currenciesQueryOptions } from '@/features/currencies/api/query-options'
import { Dashboard } from '@/features/currencies/components/dashboard/dashboard'
import { Currency } from '@/features/currencies/model/currency.types'
import { TopBar } from '@/components/layout/top-bar'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default async function HomePage() {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(currenciesQueryOptions)
  const currencies: Currency[] = await queryClient.fetchQuery(currenciesQueryOptions)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReactQueryDevtools />
      <TopBar currencyCount={currencies.length} />
      <Dashboard />
    </HydrationBoundary>
  )
}
