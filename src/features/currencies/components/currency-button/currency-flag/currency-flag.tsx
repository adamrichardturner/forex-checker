import type { FC } from 'react'
import { CURRENCY_FLAG_MAP } from '../../../model/currency-flag-map'
import styles from './currency-flag.module.scss'

type CurrencyFlagProps = {
  currencyCode: string
  className?: string
}

const CurrencyFlag: FC<CurrencyFlagProps> = ({ currencyCode, className }) => {
  const countryCode = CURRENCY_FLAG_MAP[currencyCode]

  return (
    <span className={`${styles.flag}${className ? ` ${className}` : ''}`}>
      {countryCode ?? currencyCode}
    </span>
  )
}

export default CurrencyFlag
