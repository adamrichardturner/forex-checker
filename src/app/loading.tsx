import { Spinner } from '@/components/ui/spinner'

const ExchangeLoadingPage = () => {
  return (
    <main className="flex h-screen items-center justify-center">
      <Spinner className="size-8 animate-spin" />
    </main>
  )
}

export default ExchangeLoadingPage
