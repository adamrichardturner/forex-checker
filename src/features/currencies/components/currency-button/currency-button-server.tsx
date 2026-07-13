import type { FC } from 'react'

type CurrencyButtonServerProps = {
  currencyCode: string
  label: string
}

const CurrencyButtonServer: FC<CurrencyButtonServerProps> = ({ currencyCode, label }) => {
  return (
    <div>
      <span>{currencyCode}</span>
      <span>{label}</span>
    </div>
  )
}

export default CurrencyButtonServer
