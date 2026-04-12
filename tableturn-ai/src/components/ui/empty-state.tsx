import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-zinc-500 max-w-sm">{description}</p>}
      {action && (
        <Button className="mt-4" onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  )
}
