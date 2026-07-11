
'use client'
import styles from './page.module.scss'
import CurrencyButton from '@/features/currencies/components/currency-button/currency-button'

const DEV_CURRENCIES = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  AED: 'UAE Dirham',
  ARS: 'Argentine Peso',
  AUD: 'Australian Dollar',
  // ... add as many as you want
}

export default function HomePage() {
  return (
    <main className={styles.page}>
      <h1>Forex checker</h1>
      <CurrencyButton selectedCode="USD" currencies={DEV_CURRENCIES} onSelect={(code) => console.log(code)} />
    </main>
  )
}
