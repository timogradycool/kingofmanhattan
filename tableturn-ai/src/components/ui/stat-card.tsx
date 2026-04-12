import * as React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  trend?: number // percentage change
  trendLabel?: string
  icon?: React.ReactNode
  className?: string
  priority?: 'high' | 'medium' | 'low'
}

export function StatCard({ title, value, description, trend, trendLabel, icon, className, priority = 'medium' }: StatCardProps) {
  const trendColor = trend === undefined ? '' : trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-500' : 'text-zinc-400'
  const TrendIcon = trend === undefined ? null : trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus

  return (
    <div className={cn(
      'rounded-xl border bg-white p-6 shadow-sm',
      priority === 'high' && 'border-indigo-200 bg-gradient-to-br from-white to-indigo-50/30',
      priority === 'medium' && 'border-zinc-200',
      priority === 'low' && 'border-zinc-100',
      className
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-zinc-900">{value}</p>
          {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
          {trend !== undefined && TrendIcon && (
            <div className={cn('mt-2 flex items-center gap-1 text-xs font-medium', trendColor)}>
              <TrendIcon className="h-3.5 w-3.5" />
              <span>{Math.abs(trend)}% {trendLabel || 'vs last period'}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
