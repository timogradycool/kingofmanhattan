import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-indigo-100 text-indigo-700',
        secondary: 'border-transparent bg-zinc-100 text-zinc-700',
        destructive: 'border-transparent bg-red-100 text-red-700',
        success: 'border-transparent bg-emerald-100 text-emerald-700',
        warning: 'border-transparent bg-amber-100 text-amber-700',
        outline: 'border-zinc-300 text-zinc-700',
        blue: 'border-transparent bg-blue-100 text-blue-700',
        purple: 'border-transparent bg-purple-100 text-purple-700',
        pink: 'border-transparent bg-pink-100 text-pink-700',
        orange: 'border-transparent bg-orange-100 text-orange-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
