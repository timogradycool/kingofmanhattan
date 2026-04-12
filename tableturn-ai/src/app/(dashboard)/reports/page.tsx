'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  MousePointerClick,
  Users,
  Bookmark,
  Mail,
  BarChart2,
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DateRange = '7d' | '30d' | '90d' | 'custom'
type ReportTab = 'overview' | 'paid-social' | 'organic' | 'attribution'

interface CampaignRow {
  id: string
  name: string
  sent: number
  openRate: number
  clickRate: number
  reservationClicks: number
  attribution: number
}

const mockCampaigns: CampaignRow[] = [
  {
    id: 'c1',
    name: 'Thursday Happy Hour — Week 2',
    sent: 1240,
    openRate: 38.2,
    clickRate: 6.2,
    reservationClicks: 98,
    attribution: 24,
  },
  {
    id: 'c2',
    name: 'Lapsed Guest Win-Back',
    sent: 890,
    openRate: 29.1,
    clickRate: 4.1,
    reservationClicks: 64,
    attribution: 18,
  },
  {
    id: 'c3',
    name: 'Private Events Spring',
    sent: 340,
    openRate: 41.4,
    clickRate: 8.9,
    reservationClicks: 42,
    attribution: 31,
  },
  {
    id: 'c4',
    name: 'Weeknight Dinner Special',
    sent: 2100,
    openRate: 33.0,
    clickRate: 5.4,
    reservationClicks: 187,
    attribution: 47,
  },
  {
    id: 'c5',
    name: 'Birthday Club — March',
    sent: 320,
    openRate: 52.8,
    clickRate: 11.3,
    reservationClicks: 78,
    attribution: 22,
  },
]

const attributionSources = [
  { label: 'Meta Ads', pct: 42, color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-50' },
  { label: 'Instagram Organic', pct: 28, color: 'bg-pink-500', textColor: 'text-pink-700', bgLight: 'bg-pink-50' },
  { label: 'Email', pct: 18, color: 'bg-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50' },
  { label: 'Google', pct: 12, color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50' },
]

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom range' },
]

const reportTabs: { key: ReportTab; label: string; href: string }[] = [
  { key: 'overview', label: 'Overview', href: '/reports' },
  { key: 'paid-social', label: 'Paid Social', href: '/reports/paid-social' },
  { key: 'organic', label: 'Organic Social', href: '/reports/organic' },
  { key: 'attribution', label: 'Attribution', href: '/reports/attribution' },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  return (
    <>
      <Topbar
        title="Reports"
        description="Performance insights across all marketing channels"
        actions={
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-zinc-400" />
            <Select
              value={dateRange}
              onChange={e => setDateRange(e.target.value as DateRange)}
              className="w-40"
            >
              {dateRangeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        }
      />
      <PageShell>
        {/* Nav tabs */}
        <div className="mb-6 flex items-center gap-1 rounded-lg border border-zinc-200 bg-white p-1 w-fit">
          {reportTabs.map(tab => (
            tab.key === 'overview' ? (
              <button
                key={tab.key}
                className="rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors"
              >
                {tab.label}
              </button>
            ) : (
              <Link
                key={tab.key}
                href={tab.href}
                className="rounded-md px-4 py-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                {tab.label}
              </Link>
            )
          ))}
        </div>

        {/* Tier 1 — Business Outcome Stats */}
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Business Outcomes
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
            <StatCard
              title="Reservations Attributed"
              value="142"
              trend={18}
              trendLabel="vs last period"
              priority="high"
              icon={<Users className="h-4 w-4" />}
              description="Driven by marketing activity"
            />
            <StatCard
              title="Private Event Inquiries"
              value="23"
              trend={31}
              trendLabel="vs last period"
              priority="high"
              icon={<BarChart2 className="h-4 w-4" />}
              description="Form submissions + direct"
            />
            <StatCard
              title="Est. Campaign Revenue"
              value="$18,400"
              trend={12}
              trendLabel="vs last period"
              priority="high"
              icon={<DollarSign className="h-4 w-4" />}
              description="Based on avg reservation value"
            />
            <StatCard
              title="Cost Per Lead"
              value="$14.20"
              trend={-8}
              trendLabel="vs last period"
              priority="high"
              icon={<TrendingDown className="h-4 w-4" />}
              description="Across all paid channels"
            />
          </div>
        </div>

        {/* Tier 2 — Engagement Metrics */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Engagement Metrics
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <MousePointerClick className="h-3.5 w-3.5" />
                Reservation Clicks
              </p>
              <p className="mt-1 text-xl font-bold text-zinc-900">892</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Profile Visits
              </p>
              <p className="mt-1 text-xl font-bold text-zinc-900">4,120</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Email Signups
              </p>
              <p className="mt-1 text-xl font-bold text-zinc-900">341</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <Bookmark className="h-3.5 w-3.5" />
                Saves
              </p>
              <p className="mt-1 text-xl font-bold text-zinc-900">2,891</p>
            </div>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 px-0 pb-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Reservation Clicks</TableHead>
                  <TableHead>Attribution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampaigns.map(row => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <span className="font-medium text-zinc-900">{row.name}</span>
                    </TableCell>
                    <TableCell>{row.sent.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-zinc-100">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500"
                            style={{ width: `${Math.min(row.openRate, 100)}%` }}
                          />
                        </div>
                        <span className="text-zinc-900 font-medium">{row.openRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-zinc-100">
                          <div
                            className="h-1.5 rounded-full bg-emerald-500"
                            style={{ width: `${Math.min(row.clickRate * 5, 100)}%` }}
                          />
                        </div>
                        <span className="text-zinc-900 font-medium">{row.clickRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-indigo-600">{row.reservationClicks}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">{row.attribution} reservations</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Attribution by Source */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Attribution by Source</CardTitle>
            <p className="text-sm text-zinc-500 mt-1">How guests found and converted from your marketing</p>
          </CardHeader>
          <CardContent>
            {/* Stacked bar */}
            <div className="flex h-8 w-full overflow-hidden rounded-lg mb-6">
              {attributionSources.map(src => (
                <div
                  key={src.label}
                  className={`${src.color} flex items-center justify-center`}
                  style={{ width: `${src.pct}%` }}
                  title={`${src.label}: ${src.pct}%`}
                >
                  {src.pct >= 18 && (
                    <span className="text-xs font-semibold text-white">{src.pct}%</span>
                  )}
                </div>
              ))}
            </div>

            {/* Legend rows */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {attributionSources.map(src => (
                <div key={src.label} className={`rounded-lg p-3 ${src.bgLight}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2.5 w-2.5 rounded-full ${src.color}`} />
                    <span className={`text-xs font-semibold ${src.textColor}`}>{src.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-zinc-900">{src.pct}%</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    ~{Math.round(142 * src.pct / 100)} reservations
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}
