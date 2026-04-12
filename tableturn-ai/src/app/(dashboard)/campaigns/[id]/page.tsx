'use client'

import Link from 'next/link'
import { ArrowLeft, Copy, Users, TrendingUp, MousePointerClick, UserMinus } from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar } from '@/components/ui/avatar'

const campaign = {
  id: '1',
  name: 'Thursday Happy Hour — Week 2',
  status: 'SENT',
  subject: 'Tonight only: Half-price cocktails at Rosewood 🍸',
  fromName: 'Rosewood Kitchen',
  fromEmail: 'hello@rosewood.com',
  sentAt: 'March 6, 2025 at 2:00 PM',
  segment: 'VIP Guests',
  totalSent: 1240,
  totalOpened: 471,
  totalClicked: 77,
  totalBounced: 8,
  totalUnsubscribed: 3,
}

const recipients = [
  { name: 'Sarah Mitchell', email: 'sarah@example.com', status: 'clicked', time: 'Mar 6, 2:12 PM' },
  { name: 'Jennifer Park', email: 'jen.park@example.com', status: 'opened', time: 'Mar 6, 2:34 PM' },
  { name: 'David Kim', email: 'dkim@example.com', status: 'clicked', time: 'Mar 6, 3:01 PM' },
  { name: 'Amanda Torres', email: 'amanda.t@example.com', status: 'opened', time: 'Mar 6, 4:15 PM' },
  { name: 'Robert Chen', email: 'rchen@example.com', status: 'sent', time: 'Mar 6, 2:00 PM' },
  { name: 'Lisa Thompson', email: 'lisa.t@example.com', status: 'bounced', time: 'Mar 6, 2:00 PM' },
]

const statusColors: Record<string, string> = {
  clicked: 'success', opened: 'blue', sent: 'secondary', bounced: 'destructive', unsubscribed: 'warning',
}

const openRate = Math.round((campaign.totalOpened / campaign.totalSent) * 100)
const clickRate = Math.round((campaign.totalClicked / campaign.totalSent) * 100)

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Topbar
        title="Campaign Results"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Copy className="h-3.5 w-3.5" /> Duplicate</Button>
          </div>
        }
      />
      <PageShell>
        <Link href="/campaigns" className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Campaigns
        </Link>

        <div className="mt-4 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">{campaign.name}</h2>
              <p className="text-sm text-zinc-500 mt-1">Sent {campaign.sentAt} · To: {campaign.segment}</p>
            </div>
            <Badge variant="success">Sent</Badge>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Delivered', value: campaign.totalSent.toLocaleString(), icon: Users, color: 'text-zinc-600' },
              { label: 'Open Rate', value: `${openRate}%`, icon: TrendingUp, color: 'text-blue-600' },
              { label: 'Click Rate', value: `${clickRate}%`, icon: MousePointerClick, color: 'text-emerald-600' },
              { label: 'Unsubscribes', value: campaign.totalUnsubscribed, icon: UserMinus, color: 'text-red-500' },
            ].map(m => (
              <div key={m.label} className="rounded-xl border border-zinc-200 bg-white p-5">
                <m.icon className={`h-5 w-5 ${m.color} mb-2`} />
                <p className="text-2xl font-bold text-zinc-900">{m.value}</p>
                <p className="text-xs text-zinc-400 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Visual bar */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>Out of {campaign.totalSent.toLocaleString()} delivered</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Opened', count: campaign.totalOpened, color: 'bg-blue-500' },
                  { label: 'Clicked', count: campaign.totalClicked, color: 'bg-emerald-500' },
                  { label: 'Bounced', count: campaign.totalBounced, color: 'bg-red-400' },
                  { label: 'Unsubscribed', count: campaign.totalUnsubscribed, color: 'bg-amber-400' },
                ].map(bar => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-zinc-500 font-medium">{bar.label}</span>
                    <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bar.color}`}
                        style={{ width: `${Math.max(2, (bar.count / campaign.totalSent) * 100)}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-xs font-semibold text-zinc-700">{bar.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campaign details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: 'Subject Line', value: campaign.subject },
              { label: 'From', value: `${campaign.fromName} <${campaign.fromEmail}>` },
              { label: 'Segment', value: campaign.segment },
            ].map(d => (
              <div key={d.label} className="rounded-lg border border-zinc-200 bg-white p-4">
                <p className="text-xs text-zinc-400 font-medium mb-1">{d.label}</p>
                <p className="text-sm text-zinc-800">{d.value}</p>
              </div>
            ))}
          </div>

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle>Recipients</CardTitle>
              <CardDescription>Showing first {recipients.length} of {campaign.totalSent.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map(r => (
                    <TableRow key={r.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={r.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-zinc-900">{r.name}</p>
                            <p className="text-xs text-zinc-400">{r.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={statusColors[r.status] as any}>{r.status}</Badge></TableCell>
                      <TableCell className="text-zinc-500">{r.time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </>
  )
}
