import type { CSSProperties } from 'react'

/**
 * Numbers are set in a monospace face, so the rendered width of a value is a
 * function of its character count. Exposing that count as `--fit-chars` lets
 * CSS scale the font to the space available — `width / (chars * glyph-advance)`
 * inside a size container — instead of clipping long values.
 */
export function fitTextStyle(value: string | null | undefined): CSSProperties {
  return { '--fit-chars': Math.max(value?.length ?? 0, 1) } as CSSProperties
}
