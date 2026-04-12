import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, Users, Inbox, CalendarDays, Settings, Plus, RefreshCw, UserPlus, Link2, Tag } from 'lucide-react'

const activityTypes: Record<string, { icon: typeof Mail; color: string; badge: string }> = {
  campaign: { icon: Mail, color: 'text-indigo-500 bg-indigo-50', badge: 'default' },
  contact: { icon: Users, color: 'text-blue-500 bg-blue-50', badge: 'blue' },
  lead: { icon: Inbox, color: 'text-amber-500 bg-amber-50', badge: 'warning' },
  event: { icon: CalendarDays, color: 'text-purple-500 bg-purple-50', badge: 'purple' },
  settings: { icon: Settings, color: 'text-zinc-500 bg-zinc-100', badge: 'secondary' },
  import: { icon: Plus, color: 'text-emerald-500 bg-emerald-50', badge: 'success' },
  segment: { icon: Tag, color: 'text-pink-500 bg-pink-50', badge: 'pink' },
  integration: { icon: Link2, color: 'text-cyan-500 bg-cyan-50', badge: 'blue' },
  user: { icon: UserPlus, color: 'text-violet-500 bg-violet-50', badge: 'purple' },
}

const logs = [
  { id: 1, type: 'campaign', user: 'Jane Doe', action: 'Sent campaign', entity: 'Thursday Happy Hour — Week 2', detail: '1,240 recipients', time: '2 hours ago' },
  { id: 2, type: 'lead', user: 'Marcus Lee', action: 'Updated lead status', entity: 'Sarah Mitchell → Private Dining', detail: 'Status changed: New → Contacted', time: '3 hours ago' },
  { id: 3, type: 'event', user: 'Sofia Garcia', action: 'Marked as Booked', entity: 'Meridian Bank Q2 Executive Dinner', detail: 'Estimated value: $4,500', time: '4 hours ago' },
  { id: 4, type: 'import', user: 'Jane Doe', action: 'Imported contacts', entity: 'Loyalty-Export-March.csv', detail: '231 contacts added', time: '6 hours ago' },
  { id: 5, type: 'campaign', user: 'Marcus Lee', action: 'Created campaign', entity: 'Birthday Club — April', detail: 'Status: Draft', time: '8 hours ago' },
  { id: 6, type: 'segment', user: 'Jane Doe', action: 'Created segment', entity: 'Birthday This Month', detail: '34 contacts matched', time: '1 day ago' },
  { id: 7, type: 'lead', user: 'Sofia Garcia', action: 'Added note', entity: 'Apex Tech Launch', detail: 'Client confirmed AV requirements. Exclusivity is non-negotiable.', time: '1 day ago' },
  { id: 8, type: 'integration', user: 'Jane Doe', action: 'Connected integration', entity: 'Google Workspace / Gmail', detail: 'marketing@rosewood.com', time: '2 days ago' },
  { id: 9, type: 'campaign', user: 'Marcus Lee', action: 'Scheduled campaign', entity: 'Sunday Brunch Push', detail: 'Scheduled for tomorrow 10:00 AM', time: '2 days ago' },
  { id: 10, type: 'contact', user: 'Jane Doe', action: 'Suppressed contact', entity: 'james.wilson@example.com', detail: 'Reason: Bounce', time: '3 days ago' },
  { id: 11, type: 'event', user: 'Sofia Garcia', action: 'Moved to Proposal Sent', entity: 'Apex Tech Launch', detail: 'Proposal emailed to events@apextech.com', time: '3 days ago' },
  { id: 12, type: 'user', user: 'Jane Doe', action: 'Invited team member', entity: 'Kevin Park', detail: 'kevin@rosewood.com · Viewer role', time: '4 days ago' },
  { id: 13, type: 'campaign', user: 'Marcus Lee', action: 'Sent campaign', entity: 'Lapsed Guest Win-Back', detail: '890 recipients · 29% open rate', time: '5 days ago' },
  { id: 14, type: 'segment', user: 'Jane Doe', action: 'Updated segment filters', entity: 'Lapsed Guests', detail: 'Threshold changed to 180 days', time: '5 days ago' },
  { id: 15, type: 'settings', user: 'Jane Doe', action: 'Updated sender identity', entity: 'Email Settings', detail: 'From name: Rosewood Kitchen', time: '6 days ago' },
  { id: 16, type: 'lead', user: 'Sofia Garcia', action: 'Created lead', entity: 'Westside Events Co.', detail: 'Type: Catering · Value: $12,000', time: '1 week ago' },
  { id: 17, type: 'event', user: 'Sofia Garcia', action: 'Created private event inquiry', entity: 'The Harrington Family', detail: 'Wedding Rehearsal Dinner · 60 guests', time: '1 week ago' },
  { id: 18, type: 'campaign', user: 'Marcus Lee', action: 'Created template', entity: 'Holiday Special Preview', detail: 'Category: Seasonal', time: '1 week ago' },
  { id: 19, type: 'contact', user: 'Jane Doe', action: 'Added tag', entity: '47 contacts tagged VIP', detail: 'Tag: VIP applied', time: '2 weeks ago' },
  { id: 20, type: 'import', user: 'Jane Doe', action: 'Imported contacts', entity: 'OpenTable-Export-Feb.csv', detail: '312 contacts imported, 18 skipped', time: '2 weeks ago' },
]

export default function ActivityLogPage() {
  return (
    <>
      <Topbar title="Activity Log" description="Complete audit trail of platform activity" />
      <PageShell>
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-zinc-100 px-4 py-3 flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-500">Showing last {logs.length} activities</p>
              <div className="flex gap-2">
                {['All', 'Campaigns', 'Contacts', 'Leads', 'Events', 'Settings'].map(f => (
                  <button key={f} className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${f === 'All' ? 'bg-indigo-50 text-indigo-700' : 'text-zinc-500 hover:bg-zinc-50'}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-zinc-100">
              {logs.map(log => {
                const typeConfig = activityTypes[log.type]
                const Icon = typeConfig.icon
                return (
                  <div key={log.id} className="flex items-start gap-4 px-4 py-3 hover:bg-zinc-50 transition-colors">
                    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg mt-0.5 ${typeConfig.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-zinc-900">{log.user}</span>
                        <span className="text-sm text-zinc-500">{log.action}</span>
                        <span className="text-sm font-medium text-zinc-800">{log.entity}</span>
                      </div>
                      {log.detail && <p className="text-xs text-zinc-400 mt-0.5">{log.detail}</p>}
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <Badge variant={typeConfig.badge as any}>{log.type}</Badge>
                      <span className="text-xs text-zinc-400 whitespace-nowrap">{log.time}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}
