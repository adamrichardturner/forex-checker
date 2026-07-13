import type { FC, SVGProps } from 'react'
import * as Flags from 'country-flag-icons/react/1x1'
import { CURRENCY_FLAG_MAP } from '../../../model/currency-flag-map'
import styles from './currency-flag.module.scss'

type CurrencyFlagProps = {
  currencyCode: string
  className?: string
}

const CurrencyFlag: FC<CurrencyFlagProps> = ({ currencyCode, className }) => {
  const countryCode = CURRENCY_FLAG_MAP[currencyCode]
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
