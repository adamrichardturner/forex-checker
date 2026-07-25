import { Card, CardContent, CardHeader, CardTitle, type CardLevel } from '@/components/ui/card'
import styles from './base-card.module.scss'
import { cn } from '@/lib/utils'

interface BaseCardProps {
  title?: string
  children?: React.ReactNode
  level?: CardLevel
  className?: string
}

export function BaseCard({ title, children, level = 'level-1', className }: BaseCardProps) {
  return (
    <Card size="default" level={level} className={cn(styles.card, className)}>
      {title && (
        <CardHeader>
          <CardTitle className={styles.cardTitle}>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={styles.cardContent}>{children}</CardContent>
    </Card>
  )
}
