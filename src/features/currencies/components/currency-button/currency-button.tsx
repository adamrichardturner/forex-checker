'use client'

import { useState, type FC } from 'react'
import { Search, ChevronDown, Check } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CurrencyFlag from './currency-flag'
import { POPULAR_CURRENCIES } from '../../model/currency.constants'
import type { CurrenciesResponse } from '../../model/currency.types'
import styles from './currency-button.module.scss'

type CurrencyButtonProps = {
  selectedCode: string
  currencies: CurrenciesResponse
  onSelect: (code: string) => void
}

const CurrencyButton: FC<CurrencyButtonProps> = ({ selectedCode, currencies, onSelect }) => {
  const [search, setSearch] = useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const allCodes = Object.keys(currencies)
  const popularCodes = POPULAR_CURRENCIES.filter((code) => allCodes.includes(code))
  const otherCodes = allCodes.filter(
    (code) => !(POPULAR_CURRENCIES as readonly string[]).includes(code),
  )

  const matches = (code: string) => {
    const term = search.toLowerCase()
    return (
      code.toLowerCase().includes(term) || (currencies[code] ?? '').toLowerCase().includes(term)
    )
  }

  const filteredPopular = popularCodes.filter(matches)
  const filteredOther = otherCodes.filter(matches)

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
            <section>
              <p className={styles.sectionHeader}>
                <span>POPULAR</span>
                <span>{filteredPopular.length}</span>
              </p>
              {filteredPopular.map((code) => (
                <CurrencyItem
                  key={code}
                  currencies={currencies}
                  currencyCode={code}
                  selectedCode={selectedCode}
                  onSelectCode={onSelect}
                />
              ))}
            </section>
          )}
          {filteredOther.length > 0 && (
            <section>
              <p className={styles.sectionHeader}>
                <span>OTHER CURRENCIES</span>
                <span>{filteredOther.length}</span>
              </p>
              {filteredOther.map((code) => (
                <CurrencyItem
                  key={code}
                  currencies={currencies}
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
  currencies: CurrenciesResponse
  currencyCode: string
  selectedCode: string
  onSelectCode: (code: string) => void
}

function CurrencyItem({ currencies, currencyCode, selectedCode, onSelectCode }: CurrencyItemProps) {
  return (
    <button
      className={`${styles.item}${currencyCode === selectedCode ? ` ${styles.itemSelected}` : ''}`}
      onClick={() => onSelectCode(currencyCode)}
    >
      <CurrencyFlag currencyCode={currencyCode} />
      <span className={styles.itemCode}>{currencyCode}</span>
      <span className={styles.itemLabel}>{currencies[currencyCode]}</span>
      {currencyCode === selectedCode && <Check className={styles.itemCheck} />}
    </button>
  )
}
