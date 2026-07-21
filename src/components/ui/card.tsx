import * as React from 'react'

import { cn } from '@/lib/utils'

export type CardLevel = 'level-1' | 'level-2'

type CardVarients = {
  default: string
  levels: Record<CardLevel, string>
}

const cardVarients: CardVarients = {
  default:
    'p-[var(--spacing-250,20px)] [--card-spacing:var(--spacing-250,20px)] border-radius-(--corner-radius-16) group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl text-sm text-card-foreground has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
  levels: {
    'level-1': 'bg-(--color-neutral-700) border-width-1 border-color-(--color-neutral-600)',
    'level-2': 'bg-(--color-neutral-500)',
  },
}

function Card({
  className,
  size = 'default',
  level = 'level-1',
  ...props
}: React.ComponentProps<'div'> & { size?: 'default' | 'sm'; level?: 'level-1' | 'level-2' }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(cardVarients.default, cardVarients.levels[level], className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        'font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm',
        className,
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center rounded-b-xl border-t p-(--card-spacing)', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
