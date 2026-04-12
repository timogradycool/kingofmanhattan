'use client'

import { Bell, Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopbarProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function Topbar({ title, description, actions }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">{title}</h1>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        <Button variant="ghost" size="icon" className="text-zinc-400">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
