import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import styles from './top-bar.module.scss'

interface TopBarProps {
  currencyCount?: number
}

function TopBarSkeleton() {
  return (
    <div className={styles.topBar} aria-busy="true" aria-label="Loading top bar">
      <div className={styles.topBarLeft}>
        <Skeleton className="hidden h-[26px] w-[139px] md:block" />
        <Skeleton className="block h-[20px] w-[107px] md:hidden" />
      </div>
      <div className={styles.topBarRight}>
        <Skeleton className="h-4 w-48 max-md:h-3.5 max-md:w-36" />
      </div>
    </div>
  )
}

export function TopBar({ currencyCount }: TopBarProps) {
  if (!currencyCount) {
    return <TopBarSkeleton />
  }

  return (
    <div className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className="hidden md:block">
          <Image src="/ForexCheckerLogo.svg" alt="Forex Checker Logo" width={139} height={26} />
        </div>
        <div className="block md:hidden">
          <Image src="/ForexCheckerLogo.svg" alt="Forex Checker Logo" width={107} height={20} />
        </div>
      </div>
      <div className={styles.topBarRight}>
        <div className={styles.topBarRightItem}>
          <span>{currencyCount} currencies</span>
          <span> · EOD · ECB DATA</span>
        </div>
      </div>
    </div>
  )
}
