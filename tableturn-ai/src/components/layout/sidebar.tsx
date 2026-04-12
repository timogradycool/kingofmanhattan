'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Mail,
  Inbox,
  CalendarDays,
  BarChart3,
  Plug,
  Settings,
  FileText,
  Tag,
  Activity,
  ChevronDown,
  Utensils,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Guests & Contacts',
    items: [
      { name: 'Contacts', href: '/contacts', icon: Users },
      { name: 'Segments', href: '/segments', icon: Tag },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { name: 'Campaigns', href: '/campaigns', icon: Mail },
      { name: 'Templates', href: '/templates', icon: FileText },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { name: 'Leads Inbox', href: '/leads', icon: Inbox },
      { name: 'Private Events', href: '/private-events', icon: CalendarDays },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { name: 'Reports', href: '/reports', icon: BarChart3 },
      { name: 'Activity Log', href: '/activity', icon: Activity },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Integrations', href: '/integrations', icon: Plug },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-zinc-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-zinc-200 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Utensils className="h-4 w-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-bold text-zinc-900">TableTurn</span>
          <span className="text-sm font-bold text-indigo-600"> AI</span>
        </div>
      </div>

      {/* Org selector */}
      <div className="border-b border-zinc-100 px-4 py-3">
        <button className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-zinc-50 transition-colors">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Organization</p>
            <p className="text-sm font-semibold text-zinc-900 truncate max-w-[160px]">The Rosewood Group</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navigation.map((group) => (
          <div key={group.label} className="mb-5">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-indigo-600' : 'text-zinc-400')} />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-zinc-200 p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex-shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-zinc-900 truncate">Jane Doe</p>
            <p className="text-xs text-zinc-400 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
