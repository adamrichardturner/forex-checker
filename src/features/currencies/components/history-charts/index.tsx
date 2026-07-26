'use client'

import { useId, useState } from 'react'
import { DateTime } from 'luxon'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { cn } from '@/lib/utils'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useRateHistory } from '../../hooks/use-rate-history'
import type { RangePreset, RateHistoryPoint } from '../../model/rate-history.types'
import { formatExchangeRate } from '../../utils/amount-input'
import styles from './history-charts.module.scss'

const RANGE_PRESETS: RangePreset[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']

type HistoryChartsProps = {
  base: string
  quote: string
}

type HistoryChartDatum = {
  date: string
  rate: number
}

function formatSignedRate(value: number): string {
  const formatted = formatExchangeRate(Math.abs(value))

  if (value > 0) {
    return `+${formatted}`
  }

  if (value < 0) {
    return `-${formatted}`
  }

  return formatted
}

function formatChangePct(value: number): string {
  const abs = Math.abs(value).toFixed(2)

  if (value > 0) {
    return `▲ +${abs}%`
  }

  if (value < 0) {
    return `▼ -${abs}%`
  }

  return `${abs}%`
}

function formatAxisDate(date: string): string {
  return DateTime.fromISO(date, { zone: 'utc' }).toFormat('MMM d')
}

function formatTooltipDate(date: string): string {
  return DateTime.fromISO(date, { zone: 'utc' })
    .setZone('Europe/Berlin')
    .set({ hour: 16, minute: 0 })
    .toFormat('MMM d yyyy · HH:mm ZZZZ')
}

function formatChartTimestamp(date: string): string {
  return DateTime.fromISO(date, { zone: 'utc' })
    .setZone('Europe/Berlin')
    .set({ hour: 16, minute: 0 })
    .toFormat('MMM d HH:mm ZZZZ')
    .toUpperCase()
}

function getChangeToneClass(change: number | undefined): string | undefined {
  if (change === undefined) {
    return undefined
  }

  if (change > 0) {
    return styles.historyChartsStatValuePositive
  }

  if (change < 0) {
    return styles.historyChartsStatValueNegative
  }

  return undefined
}

function toChartData(points: RateHistoryPoint[]): HistoryChartDatum[] {
  return points.map((point) => ({
    date: point.date,
    rate: point.value,
  }))
}

function HistoryAreaChart({
  points,
  base,
  quote,
}: {
  points: RateHistoryPoint[]
  base: string
  quote: string
}) {
  const gradientId = useId().replace(/:/g, '')
  const chartData = toChartData(points)

  const chartConfig = {
    rate: {
      label: `${base}/${quote}`,
      color: 'var(--color-lime-500, #CEF739)',
    },
  } satisfies ChartConfig

  if (chartData.length === 0) {
    return <p className={styles.historyChartsEmpty}>No history available for this range.</p>
  }

  return (
    <ChartContainer
      config={chartConfig}
      className={styles.historyChartsContainer}
      initialDimension={{ width: 944, height: 272 }}
    >
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--colors-lime-500, #CEF739)" stopOpacity={1} />
            <stop offset="100%" stopColor="#171719" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-neutral-500, #2e2e2e)" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          minTickGap={32}
          tickFormatter={formatAxisDate}
        />
        <YAxis
          dataKey="rate"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={56}
          domain={['auto', 'auto']}
          tickFormatter={formatExchangeRate}
        />
        <ChartTooltip
          cursor={{
            stroke: 'var(--color-neutral-400, #3d3d3d)',
            strokeWidth: 1,
            strokeDasharray: '4 4',
          }}
          content={
            <ChartTooltipContent
              className={styles.historyChartsTooltip}
              indicator="dot"
              labelFormatter={(value) => {
                if (typeof value !== 'string') {
                  return null
                }

                return formatTooltipDate(value)
              }}
              formatter={(value) => {
                if (typeof value !== 'number') {
                  return null
                }

                return (
                  <div className={styles.historyChartsTooltipRow}>
                    <span className={styles.historyChartsTooltipDot} aria-hidden="true" />
                    <span className={styles.historyChartsTooltipLabel}>
                      {base}/{quote}
                    </span>
                    <span className={styles.historyChartsTooltipValue}>
                      {formatExchangeRate(value)}
                    </span>
                  </div>
                )
              }}
            />
          }
        />
        <Area
          dataKey="rate"
          type="linear"
          stroke="var(--color-rate)"
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          dot={false}
          activeDot={{
            r: 4,
            fill: 'var(--color-lime-500, #CEF739)',
            stroke: 'var(--color-neutral-700, #171719)',
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function HistoryCharts({ base, quote }: HistoryChartsProps) {
  const [range, setRange] = useState<RangePreset>('1M')
  const { data, isPending, isError } = useRateHistory(base, quote, range)

  const changeToneClass = getChangeToneClass(data?.change)
  const lastPointDate = data?.points.at(-1)?.date
  const metaLabel =
    data !== undefined && lastPointDate !== undefined
      ? `${formatExchangeRate(data.last)} · ${formatChartTimestamp(lastPointDate)}`
      : null

  return (
    <div className={styles.historyCharts}>
      <div className={styles.historyChartsToolbar}>
        <div className={styles.historyChartsStats}>
          <div className={styles.historyChartsStat}>
            <p className={styles.historyChartsStatLabel}>Open</p>
            <p className={styles.historyChartsStatValue}>
              {data ? formatExchangeRate(data.open) : '—'}
            </p>
          </div>
          <div className={styles.historyChartsStat}>
            <p className={styles.historyChartsStatLabel}>Last</p>
            <p className={styles.historyChartsStatValue}>
              {data ? formatExchangeRate(data.last) : '—'}
            </p>
          </div>
          <div className={styles.historyChartsStat}>
            <p className={styles.historyChartsStatLabel}>Change</p>
            <p className={cn(styles.historyChartsStatValue, changeToneClass)}>
              {data ? formatSignedRate(data.change) : '—'}
            </p>
          </div>
          <div className={styles.historyChartsStat}>
            <p className={styles.historyChartsStatLabel}>% Change</p>
            <p className={cn(styles.historyChartsStatValue, changeToneClass)}>
              {data ? formatChangePct(data.changePct) : '—'}
            </p>
          </div>
        </div>

        <div className={styles.historyChartsRanges} role="group" aria-label="History range">
          {RANGE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className={styles.historyChartsRangeButton}
              aria-pressed={range === preset}
              onClick={() => {
                setRange(preset)
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.historyChartsCard}>
        <div className={styles.historyChartsCardHeader}>
          <p className={styles.historyChartsPair}>
            {base}/{quote}
          </p>
          {metaLabel ? <p className={styles.historyChartsMeta}>{metaLabel}</p> : null}
        </div>

        <div className={styles.historyChartsPlot}>
          {isPending && !data ? (
            <p className={styles.historyChartsStatus}>Loading rate history…</p>
          ) : null}
          {isError && !data ? (
            <p className={styles.historyChartsStatus}>Failed to load rate history</p>
          ) : null}
          {data ? <HistoryAreaChart points={data.points} base={base} quote={quote} /> : null}
        </div>
      </div>
    </div>
  )
}
