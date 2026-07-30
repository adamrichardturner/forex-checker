import { setupServer } from 'msw/node'
import { frankfurterHandlers } from './handlers'

export const server = setupServer(...frankfurterHandlers)
