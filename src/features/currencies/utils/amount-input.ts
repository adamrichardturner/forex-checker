const AMOUNT_INPUT_PATTERN = /^\d*\.?\d*$/

export const MAX_SEND_AMOUNT = 100_000

export function stripAmountFormatting(value: string): string {
  return value.replace(/,/g, '')
}

export function isValidAmountInput(value: string): boolean {
  const raw = stripAmountFormatting(value)

  if (!AMOUNT_INPUT_PATTERN.test(raw)) {
    return false
  }

  const parsed = parseAmountInput(raw)

  if (!Number.isFinite(parsed)) {
    return true
  }

  return parsed <= MAX_SEND_AMOUNT
}

export function formatAmountInput(value: string): string {
  const raw = stripAmountFormatting(value)

  if (raw === '') {
    return ''
  }

  const decimalIndex = raw.indexOf('.')
  const hasDecimal = decimalIndex !== -1
  const integerPart = hasDecimal ? raw.slice(0, decimalIndex) : raw
  const decimalPart = hasDecimal ? raw.slice(decimalIndex + 1) : undefined
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  if (!hasDecimal) {
    return formattedInteger
  }

  return `${formattedInteger}.${decimalPart ?? ''}`
}

export function parseAmountInput(amount: string): number {
  const raw = stripAmountFormatting(amount)

  if (raw === '' || raw === '.') {
    return Number.NaN
  }

  return Number(raw)
}

export function countRawCharacters(value: string, caret: number): number {
  let count = 0
  const end = Math.min(caret, value.length)

  for (let i = 0; i < end; i++) {
    if (value[i] === ',') {
      continue
    }

    count += 1
  }

  return count
}

export function mapRawCaretToFormattedIndex(formatted: string, rawCaret: number): number {
  if (rawCaret <= 0) {
    return 0
  }

  let rawSeen = 0

  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] === ',') {
      continue
    }

    rawSeen += 1

    if (rawSeen === rawCaret) {
      return i + 1
    }
  }

  return formatted.length
}

export function formatConvertedAmount(value: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatExchangeRate(rate: number): string {
  return rate.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
}

export function clampSendAmountInput(value: string): string {
  const parsed = parseAmountInput(value)

  if (!Number.isFinite(parsed)) {
    return formatAmountInput(value)
  }

  if (parsed > MAX_SEND_AMOUNT) {
    return formatAmountInput(String(MAX_SEND_AMOUNT))
  }

  return formatAmountInput(stripAmountFormatting(value))
}

export function toSwapAmountInput(converted: number): string {
  return clampSendAmountInput(converted.toFixed(2))
}
