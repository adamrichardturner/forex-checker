'use client'

import type { FC } from 'react'
import styles from './currency-button.module.scss'

type CurrencyButtonProps = {
  currencyCode: string
  label: string
  onClick?: () => void
}

const CurrencyButton: FC<CurrencyButtonProps> = ({ currencyCode, label, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <span>{currencyCode}</span>
      <span>{label}</span>
    </button>
  )
}

export default CurrencyButton
