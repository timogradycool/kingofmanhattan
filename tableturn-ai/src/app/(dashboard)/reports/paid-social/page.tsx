import Link from 'next/link'
import { Topbar } from '@/components/layout/topbar'
import { PageShell } from '@/components/layout/page-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatCard } from '@/components/ui/stat-card'
import { DollarSign, Target, MousePointerClick, AlertTriangle } from 'lucide-react'

const campaigns = [
  { name: 'Private Dining — Spring Push', platform: 'Meta', spend: 1200, impressions: 124000, clicks: 3840, ctr: '3.1%', reservationClicks: 312, privateEventClicks: 89, cpl: '$13.50' },
  { name: 'Happy Hour — Thursday', platform: 'Instagram', spend: 800, impressions: 88000, clicks: 2640, ctr: '3.0%', reservationClicks: 224, privateEventClicks: 12, cpl: '$11.20' },
  { name: 'Chef\'s Tasting Menu Launch', platform: 'Meta', spend: 1000, impressions: 62000, clicks: 1550, ctr: '2.5%', reservationClicks: 198, privateEventClicks: 21, cpl: '$16.40' },
  { name: 'Weekend Brunch Promo', platform: 'Instagram', spend: 700, impressions: 51000, clicks: 1428, ctr: '2.8%', reservationClicks: 142, privateEventClicks: 0, cpl: '$9.80' },
  { name: 'Holiday Events Preview', platform: 'TikTok', spend: 500, impressions: 92000, clicks: 1840, ctr: '2.0%', reservationClicks: 16, privateEventClicks: 2, cpl: '$18.90' },
]

const platformColors: Record<string, string> = { Meta: 'blue', Instagram: 'pink', TikTok: 'secondary' }

const tabs = [
  { label: 'Overview', href: '/reports' },
  { label: 'Paid Social', href: '/reports/paid-social' },
  { label: 'Organic Social', href: '/reports/organic' },
  { label: 'Attribution', href: '/reports/attribution' },
]

export default function PaidSocialReportPage() {
  return (
    <>
      <Topbar title="Reports" description="Paid Social Advertising Performance" />
      <PageShell>
        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-zinc-200 pb-0">
          {tabs.map(t => (
            <Link key={t.href} href={t.href} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${t.href === '/reports/paid-social' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}>
              {t.label}
            </Link>
          ))}
        </div>

        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Paid Social Advertising</h2>
            <p className="text-sm text-zinc-500">Separated from organic reporting · Last 30 days</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600">
            Apr 1 – Apr 12, 2025
          </div>
        </div>

        {/* Tier 1: Business outcomes */}
        <p className="mt-4 mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Business Outcomes</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          <StatCard title="Reservation Clicks" value="892" trend={14} priority="high" icon={<Target className="h-5 w-5" />} />
          <StatCard title="Private Event Clicks" value="124" trend={31} priority="high" icon={<Target className="h-5 w-5" />} />
          <StatCard title="Cost Per Lead" value="$14.20" trend={-8} description="Lower is better" priority="high" icon={<DollarSign className="h-5 w-5" />} />
          <StatCard title="Cost / Reservation Click" value="$4.71" trend={-5} priority="high" icon={<DollarSign className="h-5 w-5" />} />
        </div>

        {/* Tier 2: Media metrics */}
        <p className="mb-3 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Media Performance</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          {[
            { title: 'Total Spend', value: '$4,200', trend: 12 },
            { title: 'Impressions', value: '417K', trend: 8 },
            { title: 'Total Clicks', value: '11,298', trend: 6 },
            { title: 'Avg CTR', value: '2.7%', trend: 3 },
          ].map(s => <StatCard key={s.title} {...s} />)}
        </div>

        {/* Ad Fatigue Alert */}
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Ad Fatigue Detected</p>
              <p className="text-sm text-amber-700 mt-0.5">
                "Chef's Tasting Menu Launch" has frequency 4.2 with declining CTR (down 18% vs. week 1). Consider refreshing the creative or pausing this ad set.
              </p>
            </div>
          </div>
        </div>

        {/* Campaign table */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>All paid campaigns — sorted by reservation clicks (highest impact first)</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Spend</TableHead>
                  <TableHead>Impressions</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>CTR</TableHead>
                  <TableHead className="text-emerald-700 bg-emerald-50">Resv. Clicks</TableHead>
                  <TableHead className="text-purple-700 bg-purple-50">Event Clicks</TableHead>
                  <TableHead>CPL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.sort((a, b) => b.reservationClicks - a.reservationClicks).map(c => (
                  <TableRow key={c.name}>
                    <TableCell className="font-medium text-zinc-900">{c.name}</TableCell>
                    <TableCell><Badge variant={platformColors[c.platform] as any}>{c.platform}</Badge></TableCell>
                    <TableCell>${c.spend.toLocaleString()}</TableCell>
                    <TableCell>{(c.impressions / 1000).toFixed(0)}K</TableCell>
                    <TableCell>{c.clicks.toLocaleString()}</TableCell>
                    <TableCell>{c.ctr}</TableCell>
                    <TableCell className="font-semibold text-emerald-700 bg-emerald-50/50">{c.reservationClicks}</TableCell>
                    <TableCell className="font-semibold text-purple-700 bg-purple-50/50">{c.privateEventClicks}</TableCell>
                    <TableCell>{c.cpl}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}
