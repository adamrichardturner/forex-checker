import type { FC, SVGProps } from 'react'
import * as Flags from 'country-flag-icons/react/1x1'
import { CURRENCY_FLAG_MAP } from '../../../model/currency-flag-map'
import styles from './currency-flag.module.scss'
import { Currency } from '@/features/currencies'

type CurrencyFlagProps = {
  currencyCode: Currency['iso_code'] | null
  className?: string
}

const CurrencyFlag: FC<CurrencyFlagProps> = ({ currencyCode, className }) => {
  const countryCode = currencyCode ? CURRENCY_FLAG_MAP[currencyCode] : null
  const FlagSvg = countryCode
    ? (Flags as Record<string, FC<SVGProps<SVGSVGElement>>>)[countryCode]
    : null

  if (!FlagSvg) {
    return (
      <span className={`${styles.flag}${className ? ` ${className}` : ''}`}>{currencyCode}</span>
    )
  }

  return (
    <span className={`${styles.flag}${className ? ` ${className}` : ''}`}>
      <FlagSvg className={styles.flagSvg} />
    </span>
  )
}

export default CurrencyFlag
