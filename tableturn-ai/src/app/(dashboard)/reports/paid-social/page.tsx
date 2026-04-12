'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  MousePointerClick,
  Target,
  Zap,
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type DateRange = '7d' | '30d' | '90d'

const tabs = [
  { label: 'Overview', href: '/reports' },
  { label: 'Paid Social', href: '/reports/paid-social' },
  { label: 'Organic Social', href: '/reports/organic' },
  { label: 'Attribution', href: '/reports/attribution' },
]

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
]

interface CampaignRow {
  id: string
  name: string
  platform: 'Meta' | 'Instagram' | 'TikTok'
  budgetSpent: number
  impressions: number
  clicks: number
  ctr: number
  leads: number
  costPerLead: number
  roas: number
}

const mockCampaigns: CampaignRow[] = [
  {
    id: 'c1',
    name: 'Private Dining — Spring Push',
    platform: 'Meta',
    budgetSpent: 1200,
    impressions: 124000,
    clicks: 3840,
    ctr: 3.1,
    leads: 89,
    costPerLead: 13.48,
    roas: 6.2,
  },
  {
    id: 'c2',
    name: 'Happy Hour — Thursday Nights',
    platform: 'Instagram',
    budgetSpent: 800,
    impressions: 88000,
    clicks: 2640,
    ctr: 3.0,
    leads: 72,
    costPerLead: 11.11,
    roas: 7.8,
  },
  {
    id: 'c3',
    name: "Chef's Tasting Menu Launch",
    platform: 'Meta',
    budgetSpent: 1000,
    impressions: 62000,
    clicks: 1550,
    ctr: 2.5,
    leads: 61,
    costPerLead: 16.39,
    roas: 4.9,
  },
  {
    id: 'c4',
    name: 'Weekend Brunch Promo',
    platform: 'Instagram',
    budgetSpent: 700,
    impressions: 51000,
    clicks: 1428,
    ctr: 2.8,
    leads: 71,
    costPerLead: 9.86,
    roas: 8.4,
  },
  {
    id: 'c5',
    name: 'Holiday Events Preview',
    platform: 'TikTok',
    budgetSpent: 500,
    impressions: 92000,
    clicks: 1840,
    ctr: 2.0,
    leads: 26,
    costPerLead: 19.23,
    roas: 3.1,
  },
]

const platformBreakdown = [
  {
    platform: 'Meta',
    spend: 2200,
    pct: 52,
    color: 'bg-blue-500',
    barColor: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    badge: 'blue' as const,
    impressions: '186K',
    leads: 150,
  },
  {
    platform: 'Instagram',
    spend: 1500,
    pct: 36,
    color: 'bg-pink-500',
    barColor: 'bg-pink-500',
    textColor: 'text-pink-700',
    bgLight: 'bg-pink-50',
    badge: 'pink' as const,
    impressions: '139K',
    leads: 143,
  },
  {
    platform: 'TikTok',
    spend: 500,
    pct: 12,
    color: 'bg-purple-500',
    barColor: 'bg-purple-500',
    textColor: 'text-purple-700',
    bgLight: 'bg-purple-50',
    badge: 'purple' as const,
    impressions: '92K',
    leads: 26,
  },
]

const platformColors: Record<string, 'blue' | 'pink' | 'purple'> = {
  Meta: 'blue',
  Instagram: 'pink',
  TikTok: 'purple',
}

