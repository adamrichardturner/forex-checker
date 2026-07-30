import styles from './tab-empty-state.module.scss'

type TabEmptyStateProps = {
  title: string
  description: string
}

export function TabEmptyState({ title, description }: TabEmptyStateProps) {
  return (
    <div className={styles.tabEmptyState} role="status">
      <p className={styles.tabEmptyStateTitle}>{title}</p>
      <p className={styles.tabEmptyStateDescription}>{description}</p>
    </div>
  )
}
