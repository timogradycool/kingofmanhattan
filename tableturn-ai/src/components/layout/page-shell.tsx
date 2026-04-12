import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageShellProps {
  children: React.ReactNode
  className?: string
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <main className={cn('flex-1 overflow-y-auto bg-zinc-50', className)}>
      <div className="mx-auto max-w-7xl px-6 py-6">{children}</div>
    </main>
  )
}

export function PageHeader({ children, className }: PageShellProps) {
  return <div className={cn('mb-6', className)}>{children}</div>
}

export function PageTitle({ children, className }: PageShellProps) {
  return <h2 className={cn('text-xl font-bold text-zinc-900', className)}>{children}</h2>
}

export function PageDescription({ children, className }: PageShellProps) {
  return <p className={cn('mt-1 text-sm text-zinc-500', className)}>{children}</p>
}