export default function PaidSocialReportPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  return (
    <>
      <Topbar
        title="Reports"
        description="Paid Social Advertising Performance"
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
        <div className="mb-6 flex gap-1 border-b border-zinc-200">
          {tabs.map(t => (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                t.href === '/reports/paid-social'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Tier 1 — Business Outcome KPIs */}
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Business Outcomes
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
            <StatCard
              title="Total Leads Generated"
              value="319"
              trend={22}
              trendLabel="vs last period"
              priority="high"
              icon={<Users className="h-4 w-4" />}
              description="Across all paid channels"
            />
            <StatCard
              title="Bookings from Ads"
              value="187"
              trend={18}
              trendLabel="vs last period"
              priority="high"
              icon={<Target className="h-4 w-4" />}
              description="Confirmed reservations"
            />
            <StatCard
              title="Revenue Attributed"
              value="$28,600"
              trend={14}
              trendLabel="vs last period"
              priority="high"
              icon={<DollarSign className="h-4 w-4" />}
              description="Based on avg booking value"
            />
            <StatCard
              title="Cost per Lead"
              value="$13.20"
              trend={-9}
              trendLabel="vs last period"
              priority="high"
              icon={<TrendingDown className="h-4 w-4" />}
              description="Lower is better"
            />
          </div>
        </div>

        {/* Tier 2 — Engagement KPIs */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Engagement Metrics
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Impressions
              </p>
              <p className="mt-1 text-xl font-bold text-zinc-900">417K</p>
              <p className="mt-0.5 text-xs text-zinc-400">+8% vs last period</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <MousePointerClick className="h-3.5 w-3.5" />
                Clicks
              </p>
              <p className="mt-1 text-xl font-bold text-zinc-900">11,298</p>
              <p className="mt-0.5 text-xs text-zinc-400">+6% vs last period</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                CTR
              </p>
              <p className="mt-1 text-xl font-bold text-zinc-900">2.71%</p>
              <p className="mt-0.5 text-xs text-zinc-400">+3% vs last period</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white px-4 py-3 shadow-sm">
              <p className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5" />
                ROAS
              </p>
              <p className="mt-1 text-xl font-bold text-zinc-900">6.81×</p>
              <p className="mt-0.5 text-xs text-zinc-400">+11% vs last period</p>
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="mb-6 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-900">AI Campaign Insight</p>
              <p className="text-sm text-indigo-700 mt-0.5">
                Weekend Brunch on Instagram has your lowest cost-per-lead at $9.86 and a ROAS of 8.4× — nearly double the TikTok campaign. Shifting 20% of TikTok budget to Instagram brunch creative could generate an estimated 14 additional leads per week at current efficiency rates.
              </p>
            </div>
          </div>
        </div>

        {/* Campaign Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>All paid campaigns sorted by leads generated</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign Name</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Budget Spent</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead className="text-emerald-700 bg-emerald-50">Leads</TableHead>
                  <TableHead>Cost / Lead</TableHead>
                  <TableHead className="text-indigo-700 bg-indigo-50">ROAS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...mockCampaigns]
                  .sort((a, b) => b.leads - a.leads)
                  .map(row => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-zinc-900">{row.name}</TableCell>
                      <TableCell>
                        <Badge variant={platformColors[row.platform]}>
                          {row.platform}
                        </Badge>
                      </TableCell>
                      <TableCell>${row.budgetSpent.toLocaleString()}</TableCell>
                      <TableCell>{(row.impressions / 1000).toFixed(0)}K</TableCell>
                      <TableCell>{row.clicks.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-12 rounded-full bg-zinc-100">
                            <div
                              className="h-1.5 rounded-full bg-indigo-500"
                              style={{ width: `${Math.min(row.ctr * 20, 100)}%` }}
                            />
                          </div>
                          <span className="text-zinc-900 font-medium">{row.ctr}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-emerald-700 bg-emerald-50/50">
                        {row.leads}
                      </TableCell>
                      <TableCell className="text-zinc-700">
                        ${row.costPerLead.toFixed(2)}
                      </TableCell>
                      <TableCell className="font-semibold text-indigo-700 bg-indigo-50/50">
                        {row.roas.toFixed(1)}×
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Platform Breakdown */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle>Platform Spend Distribution</CardTitle>
            <p className="text-sm text-zinc-500 mt-1">
              Budget allocation and performance by platform
            </p>
          </CardHeader>
          <CardContent>
            {/* Stacked bar */}
            <div className="flex h-8 w-full overflow-hidden rounded-lg mb-6">
              {platformBreakdown.map(p => (
                <div
                  key={p.platform}
                  className={`${p.barColor} flex items-center justify-center`}
                  style={{ width: `${p.pct}%` }}
                  title={`${p.platform}: ${p.pct}%`}
                >
                  {p.pct >= 18 && (
                    <span className="text-xs font-semibold text-white">{p.pct}%</span>
                  )}
                </div>
              ))}
            </div>

            {/* Platform cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {platformBreakdown.map(p => (
                <div key={p.platform} className={`rounded-xl border p-4 ${p.bgLight}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${p.color}`} />
                      <span className={`text-sm font-bold ${p.textColor}`}>{p.platform}</span>
                    </div>
                    <Badge variant={p.badge}>{p.pct}% of spend</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Budget Spent</span>
                      <span className="font-semibold text-zinc-900">${p.spend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Impressions</span>
                      <span className="font-medium text-zinc-700">{p.impressions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Leads</span>
                      <span className="font-semibold text-zinc-900">{p.leads}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-zinc-200/70">
                      {/* Mini progress bar showing share of total leads */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-zinc-400">Share of leads</span>
                        <span className={`text-xs font-semibold ${p.textColor}`}>
                          {Math.round((p.leads / 319) * 100)}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-zinc-200">
                        <div
                          className={`h-1.5 rounded-full ${p.barColor}`}
                          style={{ width: `${Math.round((p.leads / 319) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}
