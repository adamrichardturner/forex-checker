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
  currencyMap: Map<Currency['iso_code'], Currency>
  onSelect: (code: Currency['iso_code']) => void
}

const CurrencyButton: FC<CurrencyButtonProps> = ({ selectedCode, currencyMap, onSelect }) => {
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const allCodes: Currency['iso_code'][] = Array.from(currencyMap.keys())

  const popularCodes = POPULAR_CURRENCIES.filter((code) => allCodes.includes(code))
  const otherCodes = allCodes.filter(
    (code) => !(POPULAR_CURRENCIES as readonly string[]).includes(code),
  )

  const matches = (code: string) => {
    const term = search.toLowerCase()
    return (
      code.toLowerCase().includes(term) ||
      (currencyMap.get(code)?.name ?? '').toLowerCase().includes(term)
    )
  }

  const filteredPopular = popularCodes.filter(matches)
  const filteredOther = otherCodes.filter(matches).slice(0, FILTERED_CURRENCIES_LIMIT)
  const filteredOtherCurrenciesCount = otherCodes.length - filteredPopular.length

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
              {filteredPopular.map((code) => (
                <CurrencyItem
                  key={code}
                  currencyMap={currencyMap}
                  currencyCode={code}
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
              {filteredOther.map((code: Currency['iso_code']) => (
                <CurrencyItem
                  key={code}
                  currencyMap={currencyMap}
                  currencyCode={code}
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
  currencyMap: Map<Currency['iso_code'], Currency>
  currencyCode: Currency['iso_code']
  selectedCode: Currency['iso_code'] | null
  onSelectCode: (code: Currency['iso_code']) => void
}

function CurrencyItem({
  currencyMap,
  currencyCode,
  selectedCode,
  onSelectCode,
}: CurrencyItemProps) {
  return (
    <button
      className={`${styles.item}${currencyCode === selectedCode ? ` ${styles.itemSelected}` : ''}`}
      onClick={() => onSelectCode(currencyCode)}
    >
      <CurrencyFlag currencyCode={currencyCode} />
      <span className={styles.itemCode}>{currencyCode}</span>
      <span className={styles.itemLabel}>{currencyMap.get(currencyCode)?.name ?? ''}</span>
      {currencyCode === selectedCode && <Check className={styles.itemCheck} />}
    </button>
  )
}
