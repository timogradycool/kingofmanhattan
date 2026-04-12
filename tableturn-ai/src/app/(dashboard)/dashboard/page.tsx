import {
  Users, Mail, Inbox, CalendarDays, TrendingUp,
  DollarSign, ArrowRight, Zap, Target, Clock
} from 'lucide-react'
import Link from 'next/link'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock data for the dashboard
const stats = [
  { title: 'Reservations Attributed', value: '142', trend: 18, description: 'This month', priority: 'high' as const, icon: <Target className="h-5 w-5" /> },
  { title: 'Private Event Inquiries', value: '23', trend: 31, description: 'This month', priority: 'high' as const, icon: <CalendarDays className="h-5 w-5" /> },
  { title: 'Campaign Revenue Est.', value: '$18,400', trend: 12, description: 'From attributed outcomes', priority: 'high' as const, icon: <DollarSign className="h-5 w-5" /> },
  { title: 'Total Contacts', value: '3,847', trend: 5, description: 'Active subscribers', priority: 'medium' as const, icon: <Users className="h-5 w-5" /> },
  { title: 'Campaigns Sent', value: '8', trend: -2, description: 'Last 30 days', priority: 'medium' as const, icon: <Mail className="h-5 w-5" /> },
  { title: 'Open Leads', value: '34', trend: 9, description: 'Needing follow-up', priority: 'medium' as const, icon: <Inbox className="h-5 w-5" /> },
]

const recentCampaigns = [
  { name: 'Thursday Happy Hour Push', status: 'sent', sent: 1240, opens: '38%', clicks: '6.2%', date: '2 days ago' },
  { name: 'Lapsed Guest Win-Back', status: 'sent', sent: 890, opens: '29%', clicks: '4.1%', date: '5 days ago' },
  { name: 'Sunday Brunch Promo', status: 'scheduled', sent: 1100, opens: '—', clicks: '—', date: 'Tomorrow 10am' },
  { name: 'Birthday Club — April', status: 'draft', sent: 0, opens: '—', clicks: '—', date: 'Draft' },
]

const recentLeads = [
  { name: 'Sarah Mitchell', type: 'Private Dining', status: 'new', value: '$4,200', time: '2h ago' },
  { name: 'Marcus & Co.', type: 'Corporate Dinner', status: 'contacted', value: '$3,800', time: '4h ago' },
  { name: 'Jennifer Park', type: 'Birthday Dinner', status: 'engaged', value: '$600', time: '1d ago' },
  { name: 'Westside Events', type: 'Catering', status: 'new', value: '$12,000', time: '1d ago' },
]

const topPerformingContent = [
  { theme: 'Private Events', metric: 'Saves', value: '2,341', trend: '+28%' },
  { theme: 'Chef/Personality', metric: 'Shares', value: '1,892', trend: '+19%' },
  { theme: 'Food Beauty Shot', metric: 'Reaches', value: '48,200', trend: '+11%' },
  { theme: 'Cocktails', metric: 'Profile Visits', value: '3,104', trend: '+22%' },
]

const statusColors: Record<string, string> = {
  sent: 'success',
  scheduled: 'blue',
  draft: 'secondary',
  new: 'warning',
  contacted: 'blue',
  engaged: 'purple',
  booked: 'success',
}

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="Dashboard"
        description="Good morning — here's how your restaurant marketing is performing."
        actions={
          <Button size="sm">
            <Zap className="h-3.5 w-3.5" />
            Quick Campaign
          </Button>
        }
      />
      <PageShell>
        {/* Tier 1: Business outcome metrics */}
        <div className="mb-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Business Outcomes</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.slice(0, 3).map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>

        {/* Tier 2: Supporting metrics */}
        <div className="mt-4 mb-6">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Activity</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.slice(3).map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* Campaigns */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Email campaign performance</CardDescription>
              </div>
              <Link href="/campaigns">
                <Button variant="ghost" size="sm" className="text-indigo-600 -mr-2">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCampaigns.map((c) => (
                  <div key={c.name} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{c.name}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{c.date}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      {c.status === 'sent' && (
                        <>
                          <span>{c.sent.toLocaleString()} sent</span>
                          <span className="text-emerald-600 font-medium">{c.opens} open</span>
                        </>
                      )}
                      <Badge variant={statusColors[c.status] as any}>{c.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leads */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent Leads</CardTitle>
                <CardDescription>New inquiries needing follow-up</CardDescription>
              </div>
              <Link href="/leads">
                <Button variant="ghost" size="sm" className="text-indigo-600 -mr-2">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.name} className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex-shrink-0">
                      {lead.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">{lead.name}</p>
                      <p className="text-xs text-zinc-400">{lead.type}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-zinc-700">{lead.value}</span>
                      <Badge variant={statusColors[lead.status] as any}>{lead.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content performance */}
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Top Content Themes</CardTitle>
                <CardDescription>Organic social performance by theme</CardDescription>
              </div>
              <Link href="/reports">
                <Button variant="ghost" size="sm" className="text-indigo-600 -mr-2">
                  Full report <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformingContent.map((item, i) => (
                  <div key={item.theme} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold text-zinc-400 bg-zinc-100 flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-zinc-900">{item.theme}</span>
                        <span className="text-xs text-emerald-600 font-semibold">{item.trend}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">{item.metric}</span>
                        <span className="text-xs font-semibold text-zinc-700">{item.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to keep revenue flowing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Import Contacts', href: '/contacts/import', icon: Users, color: 'bg-blue-50 text-blue-700' },
                  { label: 'New Campaign', href: '/campaigns/new', icon: Mail, color: 'bg-indigo-50 text-indigo-700' },
                  { label: 'Add Lead', href: '/leads', icon: Inbox, color: 'bg-amber-50 text-amber-700' },
                  { label: 'New Inquiry', href: '/private-events', icon: CalendarDays, color: 'bg-purple-50 text-purple-700' },
                  { label: 'View Reports', href: '/reports', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-700' },
                  { label: 'Integrations', href: '/integrations', icon: Clock, color: 'bg-rose-50 text-rose-700' },
                ].map((action) => (
                  <Link key={action.label} href={action.href}>
                    <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3 hover:border-zinc-200 hover:bg-zinc-50 transition-colors cursor-pointer">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${action.color} flex-shrink-0`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-zinc-800">{action.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insight Banner */}
        <div className="mt-6 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 flex-shrink-0">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-indigo-900">AI Insight</p>
              <p className="mt-0.5 text-sm text-indigo-700">
                Your Thursday happy hour campaigns have a 34% higher open rate than weekday average. Consider scheduling a follow-up for lapsed guests who didn't open the last send. Estimated reach: 312 contacts.
              </p>
            </div>
            <Button size="sm" variant="outline" className="flex-shrink-0 border-indigo-300 text-indigo-700 hover:bg-indigo-100">
              Create Campaign
            </Button>
          </div>
        </div>
      </PageShell>
    </>
  )
}
