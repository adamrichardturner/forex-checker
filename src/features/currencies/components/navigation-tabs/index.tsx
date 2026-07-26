'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useConversionLogsContext,
  useFavouritePairsContext,
} from '../../persistence/currency-persistence-provider'
import { Compare } from '../compare'
import { ConversionHistory } from '../conversion-history'
import { Favourites } from '../favourites'
import { HistoryCharts } from '../history-charts'
import styles from './navigation-tabs.module.scss'

type NavigationTab = 'history' | 'compare' | 'favourites' | 'log'

type NavigationTabsProps = {
  base: string
  quote: string
  amount: number
  formattedAmount: string
}

type NavigationTabBadge = {
  count: number
  isReady: boolean
}

type NavigationTabOption = {
  value: NavigationTab
  label: string
  badge?: NavigationTabBadge
}

function TabBadge({ count, isReady }: NavigationTabBadge) {
  return (
    <span className={styles.tabBadge} data-ready={isReady || undefined} aria-hidden={!isReady}>
      {isReady ? count : null}
    </span>
  )
}

function isNavigationTab(value: string): value is NavigationTab {
  return value === 'history' || value === 'compare' || value === 'favourites' || value === 'log'
}

export function NavigationTabs({ base, quote, amount, formattedAmount }: NavigationTabsProps) {
  const { pairs, isLoading: isFavouritesLoading } = useFavouritePairsContext()
  const { logs, isLoading: isLogsLoading } = useConversionLogsContext()
  const [activeTab, setActiveTab] = useState<NavigationTab>('history')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const tabOptions: NavigationTabOption[] = [
    { value: 'history', label: 'History' },
    { value: 'compare', label: 'Compare' },
    {
      value: 'favourites',
      label: 'Favourites',
      badge: {
        count: pairs.length,
        isReady: !isFavouritesLoading,
      },
    },
    {
      value: 'log',
      label: 'Log',
      badge: {
        count: logs.length,
        isReady: !isLogsLoading,
      },
    },
  ]

  let activeOption = tabOptions[0]
  for (const option of tabOptions) {
    if (option.value === activeTab) {
      activeOption = option
      break
    }
  }

  const handleTabChange = (value: string | number | null) => {
    if (typeof value !== 'string' || !isNavigationTab(value)) {
      return
    }

    setActiveTab(value)
  }

  const handleMobileTabChange = (value: string | number | null) => {
    handleTabChange(value)
    setIsMobileMenuOpen(false)
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className={styles.navigationTabs}>
      <TabsList className={styles.tabsList}>
        {tabOptions.map((option) => (
          <TabsTrigger key={option.value} value={option.value} className={styles.tabTrigger}>
            <span className={styles.tabTriggerLabel}>{option.label}</span>
            {option.badge ? (
              <TabBadge count={option.badge.count} isReady={option.badge.isReady} />
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className={styles.mobileDropdown}>
        <DropdownMenu
          open={isMobileMenuOpen}
          onOpenChange={(open) => {
            setIsMobileMenuOpen(open)
          }}
        >
          <DropdownMenuTrigger className={styles.mobileTrigger}>
            <span className={styles.mobileTriggerLabel}>
              <span className={styles.tabTriggerLabel}>{activeOption.label}</span>
              {activeOption.badge ? (
                <TabBadge count={activeOption.badge.count} isReady={activeOption.badge.isReady} />
              ) : null}
            </span>
            <ChevronDown className={styles.mobileTriggerIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={styles.mobileMenuContent}>
            <DropdownMenuRadioGroup value={activeTab} onValueChange={handleMobileTabChange}>
              {tabOptions.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  className={styles.mobileMenuItem}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                  }}
                >
                  <span className={styles.mobileMenuItemLabel}>
                    <span className={styles.tabTriggerLabel}>{option.label}</span>
                    {option.badge ? (
                      <TabBadge count={option.badge.count} isReady={option.badge.isReady} />
                    ) : null}
                  </span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <TabsContent value="history" className={styles.tabContent}>
        <HistoryCharts base={base} quote={quote} />
      </TabsContent>

      <TabsContent value="compare" className={styles.tabContent}>
        <Compare base={base} quote={quote} amount={amount} formattedAmount={formattedAmount} />
      </TabsContent>

      <TabsContent value="favourites" className={styles.tabContent}>
        <Favourites />
      </TabsContent>

      <TabsContent value="log" className={styles.tabContent}>
        <ConversionHistory />
      </TabsContent>
    </Tabs>
  )
}
