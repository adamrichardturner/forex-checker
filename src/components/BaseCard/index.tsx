import { Card, CardContent, CardHeader, CardTitle, type CardLevel } from '@/components/ui/card'
import styles from './base-card.module.scss'

interface BaseCardProps {
  title?: string
  children?: React.ReactNode
  level?: CardLevel
}

export function BaseCard({ title, children, level = 'level-1' }: BaseCardProps) {
  return (
    <Card size="default" level={level} className={styles.card}>
      <CardHeader>
        <CardTitle className={styles.cardTitle}>{title}</CardTitle>
      </CardHeader>
      <CardContent className={styles.cardContent}>{children}</CardContent>
    </Card>
  )
}
