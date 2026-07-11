'use client'

import type { FC } from 'react'

type ExchangeErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

const ExchangeErrorPage: FC<ExchangeErrorPageProps> = ({ error, reset }) => {
  return (
    <main>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </main>
  )
}

export default ExchangeErrorPage
