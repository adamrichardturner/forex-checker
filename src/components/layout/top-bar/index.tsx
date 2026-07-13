import styles from './top-bar.module.scss'
import Image from 'next/image'

interface TopBarProps {
  currencyCount: number
}

export function TopBar({ currencyCount }: TopBarProps) {
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
          <span className={styles.topBarRightItemText}>{currencyCount} currencies</span>
          <span className={styles.topBarRightItemText}> · EOD · ECB DATA</span>
        </div>
      </div>
    </div>
  )
}
