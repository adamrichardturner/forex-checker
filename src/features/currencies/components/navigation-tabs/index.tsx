'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useConversionLogsContext,
  useFavouritePairsContext,
} from '../../persistence/currency-persistence-provider'
import { ConversionHistory } from '../conversion-history'
import { Favourites } from '../favourites'
import { HistoryCharts } from '../history-charts'
import styles from './navigation-tabs.module.scss'

type NavigationTabsProps = {
  base: string
  quote: string
}

function TabBadge({ count }: { count: number }) {
  return <span className={styles.tabBadge}>{count}</span>
}

export function NavigationTabs({ base, quote }: NavigationTabsProps) {
  const { pairs } = useFavouritePairsContext()
  const { logs } = useConversionLogsContext()

  return (
    <Tabs defaultValue="history" className={styles.navigationTabs}>
      <TabsList className={styles.tabsList}>
        <TabsTrigger value="history" className={styles.tabTrigger}>
          History
        </TabsTrigger>
        <TabsTrigger value="compare" className={styles.tabTrigger}>
          Compare
        </TabsTrigger>
        <TabsTrigger value="favourites" className={styles.tabTrigger}>
          Favourites
          <TabBadge count={pairs.length} />
        </TabsTrigger>
        <TabsTrigger value="log" className={styles.tabTrigger}>
          Log
          <TabBadge count={logs.length} />
        </TabsTrigger>
      </TabsList>

      <TabsContent value="history" className={styles.tabContent}>
        <HistoryCharts base={base} quote={quote} />
      </TabsContent>

      <TabsContent value="compare" className={styles.tabContent}>
        <p className={styles.comparePlaceholder}>Compare view coming soon.</p>
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
