import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import 'fake-indexeddb/auto'
import ResizeObserver from 'resize-observer-polyfill'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './msw/server'
import { resetIndexedDb } from './utils/idb'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetIndexedDb()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

afterAll(() => {
  server.close()
})

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: ResizeObserver,
  })

  Element.prototype.scrollIntoView = vi.fn()

  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false)
  }

  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = vi.fn()
  }

  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = vi.fn()
  }

  if (typeof globalThis.PointerEvent === 'undefined') {
    class MockPointerEvent extends MouseEvent {
      constructor(type: string, params: MouseEventInit = {}) {
        super(type, params)
      }
    }

    // @ts-expect-error — jsdom does not provide PointerEvent
    globalThis.PointerEvent = MockPointerEvent
  }
}
