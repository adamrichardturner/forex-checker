import { createMiddleware } from '@mswjs/http-middleware'
import express from 'express'
import { frankfurterHandlers } from './handlers'

const PORT = Number(process.env.MOCK_API_PORT ?? 4010)

const app = express()

app.get('/health', (_request, response) => {
  response.status(200).json({ ok: true })
})

app.use(createMiddleware(...frankfurterHandlers))

app.listen(PORT, '127.0.0.1', () => {
  console.log(`MSW HTTP mock listening on http://127.0.0.1:${PORT}`)
})
