'use client'

import { useState, type FC } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CurrencyFlag from './currency-flag'
import { POPULAR_CURRENCIES } from '../../model/currency.constants'
import type { Currency } from '../../model/currency.types'
import styles from './currency-button.module.scss'
import { Separator } from '@/components/ui/separator'

const FILTERED_CURRENCIES_LIMIT = 4 as const

type CurrencyButtonProps = {
  selectedCode: Currency['iso_code'] | null
  currencies: Currency[]
  onSelect: (code: Currency['iso_code']) => void
}

const CurrencyButton: FC<CurrencyButtonProps> = ({ selectedCode, currencies, onSelect }) => {
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const popularCurrencies = currencies.filter((currency) =>
    (POPULAR_CURRENCIES as readonly string[]).includes(currency.iso_code),
  )
  const otherCurrencies = currencies.filter(
    (currency) => !(POPULAR_CURRENCIES as readonly string[]).includes(currency.iso_code),
  )

  const matches = (currency: Currency) => {
    const term = search.toLowerCase()
    return (
      currency.iso_code.toLowerCase().includes(term) || currency.name.toLowerCase().includes(term)
    )
  }

  const filteredPopular = popularCurrencies.filter(matches)
  const matchingOther = otherCurrencies.filter(matches)
  const filteredOther = matchingOther.slice(0, FILTERED_CURRENCIES_LIMIT)
  const filteredOtherCurrenciesCount = matchingOther.length

  return (
    <Popover>
      <PopoverTrigger render={<Button className={styles.trigger} />}>
        <CurrencyFlag currencyCode={selectedCode} />
        <span className={styles.triggerCode}>{selectedCode}</span>
        <ChevronDown className={styles.triggerChevron} />
      </PopoverTrigger>
      <PopoverContent className={styles.popover} side="bottom" align="end">
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <Input
            className={styles.searchInput}
            placeholder="Search currencies..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.list}>
          {filteredPopular.length > 0 && (
            <section className={styles.sectionGroup}>
              <p className={styles.sectionHeader}>
                <span>POPULAR</span>
                <span>{filteredPopular.length}</span>
              </p>
              <Separator className={styles.sectionSeparator} />
              {filteredPopular.map((currency) => (
                <CurrencyItem
                  key={currency.iso_code}
                  currency={currency}
                  selectedCode={selectedCode}
                  onSelectCode={onSelect}
                />
              ))}
            </section>
          )}
          {filteredOther.length > 0 && (
            <section className={styles.sectionGroup}>
              <p className={styles.sectionHeader}>
                <span>OTHER CURRENCIES</span>
                <span>{filteredOtherCurrenciesCount}</span>
              </p>
              <Separator className={styles.sectionSeparator} />
              {filteredOther.map((currency) => (
                <CurrencyItem
                  key={currency.iso_code}
                  currency={currency}
                  selectedCode={selectedCode}
                  onSelectCode={onSelect}
                />
              ))}
            </section>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CurrencyButton

interface CurrencyItemProps {
  currency: Currency
  selectedCode: Currency['iso_code'] | null
  onSelectCode: (code: Currency['iso_code']) => void
}

function CurrencyItem({ currency, selectedCode, onSelectCode }: CurrencyItemProps) {
  const isSelected = currency.iso_code === selectedCode

  return (
    <button
      className={`${styles.item}${isSelected ? ` ${styles.itemSelected}` : ''}`}
      onClick={() => onSelectCode(currency.iso_code)}
    >
      <CurrencyFlag currencyCode={currency.iso_code} />
      <span className={styles.itemCode}>{currency.iso_code}</span>
      <span className={styles.itemLabel}>{currency.name}</span>
      {isSelected && <Check className={styles.itemCheck} />}
    </button>
  )
}
