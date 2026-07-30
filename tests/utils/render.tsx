import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  render,
  renderHook,
  type RenderHookOptions,
  type RenderOptions,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import { CurrencyPersistenceProvider } from '@/features/currencies/persistence/currency-persistence-provider'

type ProviderOptions = {
  withPersistence?: boolean
  queryClient?: QueryClient
}

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

function createWrapper(options: ProviderOptions = {}) {
  const queryClient = options.queryClient ?? createTestQueryClient()
  const withPersistence = options.withPersistence ?? true

  function Wrapper({ children }: { children: ReactNode }) {
    const content = withPersistence ? (
      <CurrencyPersistenceProvider>{children}</CurrencyPersistenceProvider>
    ) : (
      children
    )

    return <QueryClientProvider client={queryClient}>{content}</QueryClientProvider>
  }

  return { Wrapper, queryClient }
}

export function renderWithProviders(
  ui: ReactElement,
  options: Omit<RenderOptions, 'wrapper'> & ProviderOptions = {},
) {
  const { withPersistence, queryClient: providedClient, ...renderOptions } = options
  const { Wrapper, queryClient } = createWrapper({
    withPersistence,
    queryClient: providedClient,
  })

  return {
    user: userEvent.setup(),
    queryClient,
    ...render(ui, {
      wrapper: Wrapper,
      ...renderOptions,
    }),
  }
}

export function renderHookWithProviders<TResult, TProps>(
  hook: (props: TProps) => TResult,
  options: Omit<RenderHookOptions<TProps>, 'wrapper'> & ProviderOptions = {},
) {
  const { withPersistence, queryClient: providedClient, ...hookOptions } = options
  const { Wrapper, queryClient } = createWrapper({
    withPersistence,
    queryClient: providedClient,
  })

  return {
    queryClient,
    ...renderHook(hook, {
      wrapper: Wrapper,
      ...hookOptions,
    }),
  }
}

export function createUserWithFakeTimers() {
  return userEvent.setup({
    advanceTimers: (ms) => {
      vi.advanceTimersByTime(ms)
    },
  })
}

export { createTestQueryClient }
export * from '@testing-library/react'
