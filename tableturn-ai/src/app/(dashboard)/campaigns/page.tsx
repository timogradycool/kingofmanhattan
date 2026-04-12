'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  MoreHorizontal,
  Mail,
  Send,
  Eye,
  Copy,
  Archive,
  Megaphone,
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { DropdownMenu, DropdownItem, DropdownSeparator } from '@/components/ui/dropdown'
import { StatCard } from '@/components/ui/stat-card'

type CampaignStatus = 'draft' | 'scheduled' | 'sent' | 'sending' | 'cancelled'

interface Campaign {
  id: string
  name: string
  status: CampaignStatus
  segment: string
  sent: number | null
  openRate: number | null
  clickRate: number | null
  date: string
  type: string
}

const mockCampaigns: Campaign[] = [
  {
    id: 'c1',
    name: 'Thursday Happy Hour — Week 2',
    status: 'sent',
    segment: 'Happy Hour Regulars',
    sent: 1240,
    openRate: 38,
    clickRate: 6.2,
    date: 'Apr 4, 2025',
    type: 'Promotion',
  },
  {
    id: 'c2',
    name: 'Lapsed Guest Win-Back',
    status: 'sent',
    segment: 'Lapsed 90+ Days',
    sent: 890,
    openRate: 29,
    clickRate: 4.1,
    date: 'Mar 28, 2025',
    type: 'Win-back',
  },
  {
    id: 'c3',
    name: 'Sunday Brunch Push',
    status: 'scheduled',
    segment: 'Brunch Subscribers',
    sent: 1100,
    openRate: null,
    clickRate: null,
    date: 'Apr 13, 2025',
    type: 'Promotion',
  },
  {
    id: 'c4',
    name: 'Birthday Club — April',
    status: 'draft',
    segment: 'Birthday This Month',
    sent: 0,
    openRate: null,
    clickRate: null,
    date: 'Apr 10, 2025',
    type: 'Birthday',
  },
  {
    id: 'c5',
    name: 'Private Events Spring',
    status: 'sent',
    segment: 'Private Events Interest',
    sent: 340,
    openRate: 41,
    clickRate: 8.9,
    date: 'Mar 15, 2025',
    type: 'Private Event',
  },
  {
    id: 'c6',
    name: 'Weeknight Dinner Special',
    status: 'sent',
    segment: 'All Subscribed',
    sent: 2100,
    openRate: 33,
    clickRate: 5.4,
    date: 'Mar 8, 2025',
    type: 'Seasonal',
  },
]

const statusVariants: Record<CampaignStatus, 'secondary' | 'blue' | 'success' | 'warning' | 'destructive'> = {
  draft: 'secondary',
  scheduled: 'blue',
  sent: 'success',
  sending: 'warning',
  cancelled: 'destructive',
}

const statusLabels: Record<CampaignStatus, string> = {
  draft: 'Draft',
  scheduled: 'Scheduled',
  sent: 'Sent',
  sending: 'Sending',
  cancelled: 'Cancelled',
}

type FilterTab = 'all' | CampaignStatus

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'sent', label: 'Sent' },
]

function formatRate(rate: number | null): string {
  if (rate === null) return '—'
  return `${rate}%`
}

function formatSent(sent: number | null): string {
  if (sent === null || sent === 0) return '—'
  return sent.toLocaleString()
}

export default function CampaignsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const sentCampaigns = mockCampaigns.filter(c => c.status === 'sent')
  const totalSent = sentCampaigns.reduce((sum, c) => sum + (c.sent ?? 0), 0)
  const avgOpenRate =
    sentCampaigns.length > 0
      ? Math.round(
          sentCampaigns.reduce((sum, c) => sum + (c.openRate ?? 0), 0) /
            sentCampaigns.length
        )
      : 0
  const avgClickRate =
    sentCampaigns.length > 0
      ? (
          sentCampaigns.reduce((sum, c) => sum + (c.clickRate ?? 0), 0) /
          sentCampaigns.length
        ).toFixed(1)
      : '0'

  const filtered =
    activeTab === 'all'
      ? mockCampaigns
      : mockCampaigns.filter(c => c.status === activeTab)

  return (
    <>
      <Topbar
        title="Campaigns"
        description="Create and manage email marketing campaigns"
        actions={
          <Link href="/campaigns/new">
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" />
              New Campaign
            </Button>
          </Link>
        }
      />
      <PageShell>
        {/* Stats row */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            title="Total Sent"
            value={totalSent.toLocaleString()}
            icon={<Send className="h-4 w-4" />}
            description="Across all sent campaigns"
          />
          <StatCard
            title="Avg Open Rate"
            value={`${avgOpenRate}%`}
            icon={<Mail className="h-4 w-4" />}
            trend={4}
            trendLabel="vs last month"
          />
          <StatCard
            title="Avg Click Rate"
            value={`${avgClickRate}%`}
            icon={<Eye className="h-4 w-4" />}
            trend={1}
            trendLabel="vs last month"
          />
          <StatCard
            title="Total Campaigns"
            value={mockCampaigns.length}
            icon={<Megaphone className="h-4 w-4" />}
            description={`${sentCampaigns.length} sent`}
          />
        </div>

        {/* Filter tabs */}
        <div className="mb-4 flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 w-fit">
          {filterTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={
                activeTab === tab.key
                  ? 'rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors'
                  : 'rounded-md px-4 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors'
              }
            >
              {tab.label}
              <span
                className={
                  activeTab === tab.key
                    ? 'ml-1.5 rounded-full bg-white/20 px-1.5 py-0.5 text-xs'
                    : 'ml-1.5 rounded-full bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-400'
                }
              >
                {tab.key === 'all'
                  ? mockCampaigns.length
                  : mockCampaigns.filter(c => c.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience / Segment</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Date</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center">
                    <EmptyState
                      icon={<Megaphone className="h-6 w-6" />}
                      title="No campaigns found"
                      description="Create your first campaign to start reaching your guests."
                    />
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(campaign => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/campaigns/${campaign.id}`}
                          className="font-medium text-zinc-900 hover:text-indigo-600 transition-colors"
                        >
                          {campaign.name}
                        </Link>
                        <p className="text-xs text-zinc-400 mt-0.5">{campaign.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[campaign.status]}>
                        {statusLabels[campaign.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-600">{campaign.segment}</TableCell>
                    <TableCell className="font-medium text-zinc-900">
                      {formatSent(campaign.sent)}
                    </TableCell>
                    <TableCell className="font-medium text-zinc-900">
                      {formatRate(campaign.openRate)}
                    </TableCell>
                    <TableCell className="font-medium text-zinc-900">
                      {formatRate(campaign.clickRate)}
                    </TableCell>
                    <TableCell className="text-zinc-500">{campaign.date}</TableCell>
                    <TableCell>
                      <DropdownMenu
                        align="right"
                        trigger={
                          <Button variant="ghost" size="icon-sm" className="text-zinc-400">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      >
                        <DropdownItem>
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </DropdownItem>
                        <DropdownItem>
                          <Copy className="h-3.5 w-3.5" />
                          Duplicate
                        </DropdownItem>
                        <DropdownSeparator />
                        <DropdownItem destructive>
                          <Archive className="h-3.5 w-3.5" />
                          Archive
                        </DropdownItem>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Footer count */}
        <div className="mt-4 text-sm text-zinc-500">
          Showing {filtered.length} of {mockCampaigns.length} campaigns
        </div>
      </PageShell>
    </>
  )
}
