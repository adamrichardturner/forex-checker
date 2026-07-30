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
import { Skeleton } from '@/components/ui/skeleton'
import { useRateHistory } from '../../hooks/use-rate-history'
import type { RangePreset, RateHistoryPoint } from '../../model/rate-history.types'
import { APP_TIMEZONE, ECB_PUBLISH_HOUR, ECB_TIMEZONE } from '../../model/timezone.constants'
import { formatExchangeRate } from '../../utils/amount-input'
import { TabEmptyState } from '../tab-empty-state'
import styles from './history-charts.module.scss'
import { Button } from '@/components/ui/button'

const RANGE_PRESETS: RangePreset[] = ['1D', '1W', '1M', '3M', '1Y', '5Y']
const SKELETON_Y_TICKS = 4
const SKELETON_X_TICKS = 5

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

function toEcbPublishInAppTimezone(date: string): DateTime {
  return DateTime.fromISO(date, { zone: ECB_TIMEZONE })
    .set({ hour: ECB_PUBLISH_HOUR, minute: 0, second: 0, millisecond: 0 })
    .setZone(APP_TIMEZONE)
}

function formatAxisDate(date: string): string {
  return DateTime.fromISO(date, { zone: APP_TIMEZONE }).toFormat('MMM d yyyy')
}

function formatTooltipDate(date: string): string {
  return toEcbPublishInAppTimezone(date).toFormat('MMM d yyyy · HH:mm ZZZZ')
}

function formatChartTimestamp(date: string): string {
  return toEcbPublishInAppTimezone(date).toFormat('MMM d HH:mm ZZZZ').toUpperCase()
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

function HistoryChartSkeleton() {
  const yTicks = []
  const xTicks = []

  for (let index = 0; index < SKELETON_Y_TICKS; index++) {
    yTicks.push(
      <Skeleton key={index} className={cn(styles.historyChartsSkeletonYTick, 'animate-none')} />,
    )
  }

  for (let index = 0; index < SKELETON_X_TICKS; index++) {
    xTicks.push(
      <Skeleton key={index} className={cn(styles.historyChartsSkeletonXTick, 'animate-none')} />,
    )
  }

  return (
    <div
      className={cn(styles.historyChartsSkeleton, 'animate-pulse')}
      aria-busy="true"
      aria-label="Loading rate history"
    >
      <div className={styles.historyChartsSkeletonBody}>
        <div className={styles.historyChartsSkeletonYAxis}>{yTicks}</div>
        <div className={styles.historyChartsSkeletonPlot}>
          <div className={styles.historyChartsSkeletonGrid} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <svg
            className={styles.historyChartsSkeletonArea}
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="history-chart-skeleton-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-neutral-500, #2e2e2e)" stopOpacity="0.9" />
                <stop offset="100%" stopColor="var(--color-neutral-500, #2e2e2e)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0 28 C8 26 14 18 22 17 C30 16 36 24 44 20 C52 16 58 8 66 10 C74 12 80 18 88 14 C94 11 97 13 100 12 L100 40 L0 40 Z"
              fill="url(#history-chart-skeleton-fill)"
            />
            <path
              d="M0 28 C8 26 14 18 22 17 C30 16 36 24 44 20 C52 16 58 8 66 10 C74 12 80 18 88 14 C94 11 97 13 100 12"
              fill="none"
              stroke="var(--color-neutral-400, #3d3d3d)"
              strokeWidth="0.6"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
      <div className={styles.historyChartsSkeletonXAxis}>{xTicks}</div>
    </div>
  )
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

  return (
    <ChartContainer
      config={chartConfig}
      className={cn(styles.historyChartsContainer, 'aspect-auto')}
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
          minTickGap={56}
          interval="preserveStartEnd"
          fontSize={10}
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
  const { data, isPending, isError, isPlaceholderData } = useRateHistory(base, quote, range)

  const isLoading = isPending || isPlaceholderData
  const hasChartData = data !== undefined && data.points.length > 0
  const showEmptyState = !isLoading && (isError || !hasChartData)

  if (showEmptyState) {
    return (
      <TabEmptyState
        title="No chart data available"
        description={`We couldn't load rate history for ${base}/${quote} right now. This usually clears up in a minute.`}
      />
    )
  }

  const changeToneClass = getChangeToneClass(isLoading ? undefined : data?.change)
  const lastPointDate = data?.points.at(-1)?.date
  const metaLabel =
    !isLoading && data !== undefined && lastPointDate !== undefined
      ? `${formatExchangeRate(data.last)} · ${formatChartTimestamp(lastPointDate)}`
      : null

  return (
    <div className={styles.historyCharts}>
      <div className={styles.historyChartsToolbar}>
        <div className={styles.historyChartsStats}>
          <div className={styles.historyChartsStat}>
            <p className={styles.historyChartsStatLabel}>Open</p>
            <div className={styles.historyChartsStatValue}>
              {isLoading ? (
                <Skeleton className={styles.historyChartsStatSkeleton} />
              ) : data ? (
                formatExchangeRate(data.open)
              ) : (
                '—'
              )}
            </div>
          </div>
          <div className={styles.historyChartsStat}>
            <p className={styles.historyChartsStatLabel}>Last</p>
            <div className={styles.historyChartsStatValue}>
              {isLoading ? (
                <Skeleton className={styles.historyChartsStatSkeleton} />
              ) : data ? (
                formatExchangeRate(data.last)
              ) : (
                '—'
              )}
            </div>
          </div>
          <div className={styles.historyChartsStat}>
            <p className={styles.historyChartsStatLabel}>Change</p>
            <div className={cn(styles.historyChartsStatValue, changeToneClass)}>
              {isLoading ? (
                <Skeleton className={styles.historyChartsStatSkeleton} />
              ) : data ? (
                formatSignedRate(data.change)
              ) : (
                '—'
              )}
            </div>
          </div>
          <div className={styles.historyChartsStat}>
            <p className={styles.historyChartsStatLabel}>% Change</p>
            <div className={cn(styles.historyChartsStatValue, changeToneClass)}>
              {isLoading ? (
                <Skeleton className={styles.historyChartsStatSkeleton} />
              ) : data ? (
                formatChangePct(data.changePct)
              ) : (
                '—'
              )}
            </div>
          </div>
        </div>

        <div className={styles.historyChartsRanges} role="group" aria-label="History range">
          {RANGE_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              className={styles.historyChartsRangeButton}
              aria-pressed={range === preset}
              onClick={() => {
                setRange(preset)
              }}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.historyChartsCard}>
        <div className={styles.historyChartsCardHeader}>
          <p className={styles.historyChartsPair}>
            {base}/{quote}
          </p>
          {isLoading ? (
            <div className={styles.historyChartsMeta}>
              <Skeleton className={styles.historyChartsMetaSkeleton} />
            </div>
          ) : metaLabel ? (
            <p className={styles.historyChartsMeta}>{metaLabel}</p>
          ) : null}
        </div>

        <div className={styles.historyChartsPlot}>
          {isLoading ? <HistoryChartSkeleton /> : null}
          {!isLoading && data ? (
            <HistoryAreaChart points={data.points} base={base} quote={quote} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
