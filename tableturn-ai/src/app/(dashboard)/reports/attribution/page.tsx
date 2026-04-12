'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  GitBranch,
  Layers,
  Clock,
  Zap,
  ArrowRight,
} from 'lucide-react'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'

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

interface SourceRow {
  id: string
  source: string
  badgeVariant: 'blue' | 'pink' | 'success' | 'purple' | 'secondary' | 'warning' | 'default'
  dotColor: string
  leads: number
  conversions: number
  conversionRate: number
  revenueAttributed: number
  cpa: number | null
}

const sourceRows: SourceRow[] = [
  {
    id: 's1',
    source: 'Google Ads',
    badgeVariant: 'warning',
    dotColor: 'bg-amber-500',
    leads: 84,
    conversions: 52,
    conversionRate: 61.9,
    revenueAttributed: 9880,
    cpa: 23.08,
  },
  {
    id: 's2',
    source: 'Meta Ads',
    badgeVariant: 'blue',
    dotColor: 'bg-blue-500',
    leads: 150,
    conversions: 89,
    conversionRate: 59.3,
    revenueAttributed: 16910,
    cpa: 24.72,
  },
  {
    id: 's3',
    source: 'Instagram Organic',
    badgeVariant: 'pink',
    dotColor: 'bg-pink-500',
    leads: 112,
    conversions: 74,
    conversionRate: 66.1,
    revenueAttributed: 14060,
    cpa: null,
  },
  {
    id: 's4',
    source: 'Email Campaign',
    badgeVariant: 'purple',
    dotColor: 'bg-purple-500',
    leads: 98,
    conversions: 71,
    conversionRate: 72.4,
    revenueAttributed: 13490,
    cpa: null,
  },
  {
    id: 's5',
    source: 'Direct',
    badgeVariant: 'secondary',
    dotColor: 'bg-zinc-500',
    leads: 63,
    conversions: 48,
    conversionRate: 76.2,
    revenueAttributed: 9120,
    cpa: null,
  },
  {
    id: 's6',
    source: 'Referral',
    badgeVariant: 'success',
    dotColor: 'bg-emerald-500',
    leads: 41,
    conversions: 34,
    conversionRate: 82.9,
    revenueAttributed: 6460,
    cpa: null,
  },
  {
    id: 's7',
    source: 'Walk-in',
    badgeVariant: 'default',
    dotColor: 'bg-indigo-500',
    leads: 38,
    conversions: 38,
    conversionRate: 100,
    revenueAttributed: 7220,
    cpa: null,
  },
]

const totalLeads = sourceRows.reduce((s, r) => s + r.leads, 0)
const totalConversions = sourceRows.reduce((s, r) => s + r.conversions, 0)

interface TouchModel {
  source: string
  pct: number
  leads: number
  dotColor: string
}

const firstTouchData: TouchModel[] = [
  { source: 'Meta Ads', pct: 34, leads: 102, dotColor: 'bg-blue-500' },
  { source: 'Google Ads', pct: 22, leads: 66, dotColor: 'bg-amber-500' },
  { source: 'Instagram Organic', pct: 21, leads: 63, dotColor: 'bg-pink-500' },
  { source: 'Email Campaign', pct: 13, leads: 39, dotColor: 'bg-purple-500' },
  { source: 'Direct', pct: 7, leads: 21, dotColor: 'bg-zinc-500' },
  { source: 'Referral', pct: 3, leads: 9, dotColor: 'bg-emerald-500' },
]

const lastTouchData: TouchModel[] = [
  { source: 'Email Campaign', pct: 29, leads: 87, dotColor: 'bg-purple-500' },
  { source: 'Instagram Organic', pct: 24, leads: 72, dotColor: 'bg-pink-500' },
  { source: 'Meta Ads', pct: 19, leads: 57, dotColor: 'bg-blue-500' },
  { source: 'Direct', pct: 14, leads: 42, dotColor: 'bg-zinc-500' },
  { source: 'Google Ads', pct: 9, leads: 27, dotColor: 'bg-amber-500' },
  { source: 'Referral', pct: 5, leads: 15, dotColor: 'bg-emerald-500' },
]

