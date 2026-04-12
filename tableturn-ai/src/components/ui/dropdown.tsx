'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

export function DropdownMenu({ trigger, children, align = 'left', className }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-50 mt-1 min-w-[10rem] rounded-lg border border-zinc-200 bg-white py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export function DropdownItem({
  className,
  children,
  destructive,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { destructive?: boolean }) {
  return (
    <button
      className={cn(
        'flex w-full items-center gap-2 px-3 py-1.5 text-sm transition-colors',
        destructive
          ? 'text-red-600 hover:bg-red-50'
          : 'text-zinc-700 hover:bg-zinc-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function DropdownSeparator() {
  return <div className="my-1 border-t border-zinc-100" />
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-1 text-xs font-semibold text-zinc-400 uppercase tracking-wide">{children}</div>
}
