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

type NavigationTabOption = {
  value: NavigationTab
  label: string
  badgeCount?: number
}

function TabBadge({ count }: { count: number }) {
  return <span className={styles.tabBadge}>{count}</span>
}

function isNavigationTab(value: string): value is NavigationTab {
  return value === 'history' || value === 'compare' || value === 'favourites' || value === 'log'
}

export function NavigationTabs({ base, quote, amount, formattedAmount }: NavigationTabsProps) {
  const { pairs } = useFavouritePairsContext()
  const { logs } = useConversionLogsContext()
  const [activeTab, setActiveTab] = useState<NavigationTab>('history')

  const tabOptions: NavigationTabOption[] = [
    { value: 'history', label: 'History' },
    { value: 'compare', label: 'Compare' },
    { value: 'favourites', label: 'Favourites', badgeCount: pairs.length },
    { value: 'log', label: 'Log', badgeCount: logs.length },
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

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className={styles.navigationTabs}>
      <TabsList className={styles.tabsList}>
        {tabOptions.map((option) => (
          <TabsTrigger key={option.value} value={option.value} className={styles.tabTrigger}>
            {option.label}
            {option.badgeCount !== undefined ? <TabBadge count={option.badgeCount} /> : null}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className={styles.mobileDropdown}>
        <DropdownMenu>
          <DropdownMenuTrigger className={styles.mobileTrigger}>
            <span className={styles.mobileTriggerLabel}>
              {activeOption.label}
              {activeOption.badgeCount !== undefined ? (
                <TabBadge count={activeOption.badgeCount} />
              ) : null}
            </span>
            <ChevronDown className={styles.mobileTriggerIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className={styles.mobileMenuContent}>
            <DropdownMenuRadioGroup value={activeTab} onValueChange={handleTabChange}>
              {tabOptions.map((option) => (
                <DropdownMenuRadioItem
                  key={option.value}
                  value={option.value}
                  className={styles.mobileMenuItem}
                >
                  <span className={styles.mobileMenuItemLabel}>
                    {option.label}
                    {option.badgeCount !== undefined ? (
                      <TabBadge count={option.badgeCount} />
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
