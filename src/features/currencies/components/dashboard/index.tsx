'use client'

import { BaseCard } from '@/components/layout/base-card'
import CurrencyButton from '../currency-button/currency-button'
import styles from './dashboard.module.scss'
import { CurrenciesResponse, Currency } from '../../model/currency.types'
import { useState } from 'react'
import { useCurrencies } from '../../hooks/use-currencies'

interface DashboardProps {
  currencies: CurrenciesResponse
}

export function Dashboard({ currencies }: DashboardProps) {
  const { currenciesMap, selectedCurrency, setSelectedCurrency } = useCurrencies({ currencies })

  return (
    <main className={styles.dashboard}>
      <h1>Forex checker</h1>
      <CurrencyButton
        selectedCode={selectedCurrency}
        currencyMap={currenciesMap}
        onSelect={(code) => setSelectedCurrency(code)}
      />
      <BaseCard title="Forex checker" level="level-2">
        <p>Forex checker</p>
      </BaseCard>
    </main>
  )
}
