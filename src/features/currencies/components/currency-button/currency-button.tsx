'use client'

import { useRef, useState, type ChangeEvent, type FC } from 'react'
import { Search, ChevronDown, Check, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useMediaQuery } from '@/hooks/use-media-query'
import CurrencyFlag from './currency-flag'
import { POPULAR_CURRENCIES } from '../../model/currency.constants'
import type { Currency } from '../../model/currency.types'
import styles from './currency-button.module.scss'

const FILTERED_CURRENCIES_LIMIT = 4 as const
const SEARCH_MAX_LENGTH = 40 as const

/** Matches the `md` breakpoint the rate checker uses to stack its panels. */
const MOBILE_QUERY = '(max-width: 767px)'

type CurrencyButtonProps = {
  selectedCode: Currency['iso_code'] | null
  disabledCode?: Currency['iso_code'] | null
  currencies: Currency[]
  onSelect: (code: Currency['iso_code']) => void
}

const CurrencyButton: FC<CurrencyButtonProps> = ({
  selectedCode,
  disabledCode = null,
  currencies,
  onSelect,
}) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const dialogTitleRef = useRef<HTMLHeadingElement>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)

    if (nextOpen) {
      return
    }

    setSearch('')
  }

  const handleSelectCode = (code: Currency['iso_code']) => {
    onSelect(code)
    setOpen(false)
    setSearch('')
  }

  const triggerContent = (
    <>
      <CurrencyFlag currencyCode={selectedCode} />
      <span className={styles.triggerCode}>{selectedCode}</span>
      <ChevronDown className={styles.triggerChevron} />
    </>
  )

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger render={<Button className={styles.trigger} />}>
          {triggerContent}
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          // Focus the heading rather than the search field so the on-screen
          // keyboard does not cover the list as soon as the dialog opens.
          initialFocus={dialogTitleRef}
          className={`top-0 left-0 flex h-dvh w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-0 ring-0 sm:max-w-none ${styles.dialog}`}
        >
          <div className={styles.dialogHeader}>
            <DialogTitle ref={dialogTitleRef} tabIndex={-1} className={styles.dialogTitle}>
              Select currency
            </DialogTitle>
            <DialogDescription className="sr-only">
              Search for a currency or choose one from the list.
            </DialogDescription>
            <DialogClose
              render={<Button variant="ghost" className={styles.dialogClose} />}
              aria-label="Close currency selector"
            >
              <X />
            </DialogClose>
          </div>
          <CurrencyPicker
            variant="dialog"
            search={search}
            onSearchChange={setSearch}
            currencies={currencies}
            selectedCode={selectedCode}
            disabledCode={disabledCode}
            onSelectCode={handleSelectCode}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={<Button className={styles.trigger} />}>
        {triggerContent}
      </PopoverTrigger>
      <PopoverContent className={styles.popover} side="bottom" align="end">
        <CurrencyPicker
          variant="popover"
          search={search}
          onSearchChange={setSearch}
          currencies={currencies}
          selectedCode={selectedCode}
          disabledCode={disabledCode}
          onSelectCode={handleSelectCode}
        />
      </PopoverContent>
    </Popover>
  )
}

export default CurrencyButton

interface CurrencyPickerProps {
  variant: 'popover' | 'dialog'
  search: string
  onSearchChange: (search: string) => void
  currencies: Currency[]
  selectedCode: Currency['iso_code'] | null
  disabledCode: Currency['iso_code'] | null
  onSelectCode: (code: Currency['iso_code']) => void
}

function CurrencyPicker({
  variant,
  search,
  onSearchChange,
  currencies,
  selectedCode,
  disabledCode,
  onSelectCode,
}: CurrencyPickerProps) {
  const isDialog = variant === 'dialog'

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value)
  }

  const popularCodes = POPULAR_CURRENCIES as readonly string[]
  const term = search.trim().toLowerCase()

  const matches = (currency: Currency) =>
    currency.iso_code.toLowerCase().includes(term) || currency.name.toLowerCase().includes(term)

  const filteredPopular = currencies.filter(
    (currency) => popularCodes.includes(currency.iso_code) && matches(currency),
  )
  const matchingOther = currencies.filter(
    (currency) => !popularCodes.includes(currency.iso_code) && matches(currency),
  )
  // The popover is a compact dropdown, so it previews a few matches; the
  // full-screen dialog has room to scroll the whole list.
  const filteredOther = isDialog ? matchingOther : matchingOther.slice(0, FILTERED_CURRENCIES_LIMIT)
  const hasResults = filteredPopular.length > 0 || matchingOther.length > 0

  const sections = [
    { title: 'POPULAR', count: filteredPopular.length, items: filteredPopular },
    { title: 'OTHER CURRENCIES', count: matchingOther.length, items: filteredOther },
  ]

  return (
    <>
      <div className={isDialog ? styles.dialogSearch : undefined}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} />
          <Input
            className={styles.searchInput}
            type="search"
            placeholder="Search currencies..."
            aria-label="Search currencies"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="search"
            maxLength={SEARCH_MAX_LENGTH}
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className={isDialog ? `${styles.list} ${styles.dialogList}` : styles.list}>
        {sections.map(
          (section) =>
            section.items.length > 0 && (
              <section key={section.title} className={styles.sectionGroup}>
                <p className={styles.sectionHeader}>
                  <span>{section.title}</span>
                  <span>{section.count}</span>
                </p>
                <Separator className={styles.sectionSeparator} />
                {section.items.map((currency) => (
                  <CurrencyItem
                    key={currency.iso_code}
                    currency={currency}
                    selectedCode={selectedCode}
                    disabledCode={disabledCode}
                    onSelectCode={onSelectCode}
                  />
                ))}
              </section>
            ),
        )}
        {!hasResults && (
          <p className={styles.empty} role="status">
            No currencies match &ldquo;{search.trim()}&rdquo;
          </p>
        )}
      </div>
    </>
  )
}

interface CurrencyItemProps {
  currency: Currency
  selectedCode: Currency['iso_code'] | null
  disabledCode: Currency['iso_code'] | null
  onSelectCode: (code: Currency['iso_code']) => void
}

function CurrencyItem({ currency, selectedCode, disabledCode, onSelectCode }: CurrencyItemProps) {
  const isSelected = currency.iso_code === selectedCode
  const isDisabled = currency.iso_code === disabledCode

  const itemClassName = [
    styles.item,
    isSelected ? styles.itemSelected : null,
    isDisabled ? styles.itemDisabled : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type="button"
      className={itemClassName}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-current={isSelected || undefined}
      onClick={() => {
        if (isDisabled) {
          return
        }

        onSelectCode(currency.iso_code)
      }}
    >
      <CurrencyFlag currencyCode={currency.iso_code} />
      <span className={styles.itemCode}>{currency.iso_code}</span>
      <span className={styles.itemLabel}>{currency.name}</span>
      {isSelected && <Check className={styles.itemCheck} />}
    </button>
  )
}