const conversionWindows = [
  { label: '< 24 hours', leads: 112, pct: 37, color: 'bg-emerald-500', textColor: 'text-emerald-700', bgLight: 'bg-emerald-50', note: 'Highly intent-driven — email & direct' },
  { label: '1 – 7 days', leads: 89, pct: 29, color: 'bg-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-50', note: 'Consideration window — social & search' },
  { label: '7 – 30 days', leads: 74, pct: 24, color: 'bg-amber-500', textColor: 'text-amber-700', bgLight: 'bg-amber-50', note: 'Nurture path — retargeting assists' },
  { label: '30+ days', leads: 31, pct: 10, color: 'bg-zinc-400', textColor: 'text-zinc-600', bgLight: 'bg-zinc-50', note: 'Long cycle — private events & catering' },
]

export default function AttributionReportPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30d')

  return (
    <>
      <Topbar
        title="Reports"
        description="Attribution & Source Analysis"
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
                t.href === '/reports/attribution'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Summary KPIs */}
        <div className="mb-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">
            Attribution Summary
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
            <StatCard
              title="Total Attributions"
              value={totalConversions.toLocaleString()}
              trend={16}
              trendLabel="vs last period"
              priority="high"
              icon={<Users className="h-4 w-4" />}
              description="Confirmed converted leads"
            />
            <StatCard
              title="Avg. Days to Convert"
              value="4.8"
              trend={-12}
              trendLabel="vs last period"
              priority="high"
              icon={<Clock className="h-4 w-4" />}
              description="Faster is better"
            />
            <StatCard
              title="Multi-touch Rate"
              value="61%"
              trend={5}
              trendLabel="vs last period"
              priority="high"
              icon={<Layers className="h-4 w-4" />}
              description="Leads touched 2+ channels"
            />
            <StatCard
              title="Top Channel"
              value="Email"
              priority="high"
              icon={<TrendingUp className="h-4 w-4" />}
              description="72.4% conversion rate"
            />
          </div>
        </div>

        {/* AI Insight */}
        <div className="mb-8 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-indigo-900">AI Attribution Insight</p>
              <p className="text-sm text-indigo-700 mt-0.5">
                Email campaigns convert at 72.4% — the highest of any paid or owned channel — yet only 16% of your leads come through email first. Referral leads convert at 82.9% and cost nothing to acquire. Growing your referral program by 20% could add an estimated 8 high-value conversions per month at $0 incremental cost.
              </p>
            </div>
          </div>
        </div>

        {/* Source breakdown table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Leads & Revenue by Source</CardTitle>
            <CardDescription>Conversion performance across all acquisition channels · last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">Source</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Leads</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-emerald-600 uppercase tracking-wide bg-emerald-50">Conversions</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-indigo-600 uppercase tracking-wide bg-indigo-50">Conv. Rate</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">Revenue Attr.</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-500 uppercase tracking-wide">CPA</th>
                  </tr>
                </thead>
                <tbody>
                  {[...sourceRows].sort((a, b) => b.conversions - a.conversions).map(row => (
                    <tr key={row.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                      <td className="px-4 py-3 font-medium text-zinc-900">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full flex-shrink-0 ${row.dotColor}`} />
                          <span>{row.source}</span>
                          <Badge variant={row.badgeVariant} className="ml-1">{row.source.split(' ')[0]}</Badge>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-700">{row.leads}</td>
                      <td className="px-4 py-3 text-right font-semibold text-emerald-700 bg-emerald-50/50">
                        {row.conversions}
                      </td>
                      <td className="px-4 py-3 text-right bg-indigo-50/50">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-14 rounded-full bg-zinc-200">
                            <div
                              className="h-1.5 rounded-full bg-indigo-500"
                              style={{ width: `${Math.min(row.conversionRate, 100)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-indigo-700 tabular-nums w-10 text-right">
                            {row.conversionRate.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-zinc-900">
                        ${row.revenueAttributed.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-zinc-600">
                        {row.cpa !== null ? `$${row.cpa.toFixed(2)}` : <span className="text-zinc-400">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-zinc-300 bg-zinc-50">
                    <td className="px-4 py-3 font-bold text-zinc-900">Total</td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-900">{totalLeads}</td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700">{totalConversions}</td>
                    <td className="px-4 py-3 text-right font-bold text-indigo-700">
                      {((totalConversions / totalLeads) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-900">
                      ${sourceRows.reduce((s, r) => s + r.revenueAttributed, 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-400">—</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* First Touch vs Last Touch */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-indigo-600" />
              First Touch vs Last Touch Attribution
            </CardTitle>
            <CardDescription>
              Which channel gets credit depends on which model you use — first touch shows where leads start; last touch shows where they convert.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Multi-touch note */}
            <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2.5">
              <Layers className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Multi-touch attribution note:</span> 61% of your converted leads touched 2 or more channels before booking. Neither first-touch nor last-touch tells the full story — both models are shown side-by-side below.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* First Touch */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="rounded-md bg-indigo-100 px-2.5 py-1">
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wide">First Touch</p>
                  </div>
                  <p className="text-xs text-zinc-500">Where leads first discovered you</p>
                </div>
                <div className="space-y-3">
                  {firstTouchData.map(item => (
                    <div key={item.source}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${item.dotColor}`} />
                          <span className="text-sm text-zinc-700">{item.source}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400">{item.leads} leads</span>
                          <span className="text-sm font-semibold text-zinc-900 w-8 text-right">{item.pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100">
                        <div
                          className={`h-2 rounded-full ${item.dotColor}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Last Touch */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="rounded-md bg-emerald-100 px-2.5 py-1">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Last Touch</p>
                  </div>
                  <p className="text-xs text-zinc-500">Channel before the booking</p>
                </div>
                <div className="space-y-3">
                  {lastTouchData.map(item => (
                    <div key={item.source}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${item.dotColor}`} />
                          <span className="text-sm text-zinc-700">{item.source}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400">{item.leads} leads</span>
                          <span className="text-sm font-semibold text-zinc-900 w-8 text-right">{item.pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-zinc-100">
                        <div
                          className={`h-2 rounded-full ${item.dotColor}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Key difference callout */}
            <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
              <p className="text-xs font-semibold text-zinc-700 mb-1.5">Key takeaway</p>
              <p className="text-sm text-zinc-600">
                Meta Ads gets 34% of first-touch credit but only 19% of last-touch credit — it opens the door.
                Email campaigns get 13% of first-touch credit but 29% of last-touch — they close the deal.
                Optimise Meta spend for reach; optimise email for conversion timing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Time-to-Conversion Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              Time-to-Conversion Distribution
            </CardTitle>
            <CardDescription>
              How long it takes leads to convert after first contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Stacked bar */}
            <div className="flex h-8 w-full overflow-hidden rounded-lg mb-6">
              {conversionWindows.map(w => (
                <div
                  key={w.label}
                  className={`${w.color} flex items-center justify-center`}
                  style={{ width: `${w.pct}%` }}
                  title={`${w.label}: ${w.pct}%`}
                >
                  {w.pct >= 15 && (
                    <span className="text-xs font-semibold text-white">{w.pct}%</span>
                  )}
                </div>
              ))}
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {conversionWindows.map(w => (
                <div key={w.label} className={`rounded-xl border p-4 ${w.bgLight}`}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className={`h-2.5 w-2.5 rounded-full ${w.color}`} />
                    <span className={`text-xs font-bold ${w.textColor}`}>{w.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-zinc-900">{w.leads}</p>
                  <p className={`text-sm font-semibold ${w.textColor} mt-0.5`}>{w.pct}% of leads</p>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{w.note}</p>
                  {/* Mini progress relative to largest bucket */}
                  <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-200">
                    <div
                      className={`h-1.5 rounded-full ${w.color}`}
                      style={{ width: `${(w.leads / 112) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Journey example */}
            <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50/60 px-5 py-4">
              <p className="text-xs font-semibold text-indigo-900 mb-3 uppercase tracking-wide">Typical multi-touch journey (37% of conversions)</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <div className="rounded-lg bg-blue-100 px-3 py-1.5 text-blue-800 font-medium text-xs">
                  Day 0 · Meta Ad
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                <div className="rounded-lg bg-pink-100 px-3 py-1.5 text-pink-800 font-medium text-xs">
                  Day 2 · Instagram Organic
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                <div className="rounded-lg bg-purple-100 px-3 py-1.5 text-purple-800 font-medium text-xs">
                  Day 5 · Email Campaign
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
                <div className="rounded-lg bg-emerald-100 px-3 py-1.5 text-emerald-800 font-semibold text-xs">
                  Day 5 · Booking ✓
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}
