'use client'

import {
  HydrationBoundary as TanStackHydrationBoundary,
  type DehydratedState,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'

type HydrationBoundaryProps = {
  state: DehydratedState
  children: ReactNode
}

export function HydrationBoundary({ state, children }: HydrationBoundaryProps) {
  return <TanStackHydrationBoundary state={state}>{children}</TanStackHydrationBoundary>
}
